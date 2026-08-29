def classify_document(raw_text: str) -> dict:
    """
    Classifies government identity documents and educational certificates.
    Returns the document category and specific document type.
    """
    t = raw_text.upper()

    # --- Educational Boards & Marksheets ---
    if "CENTRAL BOARD OF SECONDARY EDUCATION" in t or "CBSE" in t or "ALL INDIA SECONDARY SCHOOL" in t:
        return {"category": "EDUCATIONAL", "type": "CBSE_MARKSHEET"}
    elif "COUNCIL FOR THE INDIAN SCHOOL CERTIFICATE" in t or "CISCE" in t or "ICSE" in t or "ISC" in t:
        return {"category": "EDUCATIONAL", "type": "ICSE_MARKSHEET"}
    elif "SECONDARY SCHOOL LEAVING CERTIFICATE" in t or "SSLC" in t or "BOARD OF SECONDARY EDUCATION" in t or "MATRICULATION" in t:
        return {"category": "EDUCATIONAL", "type": "SSLC_MARKSHEET"}
    elif "PRE-UNIVERSITY" in t or "DEPARTMENT OF PRE-UNIVERSITY" in t or "HIGHER SECONDARY" in t or "HSC" in t or "PUC" in t:
        return {"category": "EDUCATIONAL", "type": "PUC_12TH_MARKSHEET"}
    elif any(k in t for k in ["DEGREE CERTIFICATE", "PROVISIONAL CERTIFICATE", "CONSOLIDATED STATEMENT OF MARKS", "BACHELOR OF", "MASTER OF", "UNIVERSITY"]):
        return {"category": "EDUCATIONAL", "type": "UNIVERSITY_DEGREE_OR_TRANSCRIPT"}

    # --- Government Identity Proofs ---
    elif "INCOME TAX DEPARTMENT" in t or "PERMANENT ACCOUNT NUMBER" in t:
        return {"category": "IDENTITY", "type": "PAN_CARD"}
    elif "UNIQUE IDENTIFICATION AUTHORITY OF INDIA" in t or "AADHAAR" in t or "GOVERNMENT OF INDIA" in t and "ENROLMENT" in t:
        return {"category": "IDENTITY", "type": "AADHAAR_CARD"}
    elif "PASSPORT" in t or "REPUBLIC OF INDIA" in t or "P<IND" in t:
        return {"category": "IDENTITY", "type": "INDIAN_PASSPORT"}
    elif "ELECTION COMMISSION OF INDIA" in t or "ELECTOR PHOTO IDENTITY CARD" in t or "VOTER" in t:
        return {"category": "IDENTITY", "type": "VOTER_ID"}
    elif "DRIVING LICENCE" in t or "DRIVING LICENSE" in t or "UNION OF INDIA DRIVING" in t or "TRANSPORT DEPARTMENT" in t:
        return {"category": "IDENTITY", "type": "DRIVING_LICENSE"}

    return {"category": "UNKNOWN", "type": "UNKNOWN_DOCUMENT"}