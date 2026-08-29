import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Download, 
  Printer, 
  Code, 
  FileText, 
  Calendar, 
  Hash, 
  ExternalLink, 
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import VerdictBadge from '../components/VerdictBadge';
import RiskScore from '../components/RiskScore';
import QualityCard from '../components/QualityCard';
import ForensicsCard from '../components/ForensicsCard';
import OCRCard from '../components/OCRCard';
import BiometricsCard from '../components/BiometricsCard';
import ReasonsCard from '../components/ReasonsCard';
import EvidenceCard from '../components/EvidenceCard';

export default function Results({ 
  result, 
  documentPreview, 
  selfiePreview, 
  onReset 
}) {
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="glass-panel rounded-3xl p-12 border border-white/10 space-y-4">
          <FileText className="w-12 h-12 text-slate-500 mx-auto" />
          <h2 className="text-2xl font-bold font-sans text-white">No Verification Record Available</h2>
          <p className="text-sm text-slate-400 font-body">Please upload and screen an identity document first.</p>
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-sans font-semibold text-sm transition-all"
          >
            Go to Upload Portal
          </button>
        </div>
      </div>
    );
  }

  const {
    job_id = 'JOB-N/A',
    document_type = 'national_id',
    processed_at = new Date().toISOString(),
    risk = {},
    checks = {},
    reasons = [],
    evidence = []
  } = result;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:space-y-4">
      
      {/* Top Action Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
              Audit Dashboard
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-xs font-mono text-slate-400">
              ID: {job_id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-sans text-white mt-1">
            Forensic Screening Intelligence
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowJsonModal(true)}
            className="px-3.5 py-2 rounded-xl bg-surface hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
            title="Inspect full JSON response from FastAPI backend"
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>Raw JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-surface hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
            title="Print or Save PDF report"
          >
            <Printer className="w-3.5 h-3.5 text-pink-400" />
            <span>Export Report</span>
          </button>

          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Scan Another</span>
          </button>
        </div>
      </div>

      {/* Primary Verdict Banner */}
      <VerdictBadge verdict={risk.verdict} />

      {/* Header Info & Metadata Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Document Type
            </span>
            <span className="text-sm font-bold font-sans text-white capitalize">
              {(document_type || 'national_id').replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
            <Hash className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Job Reference UUID
            </span>
            <span className="text-xs font-mono font-bold text-slate-200 truncate block" title={job_id}>
              {job_id}
            </span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Audit Timestamp
            </span>
            <span className="text-xs font-mono text-slate-300">
              {new Date(processed_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Row 1 (Risk Score Gauge + Forensic Tamper Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Score: 4 cols */}
        <div className="lg:col-span-4">
          <RiskScore
            score={risk.score}
            level={risk.level}
            verdict={risk.verdict}
          />
        </div>

        {/* Forensic Analysis & Heatmap: 8 cols */}
        <div className="lg:col-span-8">
          <ForensicsCard
            forensics={checks.forensics}
            documentPreview={documentPreview}
          />
        </div>

      </div>

      {/* Main Grid: Row 2 (OCR Document Intelligence + Optical Quality) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* OCR Card: 7 cols */}
        <div className="lg:col-span-7">
          <OCRCard
            ocr={checks.ocr_layout}
          />
        </div>

        {/* Quality Card: 5 cols */}
        <div className="lg:col-span-5">
          <QualityCard
            quality={checks.quality}
          />
        </div>

      </div>

      {/* Main Grid: Row 3 (Biometrics + Reasons + Evidence) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Biometrics Face Verification: 5 cols */}
        <div className="lg:col-span-5">
          <BiometricsCard
            biometrics={checks.biometrics}
            selfiePreview={selfiePreview}
            documentPreview={documentPreview}
          />
        </div>

        {/* AI Reasons & Decision Factors: 7 cols */}
        <div className="lg:col-span-7">
          <ReasonsCard
            reasons={reasons}
            verdict={risk.verdict}
          />
        </div>

      </div>

      {/* Evidence Markers (if available) */}
      <EvidenceCard evidence={evidence} />

      {/* Bottom Floating Action Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Screening complete. Verified via FastAPI DeepNet Model Pipeline.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-sans font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
          >
            Verify Another Document
          </button>
        </div>
      </div>

      {/* Raw JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-3xl glass-panel rounded-3xl border border-white/15 bg-slate-950 p-6 space-y-4 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-400" />
                <h3 className="font-sans font-bold text-base text-white">
                  FastAPI Backend Response Payload
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="px-3 py-1.5 rounded-lg bg-surface hover:bg-white/10 text-slate-300 text-xs font-mono flex items-center gap-1 border border-white/10"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedJson ? 'Copied' : 'Copy JSON'}
                </button>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-indigo-200">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>

            <div className="text-right">
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-5 py-2 rounded-xl bg-surface hover:bg-white/10 text-white text-xs font-mono border border-white/10"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

