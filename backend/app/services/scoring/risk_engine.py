def calculate_risk(
    quality_result: dict,
    forensics_result: dict,
    ocr_result: dict,
    biometrics_result: dict | None
) -> dict:
    score = 0
    reasons = []
    
    # 1. Quality Check
    if not quality_result.get("quality_passed", False):
        return {
            "score": 100,
            "level": "HIGH",
            "verdict": "RETAKE",
            "reasons": [{"reason_code": "POOR_QUALITY", "message": "Document image quality is too low", "severity": "CRITICAL"}]
        }
        
    # 2. Forensics (M2)
    if forensics_result.get("tamper_detected", False):
        score += 40
        reasons.append({"reason_code": "TAMPERING_DETECTED", "message": "Possible document tampering detected", "severity": "CRITICAL"})
    else:
        score += (forensics_result.get("tamper_score", 0) * 0.5)

    # 3. OCR & Layout (M3)
    if not ocr_result.get("qr_valid", True):
        score += 20
        reasons.append({"reason_code": "QR_INVALID", "message": "QR validation failed", "severity": "WARNING"})
        
    if not ocr_result.get("field_consistency", True):
        score += 30
        reasons.append({"reason_code": "FIELD_MISMATCH", "message": "Document fields are inconsistent", "severity": "WARNING"})
        
    # 4. Biometrics (M4)
    if biometrics_result:
        if not biometrics_result.get("face_match", True):
            score += 50
            reasons.append({"reason_code": "FACE_MISMATCH", "message": "Face similarity is below configured threshold", "severity": "CRITICAL"})
            
        if not biometrics_result.get("liveness_verified", True):
            score += 30
            reasons.append({"reason_code": "LIVENESS_FAILED", "message": "Liveness check failed", "severity": "WARNING"})
            
    # Cap score at 100
    score = min(score, 100)
    
    # Determine Level & Verdict
    if score <= 30:
        level = "LOW"
        verdict = "PASS"
    elif score <= 60:
        level = "MEDIUM"
        verdict = "REVIEW"
    else:
        level = "HIGH"
        verdict = "SUSPICIOUS"
        
    return {
        "score": score,
        "level": level,
        "verdict": verdict,
        "reasons": reasons
    }
