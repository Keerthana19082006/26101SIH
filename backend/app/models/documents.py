from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(50), primary_key=True, index=True)
    uploader_id = Column(String(50), nullable=True)
    department_id = Column(String(50), ForeignKey("departments.id"), nullable=True)
    title = Column(String(200), nullable=False)
    filename = Column(String(200), nullable=False)
    file_type = Column(String(50), default="application/pdf")
    file_size_mb = Column(Float, default=1.0)
    storage_path = Column(String(255), nullable=True)
    competency_name = Column(String(150), default="Survey Sampling")
    chunks_count = Column(Integer, default=0)
    status = Column(String(30), default="PROCESSED")  # UPLOADED, PROCESSING, PROCESSED, ERROR
    created_at = Column(DateTime, default=datetime.utcnow)

    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(50), primary_key=True, index=True)
    document_id = Column(String(50), ForeignKey("documents.id"), nullable=False)
    chunk_index = Column(Integer, default=0)
    content = Column(Text, nullable=False)
    page_number = Column(Integer, nullable=True)
    metadata_json = Column(Text, nullable=True)

    document = relationship("Document", back_populates="chunks")

class GeneratedMCQ(Base):
    __tablename__ = "generated_mcqs"

    id = Column(String(50), primary_key=True, index=True)
    document_id = Column(String(50), ForeignKey("documents.id"), nullable=True)
    competency_name = Column(String(150), default="Survey Sampling")
    difficulty = Column(String(20), default="Intermediate")
    question_text = Column(Text, nullable=False)
    options_json = Column(Text, nullable=False)  # Array of {id, text, isCorrect}
    correct_option_key = Column(String(10), default="A")
    explanation = Column(Text, nullable=True)
    grounded_chunk_id = Column(String(50), nullable=True)
    source_reference = Column(String(200), nullable=True)
    validation_status = Column(String(30), default="REVIEW_REQUIRED")  # DRAFT, REVIEW_REQUIRED, APPROVED, REJECTED, PUBLISHED
    reviewer_feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
