import os

from tamper_detection import detect_tampering


def analyze_document(image_path):
    """
    Main entry point for the forensics module.

    Args:
        image_path: Path to a processed document image.

    Returns:
        Dictionary containing forensic results.
    """

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Document not found: {image_path}"
        )

    result = detect_tampering(
        image_path
    )

    return {
        "module": "computer_vision_forensics",
        "image": image_path,
        "forensic_score": result[
            "forensic_score"
        ],
        "verdict": result[
            "verdict"
        ],
        "ela_score": result[
            "ela_score"
        ],
        "noise_score": result[
            "noise_score"
        ],
        "suspicious_regions": result[
            "suspicious_regions"
        ]
    }