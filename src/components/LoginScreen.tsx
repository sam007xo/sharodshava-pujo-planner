import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  AlertCircle, 
  Settings, 
  Key, 
  Check, 
  ExternalLink,
  HelpCircle,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { processGcpCredential } from '../services/gcpAuth';

export const LoginScreen: React.FC = () => {
  const { 
    setUserFromGcp, 
    isGcpConfigured, 
    gcpClientId, 
    setGcpClientId 
  } = useAuth();
  
  const { permissionState, locality, requestLocation } = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showGcpConfigModal, setShowGcpConfigModal] = useState(false);
  const [clientIdInput, setClientIdInput] = useState(gcpClientId || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isGisReady, setIsGisReady] = useState(false);

  const googleButtonContainerRef = useRef<HTMLDivElement>(null);

  // Initialize official Google Identity Services (GIS) button
  useEffect(() => {
    if (!gcpClientId) return;

    let checkInterval: ReturnType<typeof setInterval> | null = null;
    let attempts = 0;

    const initGis = () => {
      attempts++;
      if (window.google?.accounts?.id && googleButtonContainerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: gcpClientId,
            callback: (response) => {
              if (response.credential) {
                const user = processGcpCredential(response.credential);
                if (user) {
                  setUserFromGcp(user);
                } else {
                  setLoginError('Failed to decode Google user profile.');
                }
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true
          });

          // Render official Google button
          googleButtonContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleButtonContainerRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            logo_alignment: 'left',
            width: 280
          });

          setIsGisReady(true);

          // Also trigger One Tap prompt
          try {
            window.google.accounts.id.prompt();
          } catch {
            // ignore prompt errors
          }

          if (checkInterval) clearInterval(checkInterval);
        } catch (e) {
          console.warn('GIS init error:', e);
        }
      } else if (attempts > 30) {
        if (checkInterval) clearInterval(checkInterval);
      }
    };

    initGis();
    checkInterval = setInterval(initGis, 300);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [gcpClientId, setUserFromGcp]);

  const handleSaveGcpClientId = (e: React.FormEvent) => {
    e.preventDefault();
    setGcpClientId(clientIdInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowGcpConfigModal(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      
      {/* Top Right GCP Settings Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setShowGcpConfigModal(true)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
            isGcpConfigured
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
              : 'bg-white/10 border-white/20 text-white/70 hover:text-white hover:bg-white/15'
          }`}
          title="Configure Google Cloud Platform (GCP) OAuth Client ID"
        >
          <Settings size={13} className={isGcpConfigured ? 'text-emerald-400' : 'text-[#d4af37]'} />
          <span>{isGcpConfigured ? 'GCP OAuth Connected' : 'GCP Settings'}</span>
        </button>
      </div>

      {/* Centered Login Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
          delay: 0.15
        }}
        className="relative w-full max-w-sm rounded-3xl p-7 sm:p-9 glass-panel border border-white/15 shadow-2xl overflow-hidden text-center z-10 bg-[#0b0d13]/90 backdrop-blur-xl"
      >
        {/* Top specular edge */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Ambient glows */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#8b1e2a]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo & Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 220, delay: 0.2 }}
          className="mx-auto mb-4 w-24 h-24 rounded-3xl overflow-hidden border border-[#d4af37]/50 bg-black/60 shadow-[0_0_30px_rgba(212,175,55,0.35)] p-2 flex items-center justify-center"
        >
          <img 
            src="/sharodshav_logo.png" 
            alt="Sharodshav Logo" 
            className="w-full h-full object-contain object-center"
          />
        </motion.div>

        {/* Brand Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-2xl sm:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#f4e5a9] via-[#d4af37] to-[#e6ca65] font-sans"
        >
          SHARODSHAV
        </motion.h1>

        {/* Subtitle & Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-1 text-xs sm:text-sm text-white/70 font-medium tracking-tight"
        >
          Optimal Pandal Navigation • Pujo Planner
        </motion.p>

        {/* Divider */}
        <div className="my-5 h-[1px] w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Status Pill */}
        <div className="mb-5 flex items-center justify-center gap-1.5">
          {isGcpConfigured ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              GCP Google OAuth Ready
            </span>
          ) : (
            <button
              onClick={() => setShowGcpConfigModal(true)}
              className="px-2.5 py-1 rounded-full bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/30 text-[#f4e5a9] text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-all"
            >
              <Key size={11} />
              <span>Connect GCP OAuth Client ID</span>
            </button>
          )}
        </div>

        {/* Error message */}
        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-3 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-[11px] text-red-200 flex items-start gap-2 text-left"
          >
            <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
            <span>{loginError}</span>
          </motion.div>
        )}

        {/* The ONLY Official Google Sign-In Button Container */}
        <div className="flex justify-center min-h-[44px] items-center my-2">
          {!isGisReady && (
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Loader2 size={16} className="animate-spin text-[#d4af37]" />
              <span>Loading Google Sign-In...</span>
            </div>
          )}
          <div ref={googleButtonContainerRef} className={!isGisReady ? 'hidden' : ''} />
        </div>

        {/* Location status badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 flex items-center justify-center space-x-1.5 text-xs text-white/50"
        >
          <MapPin size={12} className={permissionState === 'granted' ? 'text-emerald-400' : 'text-[#d4af37] animate-pulse'} />
          <span className="truncate max-w-[200px]">
            {permissionState === 'granted'
              ? `${locality || 'Location active'}`
              : permissionState === 'denied'
                ? 'Location blocked'
                : 'Detecting location...'}
          </span>
          {permissionState !== 'granted' && (
            <button
              onClick={requestLocation}
              className="text-[#f4e5a9] underline ml-1 hover:text-white text-[11px] cursor-pointer"
            >
              Enable
            </button>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-3 flex items-center justify-center space-x-1.5 text-[10px] text-white/30 font-mono"
        >
          <ShieldCheck size={11} className="text-emerald-500/60" />
          <span>GCP OAuth 2.0 • Google Identity Services</span>
        </motion.div>
      </motion.div>

      {/* GCP OAuth Client ID Configuration Modal */}
      <AnimatePresence>
        {showGcpConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl glass-panel border border-white/20 p-6 shadow-2xl bg-[#0b0d13]/95 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                    <Key size={16} />
                  </div>
                  <h3 className="text-base font-bold text-white">Google Cloud (GCP) OAuth</h3>
                </div>
                <button
                  onClick={() => setShowGcpConfigModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveGcpClientId} className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 block">
                    GCP OAuth Web Client ID
                  </label>
                  <input
                    type="text"
                    value={clientIdInput}
                    onChange={(e) => setClientIdInput(e.target.value)}
                    placeholder="xxxxxxxxxxxx.apps.googleusercontent.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 focus:border-[#d4af37] focus:outline-none text-white text-xs font-mono placeholder:text-white/30"
                  />
                  <p className="text-[10px] text-white/40">
                    Saved directly in your browser's local storage and environment.
                  </p>
                </div>

                {/* Quick GCP Setup Guide */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 text-xs text-white/70">
                  <div className="flex items-center gap-1.5 font-semibold text-white text-[11px]">
                    <HelpCircle size={13} className="text-[#d4af37]" />
                    <span>How to get your GCP Client ID (1 minute):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-white/60 pl-1">
                    <li>Open <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-[#d4af37] underline inline-flex items-center gap-0.5">Google Cloud Console <ExternalLink size={10} /></a></li>
                    <li>Click <strong>Create Credentials → OAuth client ID</strong></li>
                    <li>Select <strong>Web application</strong></li>
                    <li>Under <strong>Authorized JavaScript origins</strong>, add: <code className="bg-black/40 px-1 rounded text-emerald-300 font-mono text-[10px]">http://localhost:5173</code></li>
                    <li>Copy your <strong>Client ID</strong> and paste it above!</li>
                  </ol>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowGcpConfigModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#e6ca65] text-black text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    {savedSuccess ? (
                      <>
                        <Check size={14} />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <span>Save Client ID</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
