# AI-Based Fake Identity and Document Screening System

A modern, high-performance, security-grade frontend dashboard for automated identity verification, digital tampering detection, OCR entity extraction, and facial biometric matching. Built for the **Smart India Hackathon (SIH)** project.

---

## 🌟 Overview & Key Features

- **🛡️ Multi-Modal Document Screening**: Comprehensive analysis pipeline integrating quality verification, forensic ELA tampering detection, OCR entity parsing, and 1:1 facial biometric matching.
- **⚡ Real-time FastAPI Integration**: Direct integration with `POST http://localhost:8000/api/documents/validate` using `multipart/form-data`.
- **📊 Interactive Forensic Dashboard**:
  - **Verdict Card**: Dynamic `PASS`, `REVIEW`, `REJECT` classification.
  - **Circular Risk Score Gauge**: 0–100 risk score with `LOW`, `MEDIUM`, `HIGH` thresholds.
  - **Quality & Optics**: Blur index, glare detection, DPI resolution checks.
  - **Tampering & Forensics**: Error Level Analysis (ELA) heatmap viewer, copy-move detection, suspicious bounding box visualization.
  - **OCR Intelligence**: Dynamic field extraction with per-field confidence rating bars and MRZ/QR consistency validation.
  - **Facial Biometrics**: 1:1 comparison against live selfies with match score.
  - **Audit Trail & Decision Rationale**: Transparent rule explanations and logged evidence artifacts.
- **🔬 Built-in SIH Evaluator Sandbox**: Pre-configured demo scenarios (Clean Passport, Glare License, Tampered ID) for instant evaluation even when offline.
- **🖨️ PDF & Audit Export**: One-click printable report formatting and Raw JSON payload viewer.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+` or `v20+` (tested with v22)
- npm `v9+` or `v10+`

### 1. Installation

```bash
# Clone or navigate to the repository
cd "SIH hackthon"

# Ensure you are on the feature/frontend branch
git checkout feature/frontend

# Install dependencies
npm install
```

### 2. Configure Backend URL (Optional)

By default, the application connects to `http://localhost:8000`. You can configure a custom backend endpoint via `.env`:

```bash
# Create .env from example
cp .env.example .env
```

`.env` content:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The frontend will start at **`http://localhost:5173`**.

### 4. Production Build

```bash
npm run build
```

---

## 📂 Project Architecture

```
SIH hackthon/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── README.md
└── src/
    ├── main.jsx                   # Application entry point
    ├── App.jsx                    # Core state and page router
    ├── index.css                  # Tailwind styles & cyber glassmorphism
    ├── api/
    │   └── documentApi.js         # FastAPI service, error handling & demo fixtures
    ├── components/
    │   ├── Navbar.jsx             # Top bar with live backend heartbeat
    │   ├── FileUpload.jsx         # Drag-and-drop uploader with image preview
    │   ├── LoadingScreen.jsx      # 7-stage laser scanner animation
    │   ├── VerdictBadge.jsx       # PASS / REVIEW / REJECT visual indicators
    │   ├── RiskScore.jsx          # Circular gauge score (0–100)
    │   ├── QualityCard.jsx        # Blur, glare, and resolution analysis
    │   ├── ForensicsCard.jsx      # Tamper score, confidence & ELA heatmap
    │   ├── OCRCard.jsx            # Dynamic entity fields & confidence bars
    │   ├── BiometricsCard.jsx     # Face matching status (MATCHED / NOT_MATCHED)
    │   ├── ReasonsCard.jsx        # Transparent audit reasons
    │   ├── EvidenceCard.jsx       # Forensic markers & security feature tags
    │   └── Footer.jsx             # Security and defense metadata
    └── pages/
        ├── Home.jsx               # Landing page with features & pipeline overview
        ├── Upload.jsx             # Document type selector & uploader
        └── Results.jsx            # Forensic analysis results dashboard
```

---

## 🔌 API Integration Details

- **Endpoint**: `POST /api/documents/validate`
- **Content-Type**: `multipart/form-data`
- **Fields Sent**:
  - `document` / `file`: Document file (`.jpg`, `.jpeg`, `.png`, `.pdf`)
  - `document_type`: `national_id`, `passport`, or `driving_license`
  - `selfie` (optional): User portrait selfie

---

## 🛡️ Git Workflow

- Dedicated branch: `feature/frontend`
- Ready for clean pull request / merge into `main` with existing FastAPI backend repository.

