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
  Clock, 
  CheckCircle2, 
  X, 
  Users,
  ChevronRight
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

  // Sender country / currency
  const defaultCurr = user?.country === 'Saudi Arabia' ? 'SAR' : (user?.country === 'UAE' ? 'AED' : 'MYR');
  const [senderCurrency, setSenderCurrency] = useState(defaultCurr);

  const senderOptions = [
    { code: 'MYR', country: 'Malaysia', countryBn: 'মালয়েশিয়া', flag: '🇲🇾' },
    { code: 'SAR', country: 'Saudi Arabia', countryBn: 'সৌদি আরব', flag: '🇸🇦' },
    { code: 'AED', country: 'UAE', countryBn: 'দুবাই', flag: '🇦🇪' }
  ];

  // Recipient in Bangladesh
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New recipient form
  const [newRecipient, setNewRecipient] = useState({
    name: '',
    phone: '',
    channel: initialChannel || 'bkash',
    bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
    accountNumber: '',
    branch: '',
    relationship: 'পরিবার'
  });

  // Amount
  const [sendAmount, setSendAmount] = useState('500');

  // Proof & Trx
  const [proofImage, setProofImage] = useState(null);
  const [depositTrxId, setDepositTrxId] = useState('');
  const [copiedField, setCopiedField] = useState('');

  // Submission success
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
    duitNowId: senderCurrency === 'MYR' ? '+60123456789' : ''
  };

  const quickAmountsMap = {
    MYR: [200, 500, 1000, 2000],
    SAR: [300, 500, 1000, 2500],
    AED: [300, 500, 1000, 2500]
  };

  useEffect(() => {
    if (user?.phone) {
      fetchRecipients(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (recipients && recipients.length > 0 && !selectedRecipientId) {
      setSelectedRecipientId(recipients[0].id);
    }
  }, [recipients]);

  const selectedRecipient = (recipients || []).find(r => r.id === selectedRecipientId);

  // Copy helper
  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} কপি করা হয়েছে!`, "info");
    setTimeout(() => setCopiedField(''), 2500);
  };

  // Proof Image Upload
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
      showToast("পেমেন্ট স্লিপ যুক্ত হয়েছে!", "success");
    };
    reader.readAsDataURL(file);
  };

  // Save Recipient
  const handleSaveRecipient = async (e) => {
    e.preventDefault();
    if (!newRecipient.name.trim()) {
      showToast("প্রাপকের নাম লিখুন।", "error");
      return;
    }

    if (newRecipient.channel === 'bank') {
      if (!newRecipient.accountNumber.trim()) {
        showToast("অ্যাকাউন্ট নম্বর লিখুন।", "error");
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

  // Submit Remittance
  const handleRemittanceSubmit = async () => {
    if (!selectedRecipient) {
      showToast("দয়া করে বাংলাদেশে প্রাপক নির্বাচন করুন।", "error");
      setShowRecipientModal(true);
      return;
    }

    if (!parsedAmount || parsedAmount <= 0) {
      showToast("টাকার সঠিক পরিমাণ লিখুন।", "error");
      return;
    }

    if (!proofImage) {
      showToast("পেমেন্ট স্লিপের স্ক্রিনশট আপলোড করুন।", "error");
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
      proofImage
    };

    const res = await submitRemittance(payload);
    if (res.success && res.transaction) {
      setSubmittedTx(res.transaction);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  // ================= SUCCESS SCREEN (BLACK AND WHITE MINIMAL) =================
  if (submittedTx) {
    return (
      <div className="bg-white text-black flex flex-col max-w-md mx-auto min-h-screen font-sans pb-24 select-none">
        <div className="bg-white border-b border-neutral-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => onNavigate('home')} className="p-1 cursor-pointer text-black hover:opacity-70">
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <h1 className="font-bold text-sm tracking-tight text-black">মানি ট্রান্সফার আবেদন গৃহীত</h1>
          <div className="w-5" />
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 text-center border border-neutral-200 shadow-sm space-y-4">
            <div className="w-14 h-14 bg-neutral-100 text-black rounded-full flex items-center justify-center mx-auto border border-neutral-300">
              <CheckCircle2 className="w-8 h-8 stroke-[2]" />
            </div>

            <div>
              <span className="text-[11px] bg-neutral-100 text-neutral-800 border border-neutral-300 font-bold px-3 py-1 rounded-full uppercase inline-flex items-center gap-1.5 mb-2 font-mono">
                <Clock className="w-3.5 h-3.5" /> অপেক্ষমান (যাচাই চলছে)
              </span>
              <h2 className="text-lg font-bold text-black">আবেদন সফলভাবে জমা হয়েছে</h2>
              <p className="text-xs text-neutral-500 mt-1">
                এডমিন পেমেন্ট স্লিপ যাচাই করে বাংলাদেশে প্রাপকের একাউন্টে টাকা পাঠিয়ে দিবেন।
              </p>
            </div>

            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 text-left space-y-2.5 text-xs">
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500">ট্রানজেকশন আইডি:</span>
                <span className="font-mono font-bold text-black">{submittedTx.id}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500">প্রেরিত পরিমাণ:</span>
                <span className="font-mono font-bold text-black">{submittedTx.sendAmount} {submittedTx.senderCurrency}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500">এক্সচেঞ্জ রেট:</span>
                <span className="font-mono font-bold text-black">১ {submittedTx.senderCurrency} = {submittedTx.exchangeRate} ৳</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200 bg-neutral-100 p-2 rounded-lg">
                <span className="text-black font-bold">বাংলাদেশে প্রাপক পাবেন:</span>
                <span className="font-mono font-black text-black text-base">
                  ৳ {Number(submittedTx.receiveAmount).toLocaleString('bn-BD')}/=
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-neutral-500">প্রাপক:</span>
                <span className="font-bold text-black text-right">
                  {submittedTx.recipient?.name} ({submittedTx.recipient?.phone || submittedTx.recipient?.accountNumber})
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onNavigate('history')}
                className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 rounded-xl text-xs transition-all cursor-pointer"
              >
                লেনদেন হিস্ট্রি দেখুন ➔
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer border border-neutral-300"
              >
                হোম পেইজে ফিরে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN FORM (PURE BLACK AND WHITE MINIMAL) =================
  const isFormValid = Boolean(selectedRecipient && parsedAmount > 0 && proofImage);

  return (
    <div className="bg-white text-black flex flex-col max-w-md mx-auto min-h-screen font-sans pb-32 select-none">
      
      {/* 1. TOP HEADER (BLACK & WHITE) */}
      <div className="bg-white border-b border-neutral-200 px-4 pt-4 pb-3 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')} 
            className="p-1.5 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer text-black"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="text-center">
            <h1 className="text-base font-bold text-black tracking-tight">
              টাকা পাঠান (Send Money)
            </h1>
            <p className="text-[11px] text-neutral-500 font-medium">
              প্রবাসী মানি ট্রান্সফার সেবা
            </p>
          </div>

          <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center font-bold text-xs text-black">
            🇧🇩
          </div>
        </div>

        {/* Sender Currency Switcher (Monochrome Pills) */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-neutral-200">
          <span className="text-xs text-neutral-600 font-medium">প্রেরক দেশ:</span>
          <div className="flex gap-1.5">
            {senderOptions.map((opt) => {
              const isSelected = senderCurrency === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setSenderCurrency(opt.code)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-black text-white border border-black shadow-xs' 
                      : 'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200'
                  }`}
                >
                  <span>{opt.flag}</span>
                  <span className="font-mono">{opt.code}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3.5">
        
        {/* ================= 2. RECIPIENT CARD (BLACK & WHITE) ================= */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-neutral-500">
              বাংলাদেশে প্রাপক (Recipient)
            </span>
            <button 
              type="button"
              onClick={() => setShowRecipientModal(true)}
              className="text-xs font-bold text-black hover:opacity-70 cursor-pointer flex items-center gap-1"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{selectedRecipient ? "পরিবর্তন" : "নির্বাচন"}</span>
            </button>
          </div>

          {selectedRecipient ? (
            <div 
              onClick={() => setShowRecipientModal(true)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-black transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-black text-white font-bold text-sm flex items-center justify-center shrink-0 font-mono">
                  {selectedRecipient.name?.[0]?.toUpperCase() || 'R'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-black text-xs truncate">
                      {selectedRecipient.name}
                    </h3>
                    <span className="text-[10px] bg-neutral-200 text-black px-2 py-0.2 rounded-full font-bold">
                      {selectedRecipient.channel === 'bank' ? 'ব্যাংক' : (selectedRecipient.channel || 'বিকাশ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5 truncate">
                    {selectedRecipient.channel === 'bank' 
                      ? `${selectedRecipient.bankName} • ${selectedRecipient.accountNumber}`
                      : selectedRecipient.phone}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="w-full bg-neutral-50 border border-dashed border-neutral-300 hover:border-black rounded-xl p-3.5 text-center cursor-pointer transition-all flex items-center justify-center gap-2 text-xs font-bold text-black"
            >
              <Plus className="w-4 h-4" />
              <span>+ প্রাপক যুক্ত করুন (বিকাশ, নগদ, রকেট বা ব্যাংক)</span>
            </button>
          )}
        </div>

        {/* ================= 3. AMOUNT & LIVE RATE (BLACK & WHITE) ================= */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-neutral-500">
              প্রেরিত পরিমাণ (You Send)
            </span>
            <span className="text-[11px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
              ১ {senderCurrency} = {rateToBdt} ৳
            </span>
          </div>

          {/* Clean Big Amount Input */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-3 flex items-center justify-between focus-within:border-black transition-colors">
            <input
              type="number"
              inputMode="decimal"
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-2xl font-black font-mono text-black placeholder:text-neutral-400 focus:outline-none"
            />
            <span className="text-sm font-bold font-mono text-black ml-2 shrink-0">
              {senderCurrency}
            </span>
          </div>

          {/* Quick Amount Chips */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {(quickAmountsMap[senderCurrency] || [200, 500, 1000, 2000]).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setSendAmount(String(q))}
                className={`flex-1 py-1 px-2 font-mono font-bold text-xs rounded-lg transition-all cursor-pointer text-center ${
                  sendAmount === String(q)
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200'
                }`}
              >
                +{q}
              </button>
            ))}
          </div>

          {/* Calculated BDT Conversion Card */}
          <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-600">
              বাংলাদেশে প্রাপক পাবেন:
            </span>
            <span className="text-lg font-black font-mono text-black">
              ৳ {receiveBdtAmount.toLocaleString('bn-BD')}
            </span>
          </div>
        </div>

        {/* ================= 4. DEPOSIT ACCOUNT (BLACK & WHITE) ================= */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-neutral-500">
              টাকা জমা দেওয়ার ব্যাংক ({senderOptions.find(o => o.code === senderCurrency)?.countryBn})
            </span>
            <span className="text-[10px] text-black font-mono font-bold bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
              অফিসিয়াল একাউন্ট
            </span>
          </div>

          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">ব্যাংক:</span>
              <span className="font-bold text-black">{currentDepositAccount.bankName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-500">অ্যাকাউন্টের নাম:</span>
              <span className="font-bold text-black">{currentDepositAccount.accountName}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
              <div>
                <span className="text-[11px] text-neutral-500 block">হিসাব নম্বর:</span>
                <span className="font-mono font-bold text-black text-sm select-all">
                  {currentDepositAccount.accountNumber}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(currentDepositAccount.accountNumber, "অ্যাকাউন্ট নম্বর")}
                className="px-3 py-1 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedField === "অ্যাকাউন্ট নম্বর" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedField === "অ্যাকাউন্ট নম্বর" ? "কপি হয়েছে" : "কপি"}</span>
              </button>
            </div>

            {currentDepositAccount.duitNowId && (
              <div className="flex justify-between items-center pt-1.5 border-t border-neutral-200">
                <span className="text-neutral-500">DuitNow ID:</span>
                <span className="font-mono font-bold text-black">{currentDepositAccount.duitNowId}</span>
              </div>
            )}
          </div>
        </div>

        {/* ================= 5. PAYMENT PROOF & SCREENSHOT (BLACK & WHITE) ================= */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs space-y-2.5">
          <span className="text-xs font-medium text-neutral-500 block">
            পেমেন্ট স্লিপ / স্ক্রিনশট <span className="text-black font-bold">*</span>
          </span>

          {proofImage ? (
            <div className="relative border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50 p-2">
              <img 
                src={proofImage} 
                alt="Payment Slip Proof" 
                className="w-full max-h-48 object-contain rounded-lg mx-auto" 
              />
              <button
                type="button"
                onClick={() => setProofImage(null)}
                className="absolute top-3 right-3 bg-black text-white p-1 rounded-full cursor-pointer hover:bg-neutral-800 shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] font-bold text-black mt-1.5 font-mono">
                ✓ স্ক্রিনশট সফলভাবে যুক্ত হয়েছে
              </p>
            </div>
          ) : (
            <label className="border border-dashed border-neutral-300 hover:border-black bg-neutral-50 rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5">
              <Upload className="w-6 h-6 text-neutral-400" />
              <p className="text-xs font-bold text-black">স্লিপের ছবি আপলোড করুন</p>
              <p className="text-[11px] text-neutral-500">গ্যালারি বা ক্যামেরা থেকে ছবি নির্বাচন করুন</p>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
            </label>
          )}

          {/* Reference / TrxID Input */}
          <input
            type="text"
            value={depositTrxId}
            onChange={(e) => setDepositTrxId(e.target.value)}
            placeholder="রেফারেন্স / TrxID (ঐচ্ছিক)"
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white"
          />
        </div>

      </div>

      {/* ================= 6. FIXED BOTTOM PROCEED BUTTON (SOLID BLACK) ================= */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-neutral-200 z-40">
        <button
          type="button"
          disabled={!isFormValid || loading}
          onClick={handleRemittanceSubmit}
          className={`w-full py-3.5 px-5 rounded-xl font-bold text-xs text-white flex items-center justify-between transition-all cursor-pointer disabled:cursor-not-allowed ${
            isFormValid && !loading
              ? 'bg-black hover:bg-neutral-800 active:scale-[0.99] shadow-md'
              : 'bg-neutral-200 text-neutral-400'
          }`}
        >
          <span>{loading ? "জমা হচ্ছে..." : "টাকা পাঠানো নিশ্চিত করুন"}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* ================= RECIPIENT SELECTION MODAL ================= */}
      {showRecipientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white border border-neutral-200 text-black rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
              <h3 className="font-bold text-black text-sm">বাংলাদেশে প্রাপক নির্বাচন করুন</h3>
              <button 
                onClick={() => setShowRecipientModal(false)}
                className="text-neutral-400 hover:text-black p-1 cursor-pointer"
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
              className="w-full bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন প্রাপক যোগ করুন</span>
            </button>

            {/* Existing List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(recipients || []).length === 0 ? (
                <p className="text-xs text-neutral-400 py-6 text-center">আপনার কোনো সংরক্ষিত প্রাপক নেই</p>
              ) : (
                recipients.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      setSelectedRecipientId(rec.id);
                      setShowRecipientModal(false);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      rec.id === selectedRecipientId
                        ? 'border-black bg-neutral-100'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-black text-white font-bold text-xs flex items-center justify-center font-mono">
                        {rec.name?.[0]?.toUpperCase() || 'R'}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-black">{rec.name}</p>
                        <p className="text-[11px] font-mono text-neutral-500">
                          {rec.channel === 'bank' ? `${rec.bankName} • ${rec.accountNumber}` : `${(rec.channel || 'বিকাশ').toUpperCase()}: ${rec.phone}`}
                        </p>
                      </div>
                    </div>
                    {rec.id === selectedRecipientId && (
                      <Check className="w-4 h-4 text-black stroke-[3]" />
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
          <div className="bg-white border border-neutral-200 text-black rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
              <h3 className="font-bold text-black text-sm">নতুন বাংলাদেশি প্রাপক যুক্ত করুন</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-black p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipient} className="space-y-3">
              {/* Channel Selector */}
              <div>
                <label className="text-xs font-medium text-neutral-600 block mb-1">
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
                          ? 'bg-black text-white border-black'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {ch.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="text-xs font-medium text-neutral-600 block mb-1">
                  প্রাপকের নাম:
                </label>
                <input
                  type="text"
                  required
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                  placeholder="যেমন: মোঃ শামীম আহমেদ"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-black focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              {/* Phone / Account */}
              {newRecipient.channel !== 'bank' ? (
                <div>
                  <label className="text-xs font-medium text-neutral-600 block mb-1">
                    প্রাপকের {newRecipient.channel.toUpperCase()} নম্বর:
                  </label>
                  <input
                    type="tel"
                    required
                    value={newRecipient.phone}
                    onChange={(e) => setNewRecipient({ ...newRecipient, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-black focus:outline-none focus:border-black focus:bg-white"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-medium text-neutral-600 block mb-1">
                      ব্যাংকের নাম:
                    </label>
                    <input
                      type="text"
                      required
                      value={newRecipient.bankName}
                      onChange={(e) => setNewRecipient({ ...newRecipient, bankName: e.target.value })}
                      placeholder="যেমন: ইসলামী ব্যাংক বাংলাদেশ"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-black focus:outline-none focus:border-black focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-600 block mb-1">
                      হিসাব নম্বর:
                    </label>
                    <input
                      type="text"
                      required
                      value={newRecipient.accountNumber}
                      onChange={(e) => setNewRecipient({ ...newRecipient, accountNumber: e.target.value })}
                      placeholder="যেমন: ২০৫০১২৩৪৫৬৭৮৯"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-black focus:outline-none focus:border-black focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-600 block mb-1">
                      শাখা (Branch):
                    </label>
                    <input
                      type="text"
                      value={newRecipient.branch}
                      onChange={(e) => setNewRecipient({ ...newRecipient, branch: e.target.value })}
                      placeholder="যেমন: মতিঝিল শাখা"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-black focus:outline-none focus:border-black focus:bg-white"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer mt-2 shadow-xs"
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
