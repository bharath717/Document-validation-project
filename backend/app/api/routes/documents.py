from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import get_db
from app.db import models
from app.db import schemas
from app.pipelines.document_pipeline import process_document_pipeline

router = APIRouter()

@router.post("/validate", response_model=schemas.VerificationResponse)
async def validate_document(
    document: UploadFile = File(...),
    selfie: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    try:
        result = await process_document_pipeline(db, document, selfie)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{document_id}")
async def get_document_result(
    document_id: str,
    db: Session = Depends(get_db)
):
    # document_id maps to job.id
    job = db.query(models.VerificationJob).filter(models.VerificationJob.id == document_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    result = job.result
    if not result:
        return {"job_id": job.id, "status": job.status, "message": "Processing not completed or failed before result creation."}
        
    checks = {check.module: check.metadata_json for check in result.checks}
    reasons = [{"reason_code": r.reason_code, "message": r.message, "severity": r.severity} for r in result.reasons]
    
    # Safely get document_type from ocr_layout check, otherwise default to "unknown"
    doc_type = "unknown"
    if "ocr_layout" in checks and isinstance(checks["ocr_layout"], dict):
        doc_type = checks["ocr_layout"].get("document_type", "unknown")

    return {
        "success": True,
        "job_id": job.id,
        "document_type": doc_type,
        "risk": {
            "score": result.risk_score,
            "level": result.risk_level,
            "verdict": result.verdict
        },
        "checks": checks,
        "reasons": reasons,
        "evidence": []
    }
