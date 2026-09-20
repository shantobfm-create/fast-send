import React, { useState } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const AddMoneyCardPage = ({ onNavigate }) => {
  const { submitAddMoney, showToast, loading } = useApp();

  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const quickPills = [1000, 5000, 10000, 20000];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast("দয়া করে সঠিক টাকার পরিমাণ দিন।", "error");
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 16) {
      showToast("দয়া করে ১৬ ডিজিটের সঠিক কার্ড নম্বর দিন।", "error");
      return;
    }

    const autoTrx = "CARD" + Math.floor(100000 + Math.random() * 900000);

    const res = await submitAddMoney({
      methodId: 'card',
      amount: Number(amount),
      adminNumber: 'VISA/MasterCard Gateway',
      trxId: autoTrx,
      note: `কার্ড নম্বর: **** **** **** ${cardNumber.slice(-4)}`
    });

    if (res.success) {
      confetti({ particleCount: 90, spread: 60 });
      onNavigate('receipt', { txData: res.transaction });
    }
  };

  const handleCardFormat = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 16);
    const parts = clean.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : clean);
  };

  const handleExpiryFormat = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      setExpiry(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setExpiry(clean);
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* Standard Header */}
      <StandardHeader 
        title="কার্ড অ্যাড-মানি" 
        onBack={() => onNavigate('add-money')} 
      />

      {/* Main Content Area */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        
        {/* Visual Card Banner */}
        <div className="bg-gradient-to-tr from-slate-900 via-sky-950 to-slate-900 text-white rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-5 h-5 text-sky-400" />
              <span className="text-[11px] font-bold tracking-wider text-slate-300">ডেবিট / ক্রেডিট কার্ড</span>
            </div>
            <div className="flex gap-1 font-bold text-[10px]">
              <span className="bg-blue-600 px-1.5 py-0.2 rounded">VISA</span>
              <span className="bg-red-600 px-1.5 py-0.2 rounded">Mastercard</span>
            </div>
          </div>

          <div className="font-mono text-sm tracking-widest font-black text-slate-200 mb-3">
            {cardNumber || "•••• •••• •••• ••••"}
          </div>

          <div className="flex justify-between items-end text-[11px] text-slate-300">
            <div>
              <p className="text-[9px] text-slate-400 uppercase">কার্ড হোল্ডার</p>
              <p className="font-bold text-white text-xs">{cardHolder || "YOUR NAME"}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 uppercase">মেয়াদ</p>
              <p className="font-mono font-bold text-white text-xs">{expiry || "MM/YY"}</p>
            </div>
          </div>
        </div>

        {/* Form Area */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2.5">
          
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
              জমা করার পরিমাণ (৳)
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="টাকার পরিমাণ লিখুন"
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#00823B] rounded-lg p-2 text-base font-mono font-black text-slate-900 focus:bg-white focus:outline-none"
            />
            {/* Quick Pills */}
            <div className="grid grid-cols-4 gap-1 mt-1.5">
              {quickPills.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(String(p))}
                  className="tap-effect bg-slate-100 hover:bg-emerald-50 hover:text-[#00823B] hover:border-[#00823B] border border-slate-200 rounded-lg py-1 text-[11px] font-bold font-mono transition-all text-slate-800"
                >
                  ৳{p.toLocaleString('bn-BD')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
              কার্ড নম্বর (১৬ ডিজিট)
            </label>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => handleCardFormat(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#00823B] rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
              কার্ডে থাকা নাম
            </label>
            <input
              type="text"
              required
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              placeholder="NAME ON CARD"
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#00823B] rounded-lg p-2 text-xs font-bold uppercase text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                মেয়াদ (MM/YY)
              </label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => handleExpiryFormat(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#00823B] rounded-lg p-2 text-xs font-mono font-bold text-center text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                CVV / CVC
              </label>
              <input
                type="password"
                required
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••"
                maxLength={4}
                className="w-full bg-slate-50 border border-slate-300 focus:border-[#00823B] rounded-lg p-2 text-xs font-mono font-bold text-center text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-0.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>256-bit SSL এনক্রিপশনের মাধ্যমে তথ্য সম্পূর্ণ সুরক্ষিত</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3 rounded-xl text-sm shadow-xs transition-all text-center mt-1"
          >
            {loading ? "প্রসেস হচ্ছে..." : "কার্ড থেকে জমা নিশ্চিত করুন 💳"}
          </button>
        </form>

      </div>

      {/* Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • সিকিউরড কার্ড গেটওয়ে
      </div>

    </div>
  );
};
