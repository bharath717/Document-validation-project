import numpy as np
from pyzbar.pyzbar import decode

def decode_qr_code(image: np.ndarray) -> dict:
    """Detects and extracts data & bounding coordinates from 2D barcodes or QR codes."""
    decoded_objects = decode(image)
    if not decoded_objects:
        return {"has_qr": False, "data": None, "box": None}
    
    obj = decoded_objects[0]
    rect = obj.rect
    return {
        "has_qr": True,
        "data": obj.data.decode("utf-8", errors="ignore"),
        "box": {
            "x": rect.left,
            "y": rect.top,
            "width": rect.width,
            "height": rect.height
        }
    }