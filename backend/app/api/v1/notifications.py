from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.community import Notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(db: Session = Depends(get_db)):
    notifs = db.query(Notification).order_by(Notification.created_at.desc()).limit(15).all()
    if not notifs:
        # Default starter notifications
        return [
            {
                "id": "notif-1",
                "title": "New Targeted Course Recommended",
                "message": "AI has mapped 'NSS 78th Round Operational Training' to address your Survey Sampling skill gap.",
                "type": "RECOMMENDATION",
                "linkPath": "/explore-learning",
                "isRead": False,
                "createdAt": "10 minutes ago"
            },
            {
                "id": "notif-2",
                "title": "Daily Streak Maintained",
                "message": "Congratulations! You have reached a 14-day learning streak.",
                "type": "STREAK",
                "linkPath": "/dashboard",
                "isRead": False,
                "createdAt": "Today"
            },
            {
                "id": "notif-3",
                "title": "iGOT Karmayogi Synced",
                "message": "Your competency record has been synchronized with the national capacity database.",
                "type": "BADGE",
                "linkPath": "/passport",
                "isRead": True,
                "createdAt": "Yesterday"
            }
        ]
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "linkPath": n.link_path,
            "isRead": n.is_read,
            "createdAt": n.created_at.strftime("%d %b %H:%M")
        }
        for n in notifs
    ]

@router.patch("/{id}/read")
def mark_notification_read(id: str, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.id == id).first()
    if n:
        n.is_read = True
        db.commit()
    return {"success": True}
