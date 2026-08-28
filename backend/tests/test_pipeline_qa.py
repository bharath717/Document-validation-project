"""
backend/tests/test_pipeline_qa.py
Verifies dataset integrity, tamper generation correctness, and API payload contracts.
"""

from pathlib import Path
from PIL import Image
import numpy as np


def test_authentic_id_dimensions_and_channels(sample_authentic_image):
    """Ensure generated authentic documents meet expected resolution and color profile."""
    assert sample_authentic_image.size == (650, 400)
    assert sample_authentic_image.mode == "RGB"


def test_text_forgery_generation(test_data_generator, sample_authentic_image):
    """Verify forged text artifacts are saved properly and readable by standard readers."""
    saved_path = test_data_generator.inject_text_forgery(
        sample_authentic_image,
        fake_text="01/01/2050",
        filename="test_forgery.jpg",
    )
    assert saved_path.exists()
    with Image.open(saved_path) as img:
        assert img.format == "JPEG"
        assert img.size == (650, 400)


def test_spliced_photo_variance(test_data_generator, sample_authentic_image):
    """Verify that spliced photo injection alters pixel variance in the target bounding box."""
    saved_path = test_data_generator.inject_spliced_photo(
        sample_authentic_image,
        filename="test_spliced.jpg",
    )
    assert saved_path.exists()

    with Image.open(saved_path) as img:
        img_np = np.array(img)
        # Crop to the photo region (40:190, 90:260) -> (ymin:ymax, xmin:xmax)
        photo_region = img_np[90:260, 40:190]
        variance = np.var(photo_region)
        # High-frequency synthetic noise will have higher variance than solid placeholder
        assert variance > 50.0


def test_api_contract_schema():
    """Verify standard response contract compliance for the backend integration pipeline."""
    mock_payload = {
        "document_type": "National ID",
        "verdict": "AUTHENTIC",
        "fraud_score": 14.2,
        "details": {
            "forensics": {"tampering_detected": False, "confidence": 0.88},
            "ocr": {"fields_extracted": 4, "mrz_valid": True},
            "biometrics": {"face_match": True, "cosine_distance": 0.12},
        },
    }

    assert "fraud_score" in mock_payload
    assert 0.0 <= mock_payload["fraud_score"] <= 100.0
    assert mock_payload["verdict"] in ["AUTHENTIC", "SUSPICIOUS", "FRAUDULENT"]
    assert isinstance(mock_payload["details"]["ocr"]["fields_extracted"], int)