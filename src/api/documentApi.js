/**
 * API Service for Document Validation and Screening
 * Connects to FastAPI backend at http://localhost:8000/api/documents/validate
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Validates an identity document against the AI screening backend.
 * 
 * @param {Object} params
 * @param {File} params.documentFile - Identity document (JPG, PNG, PDF)
 * @param {string} params.documentType - national_id, passport, driving_license
 * @param {File|null} [params.selfieFile] - Optional selfie photo
 * @returns {Promise<Object>} Verification analysis response
 */
export async function validateDocument({ documentFile, documentType, selfieFile }) {
  if (!documentFile) {
    throw new Error('Please select a document file to analyze.');
  }

  const formData = new FormData();
  
  // Provide standard parameter names to maximize compatibility with FastAPI endpoints
  formData.append('document', documentFile);
  formData.append('file', documentFile);
  formData.append('document_type', documentType || 'national_id');

  if (selfieFile) {
    formData.append('selfie', selfieFile);
    formData.append('selfie_file', selfieFile);
  }

  const endpoint = `${API_BASE_URL}/api/documents/validate`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      // Note: Do NOT set Content-Type header manually; fetch will set multipart/form-data with boundary
    });

    if (!response.ok) {
      let errorMessage = `Server error (${response.status} ${response.statusText})`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // Response wasn't JSON
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return normalizeBackendResponse(data, documentType);
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        `Unable to reach AI backend server at ${API_BASE_URL}. Ensure the FastAPI Docker container is running.`
      );
    }
    throw err;
  }
}

/**
 * Checks if the backend server is reachable.
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_BASE_URL}/docs`, {
      method: 'GET',
      mode: 'no-cors',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalizes backend response to guarantee all expected fields exist gracefully.
 */
