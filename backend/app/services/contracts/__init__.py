from abc import ABC, abstractmethod

class ForensicsAnalyzerContract(ABC):
    @abstractmethod
    def analyze_forensics(self, document_path: str) -> dict:
        """
        Expected return format:
        {
            "tamper_detected": bool,
            "tamper_score": int,
            "suspicious_regions": list,
            "heatmap_path": str | None,
            "confidence": float
        }
        """
        pass

class OCRAnalyzerContract(ABC):
    @abstractmethod
    def analyze_document(self, document_path: str) -> dict:
        """
        Expected return format:
        {
            "document_type": str,
            "fields": dict,
            "field_confidence": dict,
            "layout_score": float,
            "qr_valid": bool | None,
            "mrz_valid": bool | None,
            "field_consistency": bool | None,
            "confidence": float
        }
        """
        pass

class BiometricsAnalyzerContract(ABC):
    @abstractmethod
    def verify_identity(self, id_image: str, selfie_image: str) -> dict:
        """
        Expected return format:
        {
            "face_detected": bool,
            "face_match": bool | None,
            "similarity": float,
            "liveness_verified": bool | None,
            "confidence": float
        }
        """
        pass
