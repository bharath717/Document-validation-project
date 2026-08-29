import React from 'react';
import { Fingerprint, CheckCircle2, AlertOctagon, HelpCircle, ShieldCheck } from 'lucide-react';

export default function EvidenceCard({ evidence = [] }) {
  if (!evidence || evidence.length === 0) {
    return null;
  }

  const getStatusBadge = (status = '') => {
    const s = String(status).toUpperCase();
    if (s === 'PASSED' || s === 'VERIFIED' || s === 'MATCH') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    if (s.includes('WARN') || s.includes('GLARE') || s.includes('MANUAL')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-white">Forensic Evidence & Markers</h3>
            <p className="text-[11px] text-slate-400 font-mono">Micro-Features & Watermarks</p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          {evidence.length} Evidence Artifacts
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {evidence.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-surface/80 border border-white/5 flex flex-col justify-between space-y-2 hover:border-white/15 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-white font-sans">
                {item.label || item.type || `Artifact #${idx + 1}`}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadge(item.status)}`}>
                {item.status || 'LOGGED'}
              </span>
            </div>
            {item.type && (
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Type: {item.type.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

