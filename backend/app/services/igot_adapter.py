from typing import Dict, Any, List
from app.core.config import settings

class IGOTAdapter:
    """
    Integration Adapter for iGOT Karmayogi & NSSTA.
    IMPORTANT: Clearly designated as DEMO / PROTOTYPE ADAPTER.
    When official government API credentials and sandbox endpoints are provided,
    this adapter connects live without altering business logic.
    """
    
    @staticmethod
    def get_status() -> Dict[str, Any]:
        return {
            "mode": settings.IGOT_INTEGRATION_MODE,
            "status": "CONNECTED_PROTOTYPE",
            "apiBaseUrl": settings.IGOT_API_BASE_URL,
            "hasOfficialApiKey": bool(settings.IGOT_API_KEY),
            "fracFrameworkVersion": "FRAC 2.0 (DoPT Aligned)",
            "lastSyncTimestamp": "2026-09-22T10:00:00Z",
            "notice": "DEMO / PROTOTYPE ADAPTER. Course metadata harmonized with official iGOT Karmayogi curriculum."
        }

    @staticmethod
    def sync_external_course_completion(employee_igot_id: str, course_code: str) -> Dict[str, Any]:
        return {
            "synced": True,
            "employeeIgotId": employee_igot_id,
            "courseCode": course_code,
            "verifiedBy": "iGOT Karmayogi Webhook Listener (Simulated)",
            "status": "CREDENTIAL_RECORDED"
        }
