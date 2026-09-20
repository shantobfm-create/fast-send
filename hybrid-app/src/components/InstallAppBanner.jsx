import React, { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle, X, HelpCircle, ArrowDownToLine } from 'lucide-react';

export const InstallAppBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('✅ Fast Send App was successfully installed!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = () => {
    // 1. If PWA prompt is available, trigger native prompt
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
      } catch (e) {}
    }
    // 2. Directly initiate FastSend.apk download
    const link = document.createElement('a');
    link.href = '/download/FastSend.apk';
    link.download = 'FastSend.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isInstalled || dismissed) return null;

  return (
    <>
      {/* Compact Android Download Banner */}
      <div className="mx-3 my-2 p-2.5 bg-gradient-to-r from-emerald-800 to-[#00823B] text-white rounded-2xl shadow-md border border-emerald-500/40 flex items-center justify-between gap-2 animate-fade-in">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white text-[#00823B] flex items-center justify-center font-bold shrink-0 shadow-sm">
            <Smartphone className="w-5 h-5 animate-bounce" />
          </div>
          <div className="truncate">
            <div className="text-xs font-bold leading-tight flex items-center gap-1">
              <span>Android অ্যাপ ইনস্টল করুন</span>
              <span className="bg-amber-400 text-slate-900 text-[9px] px-1.5 py-0.2 rounded-full font-black">APK</span>
            </div>
            <p className="text-[10px] text-emerald-100 truncate">ফোনে সরাসরি অ্যাপের মতো ব্যবহার করুন</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleInstallClick}
            className="tap-effect bg-white hover:bg-emerald-50 text-[#00823B] text-xs font-black px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>ডাউনলোড</span>
          </button>
          
          <button
            onClick={() => setDismissed(true)}
            className="text-white/60 hover:text-white p-1"
            title="লুকান"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
};
