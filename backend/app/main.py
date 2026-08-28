from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.routes import documents
from app.db.database import init_db

from sqlalchemy.exc import SQLAlchemyError
import logging

# Initialize database tables
try:
    init_db()
except SQLAlchemyError as e:
    logging.warning(f"Could not connect to the database. Is PostgreSQL running? Error: {e}")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-based fake identity and document screening system"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred.", "details": str(exc)}
    )

# Include Routers
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "Document Validation Backend is running"
    }