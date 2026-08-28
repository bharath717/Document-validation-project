"""
dataset_tools/synthetic_generator.py
Synthetic ID generator and digital tampering injection suite for ML testing.
"""

import os
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"


class DocumentDatasetGenerator:
    def __init__(self, output_dir: Path = OUTPUT_DIR):
        self.output_dir = output_dir
        self.auth_dir = self.output_dir / "authentic"
        self.forged_text_dir = self.output_dir / "forged_text"
        self.spliced_photo_dir = self.output_dir / "spliced_photo"
        self._init_directories()

    def _init_directories(self):
        for directory in [self.auth_dir, self.forged_text_dir, self.spliced_photo_dir]:
            directory.mkdir(parents=True, exist_ok=True)

    def generate_authentic_id(
        self,
        name: str = "ROHAN SHARMA",
        doc_id: str = "ABCDE1234F",
        dob: str = "15/08/1998",
        filename: str = "sample_id.png",
    ) -> Image.Image:
        """Renders an authentic base identity card."""
        width, height = 650, 400
        image = Image.new("RGB", (width, height), color=(248, 249, 250))
        draw = ImageDraw.Draw(image)

        # Header bar
        draw.rectangle([(0, 0), (width, 65)], fill=(24, 43, 73))
        draw.text((25, 22), "GOVERNMENT IDENTITY VERIFICATION CARD", fill=(255, 255, 255))

        # Photo portrait placeholder
        photo_box = [(40, 90), (190, 260)]
        draw.rectangle(photo_box, fill=(210, 220, 230), outline=(100, 110, 120), width=2)
        draw.text((85, 165), "PHOTO", fill=(80, 90, 100))

        # Document text fields
        fields = [
            ("Name", name, 100),
            ("Document ID", doc_id, 155),
            ("Date of Birth", dob, 210),
            ("Nationality", "INDIAN", 265),
        ]

        for label, val, y_pos in fields:
            draw.text((220, y_pos), f"{label.upper()}:", fill=(110, 110, 110))
            draw.text((220, y_pos + 18), val, fill=(15, 15, 15))

        # Micro-text and security line simulation
        draw.line([(40, 330), (610, 330)], fill=(200, 200, 200), width=1)
        draw.text((40, 340), "SECURE ID VALIDATION - SYSTEM GENERATED DOCUMENT", fill=(160, 160, 160))

        # Barcode/QR simulation box
        draw.rectangle([(480, 100), (590, 210)], fill=(20, 20, 20))
        draw.rectangle([(500, 120), (570, 190)], fill=(255, 255, 255))

        filepath = self.auth_dir / filename
        image.save(filepath, "PNG")
        return image

    def inject_text_forgery(
        self,
        base_img: Image.Image,
        fake_text: str = "31/02/1900",
        target_box: tuple = (220, 228, 380, 250),
        filename: str = "forged_text.jpg",
    ) -> Path:
        """Simulates inpainting/patching forgery with mismatched noise and font alignment."""
        tampered = base_img.copy()
        draw = ImageDraw.Draw(tampered)

        # Inpaint with unnatural patch color (slight background mismatch)
        draw.rectangle(target_box, fill=(238, 240, 243))

        # Render forged text inside patch
        draw.text((target_box[0] + 2, target_box[1]), fake_text, fill=(200, 20, 20))

        filepath = self.forged_text_dir / filename
        # Save at lowered JPEG quality to create local compression discrepancies
        tampered.save(filepath, "JPEG", quality=70)
        return filepath

    def inject_spliced_photo(
        self,
        base_img: Image.Image,
        photo_box: tuple = (40, 90, 190, 260),
        filename: str = "spliced_photo.jpg",
    ) -> Path:
        """Injects a mismatched synthetic noise patch simulating photo substitution."""
        tampered = base_img.copy()
        w = photo_box[2] - photo_box[0]
        h = photo_box[3] - photo_box[1]

        # Generate Gaussian noise array
        noise_arr = np.random.normal(128, 40, (h, w, 3)).clip(0, 255).astype(np.uint8)
        spliced_patch = Image.fromarray(noise_arr)

        tampered.paste(spliced_patch, photo_box)

        filepath = self.spliced_photo_dir / filename
        tampered.save(filepath, "JPEG", quality=55)
        return filepath

    def generate_batch(self, count: int = 5):
        """Generates a structured test batch."""
        for i in range(1, count + 1):
            auth_img = self.generate_authentic_id(
                name=f"TEST USER {i}",
                doc_id=f"IDNUM{i:04d}X",
                dob=f"0{i}/01/199{i}",
                filename=f"authentic_id_{i:02d}.png",
            )
            self.inject_text_forgery(auth_img, filename=f"forged_text_{i:02d}.jpg")
            self.inject_spliced_photo(auth_img, filename=f"spliced_photo_{i:02d}.jpg")


if __name__ == "__main__":
    generator = DocumentDatasetGenerator()
    generator.generate_batch(count=5)
    print(f"Generated synthetic test suite in {OUTPUT_DIR}")