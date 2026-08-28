# Dataset Guidelines

This directory is for storing local development datasets and synthetic test data.

## IMPORTANT SECURITY RULES

**DO NOT COMMIT REAL DATA:**
Never commit real identity documents, real selfies, or sensitive PII to this repository.

**ONLY USE SYNTHETIC DATA:**
M2, M3, M4, and M6 should only use generated, publicly available benchmark datasets, or synthetic images for testing and algorithm validation.

## Module Data

*   **M2 (Forensics)**: Place synthetic tampered images in `dataset/forensics/`
*   **M3 (OCR/Layout)**: Place sample ID templates in `dataset/ocr/`
*   **M4 (Biometrics)**: Place authorized synthetic face pairs in `dataset/biometrics/`
*   **M6 (QA)**: Store test cases and synthetic regression suites in `dataset/test_cases/`

Keep all datasets strictly local and ignored in `.gitignore`.
