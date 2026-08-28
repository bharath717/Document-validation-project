from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class RiskScore(BaseModel):
    score: float
    level: str
    verdict: str


class VerificationReasonSchema(BaseModel):
    reason_code: str
    message: str
    severity: str


class EvidenceSchema(BaseModel):
    type: str
    path: str


class VerificationResponse(BaseModel):
    success: bool
    job_id: str
    document_type: str
    risk: RiskScore
    checks: Dict[str, Any]
    reasons: List[VerificationReasonSchema]
    evidence: List[EvidenceSchema]


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime]
