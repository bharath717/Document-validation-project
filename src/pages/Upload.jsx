import React, { useState } from 'react';
import { 
  FileText, 
  Camera, 
  UploadCloud, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  CreditCard, 
  Globe, 
  Car, 
  Check, 
  RefreshCw,
  Info
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { validateDocument, DEMO_SAMPLES } from '../api/documentApi';

const DOC_TYPES = [
  { id: 'national_id', label: 'National ID Card', icon: CreditCard, desc: 'Aadhaar, Citizen ID, SSN' },
  { id: 'passport', label: 'International Passport', icon: Globe, desc: 'ICAO 9303 Compliant Travel Doc' },
  { id: 'driving_license', label: 'Driving License', icon: Car, desc: 'State / National Motor License' },
];

export default function Upload({ 
  onVerificationSuccess, 
  setIsLoading, 
  setDocumentPreview,
  setSelfiePreview,
  onSelectDemo
}) {
  const [docType, setDocType] = useState('national_id');
  const [docFile, setDocFile] = useState(null);
  const [docPreview, setDocPreviewState] = useState(null);

  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreviewState] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDocSelect = (file) => {
    setDocFile(file);
    setErrorMessage(null);
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setDocPreviewState(url);
      setDocumentPreview(url);
    } else {
      setDocPreviewState(null);
      setDocumentPreview(null);
    }
  };

  const handleDocRemove = () => {
    if (docPreview) URL.revokeObjectURL(docPreview);
    setDocFile(null);
    setDocPreviewState(null);
    setDocumentPreview(null);
  };

  const handleSelfieSelect = (file) => {
    setSelfieFile(file);
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setSelfiePreviewState(url);
      setSelfiePreview(url);
    }
  };

  const handleSelfieRemove = () => {
    if (selfiePreview) URL.revokeObjectURL(selfiePreview);
    setSelfieFile(null);
    setSelfiePreviewState(null);
    setSelfiePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docFile) {
      setErrorMessage('Please upload an identity document before verifying.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const result = await validateDocument({
        documentFile: docFile,
        documentType: docType,
        selfieFile: selfieFile
      });

      // Small delay for smooth transition after scan
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitting(false);
        onVerificationSuccess(result);
      }, 1200);
    } catch (err) {
      setIsLoading(false);
      setIsSubmitting(false);
      setErrorMessage(err.message || 'An error occurred during verification.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
          Document Intake Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-sans text-white">
          Upload Identity Document
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto font-body">
          Select your document type and upload a clear, un-occluded copy for real-time forensic screening.
        </p>
      </div>

      {/* Main Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Select Document Type */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">
                1
              </span>
              Select Document Classification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {DOC_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = docType === type.id;

              return (
                <div
                  key={type.id}
                  onClick={() => setDocType(type.id)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                      : 'bg-surface/60 border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold font-sans text-white">
                      {type.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-body mt-0.5">
                      {type.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Upload Identity Document */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px]">
                2
              </span>
              Upload Identity Document (Required)
            </span>
          </div>

          <FileUpload
            label="Front View of Document"
            sublabel="High-resolution color scan or photo (JPG, PNG, PDF)"
            file={docFile}
            previewUrl={docPreview}
            onFileSelect={handleDocSelect}
            onFileRemove={handleDocRemove}
            icon={UploadCloud}
          />
        </div>

        {/* Step 3: Optional Selfie Upload */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px]">
                3
              </span>
              Live Portrait Selfie (Optional for 1:1 Face Match)
            </span>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Biometrics
            </span>
          </div>

          <FileUpload
            label="Live Headshot Portrait"
            sublabel="Capture or upload a front-facing selfie without sunglasses"
            file={selfieFile}
            previewUrl={selfiePreview}
            onFileSelect={handleSelfieSelect}
            onFileRemove={handleSelfieRemove}
            isOptional={true}
            icon={Camera}
          />
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 text-xs font-body animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold font-sans text-sm text-rose-200">Validation Error</p>
              <p className="mt-0.5">{errorMessage}</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-400">
                  Tip: You can also use the preset demo sample buttons below.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Submit Verification Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!docFile || isSubmitting}
            className={`w-full py-4 sm:py-5 rounded-2xl font-sans font-bold text-base uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl transition-all ${
              !docFile || isSubmitting
                ? 'bg-slate-800 text-slate-500 border border-white/5 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Transmitting to AI Gateway...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Verify Document</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* Preset Demo Sandbox Footer */}
      <div className="mt-12 pt-8 border-t border-white/10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Need quick test fixtures for SIH demonstration?</span>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => onSelectDemo(DEMO_SAMPLES.PASS_PASSPORT.data)}
            className="px-4 py-2 rounded-xl bg-surface hover:bg-emerald-950/30 text-emerald-400 border border-white/10 hover:border-emerald-500/40 text-xs font-mono transition-all"
          >
            Load Sample 1: Clean Passport (PASS)
          </button>
          <button
            type="button"
            onClick={() => onSelectDemo(DEMO_SAMPLES.REVIEW_LICENSE.data)}
            className="px-4 py-2 rounded-xl bg-surface hover:bg-amber-950/30 text-amber-400 border border-white/10 hover:border-amber-500/40 text-xs font-mono transition-all"
          >
            Load Sample 2: Glare DL (REVIEW)
          </button>
          <button
            type="button"
            onClick={() => onSelectDemo(DEMO_SAMPLES.REJECT_TAMPERED.data)}
            className="px-4 py-2 rounded-xl bg-surface hover:bg-rose-950/30 text-rose-400 border border-white/10 hover:border-rose-500/40 text-xs font-mono transition-all"
          >
            Load Sample 3: Tampered ID (REJECT)
          </button>
        </div>
      </div>

    </div>
  );
}

