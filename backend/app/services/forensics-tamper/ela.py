import os
from PIL import Image, ImageChops, ImageEnhance


def perform_ela(image_path, quality=90):
    """
    Perform Error Level Analysis (ELA).

    Returns:
        PIL.Image: ELA image
    """

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    original = Image.open(
        image_path
    ).convert("RGB")

    temp_path = "temp_ela.jpg"

    try:

        # Recompress the image
        original.save(
            temp_path,
            "JPEG",
            quality=quality
        )

        recompressed = Image.open(
            temp_path
        ).convert("RGB")

        # Calculate differences
        ela_image = ImageChops.difference(
            original,
            recompressed
        )

        # Find maximum difference
        extrema = ela_image.getextrema()

        max_difference = max(
            channel[1]
            for channel in extrema
        )

        if max_difference == 0:
            max_difference = 1

        # Amplify differences
        scale = 255.0 / max_difference

        ela_image = ImageEnhance.Brightness(
            ela_image
        ).enhance(scale)

        return ela_image

    finally:

        if os.path.exists(temp_path):
            os.remove(temp_path)