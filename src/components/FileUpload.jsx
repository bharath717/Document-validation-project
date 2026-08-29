import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Trash2, CheckCircle2, AlertCircle, Eye } from 'lucide-react';

export default function FileUpload({
  label,
  sublabel,
  accept = "image/jpeg,image/png,image/jpg,application/pdf",
  file,
  previewUrl,
  onFileSelect,
  onFileRemove,
  isOptional = false,
  icon: IconComponent = UploadCloud
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndSelect = (selectedFile) => {
    setErrorMsg(null);
    if (!selectedFile) return;

    // Check size limit: 15MB
    const MAX_SIZE = 15 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      setErrorMsg('File exceeds 15MB size limit. Please upload a smaller file.');
      return;
    }

    // Check type
    const validExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const fileName = selectedFile.name.toLowerCase();
    const isValidExt = validExtensions.some(ext => fileName.endsWith(ext)) || 
      selectedFile.type.startsWith('image/') || 
      selectedFile.type === 'application/pdf';

    if (!isValidExt) {
      setErrorMsg('Unsupported file format. Please upload JPG, PNG, or PDF.');
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2 font-sans">
          <IconComponent className="w-4 h-4 text-indigo-400" />
          <span>{label}</span>
          {isOptional && (
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
              Optional
            </span>
          )}
        </label>
        {file && (
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Ready
          </span>
        )}
      </div>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all duration-300 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-white/15 bg-white/[0.02] hover:border-indigo-500/50 hover:bg-white/[0.04]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                validateAndSelect(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <IconComponent className="w-7 h-7 text-indigo-400 group-hover:text-pink-400 transition-colors" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-200">
                <span className="text-indigo-400 font-semibold underline underline-offset-4">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-400">
                {sublabel || 'Supports JPG, PNG, PDF (Max 15MB)'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-slate-500 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                JPG
              </span>
              <span className="text-[11px] font-mono text-slate-500 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                PNG
              </span>
              <span className="text-[11px] font-mono text-slate-500 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                PDF
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* File Uploaded Preview Card */
        <div className="glass-panel rounded-2xl p-4 border border-indigo-500/30 bg-indigo-950/20 relative overflow-hidden">
          <div className="flex items-center gap-4">
            
            {/* Preview Thumbnail */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-surface border border-white/10 overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
              {previewUrl && file.type.startsWith('image/') ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : file.type === 'application/pdf' ? (
                <FileText className="w-8 h-8 text-rose-400" />
              ) : (
                <ImageIcon className="w-8 h-8 text-indigo-400" />
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white truncate" title={file.name}>
                  {file.name}
                </p>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                {formatFileSize(file.size)} &bull; {file.type || 'Document'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Ready to Validate
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onFileRemove}
                title="Remove file"
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

