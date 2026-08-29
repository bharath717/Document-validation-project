import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Layers, AlertOctagon, Eye, Flame, ZoomIn } from 'lucide-react';

export default function ForensicsCard({ forensics = {}, documentPreview = null }) {
  const {
    tamper_detected = false,
    tamper_score = 0,
    suspicious_regions = [],
    heatmap_path = null,
    confidence = 0.95
  } = forensics;

  const [showHeatmap, setShowHeatmap] = useState(true);

  const cleanTamperScore = Math.max(0, Math.min(100, Number(tamper_score) || 0));

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              tamper_detected
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-white">Digital Forensics & ELA</h3>
              <p className="text-[11px] text-slate-400 font-mono">Tamper & Manipulation Analysis</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
              tamper_detected
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-lg shadow-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {tamper_detected ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            {tamper_detected ? 'TAMPERING DETECTED' : 'UNALTERED'}
          </span>
        </div>

        {/* Forensic Scores Row */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-surface/80 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Tamper Score
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-xl font-bold font-sans ${cleanTamperScore > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {cleanTamperScore}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  cleanTamperScore > 50 ? 'bg-rose-500' : cleanTamperScore > 20 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${cleanTamperScore}%` }}
              />
            </div>
          </div>

          <div className="bg-surface/80 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              AI Model Confidence
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-sans text-indigo-300">
                {Math.round((confidence || 0.95) * 100)}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono">DeepNet v3</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${Math.round((confidence || 0.95) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Heatmap / Forensic Visualizer */}
        <div className="bg-black/30 rounded-xl p-3 border border-white/5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" /> Error Level Analysis (ELA) Heatmap
            </span>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              {showHeatmap ? 'Hide Overlay' : 'Show Overlay'}
            </button>
          </div>

          {showHeatmap && (
            <div className="relative rounded-lg overflow-hidden border border-white/10 bg-slate-950 aspect-video max-h-48 flex items-center justify-center group">
              {documentPreview ? (
                <img
                  src={documentPreview}
                  alt="Forensic Base"
                  className="w-full h-full object-contain filter contrast-125"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-indigo-950/40 to-slate-900 flex items-center justify-center p-4">
                  <div className="text-center space-y-1">
                    <p className="text-xs font-mono text-slate-400">Forensic Scan Matrix</p>
                    <p className="text-[10px] text-slate-500 font-mono">8-bit ELA Spectral Decomposition</p>
                  </div>
                </div>
              )}

              {/* Simulated Heatmap Glow Overlay if Tampered */}
              {tamper_detected && (
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 via-transparent to-amber-500/20 mix-blend-screen pointer-events-none animate-pulse">
                  <div className="absolute top-1/4 left-1/3 w-16 h-12 border-2 border-rose-500 bg-rose-500/30 rounded shadow-[0_0_15px_rgba(244,63,94,0.8)] flex items-center justify-center">
                    <span className="text-[9px] font-mono font-bold text-white bg-rose-600 px-1 rounded">
                      ANOMALY
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Suspicious Regions List */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
            Suspicious Regions ({suspicious_regions.length}):
          </span>

          {suspicious_regions.length > 0 ? (
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {suspicious_regions.map((region, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-300 flex items-start gap-2"
                >
                  <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-rose-200">
                      {region.description || `Tamper Region #${idx + 1}`}
                    </p>
                    {(region.x !== undefined || region.width !== undefined) && (
                      <span className="text-[10px] text-rose-400/80 block mt-0.5">
                        Bounding Box: [X:{region.x || 0}, Y:{region.y || 0}, W:{region.width || 0}, H:{region.height || 0}]
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs font-mono text-emerald-400 text-center">
              ✓ No spliced pixels, font clones, or compression anomalies found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

