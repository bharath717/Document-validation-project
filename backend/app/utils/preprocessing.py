import os

from PIL import Image


SUPPORTED_IMAGE_FORMATS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".tif",
    ".tiff",
    ".webp"
}


def validate_input(file_path):
    """
    Check whether the input file exists
    and has a supported format.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(
            f"File not found: {file_path}"
        )

    extension = os.path.splitext(
        file_path
    )[1].lower()

    supported = (
        extension in SUPPORTED_IMAGE_FORMATS
        or extension == ".pdf"
    )

    if not supported:
        raise ValueError(
            f"Unsupported file format: {extension}"
        )

    return True


def convert_image(
    input_path,
    output_path="processed_input.jpg"
):
    """
    Convert an image to RGB JPEG format.
    """

    validate_input(input_path)

    extension = os.path.splitext(
        input_path
    )[1].lower()

    if extension == ".pdf":
        raise ValueError(
            "Use convert_pdf() for PDF files."
        )

    image = Image.open(
        input_path
    ).convert("RGB")

    image.save(
        output_path,
        "JPEG",
        quality=95
    )

    return output_path


def convert_pdf(
    input_path,
    output_dir="processed_pages"
):
    """
    Convert each PDF page into a JPEG image.

    Requires:
        pdf2image
        Poppler
    """

    validate_input(input_path)

    try:
        from pdf2image import convert_from_path
    except ImportError:
        raise ImportError(
            "Install pdf2image using: "
            "pip install pdf2image"
        )

    os.makedirs(
        output_dir,
        exist_ok=True
    )

    pages = convert_from_path(
        input_path
    )

    output_files = []

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

        output_files.append(
            output_path
        )

    return output_files


def preprocess_input(
    input_path,
    output_dir="processed"
):
    """
    Automatically process an image or PDF.
    """

    validate_input(input_path)

    os.makedirs(
        output_dir,
        exist_ok=True
    )

    extension = os.path.splitext(
        input_path
    )[1].lower()

    if extension == ".pdf":

        return convert_pdf(
            input_path,
            output_dir
        )

    output_path = os.path.join(
        output_dir,
        "processed_image.jpg"
    )

    return [
        convert_image(
            input_path,
            output_path
        )
    ]