import React from 'react';
import { CheckCircle2, XCircle, Sparkles, Sun, Eye, AlertCircle } from 'lucide-react';

export default function QualityCard({ quality = {} }) {
  const {
    quality_passed = true,
    quality_score = 0.85,
    blur_score = 0.05,
    glare_score = 0.08,
    resolution_ok = true,
    issues = []
  } = quality;

  const formatPct = (val) => `${Math.round((Number(val) || 0) * 100)}%`;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-white">Image Quality & Optics</h3>
              <p className="text-[11px] text-slate-400 font-mono">Clarity, Glare & Resolution</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
              quality_passed
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {quality_passed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {quality_passed ? 'PASSED' : 'DEGRADED'}
          </span>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-surface/80 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Quality Score
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-sans text-white">
                {formatPct(quality_score)}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  quality_score >= 0.75 ? 'bg-emerald-400' : quality_score >= 0.5 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, quality_score * 100))}%` }}
              />
            </div>
          </div>

          <div className="bg-surface/80 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Resolution Check
            </span>
            <div className="flex items-center gap-2 mt-1">
              {resolution_ok ? (
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Optimal DPI
                </span>
              ) : (
                <span className="text-sm font-bold text-rose-400 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Low Res
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-2">
              {resolution_ok ? 'Suitable for microprint OCR' : 'Below 300 DPI threshold'}
            </p>
          </div>
        </div>

        {/* Blur & Glare Bars */}
        <div className="space-y-3 bg-black/20 p-3.5 rounded-xl border border-white/5">
          {/* Blur Score */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400" /> Blur Defect
              </span>
              <span className={blur_score > 0.3 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                {formatPct(blur_score)} {blur_score > 0.3 ? '(High Blur)' : '(Sharp)'}
              </span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  blur_score > 0.3 ? 'bg-rose-500' : blur_score > 0.15 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, blur_score * 100))}%` }}
              />
            </div>
          </div>

          {/* Glare Score */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Glare Reflection
              </span>
              <span className={glare_score > 0.3 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                {formatPct(glare_score)} {glare_score > 0.3 ? '(Specular Glare)' : '(Clear)'}
              </span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  glare_score > 0.3 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, glare_score * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Issues list if any */}
      {issues && issues.length > 0 ? (
        <div className="mt-4 pt-3 border-t border-white/10">
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1.5">
            Detected Optical Issues ({issues.length}):
          </span>
          <ul className="space-y-1">
            {issues.map((issue, idx) => (
              <li key={idx} className="text-xs text-amber-300/90 flex items-start gap-1.5 bg-amber-500/10 p-1.5 rounded border border-amber-500/20 font-body">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <span className="text-[11px] font-mono text-slate-400">
            ✓ No optical distortions or obscuring reflections detected
          </span>
        </div>
      )}
    </div>
  );
}

