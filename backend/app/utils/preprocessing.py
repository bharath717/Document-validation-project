import random

def check_image_quality(file_path: str, document_type: str = "document") -> dict:
    """
    Mock implementation of image quality check.
    In a real system, this would use OpenCV/PIL to analyze the image.
    """
    
    # Simulate quality metrics
    blur_score = random.uniform(0.01, 0.3)
    glare_score = random.uniform(0.01, 0.2)
    quality_score = random.uniform(0.7, 1.0)
    
    issues = []
    
    # Thresholds
    if blur_score > 0.25:
        issues.append("Image is too blurry")
    if glare_score > 0.15:
        issues.append("Excessive glare detected")
    if quality_score < 0.75:
        issues.append("Overall image quality is too low")
        
    quality_passed = len(issues) == 0
    
    return {
        "quality_passed": quality_passed,
        "quality_score": round(quality_score, 2),
        "blur_score": round(blur_score, 2),
        "glare_score": round(glare_score, 2),
        "resolution_ok": True,
        "issues": issues
    }
