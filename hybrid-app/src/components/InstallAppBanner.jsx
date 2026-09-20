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

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
      } catch (e) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
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
            <span>ইনস্টল করুন</span>
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

      {showGuideModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full text-slate-800 shadow-2xl animate-fade-in border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2 font-bold text-base text-[#00823B]">
                <Smartphone className="w-5 h-5" />
                <span>ফোনে অ্যাপ ইনস্টল করার নিয়ম</span>
              </div>
              <button onClick={() => setShowGuideModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-[#00823B] text-white flex items-center justify-center font-bold text-xs shrink-0">১</span>
                <span>ব্রাউজারের উপরে বা নিচে <b>তিনটি ডট (⋮)</b> অথবা <b>শেয়ার (Share)</b> বাটনে চাপুন।</span>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="w-6 h-6 rounded-full bg-[#00823B] text-white flex items-center justify-center font-bold text-xs shrink-0">২</span>
                <span>মেনু থেকে <b>"Install app"</b> অথবা <b>"Add to Home Screen"</b> সিলেক্ট করুন।</span>
              </div>

              <div className="flex items-start gap-2.5 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-[#00823B]">
                <CheckCircle className="w-5 h-5 shrink-0 text-[#00823B] mt-0.5" />
                <span>ব্যাস! অ্যাপটি সরাসরি আপনার ফোনের হোম স্ক্রিনে অ্যাপ আইকন হিসেবে যুক্ত হয়ে যাবে।</span>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full mt-4 bg-[#00823B] text-white font-bold py-2.5 rounded-xl hover:bg-[#006837] transition-all"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </>
  );
};
