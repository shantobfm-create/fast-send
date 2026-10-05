import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Copy, 
  Plus, 
  Building2, 
  Smartphone, 
  Upload, 
  Image as ImageIcon, 
  Clock, 
  CheckCircle2, 
  X, 
  Trash2, 
  ChevronRight,
  Globe,
  ShieldCheck,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const RemittancePage = ({ onNavigate, initialChannel = 'bkash' }) => {
  const { 
    user, 
    settings, 
    recipients, 
    fetchRecipients, 
    addRecipient, 
    deleteRecipient, 
    submitRemittance, 
    showToast, 
    loading 
  } = useApp();

  // SENDER COUNTRY / CURRENCY
  // Supported sender countries: Malaysia (MYR), Saudi Arabia (SAR), UAE/Dubai (AED)
  const defaultCurr = user?.country === 'Saudi Arabia' ? 'SAR' : (user?.country === 'UAE' ? 'AED' : 'MYR');
  const [senderCurrency, setSenderCurrency] = useState(defaultCurr);

  const senderOptions = [
    { code: 'MYR', country: 'Malaysia', countryBn: 'মালয়েশিয়া', flag: '🇲🇾', label: 'MYR (রিঙ্গিত)' },
    { code: 'SAR', country: 'Saudi Arabia', countryBn: 'সৌদি আরব', flag: '🇸🇦', label: 'SAR (রিয়াল)' },
    { code: 'AED', country: 'UAE', countryBn: 'দুবাই / ইউএই', flag: '🇦🇪', label: 'AED (দিরহাম)' }
  ];

  // RECIPIENT IN BANGLADESH
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Recipient Form
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    phone: '',
    channel: initialChannel || 'bkash', // 'bkash' | 'nagad' | 'rocket' | 'upay' | 'bank'
    bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
    accountNumber: '',
    branch: '',
    relationship: 'পরিবার'
  });

  // AMOUNT
  const [sendAmount, setSendAmount] = useState('500');

  // DEPOSIT PROOF & TRX
  const [proofImage, setProofImage] = useState(null);
  const [depositTrxId, setDepositTrxId] = useState('');
  const [senderNote, setSenderNote] = useState('');
  const [copiedField, setCopiedField] = useState('');

  // SUCCESS SUBMISSION STATE
  const [submittedTx, setSubmittedTx] = useState(null);

  // Live Exchange Rate
  const exchangeRates = settings?.exchangeRates || [];
  const currentRateObj = exchangeRates.find(r => r.code === senderCurrency) || {
    rateToBdt: senderCurrency === 'SAR' ? 32.80 : (senderCurrency === 'AED' ? 33.50 : 27.50)
  };
  const rateToBdt = currentRateObj?.rateToBdt || (senderCurrency === 'SAR' ? 32.80 : (senderCurrency === 'AED' ? 33.50 : 27.50));

  const parsedAmount = parseFloat(sendAmount) || 0;
  const receiveBdtAmount = Math.round(parsedAmount * rateToBdt);

  // Admin Deposit Account for selected country
  const senderAccounts = settings?.senderAccounts || [];
  const currentDepositAccount = senderAccounts.find(a => a.currency === senderCurrency) || {
    bankName: senderCurrency === 'SAR' ? 'Al Rajhi Bank' : (senderCurrency === 'AED' ? 'Emirates NBD' : 'Maybank'),
    accountName: senderCurrency === 'SAR' ? 'Fast Send KSA' : (senderCurrency === 'AED' ? 'Fast Send UAE LLC' : 'Fast Send Global MY'),
    accountNumber: senderCurrency === 'SAR' ? 'SA4480000123456789012345' : (senderCurrency === 'AED' ? 'AE250260001234567890123' : '514012345678'),
    duitNowId: senderCurrency === 'MYR' ? '+60123456789' : '',
    stcPay: senderCurrency === 'SAR' ? '+966501234567' : '',
    payByPhone: senderCurrency === 'AED' ? '+971501234567' : ''
  };

  const quickAmountsMap = {
    MYR: [200, 500, 1000, 2000, 5000],
    SAR: [300, 500, 1000, 2500, 5000],
    AED: [300, 500, 1000, 2500, 5000]
  };

  useEffect(() => {
    if (user?.phone) {
      fetchRecipients(user.phone);
    }
  }, [user]);

  // Set default recipient if list is loaded
  useEffect(() => {
    if (recipients && recipients.length > 0 && !selectedRecipientId) {
      setSelectedRecipientId(recipients[0].id);
    }
  }, [recipients]);

  const selectedRecipient = (recipients || []).find(r => r.id === selectedRecipientId);

  // 1-tap Copy Helper
  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} কপি করা হয়েছে!`, "info");
    setTimeout(() => setCopiedField(''), 2500);
  };

  // Proof Image Upload Handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("ছবির সাইজ সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProofImage(event.target.result);
      showToast("পেমেন্ট স্লিপ সফলভাবে যুক্ত হয়েছে!", "success");
    };
    reader.readAsDataURL(file);
  };

  // Handle Save New Recipient
  const handleSaveRecipient = async (e) => {
    e.preventDefault();
    if (!newRecipient.name.trim()) {
      showToast("প্রাপকের নাম লিখুন।", "error");
      return;
    }

    if (newRecipient.channel === 'bank') {
      if (!newRecipient.accountNumber.trim()) {
        showToast("ব্যাংক অ্যাকাউন্ট নম্বর লিখুন।", "error");
        return;
      }
    } else {
      if (!newRecipient.phone || newRecipient.phone.length < 11) {
        showToast("সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।", "error");
        return;
      }
    }

    const res = await addRecipient(newRecipient);
    if (res.success && res.recipient) {
      setSelectedRecipientId(res.recipient.id);
      setShowAddModal(false);
      setShowRecipientModal(false);
      setNewRecipient({
        name: '',
        phone: '',
        channel: 'bkash',
        bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
        accountNumber: '',
        branch: '',
        relationship: 'পরিবার'
      });
    }
  };

  // Handle Submit Remittance
  const handleRemittanceSubmit = async () => {
    if (!selectedRecipient) {
      showToast("দয়া করে বাংলাদেশে টাকা গ্রহণকারী প্রাপক নির্বাচন করুন।", "error");
      setShowRecipientModal(true);
      return;
    }

    if (!parsedAmount || parsedAmount <= 0) {
      showToast("টাকার সঠিক পরিমাণ লিখুন।", "error");
      return;
    }

    if (!proofImage) {
      showToast("দয়া করে টাকা ডিপোজিটের স্ক্রিনশট বা স্লিপ আপলোড করুন।", "error");
      return;
    }

    const payload = {
      senderCountry: senderOptions.find(o => o.code === senderCurrency)?.country || 'Malaysia',
      senderCurrency,
      sendAmount: parsedAmount,
      exchangeRate: rateToBdt,
      receiveAmount: receiveBdtAmount,
      recipient: selectedRecipient,
      depositAccount: currentDepositAccount,
      trxId: depositTrxId.trim() || undefined,
      proofImage,
      senderNote: senderNote.trim()
    };

    const res = await submitRemittance(payload);
    if (res.success && res.transaction) {
      setSubmittedTx(res.transaction);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  // ================= SUCCESS RECEIPT SCREEN =================
  if (submittedTx) {
    return (
      <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans pb-20">
        <div className="bg-[#00823B] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => onNavigate('home')} className="p-1 cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-base">রেমিটেন্স আবেদন গৃহীত</h1>
          <div className="w-5" />
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-[#00823B] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-1 rounded-full uppercase inline-flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 animate-spin" /> এডমিন যাচাই প্রক্রিয়াধীন
              </span>
              <h2 className="text-xl font-black text-slate-900">রিকোয়েস্ট সফলভাবে জমা হয়েছে!</h2>
              <p className="text-xs text-slate-500 mt-1">
                এডমিন পেমেন্ট স্ক্রিনশট যাচাই করে বাংলাদেশে প্রাপকের একাউন্টে টাকা পাঠিয়ে দিবেন।
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-slate-200">
                <span className="text-slate-500">ট্রানজেকশন আইডি:</span>
                <span className="font-mono font-bold text-slate-900">{submittedTx.id}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-200">
                <span className="text-slate-500">প্রেরিত পরিমাণ:</span>
                <span className="font-mono font-bold text-slate-900">{submittedTx.sendAmount} {submittedTx.senderCurrency}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-200">
                <span className="text-slate-500">এক্সচেঞ্জ রেট:</span>
                <span className="font-mono font-bold text-slate-700">১ {submittedTx.senderCurrency} = {submittedTx.exchangeRate} ৳</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-200 bg-emerald-50/70 p-2 rounded-xl">
                <span className="text-emerald-900 font-bold">বাংলাদেশে প্রাপক পাবেন:</span>
                <span className="font-mono font-black text-[#00823B] text-base">
                  ৳ {Number(submittedTx.receiveAmount).toLocaleString('bn-BD')}/=
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">প্রাপক:</span>
                <span className="font-bold text-slate-900 text-right">
                  {submittedTx.recipient?.name} ({submittedTx.recipient?.phone || submittedTx.recipient?.accountNumber})
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onNavigate('history')}
                className="w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-all cursor-pointer"
              >
                লেনদেন হিস্ট্রি দেখুন ➔
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl text-xs transition-all cursor-pointer"
              >
                হোম পেইজে ফিরে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN REMITTANCE / SEND MONEY FORM =================
  const isFormValid = Boolean(selectedRecipient && parsedAmount > 0 && proofImage);

  return (
    <div className="bg-white flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans pb-32">
      
      {/* ================= 1. TOP HEADER (BRAND COLOR & ROUTE) ================= */}
      <div className="bg-[#00823B] text-white px-4 pt-4 pb-3 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')} 
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div className="text-center">
            <h1 className="text-base font-bold tracking-tight text-white">
              টাকা পাঠান (Send Money)
            </h1>
            <p className="text-[11px] text-emerald-100 font-medium">
              বিদেশ থেকে বাংলাদেশে রেমিটেন্স
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center font-bold text-xs">
            🇧🇩
          </div>
        </div>

        {/* Sender Country / Currency Switcher (Malaysia, Saudi Arabia, Dubai) */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/20">
          <span className="text-[11px] text-emerald-100 font-medium shrink-0">প্রেরক দেশ:</span>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
            {senderOptions.map((opt) => {
              const isSelected = senderCurrency === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setSenderCurrency(opt.code)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-white text-[#00823B] shadow-sm' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <span>{opt.flag}</span>
                  <span>{opt.code}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= 2. RECIPIENT CARD (MATCHING USER SCREENSHOT) ================= */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-medium text-slate-500 tracking-wide">
            Recipient (বাংলাদেশে প্রাপক)
          </label>
          <button 
            type="button"
            onClick={() => setShowRecipientModal(true)}
            className="text-[11px] font-bold text-[#00823B] hover:text-[#006837] cursor-pointer flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" />
            <span>প্রাপক পরিবর্তন</span>
          </button>
        </div>

        {selectedRecipient ? (
          <div 
            onClick={() => setShowRecipientModal(true)}
            className="border border-slate-200 rounded-2xl p-3 flex items-center gap-3.5 bg-white hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
          >
            {/* Lavender Avatar Circle with initial */}
            <div className="w-11 h-11 rounded-full bg-[#E9D5FF] text-[#7E22CE] font-bold text-base flex items-center justify-center shrink-0">
              {selectedRecipient.name?.[0]?.toUpperCase() || selectedRecipient.phone?.[0] || '0'}
            </div>

            {/* Recipient Details */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm tracking-tight truncate">
                  {selectedRecipient.name}
                </h3>
                <span className="text-[10px] bg-emerald-50 text-[#00823B] border border-emerald-200 px-2 py-0.2 rounded-full font-bold">
                  {selectedRecipient.channel === 'bank' ? 'ব্যাংক' : (selectedRecipient.channel || 'বিকাশ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                {selectedRecipient.channel === 'bank' 
                  ? `${selectedRecipient.bankName} • ${selectedRecipient.accountNumber}`
                  : selectedRecipient.phone}
              </p>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl p-4 text-center cursor-pointer hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-xs font-bold text-[#00823B]"
          >
            <Plus className="w-4 h-4" />
            <span>+ প্রাপক যুক্ত করুন (বিকাশ, নগদ, রকেট বা ব্যাংক)</span>
          </button>
        )}
      </div>

      <div className="h-px bg-slate-100 mx-5 my-2" />

      {/* ================= 3. AMOUNT SECTION (CLEAN CENTERED INPUT & LIVE RATE) ================= */}
      <div className="px-5 py-3 text-center">
        <label className="text-xs font-medium text-slate-500 block text-left mb-1">
          Amount (প্রেরিত পরিমাণ)
        </label>

        {/* Big Centered Currency Input */}
        <div className="relative py-2 flex items-center justify-center">
          <div className="flex items-center justify-center text-4xl sm:text-5xl font-light text-slate-400 font-mono tracking-tight">
            <span className="text-slate-400 text-2xl font-bold mr-2">{senderCurrency}</span>
            <input
              type="number"
              inputMode="decimal"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              placeholder="0"
              className="w-44 bg-transparent text-center font-normal text-slate-800 placeholder:text-slate-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Live Exchange Rate & BDT Conversion Box */}
        <div className="mt-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] text-slate-500 block font-medium">লাইভ এক্সচেঞ্জ রেট</span>
            <span className="text-xs font-mono font-bold text-slate-800">
              ১ {senderCurrency} = {rateToBdt} ৳
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-500 block font-medium">বাংলাদেশে পাবেন</span>
            <span className="text-lg font-mono font-black text-[#00823B]">
              ৳ {receiveBdtAmount.toLocaleString('bn-BD')}
            </span>
          </div>
        </div>

        {/* Quick Amount Suggestion Chips */}
        <div className="flex justify-center gap-2 mt-3 overflow-x-auto no-scrollbar">
          {(quickAmountsMap[senderCurrency] || [200, 500, 1000, 2000]).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setSendAmount(String(q))}
              className={`px-3 py-1 font-mono font-bold text-xs rounded-full transition-all cursor-pointer ${
                sendAmount === String(q)
                  ? 'bg-[#00823B] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              +{q} {senderCurrency}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100 mx-5 my-2" />

      {/* ================= 4. ADMIN LOCAL DEPOSIT ACCOUNT (WHERE SENDER TRANSFERS) ================= */}
      <div className="px-5 py-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 tracking-wide">
            {senderOptions.find(o => o.code === senderCurrency)?.countryBn}-তে টাকা জমা দেওয়ার একাউন্ট
          </label>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            অফিসিয়াল একাউন্ট
          </span>
        </div>

        {/* Deposit Account Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">ব্যাংকের নাম:</span>
            <span className="font-bold text-slate-900">{currentDepositAccount.bankName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">হিসাবের নাম:</span>
            <span className="font-bold text-slate-900">{currentDepositAccount.accountName}</span>
          </div>

          <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[11px] text-slate-500 block">হিসাব নম্বর (Account Number):</span>
              <span className="font-mono font-bold text-slate-900 text-sm select-all">
                {currentDepositAccount.accountNumber}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(currentDepositAccount.accountNumber, "অ্যাকাউন্ট নম্বর")}
              className="px-3 py-1.5 bg-[#00823B] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-[#006837]"
            >
              {copiedField === "অ্যাকাউন্ট নম্বর" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === "অ্যাকাউন্ট নম্বর" ? "কপি হয়েছে" : "কপি"}</span>
            </button>
          </div>

          {currentDepositAccount.duitNowId && (
            <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
              <span className="text-slate-500">DuitNow ID / মোবাইল:</span>
              <span className="font-mono font-bold text-slate-800">{currentDepositAccount.duitNowId}</span>
            </div>
          )}

          {currentDepositAccount.stcPay && (
            <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
              <span className="text-slate-500">stc pay নম্বর:</span>
              <span className="font-mono font-bold text-slate-800">{currentDepositAccount.stcPay}</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-slate-100 mx-5 my-2" />

      {/* ================= 5. PAYMENT PROOF & SCREENSHOT UPLOAD ================= */}
      <div className="px-5 py-3 space-y-3">
        <label className="text-xs font-bold text-slate-800 block">
          পেমেন্ট স্লিপ / স্ক্রিনশট আপলোড করুন <span className="text-rose-500">*</span>
        </label>

        {proofImage ? (
          <div className="relative border-2 border-emerald-400 rounded-2xl overflow-hidden bg-emerald-50/30 p-2">
            <img 
              src={proofImage} 
              alt="Payment Slip Proof" 
              className="w-full max-h-52 object-contain rounded-xl mx-auto" 
            />
            <button
              type="button"
              onClick={() => setProofImage(null)}
              className="absolute top-4 right-4 bg-rose-600 text-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-rose-700"
              title="মুছে ফেলুন"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-center text-[11px] font-bold text-[#00823B] mt-2">
              ✓ স্ক্রিনশট যুক্ত হয়েছে (পরিবর্তন করতে ক্রস চাপুন)
            </p>
          </div>
        ) : (
          <label className="border-2 border-dashed border-slate-300 hover:border-[#00823B] bg-slate-50 hover:bg-emerald-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs flex items-center justify-center text-slate-400 group-hover:text-[#00823B]">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">পেমেন্ট স্ক্রিনশটের ছবি নির্বাচন করুন</p>
              <p className="text-[11px] text-slate-400 mt-0.5">গ্যালারি বা ক্যামেরা থেকে ছবি যুক্ত করুন</p>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="hidden" 
            />
          </label>
        )}

        {/* TrxID / Reference Input */}
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">
            ট্রানজেকশন আইডি / রেফারেন্স নম্বর (ঐচ্ছিক):
          </label>
          <input
            type="text"
            value={depositTrxId}
            onChange={(e) => setDepositTrxId(e.target.value)}
            placeholder="যেমন: MB12345678 বা স্লিপ রেফারেন্স"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00823B] focus:bg-white"
          />
        </div>
      </div>

      {/* ================= 6. FIXED BOTTOM PROCEED BUTTON ================= */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-xs border-t border-slate-100 z-40">
        <button
          type="button"
          disabled={!isFormValid || loading}
          onClick={handleRemittanceSubmit}
          className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm text-white flex items-center justify-between transition-all shadow-md cursor-pointer disabled:cursor-not-allowed ${
            isFormValid && !loading
              ? 'bg-[#00823B] hover:bg-[#006837] active:scale-[0.99] shadow-emerald-200'
              : 'bg-[#9CA3AF] opacity-90'
          }`}
        >
          <span>{loading ? "জমা হচ্ছে..." : "Proceed (রেমিটেন্স নিশ্চিত করুন)"}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* ================= RECIPIENT SELECTION MODAL ================= */}
      {showRecipientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">বাংলাদেশে প্রাপক নির্বাচন করুন</h3>
              <button 
                onClick={() => setShowRecipientModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add New Recipient Button */}
            <button
              type="button"
              onClick={() => {
                setShowRecipientModal(false);
                setShowAddModal(true);
              }}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#00823B] border border-emerald-300 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন প্রাপক যোগ করুন</span>
            </button>

            {/* Existing List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(recipients || []).length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">আপনার কোনো সংরক্ষিত প্রাপক নেই</p>
              ) : (
                recipients.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      setSelectedRecipientId(rec.id);
                      setShowRecipientModal(false);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      rec.id === selectedRecipientId
                        ? 'border-[#00823B] bg-emerald-50/50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E9D5FF] text-[#7E22CE] font-bold text-xs flex items-center justify-center">
                        {rec.name?.[0]?.toUpperCase() || 'R'}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">{rec.name}</p>
                        <p className="text-[11px] font-mono text-slate-500">
                          {rec.channel === 'bank' ? `${rec.bankName} • ${rec.accountNumber}` : `${(rec.channel || 'বিকাশ').toUpperCase()}: ${rec.phone}`}
                        </p>
                      </div>
                    </div>
                    {rec.id === selectedRecipientId && (
                      <Check className="w-4 h-4 text-[#00823B]" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD NEW RECIPIENT MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">নতুন বাংলাদেশি প্রাপক যুক্ত করুন</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipient} className="space-y-3">
              {/* Channel Selector (বিকাশ, নগদ, রকেট, উপায়, ব্যাংক) */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  টাকা গ্রহণের মাধ্যম:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { id: 'bkash', name: 'বিকাশ' },
                    { id: 'nagad', name: 'নগদ' },
                    { id: 'rocket', name: 'রকেট' },
                    { id: 'upay', name: 'উপায়' },
                    { id: 'bank', name: 'ব্যাংক' }
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setNewRecipient({ ...newRecipient, channel: ch.id })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        newRecipient.channel === ch.id
                          ? 'bg-[#00823B] text-white border-[#00823B]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {ch.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  প্রাপকের নাম:
                </label>
                <input
                  type="text"
                  required
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                  placeholder="যেমন: মোঃ শামীম আহমেদ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00823B]"
                />
              </div>

              {/* Phone if Mobile Wallet */}
              {newRecipient.channel !== 'bank' ? (
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">
                    প্রাপকের {newRecipient.channel.toUpperCase()} মোবাইল নম্বর:
                  </label>
                  <input
                    type="tel"
                    required
                    value={newRecipient.phone}
                    onChange={(e) => setNewRecipient({ ...newRecipient, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00823B]"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">
                      ব্যাংকের নাম:
                    </label>
                    <input
                      type="text"
                      required
                      value={newRecipient.bankName}
                      onChange={(e) => setNewRecipient({ ...newRecipient, bankName: e.target.value })}
                      placeholder="যেমন: ইসলামী ব্যাংক বাংলাদেশ"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00823B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">
                      অ্যাকাউন্ট নম্বর:
                    </label>
                    <input
                      type="text"
                      required
                      value={newRecipient.accountNumber}
                      onChange={(e) => setNewRecipient({ ...newRecipient, accountNumber: e.target.value })}
                      placeholder="যেমন: ২০৫০১২৩৪৫৬৭৮৯"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00823B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">
                      শাখা (Branch):
                    </label>
                    <input
                      type="text"
                      value={newRecipient.branch}
                      onChange={(e) => setNewRecipient({ ...newRecipient, branch: e.target.value })}
                      placeholder="যেমন: মতিঝিল শাখা"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00823B]"
                    />
                  </div>
                </>
              )}

              {/* Relationship */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">সম্পর্ক:</label>
                <select
                  value={newRecipient.relationship}
                  onChange={(e) => setNewRecipient({ ...newRecipient, relationship: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="পরিবার">পরিবার</option>
                  <option value="আত্মীয়">আত্মীয়</option>
                  <option value="বন্ধু">বন্ধু</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer mt-2"
              >
                সংরক্ষণ ও নির্বাচন করুন
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
