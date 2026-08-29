import cv2
import numpy as np
import os


def analyze_noise(image_path, block_size=32):

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(
            "Unable to read image."
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

            noise_score = float(
                laplacian.var()
            )

            blocks.append({
                "x": x,
                "y": y,
                "width": block.shape[1],
                "height": block.shape[0],
                "noise_score": noise_score
            })

    if not blocks:
        return {
            "noise_score": 0.0,
            "suspicious_regions": []
        }

    scores = [
        block["noise_score"]
        for block in blocks
    ]

    average = float(np.mean(scores))
    standard_deviation = float(np.std(scores))

    threshold = average + (
        2 * standard_deviation
    )

    suspicious_regions = []

    for block in blocks:

        if block["noise_score"] > threshold:

            suspicious_regions.append({
                "x": block["x"],
                "y": block["y"],
                "width": block["width"],
                "height": block["height"],
                "noise_score": round(
                    block["noise_score"],
                    2
                )
            })

    return {
        "noise_score": round(
            average,
            2
        ),
        "suspicious_regions":
            suspicious_regions
    }