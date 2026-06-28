from datetime import datetime
from uuid import uuid4
from sqlalchemy import Column, String, DateTime, Integer
from interview_prep_ai.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    full_name = Column(String, nullable=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    
    role = Column(String, default="user", nullable=False)
    plan = Column(String, default="free", nullable=False)
    
    reports_generated = Column(Integer, default=0, nullable=False)
    ai_requests = Column(Integer, default=0, nullable=False)
    tokens_consumed = Column(Integer, default=0, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)
