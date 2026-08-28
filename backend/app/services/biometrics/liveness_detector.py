"""
backend/app/services/biometrics/liveness_detector.py
Passive Liveness Detection and Presentation Attack Detection (PAD).
"""

import cv2
import numpy as np


class LivenessDetector:
    def __init__(self, laplacian_blur_threshold: float = 100.0):
        self.laplacian_blur_threshold = laplacian_blur_threshold

    def check_blur_metric(self, image_np: np.ndarray) -> Tuple[bool, float]:
        """Detects if an image is blurred or captured from a low-resolution printed paper."""
        gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
        variance = cv2.Laplacian(gray, cv2.CV_64F).var()
        is_clear = variance >= self.laplacian_blur_threshold
        return is_clear, round(variance, 2)

    def analyze_passive_liveness(self, image_path: str) -> dict:
        """Runs basic anti-spoofing heuristics on the captured selfie."""
        image = cv2.imread(image_path)
        if image is None:
            return {"liveness_passed": False, "reason": "Failed to read image file"}

        is_clear, blur_score = self.check_blur_metric(image)

        # Check color spectrum variance to detect grayscale/screen glare attacks
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        sat_variance = np.var(hsv[:, :, 1])

        liveness_passed = is_clear and (sat_variance > 50.0)

        return {
            "liveness_passed": liveness_passed,
            "blur_score": blur_score,
            "saturation_variance": round(float(sat_variance), 2),
            "is_sharp": is_clear,
        }


if __name__ == "__main__":
    detector = LivenessDetector()
    print("LivenessDetector initialized successfully.")