from app.services.contracts import OCRAnalyzerContract

class MockOCRAnalyzer(OCRAnalyzerContract):
    def analyze_document(self, document_path: str) -> dict:
        """
        MOCK / DEMO IMPLEMENTATION
        """
        return {
            "document_type": "national_id",
            "fields": {
                "name": "Jane Doe",
                "id_number": "123456789"
            },
            "field_confidence": {
                "name": 0.99,
                "id_number": 0.98
            },
            "layout_score": 0.92,
            "qr_valid": True,
            "mrz_valid": None,
            "field_consistency": True,
            "confidence": 0.95
        }
