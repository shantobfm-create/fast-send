import React, { useState } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { MapPin, Building, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const AddMoneyCashPage = ({ onNavigate }) => {
  const { submitAddMoney, showToast, loading } = useApp();

  const [amount, setAmount] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('agent-1');
  const [depositorPhone, setDepositorPhone] = useState('');

  const agents = [
    {
      id: 'agent-1',
      name: 'মতিঝিল সেন্ট্রাল ক্যাশ পয়েন্ট',
      agentCode: 'AG-8821',
      address: '১২/এ মতিঝিল বা/এ, ঢাকা-১০০০',
      phone: '01754150019',
      hours: 'সকাল ৯:০০ - রাত ৯:০০'
    },
    {
      id: 'agent-2',
      name: 'মিরপুর ১০ কাঁচাবাজার পয়েন্ট',
      agentCode: 'AG-9402',
      address: 'প্লট ৪, সেকশন ১০, মিরপুর, ঢাকা',
      phone: '01812345678',
      hours: 'সকাল ৮:০০ - রাত ১০:০০'
    },
    {
      id: 'agent-3',
      name: 'চট্টগ্রাম জিইসি মোড় পয়েন্ট',
      agentCode: 'AG-7110',
      address: 'সিডিএ এভিনিউ, জিইসি মোড়, চট্টগ্রাম',
      phone: '01912345678',
      hours: 'সকাল ৯:০০ - রাত ৮:০০'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showToast("দয়া করে সঠিক টাকার পরিমাণ দিন।", "error");
      return;
    }

    const agent = agents.find(a => a.id === selectedAgent) || agents[0];
    const autoTrx = "CSH" + Math.floor(100000 + Math.random() * 900000);

    const res = await submitAddMoney({
      methodId: 'cash',
      amount: Number(amount),
      adminNumber: `${agent.name} (${agent.agentCode})`,
      trxId: autoTrx,
      note: `ক্যাশ কাউন্টার ডিপোজিট • ফোন: ${depositorPhone || 'নগদ জমা'}`
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
        title="ক্যাশ-পিকআপ পয়েন্ট" 
        onBack={() => onNavigate('add-money')} 
      />

      {/* Main Content Area */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        
        {/* Info Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center gap-2.5 shadow-2xs">
          <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800 shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-950">কাউন্টার থেকে নগদ জমা</h4>
            <p className="text-[10px] text-amber-800 leading-tight">
              অনুমোদিত এজেন্ট পয়েন্টে গিয়ে সরাসরি নগদ টাকা জমা দিয়ে ব্যালেন্স যোগ করুন
            </p>
          </div>
        </div>

        {/* Select Agent Point */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-slate-700 px-1">
            নিকটস্থ পয়েন্ট বেছে নিন:
          </label>
          <div className="space-y-1.5">
            {agents.map((ag) => {
              const isSelected = selectedAgent === ag.id;
              return (
                <div
                  key={ag.id}
                  onClick={() => setSelectedAgent(ag.id)}
                  className={`tap-effect bg-white rounded-xl p-2.5 border transition-all cursor-pointer ${
                    isSelected ? 'border-[#00823B] bg-emerald-50/20 shadow-2xs' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{ag.name}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono font-bold">
                        {ag.agentCode}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#00823B]" />}
                  </div>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{ag.address}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deposit Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2.5">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
              নগদ জমা দেওয়া টাকার পরিমাণ (৳)
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="যেমন: ১০০০"
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#00823B] rounded-lg p-2 text-base font-mono font-black text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
              আপনার মোবাইল নম্বর (টোকেন পাঠানোর জন্য)
            </label>
            <input
              type="tel"
              required
              value={depositorPhone}
              onChange={(e) => setDepositorPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#00823B] rounded-lg p-2 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3 rounded-xl text-sm shadow-xs transition-all text-center mt-1"
          >
            {loading ? "প্রসেস হচ্ছে..." : "ক্যাশ ডিপোজিট কনফার্ম করুন 💵"}
          </button>
        </form>

      </div>

      {/* Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • এজেন্ট ক্যাশ ডিপোজিট
      </div>

    </div>
  );
};
