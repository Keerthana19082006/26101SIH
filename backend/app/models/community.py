from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Discussion(Base):
    __tablename__ = "discussions"

    id = Column(String(50), primary_key=True, index=True)
    author_id = Column(String(50), nullable=True)
    author_name = Column(String(150), default="Officer")
    author_role = Column(String(100), default="Statistical Investigator")
    department_name = Column(String(150), default="MoSPI")
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(100), default="Methodology & Field Operations")
    upvotes = Column(Integer, default=0)
    replies_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    replies = relationship("DiscussionReply", back_populates="discussion", cascade="all, delete-orphan")

class DiscussionReply(Base):
    __tablename__ = "discussion_replies"

    id = Column(String(50), primary_key=True, index=True)
    discussion_id = Column(String(50), ForeignKey("discussions.id"), nullable=False)
    author_id = Column(String(50), nullable=True)
    author_name = Column(String(150), nullable=False)
    author_role = Column(String(100), default="Faculty / Senior Officer")
    is_trainer_response = Column(Boolean, default=False)
    content = Column(Text, nullable=False)
    upvotes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    discussion = relationship("Discussion", back_populates="replies")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), nullable=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="RECOMMENDATION")  # RECOMMENDATION, ASSESSMENT, GAP_ALERT, STREAK, BADGE
    link_path = Column(String(200), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
