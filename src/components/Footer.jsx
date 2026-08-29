import React from 'react';
import { Shield, Lock, FileCheck2, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background-alt/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold font-sans text-white">
                AI-Based Fake Identity & Document Screening System
              </p>
              <p className="text-xs text-slate-400 font-body">
                Smart India Hackathon • Team Project
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>AES-256 Encrypted In-Memory Processing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>FastAPI Backend Engine</span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <p>© 2026 AI Document Screening System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Confidential Defense / Security Spec</span>
            <span>v1.0.0-PROD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

