from app.services.contracts import ForensicsAnalyzerContract

class MockForensicsAnalyzer(ForensicsAnalyzerContract):
    def analyze_forensics(self, document_path: str) -> dict:
        """
        MOCK / DEMO IMPLEMENTATION
        """
        return {
            "tamper_detected": False,
            "tamper_score": 10,
            "suspicious_regions": [],
            "heatmap_path": None,
            "confidence": 0.95
        }
