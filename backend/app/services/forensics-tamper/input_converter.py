import os
from PIL import Image


SUPPORTED_IMAGE_FORMATS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".tiff",
    ".tif",
    ".webp"
}


def convert_input_to_images(input_path, output_dir="converted_images"):
    """
    Convert an input document/image into one or more image files.

    Supported:
        JPG, JPEG, PNG, BMP, TIFF, WEBP
        PDF (requires pdf2image + Poppler)

    Returns:
        List of generated image paths.
    """

    if not os.path.exists(input_path):
        raise FileNotFoundError(
            f"Input file not found: {input_path}"
        )

    os.makedirs(output_dir, exist_ok=True)

    extension = os.path.splitext(input_path)[1].lower()

    # -----------------------------
    # IMAGE INPUT
    # -----------------------------
    if extension in SUPPORTED_IMAGE_FORMATS:

        image = Image.open(input_path).convert("RGB")

        output_path = os.path.join(
            output_dir,
            "page_1.jpg"
        )

        image.save(
            output_path,
            "JPEG",
            quality=95
        )

        return [output_path]

    # -----------------------------
    # PDF INPUT
    # -----------------------------
    elif extension == ".pdf":

        try:
            from pdf2image import convert_from_path
        except ImportError:
            raise ImportError(
                "PDF support requires pdf2image. "
                "Install it using: pip install pdf2image"
            )

        pages = convert_from_path(input_path)

        output_paths = []

        for index, page in enumerate(pages):

            output_path = os.path.join(
                output_dir,
                f"page_{index + 1}.jpg"
            )

            page.convert("RGB").save(
                output_path,
                "JPEG",
                quality=95
            )

            output_paths.append(output_path)

        return output_paths

    else:
        raise ValueError(
            f"Unsupported file format: {extension}"
        )