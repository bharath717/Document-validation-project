import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu, Search, Sparkles, CheckCircle2, AlertCircle, Scan, Eye, Layers } from 'lucide-react';

const STAGES = [
  { id: 1, label: 'Upload Complete', desc: 'Secure payload received by gateway' },
  { id: 2, label: 'Quality Analysis', desc: 'Assessing blur, glare, and resolution DPI' },
  { id: 3, label: 'Forensic Analysis', desc: 'Error level spectral tamper detection' },
  { id: 4, label: 'OCR & Layout Analysis', desc: 'Extracting textual entities & MRZ/QR consistency' },
  { id: 5, label: 'Identity Verification', desc: 'Facial vector biometric comparison' },
  { id: 6, label: 'Risk Assessment', desc: 'Multi-modal weighted fraud score calculation' },
  { id: 7, label: 'Verification Complete', desc: 'Compiling audit report and decision' },
];

const MESSAGES = [
  "Uploading document to secure enclave...",
  "Checking document clarity, lighting & resolution...",
  "Decomposing image compression layers (ELA)...",
  "Detecting potential text splicing and clone artifacts...",
  "Performing optical character recognition (OCR)...",
  "Cross-validating MRZ checksums and QR payloads...",
  "Calculating multi-layer composite risk index..."
];

export default function LoadingScreen({ currentStage = 3, documentPreview = null }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [simulatedProgress, setSimulatedProgress] = useState(15);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1800);

    const progressInterval = setInterval(() => {
      setSimulatedProgress((prev) => {
        if (prev < 90) return prev + Math.floor(Math.random() * 8) + 2;
        return prev;
      });
    }, 400);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl glass-panel rounded-3xl p-6 sm:p-10 border border-indigo-500/30 relative overflow-hidden shadow-2xl shadow-indigo-950/50">
        
        {/* Background glow */}
        <div className="ambient-glow w-96 h-96 bg-indigo-600/15 -top-20 -left-20" />
        <div className="ambient-glow w-96 h-96 bg-pink-600/15 -bottom-20 -right-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Cyber Scanning HUD Animation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-64 sm:w-72 aspect-[4/3] rounded-2xl bg-surface-card border-2 border-indigo-500/40 p-3 shadow-2xl shadow-indigo-500/20 overflow-hidden group">
              
              {/* Document Mock or Preview */}
              <div className="w-full h-full rounded-xl bg-slate-900 overflow-hidden relative flex flex-col justify-between p-3">
                {documentPreview ? (
                  <img
                    src={documentPreview}
                    alt="Scanning target"
                    className="w-full h-full object-cover opacity-60 filter grayscale contrast-125"
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[9px] font-mono text-indigo-300">SECURE_DOC_SCAN</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">2048-BIT</span>
                    </div>

                    <div className="flex gap-2.5 items-center my-2">
                      <div className="w-14 h-16 rounded bg-slate-800 border border-white/10 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-indigo-400 animate-pulse" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2 bg-indigo-400/30 rounded w-4/5" />
                        <div className="h-2 bg-indigo-400/20 rounded w-2/3" />
                        <div className="h-2 bg-indigo-400/15 rounded w-1/2" />
                      </div>
                    </div>

                    <div className="h-4 bg-slate-800 rounded border border-white/5 flex items-center px-1">
                      <span className="text-[8px] font-mono text-security-cyan truncate">
                        P&lt;IND123456789&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                      </span>
                    </div>
                  </>
                )}

                {/* Laser Scanning Beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser pointer-events-none" />
                <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-cyan-500/20 to-transparent animate-laser pointer-events-none" />

                {/* Target Reticles */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-indigo-400" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-indigo-400" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-indigo-400" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-indigo-400" />
              </div>
            </div>

            {/* Live Status Text */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>AI Screening Pipeline Active</span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-2 transition-all duration-300 min-h-[20px]">
                {MESSAGES[msgIndex]}
              </p>
            </div>
          </div>

          {/* Right Column: 7 Stages Tracker */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-sans font-bold text-lg text-white">
                  Multi-Modal Document Inspection
                </h3>
                <span className="text-sm font-mono font-bold text-indigo-400">
                  {simulatedProgress}%
                </span>
              </div>

              {/* Master Progress Bar */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  style={{ width: `${simulatedProgress}%` }}
                />
              </div>
            </div>

            {/* Stages Checklist */}
            <div className="space-y-2 pt-2">
              {STAGES.map((stage) => {
                const isPassed = stage.id < currentStage || simulatedProgress > (stage.id * 14);
                const isCurrent = !isPassed && (stage.id === currentStage || simulatedProgress >= ((stage.id - 1) * 14));

                return (
                  <div
                    key={stage.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isPassed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                        : isCurrent
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10 scale-[1.01]'
                        : 'bg-white/[0.02] border-white/5 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold">
                        {isPassed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="text-slate-600">{stage.id}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold font-sans">
                          {stage.label}
                        </p>
                        <p className="text-[10px] text-slate-400 font-body hidden sm:block">
                          {stage.desc}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded">
                      {isPassed ? (
                        <span className="text-emerald-400 font-bold">Completed</span>
                      ) : isCurrent ? (
                        <span className="text-indigo-400 font-bold animate-pulse">Analyzing...</span>
                      ) : (
                        <span className="text-slate-600">Pending</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

