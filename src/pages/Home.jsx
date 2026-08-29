import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  FileSpreadsheet, 
  ScanFace, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Zap, 
  Search, 
  FileText, 
  Fingerprint, 
  ShieldAlert,
  Server
} from 'lucide-react';
import { DEMO_SAMPLES } from '../api/documentApi';

export default function Home({ onStartVerification, onSelectDemo }) {
  const features = [
    {
      icon: ShieldCheck,
      color: 'from-indigo-500 to-blue-600',
      title: 'AI Document Verification',
      desc: 'Deep multi-modal convolutional networks inspect document authenticity, security watermarks, and microprint integrity in real-time.'
    },
    {
      icon: Layers,
      color: 'from-pink-500 to-rose-600',
      title: 'Tampering Detection',
      desc: 'Spectral Error Level Analysis (ELA), copy-move forgery detection, and spliced boundary localization pinpoint digital manipulations.'
    },
    {
      icon: FileSpreadsheet,
      color: 'from-cyan-400 to-teal-500',
      title: 'OCR & Layout Analysis',
      desc: 'Automated entity extraction for National IDs, Passports & Licenses with individual confidence scores, MRZ validation, and QR verification.'
    },
    {
      icon: ScanFace,
      color: 'from-purple-500 to-indigo-600',
      title: 'Identity Verification',
      desc: 'High-precision 1:1 facial biometric matching compares user selfies directly against document portrait photos with liveness detection.'
    },
    {
      icon: Activity,
      color: 'from-emerald-400 to-green-600',
      title: 'Risk Scoring',
      desc: 'Unified 0–100 composite risk engine aggregates optical clarity, forensic anomalies, and cryptographic checksums into an actionable verdict.'
    },
    {
      icon: Lock,
      color: 'from-amber-400 to-orange-500',
      title: 'Defense-Grade Privacy',
      desc: 'Ephemeral in-memory processing guarantees zero unencrypted storage of sensitive identity documents and PII attributes.'
    }
  ];

  const pipelineStages = [
    { step: '01', title: 'Upload & Ingestion', desc: 'Accepts JPG, PNG, PDF with automated format validation' },
    { step: '02', title: 'Optical Quality Check', desc: 'Calculates blur index, glare reflections, and resolution DPI' },
    { step: '03', title: 'Forensic ELA Analysis', desc: 'Analyzes compression artifacts and pixel-level tampering' },
    { step: '04', title: 'OCR & Data Extraction', desc: 'Parses demographic fields & cross-checks MRZ checksums' },
    { step: '05', title: 'Facial Biometrics', desc: 'Compares selfie facial vectors against extracted photo' },
    { step: '06', title: 'Decision & Audit Report', desc: 'Generates PASS / REVIEW / REJECT verdict with forensic logs' },
  ];

  return (
    <div className="space-y-24 pb-12">
      
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-12 sm:pt-20 text-center overflow-hidden">
        {/* Ambient background glows */}
        <div className="ambient-glow w-[500px] h-[500px] bg-indigo-600/20 top-0 left-1/2 -translate-x-1/2" />
        <div className="ambient-glow w-[350px] h-[350px] bg-pink-600/15 top-1/3 left-1/4" />
        <div className="ambient-glow w-[350px] h-[350px] bg-cyan-600/15 top-1/3 right-1/4" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold tracking-wider uppercase backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>Smart India Hackathon • AI Document Security</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans text-white leading-[1.1]">
            AI-Based Fake Identity &amp; <br />
            <span className="text-gradient-primary">Document Screening System</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-300 font-body leading-relaxed">
            Enterprise-grade identity verification powered by deep neural forensics, Error Level Analysis (ELA), 
            optical character intelligence, and 1:1 facial biometric matching.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartVerification}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-sans font-bold text-base shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.03] active:scale-[0.98] group"
            >
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Start Verification</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative group w-full sm:w-auto">
              <button
                onClick={() => onSelectDemo(DEMO_SAMPLES.PASS_PASSPORT.data)}
                className="w-full sm:w-auto px-6 py-4 rounded-full glass-panel hover:bg-white/10 text-slate-200 font-sans font-semibold text-base border border-white/15 flex items-center justify-center gap-2.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Explore Live Sample</span>
              </button>
            </div>
          </div>

          {/* Verified Supported Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>National ID Cards</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ICAO Passports</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Driving Licenses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Live Selfie Matching</span>
            </div>
          </div>

        </div>
      </section>

      {/* ================= FEATURES GRID ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">
            Core Inspection Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-sans text-white">
            Multi-Layered AI Screening Pipeline
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-body">
            Each document undergoes rigorous parallel inspection across computer vision, forensic mathematics, and cryptographic validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel glass-panel-hover rounded-3xl p-8 border border-white/10 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-sans text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400 font-body leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    Stage {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-mono text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Automated &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= PIPELINE TIMELINE ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-security-cyan">
              End-to-End Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white">
              How the AI Evaluates Identity Documents
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pipelineStages.map((stage, idx) => (
              <div key={idx} className="bg-surface/80 rounded-2xl p-6 border border-white/5 relative">
                <span className="text-3xl font-black font-mono text-indigo-500/30 block mb-2">
                  {stage.step}
                </span>
                <h4 className="text-base font-bold font-sans text-white mb-1">
                  {stage.title}
                </h4>
                <p className="text-xs text-slate-400 font-body leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRESET SAMPLES QUICK LAUNCHER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 border border-indigo-500/20 bg-indigo-950/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 block mb-1">
                SIH Evaluator Quick-Test Sandbox
              </span>
              <h3 className="text-2xl font-bold font-sans text-white">
                Inspect Pre-Analyzed Forensic Scenarios
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-body mt-1">
                Jump directly into the interactive dashboard with simulated high-integrity, ambiguous, and tampered payloads.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-start lg:justify-end">
              <button
                onClick={() => onSelectDemo(DEMO_SAMPLES.PASS_PASSPORT.data)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold transition-all hover:scale-105"
              >
                PASS: Clean Passport
              </button>
              <button
                onClick={() => onSelectDemo(DEMO_SAMPLES.REVIEW_LICENSE.data)}
                className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-semibold transition-all hover:scale-105"
              >
                REVIEW: Glare License
              </button>
              <button
                onClick={() => onSelectDemo(DEMO_SAMPLES.REJECT_TAMPERED.data)}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-semibold transition-all hover:scale-105"
              >
                REJECT: Tampered ID
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="text-center max-w-4xl mx-auto px-4 sm:px-6">
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sans text-white">
            Ready to Screen Your First Document?
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-body">
            Upload an ID card, passport, or driver license for complete AI verification.
          </p>
          <button
            onClick={onStartVerification}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-sans font-bold text-base shadow-xl shadow-indigo-600/25 inline-flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Launch Document Scanner</span>
          </button>
        </div>
      </section>

    </div>
  );
}

