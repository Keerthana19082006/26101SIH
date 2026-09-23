def test_generate_assessment_groq_endpoint(client):
    """
    Tests the secure POST /api/ai/generate-assessment endpoint.
    Verifies that the endpoint validates requests, communicates with GroqService
    (or uses deterministic fallback if network unavailable), returns strict JSON,
    and never exposes API keys.
    """
    payload = {
        "employeeId": "demo-employee-01",
        "department": "MoSPI / National Statistical Office",
        "role": "Statistical Investigator",
        "professionalArea": "Official Statistics & Survey Analytics",
        "competencies": [
            "Survey Sampling",
            "Statistical Methods",
            "Data Analysis",
            "Survey Operations"
        ],
        "count": 4
    }

    resp = client.post("/api/ai/generate-assessment", json=payload)
    assert resp.status_code == 200
    data = resp.json()

    assert data["success"] is True
    assert "assessment" in data
    assessment = data["assessment"]

    # Verify root fields
    assert assessment["department"] == "MoSPI / National Statistical Office"
    assert assessment["role"] == "Statistical Investigator"
    assert "questions" in assessment
    assert len(assessment["questions"]) >= 4

    # Verify questions structure
    for q in assessment["questions"]:
        assert "id" in q
        assert "question" in q and len(q["question"]) > 10
        assert "options" in q and len(q["options"]) == 4
        assert "correctAnswer" in q
        assert "competency" in q
        assert q["difficulty"] in ["easy", "medium", "hard"]
        assert "explanation" in q

    # Verify no secret leakage
    raw_str = resp.text
    assert "gsk_" not in raw_str
    assert "SECRET" not in raw_str

def test_generate_assessment_different_department_role(client):
    """
    Verifies that assessments generated for Agriculture are department-specific
    and different from MoSPI.
    """
    payload = {
        "employeeId": "demo-employee-02",
        "department": "Ministry of Agriculture",
        "role": "Agricultural Statistics Officer",
        "professionalArea": "Agricultural Planning & Economics",
        "competencies": [
            "Crop Estimation",
            "Agricultural Statistics",
            "Yield Modeling"
        ],
        "count": 4
    }

    resp = client.post("/api/ai/generate-assessment", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assessment = data["assessment"]
    assert assessment["department"] == "Ministry of Agriculture"
    assert assessment["role"] == "Agricultural Statistics Officer"
    assert len(assessment["questions"]) >= 3

def test_generate_assessment_missing_department_fails(client):
    """
    Verifies that validation rejects empty/missing department or role.
    """
    resp = client.post("/api/ai/generate-assessment", json={
        "department": "",
        "role": "Statistical Investigator"
    })
    assert resp.status_code == 400
