import os
import sys

import pytest
from PIL import Image

# Add the forensics folder to Python path
FORENSICS_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "backend",
        "app",
        "services",
        "forensics-tamper"
    )
)

UTILS_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "backend",
        "app",
        "utils"
    )
)

sys.path.insert(
    0,
    FORENSICS_PATH
)

sys.path.insert(
    0,
    UTILS_PATH
)

from image_analysis import (
    perform_ela,
    get_ela_score
)

from tamper_detection import (
    detect_tampering
)

from preprocessing import (
    preprocess_input
)


@pytest.fixture
def sample_image(tmp_path):

    image_path = tmp_path / "sample.jpg"

    image = Image.new(
        "RGB",
        (500, 300),
        "white"
    )

    image.save(
        image_path,
        "JPEG"
    )

    return str(image_path)


def test_ela(sample_image):

    result = perform_ela(
        sample_image
    )

    assert result is not None

    assert result.size == (
        500,
        300
    )


def test_ela_score(sample_image):

    score = get_ela_score(
        sample_image
    )

    assert isinstance(
        score,
        float
    )

    assert score >= 0


def test_tamper_detection(
    sample_image
):

    result = detect_tampering(
        sample_image
    )

    assert "forensic_score" in result
    assert "verdict" in result
    assert "ela_score" in result
    assert "noise_score" in result


def test_preprocessing(
    sample_image,
    tmp_path
):

    output_dir = tmp_path / "processed"

    result = preprocess_input(
        sample_image,
        str(output_dir)
    )

    assert len(result) == 1

    assert os.path.exists(
        result[0]
    )