import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.documents import Document
from app.services.rag_engine import RAGEngine
from app.core.config import settings

router = APIRouter(prefix="/documents", tags=["Documents & Learning Materials"])

@router.get("")
def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.created_at.desc()).all()
    return [
        {
            "id": d.id,
            "title": d.title,
            "filename": d.filename,
            "fileType": d.file_type,
            "fileSizeMb": d.file_size_mb,
            "competency": d.competency_name,
            "chunksCount": d.chunks_count,
            "status": d.status,
            "createdAt": d.created_at.strftime("%d %b %Y")
        }
        for d in docs
    ]

@router.post("/upload")
def upload_document(
    title: str = Form(...),
    competency: str = Form("Survey Sampling"),
    department: str = Form("MoSPI / National Statistical Office"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size_mb = round(os.path.getsize(file_path) / (1024 * 1024), 2)

    doc = RAGEngine.process_and_store_document(
        db=db,
        title=title,
        filename=file.filename,
        file_path=file_path,
        file_type=file.content_type or "application/pdf",
        file_size_mb=file_size_mb,
        competency_name=competency
    )

    return {
        "success": True,
        "documentId": doc.id,
        "title": doc.title,
        "chunksCount": doc.chunks_count,
        "status": doc.status
    }
