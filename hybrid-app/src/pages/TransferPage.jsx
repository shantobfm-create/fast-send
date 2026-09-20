import React, { useState } from 'react';
import { ArrowLeft, Building2, Smartphone, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const TransferPage = ({ onNavigate, selectedWallet = 'bkash' }) => {
  const { user, submitTransfer, showToast, loading } = useApp();

  // Mobile Banking State
  const [currentWalletId, setCurrentWalletId] = useState(selectedWallet || 'bkash');
  const [actionType, setActionType] = useState('send_money'); // 'send_money' | 'cash_out'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');

  // Quick Amounts
  const quickAmounts = [500, 5000, 10000, 25000];

  // Mobile Wallets config
  const walletConfigs = {
    bkash: {
      name: 'Bkash',
      banglaName: 'বিকাশ',
      color: '#E2136E',
      logo: (
        <div className="w-10 h-10 rounded-full bg-[#E2136E] flex items-center justify-center p-1.5 shadow-2xs shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="20,30 65,35 55,70" fill="#FFFFFF" />
            <polygon points="65,35 95,45 68,85" fill="#FFE4E6" />
            <polygon points="55,70 68,85 65,35" fill="#FFFFFF" />
            <polygon points="68,85 95,45 88,75" fill="#FCE7F3" />
            <polygon points="95,45 105,52 92,60" fill="#FFFFFF" />
            <polygon points="55,70 68,85 45,95" fill="#FFFFFF" />
          </svg>
        </div>
      )
    },
    nagad: {
      name: 'Nagad',
      banglaName: 'নগদ',
      color: '#E23528',
      logo: (
        <div className="w-10 h-10 rounded-full bg-[#E23528] flex items-center justify-center p-1.5 shadow-2xs shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="44" fill="#E23528" />
            <path d="M50 25 C65 25 75 35 75 50 C75 65 65 75 50 75 C35 75 25 65 25 50 C25 38 34 30 44 30 C52 30 60 36 60 44 C60 52 52 58 46 58 C41 58 38 52 38 48" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            <circle cx="48" cy="48" r="5" fill="#FFFFFF" />
          </svg>
        </div>
      )
    },
    rocket: {
      name: 'Rocket',
      banglaName: 'রকেট',
      color: '#8C3494',
      logo: (
        <div className="w-10 h-10 rounded-full bg-[#8C3494] flex items-center justify-center p-1.5 shadow-2xs shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M22 65 L60 20 L90 45 L62 82 Z" fill="#FFFFFF" />
            <path d="M60 20 L85 58 L62 82 Z" fill="#E1BEE7" />
            <polygon points="60,20 90,45 85,58" fill="#FFFFFF" />
            <polygon points="22,65 62,82 45,88" fill="#FFFFFF" />
          </svg>
        </div>
      )
    },
    upay: {
      name: 'Upay',
      banglaName: 'উপায়',
      color: '#0055A5',
      logo: (
        <div className="w-10 h-10 rounded-full bg-[#0055A5] flex items-center justify-center p-1.5 shadow-2xs shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="35" cy="35" r="9" fill="#FFFFFF" />
            <circle cx="65" cy="35" r="9" fill="#78BE20" />
            <path d="M26 55 C35 72 65 72 74 55" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      )
    }
  };

  const currentWallet = walletConfigs[currentWalletId] || walletConfigs.bkash;
  const currentBalance = user?.balance || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 11) {
      showToast("দয়া করে সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।", "error");
      return;
    }
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      showToast("দয়া করে টাকার সঠিক পরিমাণ দিন।", "error");
      return;
    }
    if (numAmount < 500) {
      showToast("সর্বনিম্ন ট্রান্সফার লিমিট ৳৫০০/= টাকা!", "error");
      return;
    }
    if (numAmount > 30000) {
      showToast("মোবাইল ওয়ালেটে প্রতি লেনদেনে সর্বোচ্চ লিমিট ৳৩০,০০০/= টাকা!", "error");
      return;
    }
    if (currentBalance < numAmount) {
      showToast(`আপনার ব্যালেন্স অপর্যাপ্ত! বর্তমান ব্যালেন্স: ৳${currentBalance}`, "error");
      return;
    }
    if (!pin || pin.length < 6) {
      showToast("দয়া করে আপনার ৬-সংখ্যার সিকিউরিটি পিন দিন।", "error");
      return;
    }

    const res = await submitTransfer({
      receiverPhone: phoneNumber,
      receiverName: currentWallet.banglaName + ' গ্রাহক',
      amount: numAmount,
      pin: pin,
      method: `${currentWallet.banglaName} (${actionType === 'send_money' ? 'সেন্ড মানি' : 'ক্যাশ আউট'})`
    });

    if (res.success) {
      confetti({ particleCount: 90, spread: 60 });
      onNavigate('receipt', { txData: res.transaction });
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* 1. Standard Header */}
      <div className="bg-[#00823B] text-white px-4 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-20">
        <button 
          onClick={() => onNavigate('home')} 
          className="p-1 hover:bg-[#006837] rounded-full transition-colors text-white"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-base font-bold text-white tracking-wide">
          মোবাইল ব্যাংকিং ট্রান্সফার
        </h1>
        <div className="w-5" />
      </div>

      {/* 2. Main Form Content */}
      <div className="p-4 flex-1 space-y-4 pb-24">
        
        {/* Wallet Selection Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Object.keys(walletConfigs).map((key) => {
            const conf = walletConfigs[key];
            const isSelected = currentWalletId === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCurrentWalletId(key)}
                className={`tap-effect px-4 py-2 rounded-full text-xs font-bold border-2 transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'border-[#00823B] bg-white text-[#00823B] shadow-sm'
                    : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                <span>{conf.banglaName}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Wallet Banner */}
        <div className="bg-white border-2 border-[#00823B] rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
          {currentWallet.logo}
          <div className="flex-1">
            <h2 className="text-sm font-bold text-[#00823B] leading-tight">
              {currentWallet.banglaName} ওয়ালেট
            </h2>
            <p className="text-xs text-slate-500">
              সর্বনিম্ন ৳৫০০ থেকে সর্বোচ্চ ৳৩০,০০০ পর্যন্ত ইনস্ট্যান্ট ট্রান্সফার
            </p>
          </div>
        </div>

        {/* Send Money vs Cash Out Toggle */}
        <div className="flex bg-slate-200/80 rounded-xl p-1 border border-slate-300">
          <button
            type="button"
            onClick={() => setActionType('send_money')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center ${
              actionType === 'send_money'
                ? 'bg-[#00823B] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            সেন্ড মানি (ব্যক্তিগত)
          </button>
          <button
            type="button"
            onClick={() => setActionType('cash_out')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all text-center ${
              actionType === 'cash_out'
                ? 'bg-[#00823B] text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            ক্যাশ আউট (এজেন্ট)
          </button>
        </div>

        {/* Transfer Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
          
          {/* Mobile Recipient Phone Number */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              প্রাপকের {currentWallet.banglaName} মোবাইল নম্বর
            </label>
            <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-[#00823B]">
              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-transparent py-3 pl-10 pr-4 text-sm font-mono font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                টাকার পরিমাণ (৳)
              </label>
              <span className="text-[11px] text-slate-500 font-medium">লিমিট: ৳৫০০ - ৳৩০,০০০</span>
            </div>
            <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-[#00823B]">
              <input
                type="number"
                min="500"
                max="30000"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="টাকার পরিমাণ লিখুন (যেমন: ৫০০০)"
                className="w-full bg-transparent py-3 px-4 text-base font-mono font-black text-slate-900 focus:outline-none"
              />
            </div>

            {/* Quick Amount Pills */}
            <div className="grid grid-cols-4 gap-1.5 mt-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(String(q))}
                  className="tap-effect bg-slate-100 hover:bg-emerald-50 hover:text-[#00823B] hover:border-[#00823B] border border-slate-200 rounded-xl py-1.5 text-xs font-bold font-mono transition-all text-slate-800"
                >
                  ৳{q.toLocaleString('bn-BD')}
                </button>
              ))}
            </div>
          </div>

          {/* Balance Reminder */}
          <div className="flex justify-between items-center text-xs py-2 px-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
            <span className="font-semibold">বর্তমান ব্যালেন্স:</span>
            <span className="font-mono font-black text-[#00823B] text-sm">৳{currentBalance.toLocaleString('bn-BD')}</span>
          </div>

          {/* Direct PIN Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#00823B]" />
              <span>আপনার ৬-সংখ্যার সিকিউরিটি পিন দিন</span>
            </label>
            <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-[#00823B]">
              <input
                type="password"
                maxLength={6}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="w-full bg-transparent py-3 px-4 text-center text-lg font-mono tracking-widest font-black text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-xl text-base shadow-md transition-all text-center mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "প্রসেস হচ্ছে..." : "টাকা পাঠানো নিশ্চিত করুন ➔"}
          </button>
        </form>

      </div>
    </div>
  );
};
