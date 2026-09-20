import React, { useState, useRef } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { Copy, Check, Camera, Upload, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const AddMoneyWalletDetailPage = ({ onNavigate, selectedWalletId = 'bkash' }) => {
  const { settings, submitAddMoney, showToast, loading } = useApp();

  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [proofImage, setProofImage] = useState(null);

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const walletInfoMap = {
    bkash: {
      name: 'বিকাশ (bKash)',
      shortName: 'Bkash',
      color: '#E2136E',
      number: settings.paymentMethods?.find(m => m.id === 'bkash')?.number || '01754150019',
      type: 'Personal / Merchant'
    },
    nagad: {
      name: 'নগদ (Nagad)',
      shortName: 'Nagad',
      color: '#E23528',
      number: settings.paymentMethods?.find(m => m.id === 'nagad')?.number || '01854150019',
      type: 'Personal'
    },
    rocket: {
      name: 'রকেট (Rocket)',
      shortName: 'Rocket',
      color: '#8C3494',
      number: settings.paymentMethods?.find(m => m.id === 'rocket')?.number || '01954150019',
      type: 'Personal'
    },
    upay: {
      name: 'উপায় (Upay)',
      shortName: 'Upay',
      color: '#0055A5',
      number: settings.paymentMethods?.find(m => m.id === 'upay')?.number || '01654150019',
      type: 'Personal'
    }
  };

  const wallet = walletInfoMap[selectedWalletId] || walletInfoMap.bkash;
  const quickAmounts = [500, 1000, 5000, 10000, 25000];

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.number);
    setCopied(true);
    showToast(`নম্বর '${wallet.number}' কপি করা হয়েছে!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  // Camera Handlers
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      showToast("ক্যামেরা ওপেন করা যায়নি। গ্যালারি থেকে ছবি সিলেক্ট করুন।", "error");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setProofImage(dataUrl);
    stopCamera();
    showToast("স্ক্রিনশট ছবি সফলভাবে ক্যাপচার হয়েছে!", "success");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProofImage(reader.result);
      showToast("স্ক্রিনশট ছবি আপলোড হয়েছে!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast("দয়া করে সঠিক টাকার পরিমাণ দিন।", "error");
      return;
    }

    const autoTrx = trxId.trim() || ("MFS" + Math.floor(100000 + Math.random() * 900000));

    const res = await submitAddMoney({
      methodId: selectedWalletId,
      amount: Number(amount),
      adminNumber: wallet.number,
      trxId: autoTrx,
      proofImage: proofImage,
      note: `${wallet.name} ক্যাশ-ইন / সেন্ড মানি`
    });

    if (res.success) {
      confetti({ particleCount: 90, spread: 60 });
      onNavigate('receipt', { txData: res.transaction });
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* Standard Header */}
      <StandardHeader 
        title={`${wallet.name} ডিপোজিট`} 
        onBack={() => onNavigate('add-money-mobile')} 
      />

      {/* Main Content Area */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        
        {/* Step 1: Copy Receiver Number Box */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              ১. নিচে দেওয়া নম্বরে টাকা পাঠান
            </span>
            <span className="text-[9px] bg-emerald-50 text-[#00823B] font-bold px-1.5 py-0.2 rounded border border-emerald-200">
              অফিসিয়াল এজেন্ট/পার্সোনাল
            </span>
          </div>

          <div className="bg-emerald-50/70 border-2 border-[#00823B] rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#00823B] font-bold block">{wallet.name} নম্বর:</span>
              <span className="font-mono font-black text-base text-slate-900 tracking-wide">{wallet.number}</span>
            </div>
            
            <button
              type="button"
              onClick={handleCopy}
              className="tap-effect bg-[#00823B] hover:bg-[#006837] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "কপি হয়েছে" : "কপি"}</span>
            </button>
          </div>
        </div>

        {/* Step 2: Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3.5">
          <span className="text-xs font-bold text-slate-600 uppercase block mb-1">
            ২. পাঠানো টাকার বিবরণ পূরণ করুন
          </span>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              জমা দেওয়া টাকার পরিমাণ (৳)
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="যেমন: ১০০০"
              className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#00823B] rounded-xl py-3 px-3.5 text-base font-mono font-black text-slate-900 focus:bg-white focus:outline-none"
            />

            {/* Quick Pills */}
            <div className="grid grid-cols-5 gap-1.5 mt-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className="tap-effect bg-slate-100 hover:bg-emerald-50 hover:text-[#00823B] hover:border-[#00823B] border border-slate-200 rounded-xl py-1.5 text-xs font-bold font-mono transition-all text-slate-800 cursor-pointer"
                >
                  ৳{q.toLocaleString('bn-BD')}
                </button>
              ))}
            </div>
          </div>

          {/* TrxID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ট্রানজেকশন আইডি / TrxID (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="যেমন: BL9847192"
              className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#00823B] rounded-xl py-3 px-3.5 text-sm font-mono font-bold uppercase text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Screenshot Upload Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              পেমেন্ট স্ক্রিনশট বা প্রুফ ছবি (ঐচ্ছিক)
            </label>

            {proofImage ? (
              <div className="relative border-2 border-emerald-500 rounded-2xl overflow-hidden p-2 bg-emerald-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img src={proofImage} alt="Proof" className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                  <span className="text-xs font-bold text-emerald-800">ছবি সফলভাবে যুক্ত হয়েছে ✅</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProofImage(null)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={startCamera}
                  className="tap-effect bg-slate-50 hover:bg-slate-100 text-slate-800 border-2 border-slate-300 rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#00823B]" />
                  <span>ক্যামেরা দিয়ে তুলুন</span>
                </button>

                <label className="tap-effect bg-slate-50 hover:bg-slate-100 text-slate-800 border-2 border-slate-300 rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span>গ্যালারি থেকে নিন</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-xl text-base shadow-md transition-all text-center mt-2 cursor-pointer"
          >
            {loading ? "সাবমিট হচ্ছে..." : "অ্যাড মানি নিশ্চিত করুন ➔"}
          </button>
        </form>

      </div>

      {/* Camera Live Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-between p-4">
          <div className="flex justify-between items-center text-white pt-2">
            <span className="text-xs font-bold">পেমেন্ট স্লিপের ছবি তুলুন</span>
            <button onClick={stopCamera} className="p-1 rounded-full bg-white/20 text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center my-4 overflow-hidden rounded-2xl border-2 border-white/30 bg-black relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          </div>

          <div className="pb-4 flex justify-center">
            <button
              type="button"
              onClick={capturePhoto}
              className="w-14 h-14 rounded-full bg-white border-4 border-[#00823B] shadow-lg flex items-center justify-center"
            >
              <div className="w-10 h-10 rounded-full bg-[#00823B]" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • শতভাগ নিরাপদ গেটওয়ে
      </div>

    </div>
  );
};
