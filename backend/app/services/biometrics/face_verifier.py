"""
backend/app/services/biometrics/face_verifier.py
Biometric Face Verification Engine using DeepFace / ArcFace embeddings.
"""

from typing import Dict, Any, Tuple
import cv2
import numpy as np
from deepface import DeepFace


class FaceVerifier:
    def __init__(self, model_name: str = "ArcFace", distance_metric: str = "cosine"):
        self.model_name = model_name
        self.distance_metric = distance_metric
        # Threshold for ArcFace with cosine distance (<= 0.68 implies match)
        self.threshold = 0.68

    def extract_and_match(
        self,
        id_image_path: str,
        selfie_image_path: str,
    ) -> Dict[str, Any]:
        """
        Extracts faces from both ID image and selfie, computes embeddings,
        and determines if both faces belong to the same individual.
        """
        try:
            result = DeepFace.verify(
                img1_path=id_image_path,
                img2_path=selfie_image_path,
                model_name=self.model_name,
                distance_metric=self.distance_metric,
                enforce_detection=True,
                detector_backend="opencv",
            )

            distance = float(result.get("distance", 1.0))
            is_match = bool(result.get("verified", False))

            # Normalize distance to confidence score (0.0 to 1.0)
            confidence = max(0.0, min(1.0, 1.0 - (distance / self.threshold)))

            return {
                "face_detected": True,
                "is_match": is_match,
                "confidence_score": round(confidence, 4),
                "distance": round(distance, 4),
                "model_used": self.model_name,
                "error": None,
            }

        except ValueError as e:
            # Triggered if no face is detected in either image
            return {
                "face_detected": False,
                "is_match": False,
                "confidence_score": 0.0,
                "distance": 1.0,
                "model_used": self.model_name,
                "error": f"Face detection failed: {str(e)}",
            }
        except Exception as e:
            return {
                "face_detected": False,
                "is_match": False,
                "confidence_score": 0.0,
                "distance": 1.0,
                "model_used": self.model_name,
                "error": f"Verification error: {str(e)}",
            }


if __name__ == "__main__":
    # Quick standalone test
    verifier = FaceVerifier()
    print("FaceVerifier initialized successfully with model:", verifier.model_name)
    