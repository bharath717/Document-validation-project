import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';

export default function VerdictBadge({ verdict, size = 'default' }) {
  const normalized = (verdict || 'PASS').toUpperCase();

  const configs = {
    PASS: {
      label: 'PASSED AUTHENTICATION',
      sublabel: 'Low Risk • Genuine Document',
      bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400',
      glow: 'shadow-emerald-500/20 shadow-lg',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: ShieldCheck,
    },
    REVIEW: {
      label: 'MANUAL REVIEW REQUIRED',
      sublabel: 'Medium Risk • Anomaly Detected',
      bg: 'bg-amber-950/40 border-amber-500/40 text-amber-400',
      glow: 'shadow-amber-500/20 shadow-lg',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: AlertTriangle,
    },
    REJECT: {
      label: 'VERIFICATION REJECTED',
      sublabel: 'High Risk • Fraud / Tampering Detected',
      bg: 'bg-rose-950/40 border-rose-500/40 text-rose-400',
      glow: 'shadow-rose-500/20 shadow-lg',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: ShieldAlert,
    },
  };

  const config = configs[normalized] || configs.REVIEW;
  const Icon = config.icon;

  if (size === 'compact') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${config.badgeBg} ${config.glow}`}>
        <Icon className="w-3.5 h-3.5" />
        {normalized}
      </span>
    );
  }

  return (
    <div className={`p-5 sm:p-6 rounded-2xl border backdrop-blur-xl ${config.bg} ${config.glow} transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-slate-400">System Verdict</span>
            <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border ${config.badgeBg}`}>
              Automated AI Decision
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5">
            {config.label}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-body">
            {config.sublabel}
          </p>
        </div>
      </div>

      <div className="self-end sm:self-center">
        <span className={`px-4 py-2 rounded-xl text-sm font-mono font-bold tracking-wider uppercase border ${config.badgeBg}`}>
          VERDICT: {normalized}
        </span>
      </div>
    </div>
  );
}

