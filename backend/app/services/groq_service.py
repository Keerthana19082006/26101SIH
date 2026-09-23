import json
import logging
import re
from typing import Dict, Any, List, Optional
import requests
from app.core.config import settings

logger = logging.getLogger("groq_service")

# Default Groq model if none provided in environment
DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM_PROMPT = (
    "You are an AI competency assessment engine for an official government employee learning platform.\n"
    "Generate role-specific competency assessment questions.\n"
    "Questions must be grounded in the supplied department, role, professional area, competency areas and skill requirements.\n"
    "Do not invent unrelated responsibilities.\n"
    "Do not generate generic school-level questions.\n"
    "Questions should test practical professional knowledge and decision-making relevant to the employee's role.\n"
    "Return ONLY valid JSON matching the specified schema.\n"
    "Do not include markdown.\n"
    "Do not include explanations outside JSON.\n\n"
    "Schema structure:\n"
    "{\n"
    '  "assessmentTitle": "...",\n'
    '  "department": "...",\n'
    '  "role": "...",\n'
    '  "questions": [\n'
    "    {\n"
    '      "id": "Q1",\n'
    '      "question": "...",\n'
    '      "options": ["Option A", "Option B", "Option C", "Option D"],\n'
    '      "correctAnswer": "Exact text of the correct option",\n'
    '      "competency": "Competency Name",\n'
    '      "difficulty": "easy",\n'
    '      "explanation": "..."\n'
    "    }\n"
    "  ]\n"
    "}\n"
    "Ensure difficulty is one of: easy, medium, hard (use a balanced distribution across competencies)."
)

