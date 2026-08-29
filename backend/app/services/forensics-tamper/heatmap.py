import cv2
import numpy as np
import os


def generate_heatmap(
    image_path,
    output_path="heatmap.jpg"
):

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

    # Detect high-frequency changes
    laplacian = cv2.Laplacian(
        gray,
        cv2.CV_64F
    )

    magnitude = np.abs(laplacian)

    # Normalize to 0-255
    normalized = cv2.normalize(
        magnitude,
        None,
        0,
        255,
        cv2.NORM_MINMAX
    )

    normalized = normalized.astype(
        np.uint8
    )

    # Smooth small noise
    normalized = cv2.GaussianBlur(
        normalized,
        (5, 5),
        0
    )

    # Generate heatmap
    heatmap = cv2.applyColorMap(
        normalized,
        cv2.COLORMAP_JET
    )

    output_directory = os.path.dirname(
        output_path
    )

    if output_directory:
        os.makedirs(
            output_directory,
            exist_ok=True
        )

    cv2.imwrite(
        output_path,
        heatmap
    )

    return output_path