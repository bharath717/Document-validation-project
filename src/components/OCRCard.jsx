import React from 'react';
import { FileText, QrCode, CheckCircle2, XCircle, FileSpreadsheet, Sparkles, Hash } from 'lucide-react';

export default function OCRCard({ ocr = {} }) {
  const {
    document_type = 'national_id',
    fields = {},
    field_confidence = {},
    layout_score = 0.92,
    qr_valid = null,
    mrz_valid = null,
    field_consistency = true,
    confidence = 0.95
  } = ocr;

  const fieldEntries = Object.entries(fields || {});

  const formatKeyName = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getConfidenceColor = (score) => {
    const num = Number(score) || 0;
    if (num >= 0.9) return 'text-emerald-400 bg-emerald-500';
    if (num >= 0.7) return 'text-amber-400 bg-amber-500';
    return 'text-rose-400 bg-rose-500';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-security-cyan/10 border border-security-cyan/20 flex items-center justify-center text-security-cyan">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-white">OCR & Document Intelligence</h3>
              <p className="text-[11px] text-slate-400 font-mono">Entity Extraction & Structural Analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
              {document_type.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Structural Metrics Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
          <div className="bg-surface/80 p-2.5 rounded-xl border border-white/5 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Layout Score</span>
            <span className="text-base font-bold font-sans text-indigo-300 mt-0.5 block">
              {Math.round((layout_score || 0.9) * 100)}%
            </span>
          </div>

          <div className="bg-surface/80 p-2.5 rounded-xl border border-white/5 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">QR Code</span>
            <div className="flex items-center justify-center gap-1 mt-1">
              {qr_valid === true && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> Valid
                </span>
              )}
              {qr_valid === false && (
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1 font-mono">
                  <XCircle className="w-3 h-3" /> Invalid
                </span>
              )}
              {qr_valid === null && (
                <span className="text-xs text-slate-500 font-mono">N/A</span>
              )}
            </div>
          </div>

          <div className="bg-surface/80 p-2.5 rounded-xl border border-white/5 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">MRZ Check</span>
            <div className="flex items-center justify-center gap-1 mt-1">
              {mrz_valid === true && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> Match
                </span>
              )}
              {mrz_valid === false && (
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1 font-mono">
                  <XCircle className="w-3 h-3" /> Error
                </span>
              )}
              {mrz_valid === null && (
                <span className="text-xs text-slate-500 font-mono">N/A</span>
              )}
            </div>
          </div>

          <div className="bg-surface/80 p-2.5 rounded-xl border border-white/5 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Consistency</span>
            <div className="flex items-center justify-center gap-1 mt-1">
              {field_consistency ? (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> 100%
                </span>
              ) : (
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1 font-mono">
                  <XCircle className="w-3 h-3" /> Conflict
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Extracted Fields Table */}
        <div className="space-y-2 mb-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Extracted Key Entities ({fieldEntries.length}):
          </span>

          {fieldEntries.length > 0 ? (
            <div className="bg-black/30 rounded-xl border border-white/5 divide-y divide-white/5 max-h-56 overflow-y-auto">
              {fieldEntries.map(([key, val]) => {
                const conf = field_confidence[key] !== undefined ? field_confidence[key] : confidence;
                const confPercent = Math.round((Number(conf) || 0) * 100);
                const isMrz = key.toLowerCase().includes('mrz');

                return (
                  <div key={key} className="p-2.5 sm:p-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-slate-400">
                          {formatKeyName(key)}:
                        </span>
                        <span className={`text-xs font-mono font-bold text-white ${isMrz ? 'text-[11px] tracking-tight bg-slate-900 px-1.5 py-0.5 rounded text-security-cyan break-all' : ''}`}>
                          {String(val || '—')}
                        </span>
                      </div>

                      {/* Confidence Tag & Micro Bar */}
                      <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                        <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              confPercent >= 90 ? 'bg-emerald-400' : confPercent >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                            }`}
                            style={{ width: `${confPercent}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-mono font-bold ${
                          confPercent >= 90 ? 'text-emerald-400' : confPercent >= 70 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {confPercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-center text-xs font-mono text-slate-500">
              No textual entities detected in document
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

