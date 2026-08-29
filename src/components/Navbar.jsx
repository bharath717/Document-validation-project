import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Activity, FileCheck2, Cpu, ExternalLink, RefreshCw } from 'lucide-react';
import { checkBackendHealth } from '../api/documentApi';

export default function Navbar({ activePage, setActivePage }) {
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [isRefreshing, setIsRefreshing] = useState(false);

  const testConnection = async () => {
    setIsRefreshing(true);
    const isOnline = await checkBackendHealth();
    setBackendStatus(isOnline ? 'online' : 'offline');
    setIsRefreshing(false);
  };

  useEffect(() => {
    testConnection();
    const interval = setInterval(testConnection, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Project Title */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group"
            onClick={() => setActivePage('home')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-indigo-400 group-hover:text-pink-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  AegisID <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">SIH</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-body hidden sm:block">
                AI Fake Identity & Document Screening
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-full border border-white/10">
            <button
              onClick={() => setActivePage('home')}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                activePage === 'home'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActivePage('upload')}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                activePage === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Verify Document
            </button>
            <button
              onClick={() => setActivePage('results')}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all ${
                activePage === 'results'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Forensic Dashboard
            </button>
          </nav>

          {/* Backend Status & CTA */}
          <div className="flex items-center gap-3">
            {/* Backend Heartbeat Badge */}
            <div 
              title="FastAPI Backend Status (http://localhost:8000)"
              onClick={testConnection}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-white/10 cursor-pointer hover:border-white/20 transition-all text-xs font-mono"
            >
              <span className="relative flex h-2 w-2">
                {backendStatus === 'online' && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </>
                )}
                {backendStatus === 'offline' && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                )}
                {backendStatus === 'checking' && (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 animate-pulse"></span>
                )}
              </span>
              <span className="text-slate-300 hidden sm:inline">
                API {backendStatus === 'online' ? 'Connected' : backendStatus === 'offline' ? 'Standby' : 'Checking'}
              </span>
              <RefreshCw className={`w-3 h-3 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </div>

            {/* Start Button */}
            <button
              onClick={() => setActivePage('upload')}
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs uppercase tracking-wider font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Scan Doc</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

