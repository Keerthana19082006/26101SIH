from fastapi import APIRouter
from app.services.igot_adapter import IGOTAdapter

router = APIRouter(prefix="/integrations", tags=["iGOT & NSSTA Integration"])

@router.get("/igot/status")
def get_igot_integration_status():
    """Returns adapter synchronization status and FRAC compliance"""
    return IGOTAdapter.get_status()