export function normalizeBackendResponse(raw, fallbackDocType = 'national_id') {
  if (!raw) return null;

  return {
    success: raw.success ?? true,
    job_id: raw.job_id || raw.id || `JOB-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    document_type: raw.document_type || fallbackDocType,
    processed_at: raw.processed_at || new Date().toISOString(),

    risk: {
      score: raw.risk?.score ?? (raw.risk_score ?? 0),
      level: (raw.risk?.level || raw.risk_level || 'LOW').toUpperCase(),
      verdict: (raw.risk?.verdict || raw.verdict || 'PASS').toUpperCase(),
    },

    checks: {
      quality: {
        quality_passed: raw.checks?.quality?.quality_passed ?? true,
        quality_score: raw.checks?.quality?.quality_score ?? 0.9,
        blur_score: raw.checks?.quality?.blur_score ?? 0.05,
        glare_score: raw.checks?.quality?.glare_score ?? 0.08,
        resolution_ok: raw.checks?.quality?.resolution_ok ?? true,
        issues: raw.checks?.quality?.issues || [],
      },

      forensics: {
        tamper_detected: raw.checks?.forensics?.tamper_detected ?? false,
        tamper_score: raw.checks?.forensics?.tamper_score ?? 5,
        suspicious_regions: raw.checks?.forensics?.suspicious_regions || [],
        heatmap_path: raw.checks?.forensics?.heatmap_path || null,
        confidence: raw.checks?.forensics?.confidence ?? 0.95,
      },

      ocr_layout: {
        document_type: raw.checks?.ocr_layout?.document_type || raw.document_type || fallbackDocType,
        fields: raw.checks?.ocr_layout?.fields || {},
        field_confidence: raw.checks?.ocr_layout?.field_confidence || {},
        layout_score: raw.checks?.ocr_layout?.layout_score ?? 0.95,
        qr_valid: raw.checks?.ocr_layout?.qr_valid ?? null,
        mrz_valid: raw.checks?.ocr_layout?.mrz_valid ?? null,
        field_consistency: raw.checks?.ocr_layout?.field_consistency ?? true,
        confidence: raw.checks?.ocr_layout?.confidence ?? 0.95,
      },

      biometrics: {
        status: (raw.checks?.biometrics?.status || 'NOT_PROVIDED').toUpperCase(),
        confidence: raw.checks?.biometrics?.confidence ?? null,
        match_score: raw.checks?.biometrics?.match_score ?? null,
        face_detected: raw.checks?.biometrics?.face_detected ?? null,
      },
    },

    reasons: Array.isArray(raw.reasons) ? raw.reasons : [],
    evidence: Array.isArray(raw.evidence) ? raw.evidence : [],
    raw: raw,
  };
}

/**
 * Pre-configured interactive mock datasets for testing and demonstration.
 */
export const DEMO_SAMPLES = {
  PASS_PASSPORT: {
    label: 'Verified Passport (PASS - Low Risk)',
    description: 'Clean high-res passport with valid MRZ, no tampering, high OCR confidence',
    data: {
      success: true,
      job_id: "7f4c9a21-8b3d-4c5e-9f12-3a4b5c6d7e8f",
      document_type: "passport",
      risk: {
        score: 4,
        level: "LOW",
        verdict: "PASS"
      },
      checks: {
        quality: {
          quality_passed: true,
          quality_score: 0.96,
          blur_score: 0.03,
          glare_score: 0.04,
          resolution_ok: true,
          issues: []
        },
        forensics: {
          tamper_detected: false,
          tamper_score: 3,
          suspicious_regions: [],
          heatmap_path: null,
          confidence: 0.98
        },
        ocr_layout: {
          document_type: "passport",
          fields: {
            "name": "Alexander John Vance",
            "passport_number": "P894120573",
            "nationality": "IND",
            "dob": "1994-06-14",
            "expiry_date": "2032-05-12",
            "gender": "M",
            "mrz_line_1": "P<INDP894120573<8IND9406148M3205123<<<<<<<4",
            "mrz_line_2": "VANCE<<ALEXANDER<JOHN<<<<<<<<<<<<<<<<<<<<<<<<"
          },
          field_confidence: {
            "name": 0.99,
            "passport_number": 0.99,
            "nationality": 0.98,
            "dob": 0.97,
            "expiry_date": 0.99,
            "gender": 0.99
          },
          layout_score: 0.98,
          qr_valid: true,
          mrz_valid: true,
          field_consistency: true,
          confidence: 0.98
        },
        biometrics: {
          status: "MATCHED",
          confidence: 0.96,
          match_score: 0.94,
          face_detected: true
        }
      },
      reasons: [
        "Document passed all anti-tampering forensic checks with high confidence.",
        "MRZ cryptographic checksum matches OCR extracted demographic records.",
        "Image resolution and lighting conditions are optimal with zero blur artifacts.",
        "Facial biometric match verified against submitted selfie portrait."
      ],
      evidence: [
        { type: "security_feature", label: "Holographic Watermark", status: "VERIFIED" },
        { type: "font_consistency", label: "Microprint Integrity", status: "VERIFIED" },
        { type: "mrz_check", label: "ICAO 9303 Checksum", status: "PASSED" }
      ]
    }
  },

  REVIEW_LICENSE: {
    label: 'Driving License with Glare (REVIEW - Medium Risk)',
    description: 'Glare detected on barcode region, moderate quality score, requires manual inspection',
    data: {
      success: true,
      job_id: "c82f10b4-51e9-41aa-821b-665b98a0df11",
      document_type: "driving_license",
      risk: {
        score: 48,
        level: "MEDIUM",
        verdict: "REVIEW"
      },
      checks: {
        quality: {
          quality_passed: false,
          quality_score: 0.62,
          blur_score: 0.18,
          glare_score: 0.42,
          resolution_ok: true,
          issues: ["Moderate glare detected over 2D barcode zone", "Partial reflection near expiry date field"]
        },
        forensics: {
          tamper_detected: false,
          tamper_score: 22,
          suspicious_regions: [
            { x: 320, y: 180, width: 90, height: 40, description: "Localized reflection specular spot" }
          ],
          heatmap_path: null,
          confidence: 0.82
        },
        ocr_layout: {
          document_type: "driving_license",
          fields: {
            "name": "Sarah Marie Connor",
            "license_number": "DL-042011009871",
            "category": "LMV / MCWG",
            "dob": "1988-11-23",
            "expiry_date": "2029-10-15",
            "address": "42 Cyberdyne Blvd, New Delhi 110001"
          },
          field_confidence: {
            "name": 0.94,
            "license_number": 0.91,
            "category": 0.88,
            "dob": 0.95,
            "expiry_date": 0.74,
            "address": 0.86
          },
          layout_score: 0.84,
          qr_valid: null,
          mrz_valid: null,
          field_consistency: true,
          confidence: 0.86
        },
        biometrics: {
          status: "NOT_PROVIDED",
          confidence: null,
          match_score: null
        }
      },
      reasons: [
        "Glare reflection detected on the card surface obscuring optical character recognition.",
        "Expiry date confidence (74%) is below optimal threshold due to specular highlights.",
        "No digital tampering or font manipulation detected, but human officer review recommended."
      ],
      evidence: [
        { type: "quality_warning", label: "Card Specularity", status: "MODERATE_GLARE" },
        { type: "ocr_warning", label: "Partial Field Occlusion", status: "MANUAL_VERIFY" }
      ]
    }
  },

  REJECT_TAMPERED: {
    label: 'Tampered National ID (REJECT - High Risk)',
    description: 'Digitally altered ID number, spliced photo box, font inconsistency and high tamper score',
    data: {
      success: true,
      job_id: "e99a77d1-023c-449b-bd55-89df530018a9",
      document_type: "national_id",
      risk: {
        score: 89,
        level: "HIGH",
        verdict: "REJECT"
      },
      checks: {
        quality: {
          quality_passed: true,
          quality_score: 0.79,
          blur_score: 0.08,
          glare_score: 0.06,
          resolution_ok: true,
          issues: []
        },
        forensics: {
          tamper_detected: true,
          tamper_score: 86,
          suspicious_regions: [
            { x: 145, y: 88, width: 120, height: 35, description: "Digital text insertion: ID Number clone artifact" },
            { x: 42, y: 110, width: 85, height: 105, description: "Photo boundary splicing and Error Level Analysis (ELA) anomaly" },
            { x: 260, y: 220, width: 110, height: 30, description: "Inconsistent font kerning and compression ghosting" }
          ],
          heatmap_path: "synthetic_ela_heatmap_tamper.png",
          confidence: 0.94
        },
        ocr_layout: {
          document_type: "national_id",
          fields: {
            "name": "Jane Doe",
            "id_number": "8934-5821-9904",
            "dob": "1997-04-02",
            "gender": "Female",
            "state": "Maharashtra"
          },
          field_confidence: {
            "name": 0.88,
            "id_number": 0.52,
            "dob": 0.91,
            "gender": 0.94,
            "state": 0.89
          },
          layout_score: 0.61,
          qr_valid: false,
          mrz_valid: null,
          field_consistency: false,
          confidence: 0.68
        },
        biometrics: {
          status: "NOT_MATCHED",
          confidence: 0.21,
          match_score: 0.18,
          face_detected: true
        }
      },
      reasons: [
        "CRITICAL: Digital tampering detected on National ID card number region.",
        "Error Level Analysis (ELA) detected photo boundary manipulation and copy-paste artifact.",
        "QR Code cryptographic payload does not match extracted plain text fields.",
        "Selfie image facial embedding does not match document portrait (Cosine distance: 0.82)."
      ],
      evidence: [
        { type: "tamper_alert", label: "ELA Compression Anomaly", status: "ALTERATION_DETECTED" },
        { type: "crypto_alert", label: "QR Code Signature Mismatch", status: "INVALID_SIGNATURE" },
        { type: "biometric_alert", label: "Facial Embedding Distance", status: "MISMATCH" }
      ]
    }
  }
};

