import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Boolean, Text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base

class VerificationJob(Base):
    __tablename__ = "verification_jobs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    status = Column(String, default="PENDING")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, nullable=True)

    documents = relationship("Document", back_populates="job")
    result = relationship("VerificationResult", back_populates="job", uselist=False)


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("verification_jobs.id"))
    document_type = Column(String)  # 'document' or 'selfie'
    file_hash = Column(String, unique=True, index=True)
    storage_reference = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    job = relationship("VerificationJob", back_populates="documents")


class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("verification_jobs.id"))
    risk_score = Column(Float, nullable=True)
    risk_level = Column(String, nullable=True) # LOW, MEDIUM, HIGH
    verdict = Column(String, nullable=True) # PASS, REVIEW, SUSPICIOUS, RETAKE
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    job = relationship("VerificationJob", back_populates="result")
    checks = relationship("VerificationCheck", back_populates="result")
    reasons = relationship("VerificationReason", back_populates="result")
    evidence = relationship("EvidenceArtifact", back_populates="result")


class VerificationCheck(Base):
    __tablename__ = "verification_checks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    result_id = Column(String, ForeignKey("verification_results.id"))
    module = Column(String) # file_validation, quality, forensics, ocr, biometrics
    score = Column(Float, nullable=True)
    status = Column(String) # PASS, FAIL, ERROR
    confidence = Column(Float, nullable=True)
    metadata_json = Column(JSON, nullable=True)

    result = relationship("VerificationResult", back_populates="checks")


class VerificationReason(Base):
    __tablename__ = "verification_reasons"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    result_id = Column(String, ForeignKey("verification_results.id"))
    reason_code = Column(String)
    message = Column(Text)
    severity = Column(String) # INFO, WARNING, CRITICAL

    result = relationship("VerificationResult", back_populates="reasons")


class EvidenceArtifact(Base):
    __tablename__ = "evidence_artifacts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    result_id = Column(String, ForeignKey("verification_results.id"))
    type = Column(String) # heatmap, crop
    path = Column(String)
    expires_at = Column(DateTime, nullable=True)

    result = relationship("VerificationResult", back_populates="evidence")
