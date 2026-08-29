import os

from ela import perform_ela
from noise_analysis import analyze_noise
from heatmap import generate_heatmap


def detect_tampering(
    image_path,
    heatmap_path="heatmap.jpg"
):
    """
    Perform basic tamper detection using:

    1. ELA
    2. Noise analysis
    3. Heatmap generation

    Returns:
        Dictionary containing forensic results.
    """

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    # -----------------------------
    # ELA ANALYSIS
    # -----------------------------

    ela_image = perform_ela(image_path)

    # Calculate average ELA brightness
    ela_gray = ela_image.convert("L")

    pixels = list(
        ela_gray.getdata()
    )

    ela_average = sum(pixels) / len(pixels)

    # -----------------------------
    # NOISE ANALYSIS
    # -----------------------------

    noise_result = analyze_noise(
        image_path
    )

    suspicious_regions = noise_result[
        "suspicious_regions"
    ]

    # -----------------------------
    # HEATMAP
    # -----------------------------

    generated_heatmap = generate_heatmap(
        image_path,
        heatmap_path
    )

    # -----------------------------
    # BASIC FORENSIC SCORE
    # -----------------------------

    score = 0

    # ELA signal
    if ela_average > 20:
        score += 40
    elif ela_average > 10:
        score += 20

    # Noise signal
    if len(suspicious_regions) >= 5:
        score += 40
    elif len(suspicious_regions) >= 2:
        score += 20

    # Limit score
    score = min(score, 100)

    if score >= 60:
        verdict = "SUSPICIOUS"
    elif score >= 30:
        verdict = "REVIEW"
    else:
        verdict = "LOW SUSPICION"

    return {
        "forensics_score": score,
        "verdict": verdict,
        "ela_average": round(
            ela_average,
            2
        ),
        "noise_score": noise_result[
            "noise_score"
        ],
        "suspicious_regions":
            suspicious_regions,
        "heatmap_path":
            generated_heatmap
    }