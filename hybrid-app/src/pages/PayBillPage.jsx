import React, { useState } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { Zap } from 'lucide-react';

export const PayBillPage = ({ onNavigate }) => {
  const { user, submitPayBill, showToast, loading } = useApp();
  const [billerId, setBillerId] = useState('');
  const [amount, setAmount] = useState('');

  const quickAmounts = [500, 1000, 2500, 5000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!billerId || !amount) {
      showToast("ইউজার আইডি ও এমাউন্ট লিখুন", "error");
      return;
    }

    const numAmount = Number(amount);
    if ((user?.balance || 0) < numAmount) {
      showToast(`অপর্যাপ্ত ব্যালেন্স! আপনার ব্যালেন্স: ৳${user?.balance || 0}`, "error");
      return;
    }

    const res = await submitPayBill({
      billerId,
      amount: numAmount,
      billerType: 'ইউটিলিটি বিল',
      pin: user?.pin
    });

    if (res.success) {
      confetti({ particleCount: 70, spread: 60 });
      onNavigate('receipt', { txData: res.transaction });
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* Standard Header */}
      <StandardHeader 
        title="পে-বিল সার্ভিস" 
        onBack={() => onNavigate('home')} 
      />

      {/* Main Content */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        
        {/* Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#00823B] flex items-center justify-center font-bold shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-950">ইউটিলিটি ও সার্ভিস বিল</h4>
            <p className="text-[10px] text-emerald-800">বিদ্যুৎ, গ্যাস, পানি, ইন্টারনেট ও ডিশ বিল পরিশোধ</p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3.5">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              গ্রাহক হিসাব / মিটার / অ্যাকাউন্ট নম্বর
            </label>
            <input
              type="text"
              required
              value={billerId}
              onChange={(e) => setBillerId(e.target.value)}
              placeholder="যেমন: 1048293751"
              className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#00823B] rounded-xl py-3 px-3.5 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বিলের পরিমাণ (৳)
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="টাকার পরিমাণ লিখুন"
              className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#00823B] rounded-xl py-3 px-3.5 text-base font-mono font-black text-slate-900 focus:bg-white focus:outline-none"
            />

            {/* Quick Pills */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className="tap-effect bg-slate-100 hover:bg-emerald-50 hover:text-[#00823B] hover:border-[#00823B] border border-slate-200 rounded-xl py-1.5 text-xs font-bold font-mono transition-all text-slate-800 cursor-pointer"
                >
                  ৳{amt.toLocaleString('bn-BD')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-xs py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
            <span className="font-semibold">উপলব্ধ ব্যালেন্স:</span>
            <span className="font-mono font-black text-[#00823B] text-sm">৳{Number(user?.balance || 0).toLocaleString('bn-BD')}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-xl text-base shadow-md transition-all text-center mt-2 cursor-pointer"
          >
            {loading ? "বিল পরিশোধ হচ্ছে..." : "বিল পরিশোধ নিশ্চিত করুন 🧾"}
          </button>
        </form>

      </div>

      {/* Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • শতভাগ সিকিউরড বিল পেমেন্ট গেটওয়ে
      </div>

    </div>
  );
};
