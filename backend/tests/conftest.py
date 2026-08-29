"""
backend/tests/conftest.py
Shared PyTest fixtures.
"""

import pytest
import shutil
from pathlib import Path
from dataset_tools.synthetic_generator import DocumentDatasetGenerator


@pytest.fixture(scope="session")
def test_data_generator(tmp_path_factory):
    """Provides a temporary generator instance writeable to an isolated test folder."""
    temp_dir = tmp_path_factory.mktemp("qa_dataset")
    generator = DocumentDatasetGenerator(output_dir=temp_dir)
    return generator


@pytest.fixture(scope="session")
def sample_authentic_image(test_data_generator):
    """Generates a single in-memory authentic image."""
    return test_data_generator.generate_authentic_id(filename="pytest_auth.png")