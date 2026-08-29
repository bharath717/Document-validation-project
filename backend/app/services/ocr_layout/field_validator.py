def validate_consistency(ocr_fields: dict, qr_result: dict, mrz_result: dict) -> dict:
    """
    Cross-checks OCR text against QR payload and MRZ zone to pinpoint altered regions.
    """
    flagged_regions = []
    
    doc_num = ocr_fields.get("document_number") or ocr_fields.get("roll_or_reg_number")
    doc_box = ocr_fields.get("document_number_box")
    
    # 1. QR Code Cross-Verification
    if qr_result.get("has_qr") and qr_result.get("data"):
        qr_text = qr_result["data"].replace(" ", "").upper()
        
        if doc_num:
            clean_doc = doc_num.replace(" ", "").upper()
            if clean_doc not in qr_text:
                flagged_regions.append({
                    "field": "document_number",
                    "issue": f"Extracted number '{doc_num}' not found in decoded QR payload",
                    "tampered_value": doc_num,
                    "bounding_box": doc_box
                })

    # 2. MRZ Cross-Verification (for Passports)
    if mrz_result.get("has_mrz") and mrz_result.get("mrz_data"):
        mrz_raw = mrz_result["mrz_data"]["raw_mrz"].replace("<", "")
        if doc_num and doc_num.upper() not in mrz_raw:
            flagged_regions.append({
                "field": "passport_number",
                "issue": f"Passport number '{doc_num}' does not match MRZ data",
                "tampered_value": doc_num,
                "bounding_box": doc_box
            })

    return {
        "is_consistent": len(flagged_regions) == 0,
        "flagged_regions": flagged_regions
    }