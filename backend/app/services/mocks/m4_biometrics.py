from app.services.contracts import BiometricsAnalyzerContract

class MockBiometricsAnalyzer(BiometricsAnalyzerContract):
    def verify_identity(self, id_image: str, selfie_image: str) -> dict:
        """
        MOCK / DEMO IMPLEMENTATION
        """
        return {
            "face_detected": True,
            "face_match": True,
            "similarity": 0.88,
            "liveness_verified": True,
            "confidence": 0.90
        }
