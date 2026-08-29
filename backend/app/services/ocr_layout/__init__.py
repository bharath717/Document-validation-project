import cv2
from .ocr import extract_ocr_data
from .document_classifier import classify_document_type
from .layout_validator import validate_layout_with_model
from .qr_validator import scan_and_decode_qr
from .mrz_validator import validate_mrz_checksum
from .field_validator import compare_fields

def analyze_document(document_path: str) -> dict:
    """
    Member 3 single entry point for Member 1 (Abhishek)'s master pipeline.
    """
    image = cv2.imread(document_path)
    
    # 1. OCR text extraction
    ocr_result = extract_ocr_data(image) # returns {"text": ..., "tokens": ..., "boxes": ...}
    
    # 2. Document classification
    doc_type, type_conf = classify_document_type(image, ocr_result["text"])
    
    # 3. Layout validation using your trained model
    is_valid_layout, layout_score, layout_flags = validate_layout_with_model(
        image_path=document_path,
        tokens=ocr_result["tokens"],
        boxes=ocr_result["boxes"]
    )
    
    # 4. QR & MRZ security extraction
    qr_data = scan_and_decode_qr(image)
    mrz_data = validate_mrz_checksum(ocr_result["text"]) if doc_type == "PASSPORT" else None
    
    # 5. Cross-field consistency check
    mismatch_flags = compare_fields(ocr_result["extracted_fields"], qr_data, mrz_data)
    
    all_flags = layout_flags + mismatch_flags
    
    return {
        "document_type": doc_type,
        "classification_confidence": type_conf,
        "extracted_fields": ocr_result["extracted_fields"],
        "is_valid_layout": is_valid_layout,
        "layout_confidence": layout_score,
        "security_elements": {
            "qr_detected": bool(qr_data),
            "qr_payload": qr_data,
            "mrz_detected": bool(mrz_data),
            "mrz_valid": mrz_data.get("is_valid") if mrz_data else None
        },
        "cross_check_mismatch": mismatch_flags,
        "flags": all_flags,
        "risk_contribution": min(100.0, len(all_flags) * 15.0)  # Feeds M1's scoring engine
    }