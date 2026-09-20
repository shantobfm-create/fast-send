import React, { useState, useRef } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { Building2, Lock, ShieldCheck, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const BankTransferPage = ({ onNavigate }) => {
  const { user, submitTransfer, showToast, loading } = useApp();

  // Selected Bank ID
  const [selectedBankId, setSelectedBankId] = useState('ibbl');

  // Form Fields
  const [bankBranch, setBankBranch] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');

  // Mouse Drag to Scroll State for Bank Slider
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // 8 Major Bangladeshi Banks with crisp SVG branding
  const bdBanks = [
    {
      id: 'ibbl',
      name: 'Islami Bank Bangladesh PLC',
      banglaName: 'ইসলামী ব্যাংক বাংলাদেশ',
      shortName: 'IBBL',
      color: '#00823B',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-600',
      logo: (
        <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
          IBBL
        </div>
      )
    },
    {
      id: 'brac',
      name: 'BRAC Bank PLC',
      banglaName: 'ব্র্যাক ব্যাংক',
      shortName: 'BRAC',
      color: '#004A99',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-700',
      logo: (
        <div className="w-10 h-10 rounded-xl bg-[#004A99] text-white flex items-center justify-center font-black text-xs shadow-xs">
          BRAC
        </div>
      )
    },
    {
      id: 'dbbl',
      name: 'Dutch-Bangla Bank PLC',
      banglaName: 'ডাচ্-বাংলা ব্যাংক',
      shortName: 'DBBL',
      color: '#8C1D40',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-700',
      logo: (
        <div className="w-10 h-10 rounded-xl bg-[#8C1D40] text-white flex items-center justify-center font-black text-xs shadow-xs">
          DBBL
        </div>
      )
    },
    {
      id: 'city',
      name: 'City Bank PLC',
      banglaName: 'সিটি ব্যাংক',
      shortName: 'CITY',
      color: '#D8232A',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-600',
      logo: (
        <div className="w-10 h-10 rounded-xl bg-[#D8232A] text-white flex items-center justify-center font-black text-xs shadow-xs">
          CITY
        </div>
      )
    },
    {
      id: 'sonali',
      name: 'Sonali Bank PLC',
      banglaName: 'সোনালী ব্যাংক',
      shortName: 'SONALI',
      color: '#F58220',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-600',
      logo: (
        <div className="w-10 h-10 rounded-xl bg-[#F58220] text-white flex items-center justify-center font-black text-xs shadow-xs">
          সোনালী
        </div>
      )
    },
    {
      id: 'ebl',
      name: 'Eastern Bank PLC',
      banglaName: 'ইস্টার্ন ব্যাংক',
      shortName: 'EBL',
      color: '#1B365D',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-700',
      logo: (
        <div className="w-10 h-10 rounded-xl bg-[#1B365D] text-white flex items-center justify-center font-black text-xs shadow-xs">
          EBL
        </div>
      )
    },
    {
      id: 'pubali',
      name: 'Pubali Bank PLC',
      banglaName: 'পূবালী ব্যাংক',
      shortName: 'PUBALI',
      color: '#007A3D',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-700',
      logo: (
        <div className="w-10 h-10 rounded-xl bg-[#007A3D] text-white flex items-center justify-center font-black text-xs shadow-xs">
          পূবালী
        </div>
      )
    },
    {
      id: 'mtb',
      name: 'Mutual Trust Bank PLC',
      banglaName: 'মিউচুয়াল ট্রাস্ট ব্যাংক',
      shortName: 'MTB',
      color: '#782F40',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-700',
      logo: (
        <div className="w-10 h-10 rounded-xl bg-[#782F40] text-white flex items-center justify-center font-black text-xs shadow-xs">
          MTB
        </div>
      )
    }
  ];

  const currentBank = bdBanks.find(b => b.id === selectedBankId) || bdBanks[0];
  const quickAmounts = [1000, 5000, 15000, 25000];
  const currentBalance = user?.balance || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!accountHolder.trim()) {
      showToast("দয়া করে ব্যাংক অ্যাকাউন্টধারীর নাম দিন।", "error");
      return;
    }
    if (!accountNumber.trim()) {
      showToast("দয়া করে ব্যাংক অ্যাকাউন্ট নম্বর দিন।", "error");
      return;
    }
    if (!numAmount || numAmount <= 0) {
      showToast("দয়া করে টাকার সঠিক পরিমাণ দিন।", "error");
      return;
    }
    if (currentBalance < numAmount) {
      showToast(`আপনার ব্যালেন্স অপর্যাপ্ত! বর্তমান ব্যালেন্স: ৳${currentBalance}`, "error");
      return;
    }
    if (!pin) {
      showToast("দয়া করে আপনার ৪-সংখ্যার সিকিউরিটি পিন দিন।", "error");
      return;
    }

    const res = await submitTransfer({
      receiverPhone: accountNumber,
      receiverName: `${accountHolder} (${currentBank.banglaName})`,
      amount: numAmount,
      pin: pin,
      method: `ব্যাংক ট্রান্সফার: ${currentBank.name}`,
      branch: bankBranch || 'প্রধান শাখা'
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
        title="ব্যাংক ট্রান্সফার" 
        onBack={() => onNavigate('home')} 
      />

      {/* Main Content Area */}
      <div className="p-3 flex-1 space-y-3 pb-20">
        
        {/* Section Title */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-800">
            ব্যাংক নির্বাচন করুন (হাত দিয়ে টেনে দেখুন)
          </span>
          <span className="text-[10px] text-slate-500 font-bold">
            ৮টি ব্যাংক সক্রিয়
          </span>
        </div>

        {/* 1. Touch & Mouse Draggable Bank Cards Slider */}
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none cursor-grab active:cursor-grabbing select-none"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {bdBanks.map((bank) => {
            const isSelected = selectedBankId === bank.id;
            return (
              <div
                key={bank.id}
                onClick={() => setSelectedBankId(bank.id)}
                className={`tap-effect min-w-[125px] max-w-[125px] p-2.5 rounded-xl border-2 transition-all flex flex-col items-center text-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#00823B] bg-white shadow-sm ring-1 ring-[#00823B]'
                    : 'border-slate-200 bg-white/90 hover:border-slate-300'
                }`}
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="mb-1.5 relative">
                  {bank.logo}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-[#00823B] text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-[#00823B]' : 'text-slate-900'}`}>
                    {bank.banglaName}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-500 font-bold mt-0.5">
                    {bank.shortName}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Selected Bank Active Banner */}
        <div className="bg-white rounded-xl p-3 border border-[#00823B] shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {currentBank.logo}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-slate-900">
                  {currentBank.banglaName}
                </h3>
                <span className="text-[9px] bg-emerald-50 text-[#00823B] font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                  সিলেক্টেড
                </span>
              </div>
              <p className="text-[10px] text-slate-500">{currentBank.name}</p>
            </div>
          </div>
          <Building2 className="w-5 h-5 text-[#00823B] opacity-70" />
        </div>

        {/* 3. Direct Input Form (Zero Modals) */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3.5">
          
          {/* Account Holder Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              অ্যাকাউন্টধারীর নাম (Account Holder Name)
            </label>
            <input
              type="text"
              required
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="যেমন: MD RAHIM UDDIN"
              className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#00823B] rounded-xl py-3 px-3.5 text-sm font-bold uppercase text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Account Number */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              ব্যাংক অ্যাকাউন্ট নম্বর (Account Number)
            </label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="যেমন: 2050345678901234"
              className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#00823B] rounded-xl py-3 px-3.5 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Branch & Routing */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                শাখা / ব্রাঞ্চ (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={bankBranch}
                onChange={(e) => setBankBranch(e.target.value)}
                placeholder="যেমন: গুলশান শাখা"
                className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#00823B] rounded-xl py-2.5 px-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                রাউটিং নম্বর (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                placeholder="যেমন: 125272458"
                className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#00823B] rounded-xl py-2.5 px-3 text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              টাকার পরিমাণ (৳)
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

          {/* Balance Reminder */}
          <div className="flex justify-between items-center text-xs py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
            <span className="font-semibold">বর্তমান উপলব্ধ ব্যালেন্স:</span>
            <span className="font-mono font-black text-[#00823B] text-sm">৳{currentBalance.toLocaleString('bn-BD')}</span>
          </div>

          {/* 6-Digit PIN */}
          <div className="pt-1">
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#00823B]" />
              <span>আপনার ৬-সংখ্যার সিকিউরিটি পিন দিন</span>
            </label>
            <input
              type="password"
              maxLength={6}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#00823B] rounded-xl py-3 px-4 text-center text-lg font-mono tracking-widest font-black text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-xl text-base shadow-md transition-all text-center mt-2 cursor-pointer"
          >
            {loading ? "ট্রান্সফার প্রসেস হচ্ছে..." : "ব্যাংক ট্রান্সফার সম্পন্ন করুন ➔"}
          </button>
        </form>

      </div>

      {/* Standard Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • শতভাগ নিরাপদ ও সুরক্ষিত বাংলাদেশ ব্যাংক সার্টিফাইড নেটওয়ার্ক
      </div>

    </div>
  );
};
