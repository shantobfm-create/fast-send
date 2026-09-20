import React, { useState } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { HandCoins, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoanPage = ({ onNavigate }) => {
  const { showToast } = useApp();
  const [loanAmount, setLoanAmount] = useState('20000');
  const [duration, setDuration] = useState('3 মাস');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("লোন আবেদন সফলভাবে গ্রহণ করা হয়েছে। প্রতিনিধি যোগাযোগ করবেন।", "success");
  };

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* Standard Header */}
      <StandardHeader 
        title="সহজ কিস্তিতে লোন" 
        onBack={() => onNavigate('home')} 
      />

      {/* Main Content */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        {submitted ? (
          <div className="bg-white rounded-xl p-5 text-center space-y-2.5 shadow-2xs border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-[#00823B] mx-auto" />
            <h3 className="font-bold text-sm text-slate-900">আবেদন সফল হয়েছে</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              আপনার ৳{Number(loanAmount).toLocaleString('bn-BD')} টাকার লোন আবেদন গ্রহণ করা হয়েছে। খুব শীঘ্রই আমাদের প্রতিনিধি আপনার দেওয়া নম্বরে যোগাযোগ করবেন।
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="tap-effect bg-[#00823B] hover:bg-[#006837] text-white font-bold py-2 px-5 rounded-lg text-xs shadow-2xs transition-all"
            >
              হোম স্ক্রিনে ফিরে যান
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl p-3 shadow-2xs border border-slate-200 space-y-2.5">
            <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
              <HandCoins className="w-4 h-4 text-[#00823B]" />
              <h3 className="font-bold text-xs text-slate-900 uppercase">জরুরি ক্ষুদ্র লোন সেবা</h3>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">লোনের পরিমাণ (৳)</label>
              <input
                type="number"
                required
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="যেমন: ২০০০০"
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#00823B] rounded-lg p-2 text-base font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-0.5">পরিশোধের মেয়াদ</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#00823B] rounded-lg p-2 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none"
              >
                <option value="3 মাস">৩ মাস (সহজ কিস্তি)</option>
                <option value="6 মাস">৬ মাস (স্বল্প মুনাফা)</option>
                <option value="12 মাস">১২ মাস (বিশেষ কিস্তি)</option>
              </select>
            </div>

            <button
              type="submit"
              className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3 rounded-xl text-sm shadow-xs transition-all text-center mt-1"
            >
              লোন আবেদন সাবমিট করুন 🤝
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • সহজ ও ঝামেলাহীন লোন পলিসি
      </div>

    </div>
  );
};
