import React, { useState } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { Globe, Building2, Smartphone, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const RemittancePage = ({ onNavigate }) => {
  const { user, submitTransfer, showToast, loading } = useApp();

  // Selected Channel: 'bkash' | 'nagad' | 'rocket' | 'bank'
  const [selectedChannel, setSelectedChannel] = useState('bkash');

  // Mobile Wallet State
  const [phoneNumber, setPhoneNumber] = useState('');

  // Bank State
  const [selectedBank, setSelectedBank] = useState('ইসলামী ব্যাংক বাংলাদেশ');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankBranch, setBankBranch] = useState('');

  // Common State
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');

  const quickAmounts = [5000, 15000, 30000, 50000];
  const currentBalance = user?.balance || 0;

  const walletOptions = [
    {
      id: 'bkash',
      name: 'বিকাশ',
      shortName: 'bKash',
      color: '#E2136E',
      activeBorder: 'border-[#E2136E]',
      activeBg: 'bg-pink-50 text-[#E2136E]'
    },
    {
      id: 'nagad',
      name: 'নগদ',
      shortName: 'Nagad',
      color: '#E23528',
      activeBorder: 'border-[#E23528]',
      activeBg: 'bg-rose-50 text-[#E23528]'
    },
    {
      id: 'rocket',
      name: 'রকেট',
      shortName: 'Rocket',
      color: '#8C3494',
      activeBorder: 'border-[#8C3494]',
      activeBg: 'bg-purple-50 text-[#8C3494]'
    },
    {
      id: 'bank',
      name: 'ব্যাংক',
      shortName: 'Bank',
      color: '#00823B',
      activeBorder: 'border-[#00823B]',
      activeBg: 'bg-emerald-50 text-[#00823B]'
    }
  ];

  const bdBanksList = [
    "ইসলামী ব্যাংক বাংলাদেশ",
    "ব্র্যাক ব্যাংক",
    "ডাচ্-বাংলা ব্যাংক",
    "সিটি ব্যাংক",
    "সোনালী ব্যাংক",
    "ইস্টার্ন ব্যাংক",
    "পূবালী ব্যাংক",
    "মিউচুয়াল ট্রাস্ট ব্যাংক"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      showToast("দয়া করে সঠিক টাকার পরিমাণ দিন।", "error");
      return;
    }

    if (selectedChannel === 'bank') {
      if (!accountHolder.trim()) {
        showToast("দয়া করে অ্যাকাউন্টধারীর নাম দিন।", "error");
        return;
      }
      if (!accountNumber.trim()) {
        showToast("দয়া করে ব্যাংক অ্যাকাউন্ট নম্বর দিন।", "error");
        return;
      }
    } else {
      if (!phoneNumber || phoneNumber.length < 11) {
        showToast("দয়া করে সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।", "error");
        return;
      }
    }

    if (currentBalance < numAmount) {
      showToast(`আপনার ব্যালেন্স অপর্যাপ্ত! বর্তমান ব্যালেন্স: ৳${currentBalance}`, "error");
      return;
    }

    if (!pin) {
      showToast("দয়া করে আপনার ৪-সংখ্যার সিকিউরিটি পিন দিন।", "error");
      return;
    }

    let transferData = {};
    if (selectedChannel === 'bank') {
      transferData = {
        receiverPhone: accountNumber,
        receiverName: `${accountHolder} (${selectedBank})`,
        amount: numAmount,
        pin: pin,
        method: `রেমিটেন্স ডিপোজিট: ${selectedBank}`,
        branch: bankBranch || 'প্রধান শাখা'
      };
    } else {
      const channelObj = walletOptions.find(w => w.id === selectedChannel);
      transferData = {
        receiverPhone: phoneNumber,
        receiverName: `${channelObj?.name || 'ওয়ালেট'} গ্রাহক`,
        amount: numAmount,
        pin: pin,
        method: `প্রবাসী রেমিটেন্স (${channelObj?.name})`
      };
    }

    const res = await submitTransfer(transferData);

    if (res.success) {
      confetti({ particleCount: 90, spread: 60 });
      onNavigate('receipt', { txData: res.transaction });
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* Standard Header */}
      <StandardHeader 
        title="প্রবাসী রেমিটেন্স" 
        onBack={() => onNavigate('home')} 
      />

      {/* Main Content */}
      <div className="p-3 flex-1 space-y-3 pb-20">
        
        {/* Channel Selection Header */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block px-1">
            টাকা পাঠানোর মাধ্যম বেছে নিন:
          </label>
          
          <div className="grid grid-cols-4 gap-1.5">
            {walletOptions.map((opt) => {
              const isSelected = selectedChannel === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedChannel(opt.id)}
                  className={`tap-effect py-2.5 px-1 rounded-xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? `${opt.activeBorder} ${opt.activeBg} shadow-xs`
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {opt.id === 'bank' ? (
                    <Building2 className="w-4 h-4" />
                  ) : (
                    <Smartphone className="w-4 h-4" />
                  )}
                  <span>{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Remittance Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3.5">
          
          {selectedChannel === 'bank' ? (
            /* Bank Fields */
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ব্যাংক নির্বাচন করুন
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#00823B] rounded-xl py-3 px-3.5 text-sm font-bold text-slate-900 focus:bg-white focus:outline-none cursor-pointer"
                >
                  {bdBanksList.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  অ্যাকাউন্টধারীর নাম
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

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  ব্যাংক অ্যাকাউন্ট নম্বর
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
            </div>
          ) : (
            /* Mobile Wallet Fields (bKash / Nagad / Rocket) */
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                প্রাপকের {walletOptions.find(w => w.id === selectedChannel)?.name} মোবাইল নম্বর
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full bg-slate-50 border-2 border-slate-300 focus:border-[#00823B] rounded-xl py-3 px-3.5 text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              রেমিটেন্সের পরিমাণ (৳)
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
            <span className="font-semibold">বর্তমান ব্যালেন্স:</span>
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
            {loading ? "পাঠানো হচ্ছে..." : "রেমিটেন্স পাঠিয়ে রিসিট নিন ➔"}
          </button>
        </form>

      </div>

      {/* Standard Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • শতভাগ বৈধ ও লাইসেন্সপ্রাপ্ত গ্লোবাল রেমিটেন্স গেটওয়ে
      </div>

    </div>
  );
};
