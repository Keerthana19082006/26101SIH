import uuid
from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.community import Discussion, DiscussionReply

router = APIRouter(prefix="/community", tags=["Community Discussions"])

class CreateDiscussionRequest(BaseModel):
    title: str
    content: str
    category: str = "Methodology & Field Operations"
    authorName: str = "Officer"
    authorRole: str = "Statistical Investigator"

class CreateReplyRequest(BaseModel):
    content: str
    authorName: str = "Officer"
    authorRole: str = "Statistical Investigator"
    isTrainerResponse: bool = False

@router.get("/discussions")
def get_discussions(category: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Discussion)
    if category and category != "all":
        query = query.filter(Discussion.category.ilike(f"%{category}%"))
    
    discussions = query.order_by(Discussion.created_at.desc()).all()
    result = []
    for d in discussions:
        replies = [
            {
                "id": r.id,
                "authorName": r.author_name,
                "authorRole": r.author_role,
                "isTrainerResponse": r.is_trainer_response,
                "content": r.content,
                "upvotes": r.upvotes,
                "createdAt": r.created_at.strftime("%d %b, %H:%M")
            }
            for r in d.replies
        ]
        result.append({
            "id": d.id,
            "title": d.title,
            "content": d.content,
            "category": d.category,
            "authorName": d.author_name,
            "authorRole": d.author_role,
            "department": d.department_name,
            "upvotes": d.upvotes,
            "repliesCount": len(replies),
            "replies": replies,
            "createdAt": d.created_at.strftime("%d %b %Y")
        })
    return result

@router.post("/discussions")
def create_discussion(req: CreateDiscussionRequest, db: Session = Depends(get_db)):
    d = Discussion(
        id=f"disc-{uuid.uuid4().hex[:10]}",
        title=req.title,
        content=req.content,
        category=req.category,
        author_name=req.authorName,
        author_role=req.authorRole
    )
    db.add(d)
    db.commit()
    db.refresh(d)
    return {"id": d.id, "title": d.title}

@router.post("/discussions/{id}/reply")
def reply_to_discussion(id: str, req: CreateReplyRequest, db: Session = Depends(get_db)):
    d = db.query(Discussion).filter(Discussion.id == id).first()
    if not d:
        raise HTTPException(status_code=404, detail="Discussion not found")

    r = DiscussionReply(
        id=f"rep-{uuid.uuid4().hex[:10]}",
        discussion_id=id,
        author_name=req.authorName,
        author_role=req.authorRole,
        is_trainer_response=req.isTrainerResponse,
        content=req.content
    )
    db.add(r)
    d.replies_count += 1
    db.commit()
    return {"id": r.id, "success": True}
