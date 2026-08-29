import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertOctagon, Shield } from 'lucide-react';

export default function ReasonsCard({ reasons = [], verdict = 'PASS' }) {
  const normalizedVerdict = (verdict || 'PASS').toUpperCase();

  const getReasonIcon = (text = '') => {
    const lower = text.toLowerCase();
    if (lower.includes('critical') || lower.includes('tamper') || lower.includes('fraud') || lower.includes('mismatch') || lower.includes('alteration')) {
      return <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />;
    }
    if (lower.includes('glare') || lower.includes('blur') || lower.includes('warning') || lower.includes('review') || lower.includes('occlusion') || lower.includes('below')) {
      return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />;
  };

  const getReasonBg = (text = '') => {
    const lower = text.toLowerCase();
    if (lower.includes('critical') || lower.includes('tamper') || lower.includes('fraud') || lower.includes('mismatch') || lower.includes('alteration')) {
      return 'bg-rose-500/10 border-rose-500/20 text-rose-200';
    }
    if (lower.includes('glare') || lower.includes('blur') || lower.includes('warning') || lower.includes('review') || lower.includes('occlusion') || lower.includes('below')) {
      return 'bg-amber-500/10 border-amber-500/20 text-amber-200';
    }
    return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-sm text-white">AI Decision Rationale & Audit Trail</h3>
            <p className="text-[11px] text-slate-400 font-mono">Explanatory Engine Factors</p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          {reasons.length} {reasons.length === 1 ? 'Rule Triggered' : 'Rules Triggered'}
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {reasons && reasons.length > 0 ? (
          reasons.map((reason, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-start gap-3 text-xs font-body transition-colors ${getReasonBg(
                reason
              )}`}
            >
              {getReasonIcon(reason)}
              <span className="leading-relaxed flex-1">{reason}</span>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-xl bg-surface/60 border border-white/5 text-center text-xs font-mono text-slate-400">
            {normalizedVerdict === 'PASS'
              ? '✓ No security violations or tampering anomalies detected across all screening pipelines.'
              : 'Decision generated automatically based on composite multi-modal threshold.'}
          </div>
        )}
      </div>
    </div>
  );
}

