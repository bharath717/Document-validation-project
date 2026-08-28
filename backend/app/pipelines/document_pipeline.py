from fastapi import UploadFile
from sqlalchemy.orm import Session
from typing import Optional

from app.utils.file_handler import save_upload
from app.utils.preprocessing import check_image_quality
from app.services.mocks.m2_forensics import MockForensicsAnalyzer
from app.services.mocks.m3_ocr import MockOCRAnalyzer
from app.services.mocks.m4_biometrics import MockBiometricsAnalyzer
from app.services.scoring.risk_engine import calculate_risk
from app.db import models

# Instantiate mocks (these will be replaced by real implementations in future phases)
forensics_analyzer = MockForensicsAnalyzer()
ocr_analyzer = MockOCRAnalyzer()
biometrics_analyzer = MockBiometricsAnalyzer()

async def process_document_pipeline(
    db: Session,
    document: UploadFile,
    selfie: Optional[UploadFile] = None
) -> dict:
    
    # 1. Create Job in DB
    job = models.VerificationJob()
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # 2. File Upload & Validation
    doc_info = await save_upload(document)
    db_doc = models.Document(
        job_id=job.id,
        document_type="document",
        file_hash=doc_info["hash"],
        storage_reference=doc_info["path"]
    )
    db.add(db_doc)
    
    selfie_path = None
    if selfie:
        selfie_info = await save_upload(selfie)
        db_selfie = models.Document(
            job_id=job.id,
            document_type="selfie",
            file_hash=selfie_info["hash"],
            storage_reference=selfie_info["path"]
        )
        db.add(db_selfie)
        selfie_path = selfie_info["path"]
        
    db.commit()
    
    # 3. Quality Gate
    quality_result = check_image_quality(doc_info["path"])
    
    # Check if we should abort early
    if not quality_result["quality_passed"]:
        # Only log quality failure and return RETAKE
        risk = calculate_risk(quality_result, {}, {}, None)
        return _finalize_job(db, job, risk, {"quality": quality_result})
        
    # 4. M2 Forensics
    try:
        forensics_result = forensics_analyzer.analyze_forensics(doc_info["path"])
    except Exception as e:
        forensics_result = {"status": "ERROR", "error": str(e)}

    # 5. M3 OCR/Layout
    try:
        ocr_result = ocr_analyzer.analyze_document(doc_info["path"])
    except Exception as e:
        ocr_result = {"status": "ERROR", "error": str(e)}

    # 6. M4 Biometrics (only if selfie provided)
    biometrics_result = None
    if selfie_path:
        try:
            biometrics_result = biometrics_analyzer.verify_identity(doc_info["path"], selfie_path)
        except Exception as e:
            biometrics_result = {"status": "ERROR", "error": str(e)}

    # 7. Risk Engine Scoring
    risk = calculate_risk(
        quality_result=quality_result,
        forensics_result=forensics_result,
        ocr_result=ocr_result,
        biometrics_result=biometrics_result
    )
    
    # 8. Store results
    checks = {
        "quality": quality_result,
        "forensics": forensics_result,
        "ocr_layout": ocr_result,
        "biometrics": biometrics_result if biometrics_result else {"status": "NOT_PROVIDED"}
    }
    
    return _finalize_job(db, job, risk, checks)

def _finalize_job(db: Session, job: models.VerificationJob, risk: dict, checks: dict) -> dict:
    from datetime import datetime, timezone
    
    # Create VerificationResult
    result = models.VerificationResult(
        job_id=job.id,
        risk_score=risk["score"],
        risk_level=risk["level"],
        verdict=risk["verdict"]
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    
    # Store reasons
    for reason in risk["reasons"]:
        db_reason = models.VerificationReason(
            result_id=result.id,
            reason_code=reason["reason_code"],
            message=reason["message"],
            severity=reason["severity"]
        )
        db.add(db_reason)
        
    # Store checks metadata (simplified to JSON for this prototype)
    for module_name, module_data in checks.items():
        status = module_data.get("status", "PASS" if not "error" in module_data else "ERROR")
        
        # Check specific override
        if module_name == "quality" and not module_data.get("quality_passed", True):
             status = "FAIL"
             
        db_check = models.VerificationCheck(
            result_id=result.id,
            module=module_name,
            status=status,
            metadata_json=module_data
        )
        db.add(db_check)
        
    job.status = "COMPLETED"
    job.completed_at = datetime.now(timezone.utc)
    db.commit()
    
    return {
        "success": True,
        "job_id": job.id,
        "document_type": checks.get("ocr_layout", {}).get("document_type", "unknown"),
        "risk": risk,
        "checks": checks,
        "reasons": risk["reasons"],
        "evidence": []
    }
