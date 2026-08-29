import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Results from './pages/Results';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home' | 'upload' | 'results'
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Previews for photos to visualize across scan HUD and results
  const [documentPreview, setDocumentPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);

  const handleStartVerification = () => {
    setActivePage('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerificationSuccess = (result) => {
    setVerificationResult(result);
    setActivePage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDemo = (demoData) => {
    setVerificationResult(demoData);
    setActivePage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setVerificationResult(null);
    setDocumentPreview(null);
    setSelfiePreview(null);
    setActivePage('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Persistent Navigation */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <LoadingScreen documentPreview={documentPreview} />
        ) : (
          <>
            {activePage === 'home' && (
              <Home 
                onStartVerification={handleStartVerification} 
                onSelectDemo={handleSelectDemo}
              />
            )}

            {activePage === 'upload' && (
              <Upload
                onVerificationSuccess={handleVerificationSuccess}
                setIsLoading={setIsLoading}
                setDocumentPreview={setDocumentPreview}
                setSelfiePreview={setSelfiePreview}
                onSelectDemo={handleSelectDemo}
              />
            )}

            {activePage === 'results' && (
              <Results
                result={verificationResult}
                documentPreview={documentPreview}
                selfiePreview={selfiePreview}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

