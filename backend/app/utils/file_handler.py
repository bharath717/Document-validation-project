import os
import uuid
import hashlib
from fastapi import UploadFile, HTTPException
from pathlib import Path
from app.core.config import settings

# Ensure upload directory exists
UPLOAD_DIR = Path(settings.UPLOAD_DIR)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def validate_extension(filename: str):
    ext = Path(filename).suffix.lower()
    allowed = [e.strip() for e in settings.ALLOWED_EXTENSIONS.split(",")]
    if ext not in allowed:
        raise HTTPException(status_code=400, detail=f"Unsupported file extension. Allowed: {allowed}")
    return ext

def validate_file_size(file: UploadFile):
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    
    max_size_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if size > max_size_bytes:
        raise HTTPException(status_code=400, detail=f"File too large. Max size: {settings.MAX_FILE_SIZE_MB}MB")
    if size == 0:
        raise HTTPException(status_code=400, detail="File is empty")
    return size

def validate_mime_type(content_type: str):
    allowed_mimes = ["image/jpeg", "image/png", "application/pdf"]
    if content_type not in allowed_mimes:
        raise HTTPException(status_code=400, detail=f"Unsupported MIME type. Allowed: {allowed_mimes}")
    return content_type

def generate_safe_filename(original_filename: str) -> str:
    ext = validate_extension(original_filename)
    unique_name = f"{uuid.uuid4().hex}{ext}"
    return unique_name

def calculate_sha256(filepath: str) -> str:
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

async def save_upload(file: UploadFile) -> dict:
    validate_mime_type(file.content_type)
    validate_file_size(file)
    
    safe_filename = generate_safe_filename(file.filename)
    save_path = UPLOAD_DIR / safe_filename
    
    with open(save_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    file_hash = calculate_sha256(str(save_path))
    
    return {
        "filename": safe_filename,
        "path": str(save_path),
        "hash": file_hash,
        "size": len(content),
        "content_type": file.content_type
    }
