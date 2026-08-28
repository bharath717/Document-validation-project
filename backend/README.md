# Document Validation Backend MVP

This is the backend architecture for the AI-Based Fake Identity and Document Screening System.

## Architecture

- **FastAPI**: Main web framework
- **SQLAlchemy (PostgreSQL)**: Database persistence
- **Pydantic**: Data validation and serialization

## Quickstart

### Local Setup
1. Create a virtual environment: `python -m venv venv`
2. Activate it: `source venv/Scripts/activate` or `source venv/bin/activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Run the server: `uvicorn app.main:app --reload`
5. Visit `http://127.0.0.1:8000/docs` to see the Swagger UI.

### Database Setup
Ensure PostgreSQL is running locally, or use Docker Compose from the root directory:
```bash
docker-compose up -d
```

## Module Integration (For M2, M3, M4)
The backend uses abstract contracts for integration. Currently, mock versions are in `app/services/mocks/`. 
To integrate a real AI model:
1. Create your implementation class implementing the interface from `app/services/contracts/interfaces.py`.
2. Replace the mock import in `app/pipelines/document_pipeline.py`.

## Testing
Run the test suite with:
```bash
pytest
```
Note: Make sure your `DATABASE_URL` is configured correctly, or adjust tests to use a local sqlite instance if needed.
