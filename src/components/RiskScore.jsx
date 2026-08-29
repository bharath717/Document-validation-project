import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, Activity } from 'lucide-react';

export default function RiskScore({ score = 0, level = 'LOW', verdict = 'PASS' }) {
  const cleanScore = Math.max(0, Math.min(100, Number(score) || 0));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cleanScore / 100) * circumference;

  const getColor = (s) => {
    if (s <= 25) {
      return {
        text: 'text-emerald-400',
        stroke: '#34d399',
        glow: 'rgba(52, 211, 153, 0.25)',
        badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        bg: 'from-emerald-950/20 to-surface-card',
        desc: 'Document shows high integrity with negligible risk markers.'
      };
    }
    if (s <= 65) {
      return {
        text: 'text-amber-400',
        stroke: '#fbbf24',
        glow: 'rgba(251, 191, 36, 0.25)',
        badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        bg: 'from-amber-950/20 to-surface-card',
        desc: 'Moderate risk indicators found. Human reviewer audit advised.'
      };
    }
    return {
      text: 'text-rose-400',
      stroke: '#f43f5e',
      glow: 'rgba(244, 63, 94, 0.25)',
      badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      bg: 'from-rose-950/20 to-surface-card',
      desc: 'High fraud probability. Forensic alterations or tampering detected.'
    };
  };

  const scheme = getColor(cleanScore);

  return (
    <div className={`glass-panel rounded-2xl p-6 border border-white/10 bg-gradient-to-br ${scheme.bg} relative overflow-hidden flex flex-col justify-between`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${scheme.text}`} />
          <span className="text-xs uppercase font-mono tracking-wider text-slate-300 font-semibold">
            Composite Risk Index
          </span>
        </div>
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full uppercase border ${scheme.badge}`}>
          {level} Risk
        </span>
      </div>

      {/* Circular Gauge Meter */}
      <div className="flex flex-col items-center justify-center my-4 relative">
        <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            className="text-white/10"
            fill="transparent"
          />
          {/* Animated Value Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={scheme.stroke}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 10px ${scheme.glow})`,
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
            }}
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl sm:text-5xl font-black font-sans text-white tracking-tight">
            {cleanScore}
          </span>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-0.5">
            / 100
          </span>
        </div>
      </div>

      {/* Description & Threshold Indicator */}
      <div className="space-y-3">
        <p className="text-xs text-slate-300 text-center font-body">
          {scheme.desc}
        </p>

        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/10 text-center font-mono text-[10px]">
          <div className={`p-1 rounded ${cleanScore <= 25 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-500'}`}>
            0 - 25 LOW
          </div>
          <div className={`p-1 rounded ${cleanScore > 25 && cleanScore <= 65 ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-500'}`}>
            26 - 65 MED
          </div>
          <div className={`p-1 rounded ${cleanScore > 65 ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-500'}`}>
            66 - 100 HIGH
          </div>
        </div>
      </div>
    </div>
  );
}

