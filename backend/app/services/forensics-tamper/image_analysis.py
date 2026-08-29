import os
import tempfile

from PIL import Image, ImageChops, ImageEnhance, ImageStat


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

    original = Image.open(image_path).convert("RGB")

    with tempfile.NamedTemporaryFile(
        suffix=".jpg",
        delete=False
    ) as temp_file:

        temp_path = temp_file.name

    try:
        original.save(
            temp_path,
            "JPEG",
            quality=quality
        )

        recompressed = Image.open(
            temp_path
        ).convert("RGB")

        difference = ImageChops.difference(
            original,
            recompressed
        )

        extrema = difference.getextrema()

        max_difference = max(
            channel[1]
            for channel in extrema
        )

        if max_difference == 0:
            max_difference = 1

        scale = 255.0 / max_difference

        ela_image = ImageEnhance.Brightness(
            difference
        ).enhance(scale)

        return ela_image

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


def get_ela_score(image_path, quality=90):
    """
    Calculate the average ELA intensity.

    Higher values indicate stronger
    compression differences.
    """

    ela_image = perform_ela(
        image_path,
        quality
    )

    grayscale = ela_image.convert("L")

    statistics = ImageStat.Stat(grayscale)

    return round(
        statistics.mean[0],
        2
    )


def get_image_info(image_path):
    """
    Return basic information about an image.
    """

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    image = Image.open(image_path)

    return {
        "format": image.format,
        "width": image.width,
        "height": image.height,
        "mode": image.mode
    }