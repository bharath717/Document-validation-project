import os

import cv2
import numpy as np

from image_analysis import (
    get_ela_score,
    perform_ela
)


def calculate_noise_score(image_path):
    """
    Calculate image noise using Laplacian variance.
    """

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(
            f"Unable to read image: {image_path}"
        )

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    laplacian = cv2.Laplacian(
        gray,
        cv2.CV_64F
    )

    return round(
        float(laplacian.var()),
        2
    )


def find_suspicious_regions(
    image_path,
    block_size=64
):
    """
    Divide the image into blocks and identify
    blocks with unusually high noise.
    """

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(
            f"Unable to read image: {image_path}"
        )

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    height, width = gray.shape

    blocks = []

    for y in range(0, height, block_size):

        for x in range(0, width, block_size):

            block = gray[
                y:min(y + block_size, height),
                x:min(x + block_size, width)
            ]

            if block.size == 0:
                continue

            laplacian = cv2.Laplacian(
                block,
                cv2.CV_64F
            )

            score = float(
                laplacian.var()
            )

            blocks.append({
                "x": x,
                "y": y,
                "width": block.shape[1],
                "height": block.shape[0],
                "noise_score": score
            })

    if not blocks:
        return []

    scores = np.array([
        block["noise_score"]
        for block in blocks
    ])

    mean = scores.mean()
    std = scores.std()

    threshold = mean + (2 * std)

    suspicious = [
        block
        for block in blocks
        if block["noise_score"] > threshold
    ]

    return suspicious


def create_ela_image(
    image_path,
    output_path="ela_result.jpg"
):
    """
    Generate and save an ELA image.
    """

    ela_image = perform_ela(
        image_path
    )

    directory = os.path.dirname(
        output_path
    )

    if directory:
        os.makedirs(
            directory,
            exist_ok=True
        )

    ela_image.save(
        output_path,
        "JPEG"
    )

    return output_path


def detect_tampering(image_path):
    """
    Perform basic forensic analysis.

    Returns:
        Dictionary containing:
        - ELA score
        - noise score
        - suspicious regions
        - forensic score
        - verdict
    """

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    ela_score = get_ela_score(
        image_path
    )

    noise_score = calculate_noise_score(
        image_path
    )

    suspicious_regions = find_suspicious_regions(
        image_path
    )

    forensic_score = 0

    # ELA signal
    if ela_score >= 30:
        forensic_score += 40
    elif ela_score >= 15:
        forensic_score += 20

    # Suspicious noise regions
    if len(suspicious_regions) >= 5:
        forensic_score += 40
    elif len(suspicious_regions) >= 2:
        forensic_score += 20

    forensic_score = min(
        forensic_score,
        100
    )

    if forensic_score >= 60:
        verdict = "SUSPICIOUS"
    elif forensic_score >= 30:
        verdict = "REVIEW"
    else:
        verdict = "LOW_SUSPICION"

    return {
        "forensic_score": forensic_score,
        "verdict": verdict,
        "ela_score": ela_score,
        "noise_score": noise_score,
        "suspicious_regions": suspicious_regions
    }