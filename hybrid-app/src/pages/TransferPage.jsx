import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Smartphone, 
  Lock, 
  Star, 
  Users, 
  Search, 
  X, 
  Sparkles,
  PartyPopper,
  Cake,
  Heart,
  Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const TransferPage = ({ onNavigate, selectedWallet = 'bkash' }) => {
  const { user, submitTransfer, showToast, loading, recipients } = useApp();

  // 1. Mobile Wallet Selection (বিকাশ, নগদ, রকেট, উপায়)
  const [currentWalletId, setCurrentWalletId] = useState(selectedWallet || 'bkash');

  // 2. Action Type (Send Money vs Cash Out)
  const [actionType, setActionType] = useState('send_money'); // 'send_money' | 'cash_out'

  // 3. Recipient Data
  const [recipientNumber, setRecipientNumber] = useState('01874451225');
  const [recipientName, setRecipientName] = useState('01874451225');
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [customPhoneInput, setCustomPhoneInput] = useState('');

  // 4. Amount & Charges
  const [amount, setAmount] = useState('');
  const [addCashOutCharge, setAddCashOutCharge] = useState(false);
  const [isPriyo, setIsPriyo] = useState(false);

  // 5. Greeting Card
  const [selectedGreetingCard, setSelectedGreetingCard] = useState('send_money');

  // 6. Review & PIN Step
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);

  // Quick Amount Presets
  const quickAmounts = [100, 500, 1000, 2000, 5000];

  // Wallet configurations with specific brand colors
  const walletConfigs = {
    bkash: {
      id: 'bkash',
      name: 'bKash',
      banglaName: 'বিকাশ',
      themeColor: '#E2136E',
      lightBg: '#FDF2F8',
      birdLogo: (
        <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
          <polygon points="20,30 65,35 55,70" />
          <polygon points="65,35 95,45 68,85" />
          <polygon points="55,70 68,85 65,35" />
          <polygon points="68,85 95,45 88,75" />
          <polygon points="95,45 105,52 92,60" />
          <polygon points="55,70 68,85 45,95" />
        </svg>
      )
    },
    nagad: {
      id: 'nagad',
      name: 'Nagad',
      banglaName: 'নগদ',
      themeColor: '#E23528',
      lightBg: '#FEF2F2',
      birdLogo: (
        <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
          <circle cx="50" cy="50" r="44" />
          <circle cx="48" cy="48" r="8" fill="#E23528" />
        </svg>
      )
    },
    rocket: {
      id: 'rocket',
      name: 'Rocket',
      banglaName: 'রকেট',
      themeColor: '#8C3494',
      lightBg: '#FAF5FF',
      birdLogo: (
        <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
          <path d="M22 65 L60 20 L90 45 L62 82 Z" />
          <polygon points="60,20 90,45 85,58" fill="#E1BEE7" />
        </svg>
      )
    },
    upay: {
      id: 'upay',
      name: 'Upay',
      banglaName: 'উপায়',
      themeColor: '#0055A5',
      lightBg: '#EFF6FF',
      birdLogo: (
        <svg viewBox="0 0 100 100" className="w-6 h-6 fill-white">
          <circle cx="35" cy="35" r="14" />
          <circle cx="65" cy="35" r="14" fill="#78BE20" />
          <path d="M26 55 C35 72 65 72 74 55" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" />
        </svg>
      )
    }
  };

  const currentWallet = walletConfigs[currentWalletId] || walletConfigs.bkash;
  const currentBalance = Number(user?.balance || 29.38);

  // Greeting cards list
  const greetingCards = [
    {
      id: 'send_money',
      title: 'Send Money',
      badge: 'Send Money',
      icon: (
        <div className="w-full h-16 bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="flex items-center gap-1">
            {/* Speed Lines */}
            <div className="flex flex-col gap-1">
              <div className="w-3.5 h-0.5 bg-slate-400 rounded-full"></div>
              <div className="w-2.5 h-0.5 bg-slate-400 rounded-full"></div>
              <div className="w-3.5 h-0.5 bg-slate-400 rounded-full"></div>
            </div>
            {/* Circle with Taka */}
            <div className="w-9 h-9 rounded-full border-2 border-slate-400 flex items-center justify-center font-bold text-slate-600 text-lg">
              ৳
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'best_wishes',
      title: 'Best Wishes',
      badge: 'Best Wishes',
      icon: (
        <div className="w-full h-16 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 rounded-xl flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 80 50" className="w-14 h-11">
            {/* Confetti pieces */}
            <circle cx="15" cy="12" r="2.5" fill="#3B82F6" />
            <circle cx="28" cy="8" r="2" fill="#EC4899" />
            <circle cx="65" cy="14" r="2.5" fill="#EAB308" />
            <circle cx="55" cy="22" r="2" fill="#10B981" />
            <rect x="20" y="22" width="3" height="6" rx="1" fill="#8B5CF6" transform="rotate(25 20 22)" />
            <rect x="60" y="8" width="3" height="5" rx="1" fill="#F43F5E" transform="rotate(-30 60 8)" />
            {/* Party Popper Cone */}
            <polygon points="40,16 28,42 52,42" fill="#6366F1" />
            <polygon points="34,28 46,28 40,16" fill="#818CF8" />
            <ellipse cx="40" cy="16" rx="12" ry="4" fill="#C7D2FE" />
            {/* Ribbons */}
            <path d="M40 16 Q45 8 50 12 Q55 16 58 10" stroke="#EC4899" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M36 16 Q30 6 25 10 Q20 14 18 8" stroke="#3B82F6" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      )
    },
    {
      id: 'birthday',
      title: 'Birthday',
      badge: 'Birthday',
      icon: (
        <div className="w-full h-16 bg-gradient-to-br from-teal-200 via-emerald-100 to-cyan-200 rounded-xl flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 80 50" className="w-13 h-11">
            {/* Candle flame */}
            <ellipse cx="40" cy="10" rx="2" ry="3.5" fill="#F59E0B" />
            <circle cx="40" cy="10" r="1" fill="#EF4444" />
            {/* Candle */}
            <rect x="38.5" y="13" width="3" height="7" fill="#60A5FA" rx="1" />
            {/* Cake Top Tier */}
            <rect x="28" y="20" width="24" height="10" rx="3" fill="#F472B6" />
            <path d="M28 23 Q34 25 40 23 Q46 25 52 23" stroke="#FDF2F8" strokeWidth="2" fill="none" />
            {/* Cake Bottom Tier */}
            <rect x="22" y="30" width="36" height="12" rx="3" fill="#FB7185" />
            <path d="M22 34 Q28 36 34 34 Q40 36 46 34 Q52 36 58 34" stroke="#FFF" strokeWidth="2.5" fill="none" />
            {/* Plate */}
            <ellipse cx="40" cy="43" rx="24" ry="3" fill="#94A3B8" />
          </svg>
        </div>
      )
    },
    {
      id: 'wedding',
      title: 'Wedding',
      badge: 'Wedding',
      icon: (
        <div className="w-full h-16 bg-gradient-to-br from-pink-200 via-rose-200 to-amber-100 rounded-xl flex items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 80 50" className="w-13 h-11">
            {/* Shimmer sparkle */}
            <polygon points="40,7 41.5,12 46,13.5 41.5,15 40,20 38.5,15 34,13.5 38.5,12" fill="#FDE047" />
            {/* Ring Diamond */}
            <polygon points="40,14 44,18 40,22 36,18" fill="#38BDF8" />
            {/* Ring Band */}
            <ellipse cx="40" cy="25" rx="10" ry="7" fill="none" stroke="#F59E0B" strokeWidth="3" />
            {/* Velvet Box */}
            <path d="M26 27 L54 27 L50 42 L30 42 Z" fill="#991B1B" />
            <ellipse cx="40" cy="27" rx="14" ry="4" fill="#DC2626" />
            <path d="M26 27 C26 22 54 22 54 27" fill="#7F1D1D" />
          </svg>
        </div>
      )
    }
  ];

  // Calculations
  const numAmount = Number(amount) || 0;
  const cashOutRate = 0.015; // 1.5%
  const chargeAmount = addCashOutCharge ? Math.round(numAmount * cashOutRate * 100) / 100 : 0;
  const totalDeduct = numAmount + chargeAmount;
  const isAmountValid = numAmount > 0 && totalDeduct <= currentBalance;

  // Handle Recipient Selection
  const handleSelectRecipient = (rec) => {
    setRecipientNumber(rec.phone || rec.accountNumber);
    setRecipientName(rec.name || rec.phone || rec.accountNumber);
    setShowRecipientModal(false);
  };

  const handleCustomPhoneConfirm = () => {
    if (!customPhoneInput || customPhoneInput.length < 11) {
      showToast("দয়া করে সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।", "error");
      return;
    }
    setRecipientNumber(customPhoneInput);
    setRecipientName(customPhoneInput);
    setShowRecipientModal(false);
    setCustomPhoneInput('');
  };

  // Proceed to PIN Step
  const handleProceed = () => {
    if (!recipientNumber || recipientNumber.length < 11) {
      showToast("দয়া করে সঠিক প্রাপকের মোবাইল নম্বর দিন।", "error");
      return;
    }
    if (!numAmount || numAmount <= 0) {
      showToast("দয়া করে টাকার পরিমাণ দিন।", "error");
      return;
    }
    if (totalDeduct > currentBalance) {
      showToast(`আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই! ব্যালেন্স: ৳${currentBalance.toFixed(2)}`, "error");
      return;
    }
    setShowPinModal(true);
  };

  // Confirm Transfer Execution
  const handleConfirmTransfer = async () => {
    if (!pin || pin.length < 4) {
      showToast("দয়া করে সঠিক সিকিউরিটি পিন দিন।", "error");
      return;
    }

    const res = await submitTransfer({
      receiverPhone: recipientNumber,
      receiverName: recipientName,
      amount: numAmount,
      pin: pin,
      method: currentWallet.banglaName,
      actionType: actionType,
      addCashOutCharge: addCashOutCharge,
      charge: chargeAmount,
      greetingCard: selectedGreetingCard,
      isPriyo: isPriyo
    });

    if (res.success) {
      setShowPinModal(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onNavigate('receipt', { txData: res.transaction });
    }
  };

  return (
    <div className="bg-white flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans pb-28">
      
      {/* ================= 1. TOP HEADER (BRAND COLOR MATCHING SCREENSHOT) ================= */}
      <div 
        style={{ backgroundColor: currentWallet.themeColor }}
        className="text-white px-4 pt-4 pb-3 sticky top-0 z-30 transition-colors duration-300 shadow-sm"
      >
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button 
            onClick={() => onNavigate('home')} 
            className="p-1 hover:bg-black/10 rounded-full transition-colors cursor-pointer text-white"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Title */}
          <h1 className="text-lg font-bold tracking-tight text-white capitalize">
            {actionType === 'cash_out' ? 'Cash Out' : 'Send Money'}
          </h1>

          {/* Origami Bird / Wallet Logo */}
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center p-1">
            {currentWallet.birdLogo}
          </div>
        </div>

        {/* Wallet Selector Pills (Supports all mobile wallets: বিকাশ, নগদ, রকেট, উপায়) */}
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/20 overflow-x-auto no-scrollbar">
          {Object.keys(walletConfigs).map((key) => {
            const w = walletConfigs[key];
            const isSelected = currentWalletId === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCurrentWalletId(key)}
                className={`tap-effect px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                  isSelected 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span>{w.banglaName}</span>
              </button>
            );
          })}

          <div className="h-4 w-px bg-white/30 mx-1 shrink-0" />

          {/* Action Type Switcher (Send Money vs Cash Out) */}
          <button
            type="button"
            onClick={() => setActionType(actionType === 'send_money' ? 'cash_out' : 'send_money')}
            className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 text-white hover:bg-white/30 transition-all shrink-0 cursor-pointer flex items-center gap-1"
          >
            <span>{actionType === 'send_money' ? '🔄 ক্যাশ আউট' : '🔄 সেন্ড মানি'}</span>
          </button>
        </div>
      </div>

      {/* ================= 2. RECIPIENT SECTION ================= */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-medium text-slate-500 tracking-wide">
            Recipient
          </label>
          <button 
            onClick={() => setShowRecipientModal(true)}
            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" />
            <span>প্রাপক পরিবর্তন</span>
          </button>
        </div>

        {/* Recipient Card (Pixel-perfect matching screenshot) */}
        <div 
          onClick={() => setShowRecipientModal(true)}
          className="border border-slate-200 rounded-2xl p-3 flex items-center gap-3.5 bg-white hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
        >
          {/* Lavender Avatar Circle with initial/number */}
          <div className="w-11 h-11 rounded-full bg-[#E9D5FF] text-[#7E22CE] font-bold text-base flex items-center justify-center shrink-0">
            {recipientNumber ? recipientNumber[0] : '0'}
          </div>

          {/* Number & Name */}
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight truncate">
              {recipientName || "01874451225"}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
              {recipientNumber || "01874451225"}
            </p>
          </div>
        </div>
      </div>

      {/* Thin Divider */}
      <div className="h-px bg-slate-100 mx-5 my-2" />

      {/* ================= 3. AMOUNT SECTION (BIG DISPLAY) ================= */}
      <div className="px-5 py-3 text-center">
        <label className="text-xs font-medium text-slate-500 block text-left mb-1">
          Amount
        </label>

        {/* Big Centered ৳ Input */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="flex items-center justify-center text-4xl sm:text-5xl font-light text-slate-400 font-mono tracking-tight">
            <span className="text-slate-300 mr-0.5">৳</span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-48 bg-transparent text-center font-normal text-slate-800 placeholder:text-slate-300 focus:outline-none"
              autoFocus
            />
          </div>
        </div>

        {/* Available Balance Helper */}
        <p className="text-xs text-slate-700 font-medium mt-1 font-mono">
          Available Balance: <span className="font-bold">৳{currentBalance.toFixed(2)}</span>
        </p>

        {/* Quick Amount Suggestion Pills */}
        <div className="flex justify-center gap-2 mt-3 overflow-x-auto no-scrollbar">
          {quickAmounts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setAmount(String(q))}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-mono font-bold text-xs rounded-full transition-all cursor-pointer"
            >
              ৳{q}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mx-5 my-2" />

      {/* ================= 4. ADD CASH OUT CHARGE TOGGLE ================= */}
      <div className="px-5 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-sm tracking-tight">
              Add Cash Out Charge
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              To send with charge for recipient
            </p>
            {addCashOutCharge && numAmount > 0 && (
              <p className="text-[11px] font-bold text-rose-600 mt-1 font-mono">
                + চার্জ ৳{chargeAmount.toFixed(2)} (মোট কর্তন: ৳{totalDeduct.toFixed(2)})
              </p>
            )}
          </div>

          {/* Custom iOS Toggle Switch */}
          <button
            type="button"
            onClick={() => setAddCashOutCharge(!addCashOutCharge)}
            className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
              addCashOutCharge ? 'bg-[#E2136E]' : 'bg-slate-300'
            }`}
          >
            <div 
              className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 left-0.5 ${
                addCashOutCharge ? 'translate-x-5.5' : 'translate-x-0'
              }`} 
            />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mx-5 my-1" />

      {/* ================= 5. ADD AS PRIYO BANNER ================= */}
      <div className="px-5 py-2.5">
        <button
          type="button"
          onClick={() => {
            setIsPriyo(!isPriyo);
            showToast(isPriyo ? "প্রিয় নম্বর তালিকা থেকে সরানো হয়েছে" : "প্রিয় নম্বর হিসেবে যুক্ত করা হয়েছে!", "info");
          }}
          className="flex items-center gap-2.5 text-left w-full group cursor-pointer"
        >
          {/* Contact Book with Star Icon */}
          <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-[#E2136E] shrink-0 border border-pink-100">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M19 2H6c-1.2 0-2 .8-2 2v16c0 1.2.8 2 2 2h13c1.1 0 2-.9 2-2V4c0-1.2-.9-2-2-2zm-1 9l-2.2 1.5.8 2.6-2.3-1.6-2.3 1.6.8-2.6L10.6 11l2.7-.2 1-2.6 1 2.6 2.7.2zM4 6h2v2H4zm0 4h2v2H4zm0 4h2v2H4zm0 4h2v2H4z" />
            </svg>
          </div>

          <span className="text-xs font-bold text-[#E2136E] flex-1">
            {isPriyo ? "✓ প্রিয় নম্বর হিসেবে যুক্ত (ফ্রি সেন্ড মানি সক্রিয়)" : "Add as Priyo to Send Money for Free"}
          </span>

          <Star className={`w-4 h-4 transition-colors ${isPriyo ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mx-5 my-2" />

      {/* ================= 6. SELECT A GREETING CARD ================= */}
      <div className="px-5 py-2">
        <label className="text-xs font-medium text-slate-500 block mb-3">
          Select a Greeting Card
        </label>

        {/* Horizontal Greeting Cards Row */}
        <div className="grid grid-cols-4 gap-2.5">
          {greetingCards.map((card) => {
            const isSelected = selectedGreetingCard === card.id;
            return (
              <div
                key={card.id}
                onClick={() => setSelectedGreetingCard(card.id)}
                className={`relative rounded-2xl border p-1 transition-all cursor-pointer flex flex-col items-center ${
                  isSelected 
                    ? 'border-[#E2136E] bg-pink-50/20 shadow-xs ring-1 ring-[#E2136E]' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Active Checkmark Badge on Top Right */}
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#E2136E] text-white flex items-center justify-center shadow-xs z-10">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                {/* Card Illustration */}
                <div className="w-full">
                  {card.icon}
                </div>

                {/* Card Title */}
                <span className="text-[11px] font-medium text-slate-700 text-center mt-1.5 pb-0.5 line-clamp-1">
                  {card.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 7. FIXED BOTTOM ACTION BAR ("PROCEED") ================= */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-xs border-t border-slate-100 z-40">
        <button
          type="button"
          disabled={!isAmountValid}
          onClick={handleProceed}
          className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-between transition-all shadow-md cursor-pointer disabled:cursor-not-allowed ${
            isAmountValid
              ? 'bg-[#E2136E] hover:bg-[#c90f61] active:scale-[0.99] shadow-pink-200'
              : 'bg-[#9CA3AF] opacity-90'
          }`}
        >
          <span>Proceed</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* ================= RECIPIENT SELECTION MODAL ================= */}
      {showRecipientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">প্রাপক নির্বাচন করুন</h3>
              <button 
                onClick={() => setShowRecipientModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Custom Input */}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                সরাসরি মোবাইল নম্বর লিখুন
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={customPhoneInput}
                  onChange={(e) => setCustomPhoneInput(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="flex-1 bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E2136E]"
                />
                <button
                  type="button"
                  onClick={handleCustomPhoneConfirm}
                  className="bg-[#E2136E] text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-[#c90f61]"
                >
                  যোগ করুন
                </button>
              </div>
            </div>

            {/* Saved Recipients */}
            <div>
              <span className="text-xs font-medium text-slate-500 block mb-2">সংরক্ষিত প্রাপক তালিকা:</span>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {(recipients || []).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">কোনো সংরক্ষিত প্রাপক পাওয়া যায়নি</p>
                ) : (
                  recipients.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => handleSelectRecipient(rec)}
                      className="p-3 bg-slate-50 hover:bg-pink-50/50 rounded-xl border border-slate-200/80 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#E9D5FF] text-[#7E22CE] font-bold text-xs flex items-center justify-center">
                          {rec.name?.[0]?.toUpperCase() || 'R'}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-900">{rec.name}</p>
                          <p className="text-[11px] font-mono text-slate-500">{rec.phone || rec.accountNumber}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#E2136E]">নির্বাচন করুন</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: REVIEW & PIN CONFIRMATION MODAL ================= */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto p-5 shadow-2xl space-y-4">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                লেনদেন নিশ্চিতকরণ ({actionType === 'cash_out' ? 'ক্যাশ আউট' : 'সেন্ড মানি'})
              </h3>
              <button 
                onClick={() => setShowPinModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Details Card */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#E9D5FF] text-[#7E22CE] font-bold text-base flex items-center justify-center shrink-0">
                {recipientNumber[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium">প্রাপকের {currentWallet.banglaName} ওয়ালেট</p>
                <h4 className="font-bold text-slate-900 text-sm truncate">{recipientName}</h4>
                <p className="text-xs font-mono font-bold text-[#E2136E]">{recipientNumber}</p>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500">মূল টাকার পরিমাণ:</span>
                <span className="font-mono font-bold text-slate-900">৳{numAmount.toFixed(2)}</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500">ক্যাশ আউট / সার্ভিস চার্জ:</span>
                <span className="font-mono font-bold text-slate-900">
                  {chargeAmount > 0 ? `+ ৳${chargeAmount.toFixed(2)}` : '৳০.০০ (ফ্রি)'}
                </span>
              </div>
              <div className="p-3 flex justify-between items-center bg-pink-50/50">
                <span className="font-bold text-slate-900">মোট কর্তন হবে:</span>
                <span className="font-mono font-black text-[#E2136E] text-base">
                  ৳{totalDeduct.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Greeting Card Note */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200">
              <Sparkles className="w-4 h-4 text-pink-500 shrink-0" />
              <span>নির্বাচিত কার্ড: <strong>{selectedGreetingCard}</strong></span>
            </div>

            {/* 6-Digit PIN Input */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#E2136E]" />
                <span>আপনার সিকিউরিটি পিন (PIN) দিন</span>
              </label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-100 border border-slate-300 rounded-xl py-3 px-4 text-center font-mono font-black text-xl tracking-widest text-slate-900 focus:outline-none focus:border-[#E2136E] focus:bg-white"
                autoFocus
              />
            </div>

            {/* Confirm Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={loading || !pin}
                onClick={handleConfirmTransfer}
                className="tap-effect w-full bg-[#E2136E] hover:bg-[#c90f61] text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all text-center cursor-pointer disabled:opacity-50"
              >
                {loading ? "লেনদেন সম্পন্ন হচ্ছে..." : "নিশ্চিত করতে ট্যাপ করুন ➔"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
