import React from 'react';
import { UserCheck, UserX, UserMinus, ScanFace, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function BiometricsCard({ biometrics = {}, selfiePreview = null, documentPreview = null }) {
  const {
    status = 'NOT_PROVIDED',
    confidence = null,
    match_score = null,
    face_detected = null
  } = biometrics;

  const normalizedStatus = (status || 'NOT_PROVIDED').toUpperCase();

  const configs = {
    MATCHED: {
      label: 'BIOMETRIC MATCH VERIFIED',
      desc: 'Selfie facial embedding directly correlates with document portrait photo.',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: UserCheck,
      color: 'text-emerald-400'
    },
    NOT_MATCHED: {
      label: 'FACIAL MISMATCH DETECTED',
      desc: 'Significant feature disparity found between selfie and identity photo.',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: UserX,
      color: 'text-rose-400'
    },
    NOT_PROVIDED: {
      label: 'SELFIE NOT PROVIDED',
      desc: 'Facial comparison skipped. Provide a live selfie during upload to verify identity.',
      badge: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      icon: UserMinus,
      color: 'text-slate-400'
    },
  };

  const config = configs[normalizedStatus] || configs.NOT_PROVIDED;
  const Icon = config.icon;

  const scorePct = match_score !== null 
    ? Math.round(match_score * 100) 
    : confidence !== null 
    ? Math.round(confidence * 100) 
    : null;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              normalizedStatus === 'MATCHED'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : normalizedStatus === 'NOT_MATCHED'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}>
              <ScanFace className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-white">Biometric Face Verification</h3>
              <p className="text-[11px] text-slate-400 font-mono">1:1 Facial Vector Matching</p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${config.badge}`}>
            <Icon className="w-3.5 h-3.5" />
            {normalizedStatus.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Status Content */}
        <div className="my-4 space-y-3">
          <div className="bg-surface/80 rounded-xl p-3.5 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 font-semibold">
                {config.label}
              </span>
              {scorePct !== null && (
                <span className={`text-sm font-mono font-bold ${config.color}`}>
                  {scorePct}% Match
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-body mt-1.5 leading-relaxed">
              {config.desc}
            </p>

            {scorePct !== null && (
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    normalizedStatus === 'MATCHED' ? 'bg-emerald-400' : 'bg-rose-500'
                  }`}
                  style={{ width: `${scorePct}%` }}
                />
              </div>
            )}
          </div>

          {/* Photo Pair Previews (if available) */}
          {(selfiePreview || documentPreview) && normalizedStatus !== 'NOT_PROVIDED' && (
            <div className="grid grid-cols-2 gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5">
              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">Doc Portrait</span>
                <div className="h-20 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
                  {documentPreview ? (
                    <img src={documentPreview} alt="Doc Photo" className="w-full h-full object-cover" />
                  ) : (
                    <ScanFace className="w-6 h-6 text-slate-600" />
                  )}
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">User Selfie</span>
                <div className="h-20 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
                  {selfiePreview ? (
                    <img src={selfiePreview} alt="Selfie Photo" className="w-full h-full object-cover" />
                  ) : (
                    <ScanFace className="w-6 h-6 text-slate-600" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>DeepFace ResNet50 Embedding</span>
        <span>Threshold: 0.70</span>
      </div>
    </div>
  );
}