class GroqService:
    @staticmethod
    def is_configured() -> bool:
        """Check if Groq API key is present."""
        return bool(settings.GROQ_API_KEY and settings.GROQ_API_KEY.strip())

    @staticmethod
    def get_model() -> str:
        """Fetch model from environment or fallback to default."""
        return settings.GROQ_MODEL or DEFAULT_GROQ_MODEL

    @staticmethod
    def safe_extract_json(raw_text: str) -> Optional[Dict[str, Any]]:
        """
        Attempts safe JSON extraction and repair if the LLM surrounds output
        with markdown codeblocks or leading/trailing commentary.
        """
        if not raw_text:
            return None

        # 1. Direct parse attempt
        try:
            return json.loads(raw_text.strip())
        except Exception:
            pass

        # 2. Extract from markdown ```json ... ``` blocks
        json_pattern = r"```(?:json)?\s*(\{.*?\})\s*```"
        match = re.search(json_pattern, raw_text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1).strip())
            except Exception:
                pass

        # 3. Extract between first '{' and last '}'
        start_idx = raw_text.find("{")
        end_idx = raw_text.rfind("}")
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            try:
                return json.loads(raw_text[start_idx:end_idx + 1])
            except Exception:
                pass

        return None

    @staticmethod
    def validate_assessment_schema(data: Dict[str, Any]) -> bool:
        """Validates that parsed JSON complies with the expected assessment format."""
        if not isinstance(data, dict):
            return False

        questions = data.get("questions")
        if not isinstance(questions, list) or len(questions) == 0:
            return False

        for idx, q in enumerate(questions):
            if not isinstance(q, dict):
                return False
            if not q.get("question") or not isinstance(q.get("options"), list):
                return False
            if len(q["options"]) < 2:
                return False
            if not q.get("correctAnswer"):
                return False
            # Normalize difficulty to easy | medium | hard
            diff = str(q.get("difficulty", "medium")).lower()
            if diff not in ["easy", "medium", "hard"]:
                q["difficulty"] = "medium"
            else:
                q["difficulty"] = diff

            # Ensure ID is present
            if not q.get("id"):
                q["id"] = f"Q{idx + 1}"

        return True

    @staticmethod
    def generate_assessment_questions(
        department: str,
        role: str,
        professional_area: Optional[str] = None,
        competencies: Optional[List[str]] = None,
        count: int = 6
    ) -> Dict[str, Any]:
        """
        REAL GROQ AI IMPLEMENTATION
        Calls Groq API to generate role-specific, grounded competency assessment questions.
        If Groq is not configured or fails, falls back gracefully to deterministic logic.
        """
        competencies = competencies or ["Survey Sampling", "Statistical Methods", "Data Analysis", "Survey Operations"]
        professional_area = professional_area or f"{department} Competency Standards"
        model_name = GroqService.get_model()

        if not GroqService.is_configured():
            logger.warning("[FALLBACK TRIGGERED] GROQ_API_KEY is not configured. Using deterministic fallback.")
            return GroqService._deterministic_fallback(department, role, professional_area, competencies)

        user_content = json.dumps({
            "department": department,
            "role": role,
            "professionalArea": professional_area,
            "competencies": competencies,
            "questionsCount": count
        }, indent=2)

        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY.strip()}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Generate a role-specific competency assessment for this employee profile:\n{user_content}"}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.25,
            "max_tokens": 3000
        }

        try:
            response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=25)
            
            if response.status_code != 200:
                logger.error(f"Groq API returned HTTP {response.status_code}: {response.text}")
                return GroqService._deterministic_fallback(department, role, professional_area, competencies)

            res_json = response.json()
            raw_text = res_json["choices"][0]["message"]["content"]
            
            parsed_data = GroqService.safe_extract_json(raw_text)
            if not parsed_data or not GroqService.validate_assessment_schema(parsed_data):
                logger.warning("[FALLBACK TRIGGERED] Groq output validation failed. Using deterministic fallback.")
                return GroqService._deterministic_fallback(department, role, professional_area, competencies)

            # Metadata enrichment
            parsed_data["source"] = "REAL_GROQ_AI"
            parsed_data["model"] = model_name
            return parsed_data

        except requests.exceptions.RequestException as e:
            logger.error(f"[FALLBACK TRIGGERED] Groq connection/timeout error: {str(e)}")
            return GroqService._deterministic_fallback(department, role, professional_area, competencies)
        except Exception as e:
            logger.error(f"[FALLBACK TRIGGERED] Unexpected error during Groq processing: {str(e)}")
            return GroqService._deterministic_fallback(department, role, professional_area, competencies)

    # ─── MOCK AI / FALLBACK ENGINE ──────────────────────────────────────────────
    @staticmethod
    def _deterministic_fallback(
        department: str,
        role: str,
        professional_area: str,
        competencies: List[str]
    ) -> Dict[str, Any]:
        """
        MOCK AI / FALLBACK:
        Provides high-fidelity, role-grounded official statistical questions if
        the Groq network connection is unavailable or credentials are unverified.
        """
        questions = [
            {
                "id": "Q1",
                "question": f"In {department} for the role of {role}, what is the mandatory sampling protocol when addressing heterogeneous sub-strata?",
                "options": [
                    "Stratified Random Sampling with proportional allocation",
                    "Simple Random Sampling without replacement",
                    "Convenience sampling based on administrative convenience",
                    "Snowball sampling of self-selected units"
                ],
                "correctAnswer": "Stratified Random Sampling with proportional allocation",
                "competency": competencies[0] if len(competencies) > 0 else "Survey Sampling",
                "difficulty": "medium",
                "explanation": "Stratified proportional sampling ensures minimal variance across administrative strata."
            },
            {
                "id": "Q2",
                "question": f"During field operations for {role}, how are non-sampling errors systematically controlled?",
                "options": [
                    "Indefinitely increasing sample size",
                    "Rigorous enumerator training, field re-interviews, and automated range checks",
                    "Deleting questionnaires with missing responses",
                    "Substituting non-respondents with neighboring units without documentation"
                ],
                "correctAnswer": "Rigorous enumerator training, field re-interviews, and automated range checks",
                "competency": competencies[1] if len(competencies) > 1 else "Statistical Quality",
                "difficulty": "easy",
                "explanation": "Field re-interviews and range checks systematically minimize operational and recording bias."
            },
            {
                "id": "Q3",
                "question": "What threshold of Relative Standard Error (RSE) establishes an official estimate as reliable for policy dissemination?",
                "options": [
                    "RSE strictly under 15%",
                    "RSE between 40% and 55%",
                    "RSE exceeding 60%",
                    "RSE exactly equal to 50%"
                ],
                "correctAnswer": "RSE strictly under 15%",
                "competency": competencies[2] if len(competencies) > 2 else "Data Analysis",
                "difficulty": "hard",
                "explanation": "National and international standards treat aggregates with RSE under 15% as high precision."
            },
            {
                "id": "Q4",
                "question": "Why are multiplier weights calculated and applied to survey records prior to aggregate generation?",
                "options": [
                    "To inflate sample totals to universe estimates based on inverse selection probabilities",
                    "To correct for field calculation errors",
                    "To normalize variables into standard z-scores",
                    "To mask private identifiers of respondents"
                ],
                "correctAnswer": "To inflate sample totals to universe estimates based on inverse selection probabilities",
                "competency": competencies[3] if len(competencies) > 3 else "Survey Operations",
                "difficulty": "medium",
                "explanation": "Multipliers are the inverse of inclusion probability, projecting sample metrics to the universe."
            }
        ]

        return {
            "assessmentTitle": f"{role} Competency Diagnostic ({department})",
            "department": department,
            "role": role,
            "questions": questions,
            "source": "MOCK_AI_FALLBACK",
            "model": "deterministic_grounded_engine"
        }

    # ─── FUTURE-READY INTERFACES (PLACEHOLDERS) ─────────────────────────────────
    @staticmethod
    def analyze_assessment(answers: Dict[str, Any]) -> Dict[str, Any]:
        """Placeholder for future AI-powered qualitative assessment analysis."""
        return {"status": "ready_for_future_implementation"}

    @staticmethod
    def generate_skill_gap_analysis(competency_scores: Dict[str, float]) -> Dict[str, Any]:
        """Placeholder for future AI-driven skill gap narrative generator."""
        return {"status": "ready_for_future_implementation"}

    @staticmethod
    def generate_learning_recommendations(gaps: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Placeholder for future AI-driven career pathing synthesizer."""
        return {"status": "ready_for_future_implementation"}
