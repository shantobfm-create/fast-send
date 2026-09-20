import React from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { CheckCircle2, Clock, Share2, Home, Download, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReceiptPage = ({ onNavigate, txData }) => {
  const { user, showToast } = useApp();

  const tx = txData || {
    id: "TRX-" + Math.floor(100000 + Math.random() * 900000),
    type: "transfer",
    methodName: "বিকাশ (সেন্ড মানি)",
    amount: 5000,
    receiverPhone: "01754150019",
    receiverName: "প্রাপক",
    requestedAt: new Date().toISOString(),
    status: "pending"
  };

  const isPending = tx.status === 'pending';
  const isApproved = tx.status === 'approved';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Fast Send ট্রানজেকশন রসিদ',
        text: `Fast Send রসিদ: ট্রানজেকশন আইডি ${tx.id}, পরিমাণ ৳${Number(tx.amount).toLocaleString('bn-BD')}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Fast Send রসিদ:\nআইডি: ${tx.id}\nপরিমাণ: ৳${tx.amount}\nতারিখ: ${new Date(tx.requestedAt).toLocaleString('bn-BD')}`);
      showToast("রসিদের বিবরণ কপি করা হয়েছে!", "success");
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* 1. Standard Header */}
      <StandardHeader 
        title="ট্রানজেকশন রসিদ" 
        onBack={() => onNavigate('home')} 
        rightAction={
          <button 
            onClick={handleShare}
            className="p-1 hover:bg-[#006837] rounded-full text-white transition-colors"
            title="শেয়ার করুন"
          >
            <Share2 className="w-4 h-4" />
          </button>
        }
      />

      {/* 2. Main Printable Receipt Card */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        
        {/* Status Banner */}
        <div className="text-center py-1">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-1 text-[#00823B] shadow-2xs">
            {isApproved ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : (
              <Clock className="w-6 h-6 animate-pulse text-[#00823B]" />
            )}
          </div>
          <h2 className="text-base font-black text-slate-900">
            {isApproved ? "লেনদেন সম্পন্ন হয়েছে!" : "রিকোয়েস্ট সফলভাবে জমা হয়েছে!"}
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isPending ? "এডমিন পর্যালোচনার পর ব্যালেন্স আপডেট হবে" : "টাকা সফলভাবে পাঠানো হয়েছে"}
          </p>
        </div>

        {/* Official Cash Memo Box */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          
          {/* Header of memo */}
          <div className="bg-[#00823B] text-white p-2.5 flex justify-between items-center text-xs">
            <span className="font-bold tracking-wide text-[11px]">FAST SEND OFFICIAL RECEIPT</span>
            <span className="font-mono bg-[#006837] px-2 py-0.2 rounded text-[10px]">
              {tx.id}
            </span>
          </div>

          {/* Amount Display */}
          <div className="p-3 text-center border-b border-dashed border-slate-200 bg-emerald-50/40">
            <span className="text-[11px] text-slate-500 font-bold block mb-0.5">মোট টাকার পরিমাণ</span>
            <span className="text-2xl font-black font-mono text-[#00823B]">
              ৳ {Number(tx.amount || 0).toLocaleString('bn-BD')}
            </span>
            <div className="mt-0.5">
              <span className={`inline-block px-2 py-0.2 rounded-full text-[10px] font-bold ${
                isApproved 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {isApproved ? "সফল লেনদেন" : "অপেক্ষমান পর্যালোচনা"}
              </span>
            </div>
          </div>

          {/* Details Breakdown Table */}
          <div className="p-3 text-xs space-y-1.5 divide-y divide-slate-100">
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-500 text-[11px]">লেনদেনের মাধ্যম:</span>
              <span className="font-bold text-slate-900">{tx.methodName || "মোবাইল ওয়ালেট"}</span>
            </div>

            {tx.receiverPhone && (
              <div className="flex justify-between pt-1">
                <span className="text-slate-500 text-[11px]">প্রাপক / অ্যাকাউন্ট:</span>
                <span className="font-mono font-bold text-slate-900">
                  {tx.receiverName ? `${tx.receiverName} - ` : ''}{tx.receiverPhone}
                </span>
              </div>
            )}

            <div className="flex justify-between pt-1">
              <span className="text-slate-500 text-[11px]">প্রেরক:</span>
              <span className="font-semibold text-slate-800">{user?.name || "গ্রাহক"} ({user?.phone})</span>
            </div>

            {tx.trxId && (
              <div className="flex justify-between pt-1">
                <span className="text-slate-500 text-[11px]">TrxID / রেফারেন্স:</span>
                <span className="font-mono font-bold text-slate-800">{tx.trxId}</span>
              </div>
            )}

            <div className="flex justify-between pt-1">
              <span className="text-slate-500 text-[11px]">তারিখ ও সময়:</span>
              <span className="font-mono text-slate-700">{new Date(tx.requestedAt || Date.now()).toLocaleString('bn-BD')}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-1.5 pt-1">
          <button
            onClick={() => onNavigate('home')}
            className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
          >
            <Home className="w-4 h-4" />
            <span>হোম স্ক্রিনে ফিরে যান</span>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className="tap-effect w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold py-2 rounded-xl text-xs transition-all"
          >
            লেনদেন হিস্ট্রি দেখুন
          </button>
        </div>

      </div>

      {/* Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • অফিসিয়াল ডিজিটাল ভাউচার
      </div>

    </div>
  );
};
