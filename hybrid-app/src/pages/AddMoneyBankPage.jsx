import React, { useState } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { Copy, Check, Building2, ShieldCheck, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const AddMoneyBankPage = ({ onNavigate }) => {
  const { submitAddMoney, showToast, loading } = useApp();

  const [amount, setAmount] = useState('');
  const [trxId, setTrxId] = useState('');
  const [copiedAcc, setCopiedAcc] = useState(false);

  const bankDetails = {
    bankName: "Islami Bank Bangladesh PLC",
    banglaName: "ইসলামী ব্যাংক বাংলাদেশ পিএলসি",
    accountName: "Fast Send Global Ltd",
    accountNumber: "2050345678901234",
    branch: "মতিঝিল কর্পোরেট শাখা, ঢাকা",
    routingNumber: "125272458"
  };

  const handleCopyAcc = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber);
    setCopiedAcc(true);
    showToast("অ্যাকাউন্ট নম্বর কপি করা হয়েছে!", "success");
    setTimeout(() => setCopiedAcc(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast("দয়া করে সঠিক টাকার পরিমাণ দিন।", "error");
      return;
    }

    const autoTrx = trxId.trim() || ("BNK" + Math.floor(100000 + Math.random() * 900000));

    const res = await submitAddMoney({
      methodId: 'bank',
      amount: Number(amount),
      adminNumber: bankDetails.accountNumber,
      trxId: autoTrx,
      note: `${bankDetails.banglaName} ডিপোজিট`
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
        title="ব্যাংক ডিপোজিট" 
        onBack={() => onNavigate('add-money')} 
      />

      {/* Main Content Area */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        
        {/* Official Bank Account Details Box */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-700" />
            <div>
              <h3 className="text-xs font-bold text-slate-900">{bankDetails.banglaName}</h3>
              <p className="text-[10px] text-slate-500">{bankDetails.branch}</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">অ্যাকাউন্টের নাম:</span>
              <span className="font-bold text-slate-900">{bankDetails.accountName}</span>
            </div>

            <div className="flex justify-between items-center bg-blue-50 p-2 rounded-lg border border-blue-200">
              <div>
                <span className="text-[10px] text-blue-800 font-bold block">অ্যাকাউন্ট নম্বর:</span>
                <span className="font-mono font-black text-sm text-blue-950">{bankDetails.accountNumber}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyAcc}
                className="bg-blue-700 hover:bg-blue-800 text-white px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
              >
                {copiedAcc ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAcc ? "কপি হয়েছে" : "কপি"}</span>
              </button>
            </div>

            <div className="flex justify-between pt-0.5 text-[11px]">
              <span className="text-slate-500">রাউটিং নম্বর:</span>
              <span className="font-mono font-bold text-slate-800">{bankDetails.routingNumber}</span>
            </div>
          </div>
        </div>

        {/* Deposit Submission Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
              জমা দেওয়া টাকার পরিমাণ (৳)
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="যেমন: ২৫০০০"
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#00823B] rounded-lg p-2 text-base font-mono font-black text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
              ব্যাংক ডিপোজিট স্লিপ / ট্রানজেকশন রেফারেন্স (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="যেমন: IBBL-984712"
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#00823B] rounded-lg p-2 text-xs font-mono font-bold uppercase text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3 rounded-xl text-sm shadow-xs transition-all text-center mt-1"
          >
            {loading ? "সাবমিট হচ্ছে..." : "ব্যাংক ডিপোজিট নিশ্চিত করুন ✅"}
          </button>
        </form>

      </div>

      {/* Security Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • শতভাগ সিকিউরড ব্যাংক ট্রানজেকশন
      </div>

    </div>
  );
};
