import os
import re
import cv2
import numpy as np
import pytesseract
from pytesseract import Output
import fitz  # PyMuPDF for PDF inputs

DEFAULT_TESSERACT_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(DEFAULT_TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = DEFAULT_TESSERACT_PATH

def load_file_as_image(file_path: str) -> np.ndarray:
    """Converts PDF, DOCX, or regular images into an OpenCV BGR numpy array."""
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == ".pdf":
        doc = fitz.open(file_path)
        page = doc.load_page(0)
        pix = page.get_pixmap(dpi=200)
        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape((pix.height, pix.width, pix.n))
        if pix.n == 4:
            return cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
        return cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    else:
        img = cv2.imread(file_path)
        if img is None:
            raise ValueError(f"Could not open/read file: {file_path}")
        return img

def extract_text_and_boxes(image: np.ndarray, doc_type: str) -> dict:
    """Extracts raw text, identifies key fields based on document type, and stores bounding boxes."""
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # OCR Data with coordinates
    ocr_data = pytesseract.image_to_data(gray, output_type=Output.DICT)
    raw_text = pytesseract.image_to_string(gray)
    
    fields = {
        "document_number": None,
        "document_number_box": None,
        "dob": None,
        "dob_box": None,
        "roll_or_reg_number": None,
        "year_of_passing": None,
        "raw_text": raw_text
    }
    
    # Common Patterns
    pan_regex = r"^[A-Z]{5}[0-9]{4}[A-Z]$"
    dob_regex = r"^\d{2}[/-]\d{2}[/-]\d{4}$"
    year_regex = r"^(19|20)\d{2}$"
    roll_regex = r"^(ROLL|REG|REGISTER|SEAT)[\s.:#-]*([A-Z0-9]+)$"

    n_boxes = len(ocr_data['text'])
    aadhaar_digits = []

    for i in range(n_boxes):
        word = ocr_data['text'][i].strip()
        if not word:
            continue
        
        box = {
            "x": ocr_data['left'][i], "y": ocr_data['top'][i],
            "width": ocr_data['width'][i], "height": ocr_data['height'][i]
        }

        # ID Matching
        if doc_type == "PAN_CARD" and re.match(pan_regex, word):
            fields["document_number"] = word
            fields["document_number_box"] = box
        elif doc_type == "AADHAAR_CARD" and re.match(r"^\d{4}$", word):
            aadhaar_digits.append((word, box))
        
        # Date of Birth Matching
        if re.match(dob_regex, word):
            fields["dob"] = word
            fields["dob_box"] = box
            
        # Educational Field Matching
        if "MARKSHEET" in doc_type or "DEGREE" in doc_type:
            if re.match(year_regex, word) and not fields["year_of_passing"]:
                fields["year_of_passing"] = word
            if any(k in word.upper() for k in ["ROLL", "REG", "NO."]) and (i + 1 < n_boxes):
                next_word = ocr_data['text'][i + 1].strip()
                if next_word and len(next_word) >= 4:
                    fields["roll_or_reg_number"] = next_word
                    fields["document_number_box"] = {
                        "x": ocr_data['left'][i + 1], "y": ocr_data['top'][i + 1],
                        "width": ocr_data['width'][i + 1], "height": ocr_data['height'][i + 1]
                    }

    if doc_type == "AADHAAR_CARD" and len(aadhaar_digits) >= 3:
        fields["document_number"] = f"{aadhaar_digits[0][0]} {aadhaar_digits[1][0]} {aadhaar_digits[2][0]}"
        fields["document_number_box"] = aadhaar_digits[0][1]

    return fields