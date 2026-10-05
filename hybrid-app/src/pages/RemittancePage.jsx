import React, { useState, useEffect } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { 
  Globe, 
  Building2, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  RefreshCw, 
  ChevronRight, 
  X,
  CreditCard,
  MapPin,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const RemittancePage = ({ onNavigate }) => {
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

  // Selected Recipient
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [showAddRecipientModal, setShowAddRecipientModal] = useState(false);

  // New Recipient Form State
  const [recipientForm, setRecipientForm] = useState({
    name: '',
    phone: '',
    channel: 'bkash', // 'bkash' | 'nagad' | 'rocket' | 'upay' | 'bank' | 'cash'
    bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
    accountNumber: '',
    accountHolder: '',
    branch: '',
    district: '',
    relationship: 'পরিবার'
  });

  // Sender Currency & Amount State
  // Default based on user's country: SA -> SAR, AE -> AED, otherwise MYR
  const defaultCurr = user?.country === 'Saudi Arabia' ? 'SAR' : (user?.country === 'UAE' ? 'AED' : 'MYR');
  const [senderCurrency, setSenderCurrency] = useState(defaultCurr);
  const [sendAmount, setSendAmount] = useState('500');

  // Payment Proof & Trx State
  const [proofImage, setProofImage] = useState(null);
  const [depositTrxId, setDepositTrxId] = useState('');
  const [senderBankName, setSenderBankName] = useState('');
  const [senderNote, setSenderNote] = useState('');
  const [copiedField, setCopiedField] = useState('');

  // Submission Result State
  const [submittedTx, setSubmittedTx] = useState(null);

  // Available Sender Countries / Currencies
  const senderOptions = [
    { code: 'MYR', country: 'Malaysia', countryBn: 'মালয়েশিয়া', flag: '🇲🇾', name: 'মালয়েশিয়ান রিঙ্গিত' },
    { code: 'SAR', country: 'Saudi Arabia', countryBn: 'সৌদি আরব', flag: '🇸🇦', name: 'সৌদি রিয়াল' },
    { code: 'AED', country: 'UAE', countryBn: 'দুবাই / ইউএই', flag: '🇦🇪', name: 'ইউএই দিরহাম' }
  ];

  // BD Banks List
  const bdBanksList = [
    "ইসলামী ব্যাংক বাংলাদেশ পিএলসি",
    "ব্র্যাক ব্যাংক পিএলসি",
    "ডাচ্-বাংলা ব্যাংক পিএলসি",
    "সিটি ব্যাংক পিএলসি",
    "সোনালী ব্যাংক পিএলসি",
    "ইস্টার্ন ব্যাংক পিএলসি",
    "পূবালী ব্যাংক পিএলসি",
    "মিউচুয়াল ট্রাস্ট ব্যাংক পিএলসি",
    "ইউনাইটেড কমার্শিয়াল ব্যাংক (ইউসিবি)",
    "প্রাইম ব্যাংক পিএলসি",
    "অগ্রণী ব্যাংক পিএলসি",
    "জনতা ব্যাংক পিএলসি"
  ];

  // Quick Amount presets per currency
  const quickAmountsMap = {
    MYR: [200, 500, 1000, 2000, 5000],
    SAR: [300, 500, 1000, 2500, 5000],
    AED: [300, 500, 1000, 2500, 5000]
  };

  // Get live rate for the selected currency
  const exchangeRates = settings?.exchangeRates || [];
  const currentRateObj = exchangeRates.find(r => r.code === senderCurrency) || {
    rateToBdt: senderCurrency === 'SAR' ? 32.80 : (senderCurrency === 'AED' ? 33.50 : 27.50)
  };
  const rateToBdt = currentRateObj?.rateToBdt || (senderCurrency === 'SAR' ? 32.80 : (senderCurrency === 'AED' ? 33.50 : 27.50));
  
  // Calculated BDT receive amount
  const parsedSendAmount = parseFloat(sendAmount) || 0;
  const receiveBdtAmount = Math.round(parsedSendAmount * rateToBdt);

  // Admin Deposit Account for the selected currency
  const senderAccounts = settings?.senderAccounts || [];
  const currentDepositAccount = senderAccounts.find(a => a.currency === senderCurrency) || {
    bankName: senderCurrency === 'SAR' ? 'Al Rajhi Bank' : (senderCurrency === 'AED' ? 'Emirates NBD' : 'Maybank'),
    accountName: senderCurrency === 'SAR' ? 'Fast Send KSA' : (senderCurrency === 'AED' ? 'Fast Send UAE LLC' : 'Fast Send Global MY'),
    accountNumber: senderCurrency === 'SAR' ? 'SA4480000123456789012345' : (senderCurrency === 'AED' ? 'AE250260001234567890123' : '514012345678'),
    duitNowId: senderCurrency === 'MYR' ? '+60123456789' : '',
    stcPay: senderCurrency === 'SAR' ? '+966501234567' : '',
    payByPhone: senderCurrency === 'AED' ? '+971501234567' : '',
    instructions: 'উপরের ব্যাংক অ্যাকাউন্টে টাকা পাঠিয়ে ট্রানজেকশনের স্ক্রিনশট ও রেফারেন্স নম্বর দিন।'
  };

  useEffect(() => {
    if (user?.phone) {
      fetchRecipients(user.phone);
    }
  }, [user]);

  // Set default recipient if list exists
  useEffect(() => {
    if (recipients && recipients.length > 0 && !selectedRecipientId) {
      setSelectedRecipientId(recipients[0].id);
    }
  }, [recipients]);

  const selectedRecipient = (recipients || []).find(r => r.id === selectedRecipientId);

  // Copy to clipboard helper
  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} কপি করা হয়েছে!`, "info");
    setTimeout(() => setCopiedField(''), 2500);
  };

  // Handle Screenshot Upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast("ছবির সাইজ সর্বোচ্চ ৮ মেগাবাইট হতে পারবে।", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProofImage(event.target.result);
      showToast("পেমেন্ট স্ক্রিনশট যুক্ত হয়েছে!", "success");
    };
    reader.readAsDataURL(file);
  };

  // Handle Save New Recipient
  const handleSaveRecipient = async (e) => {
    e.preventDefault();
    if (!recipientForm.name.trim()) {
      showToast("প্রাপকের নাম প্রদান করুন।", "error");
      return;
    }

    if (recipientForm.channel === 'bank') {
      if (!recipientForm.accountNumber.trim()) {
        showToast("ব্যাংক অ্যাকাউন্ট নম্বর প্রদান করুন।", "error");
        return;
      }
    } else {
      if (!recipientForm.phone || recipientForm.phone.length < 11) {
        showToast("সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।", "error");
        return;
      }
    }

    const res = await addRecipient(recipientForm);
    if (res.success && res.recipient) {
      setSelectedRecipientId(res.recipient.id);
      setShowAddRecipientModal(false);
      setRecipientForm({
        name: '',
        phone: '',
        channel: 'bkash',
        bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
        accountNumber: '',
        accountHolder: '',
        branch: '',
        district: '',
        relationship: 'পরিবার'
      });
    }
  };

  // Handle Remittance Submit
  const handleRemittanceSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRecipient) {
      showToast("দয়া করে টাকা গ্রহণকারী প্রাপক নির্বাচন করুন অথবা নতুন প্রাপক যোগ করুন।", "error");
      return;
    }

    if (!parsedSendAmount || parsedSendAmount <= 0) {
      showToast("টাকার সঠিক পরিমাণ লিখুন।", "error");
      return;
    }

    if (!proofImage) {
      showToast("দয়া করে পেমেন্টের স্ক্রিনশট / রসিদের ছবি আপলোড করুন।", "error");
      return;
    }

    const payload = {
      senderCountry: senderOptions.find(o => o.code === senderCurrency)?.country || 'Malaysia',
      senderCurrency,
      sendAmount: parsedSendAmount,
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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (submittedTx) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto">
        <StandardHeader title="রেমিটেন্স আবেদন গৃহীত" onBack={() => onNavigate('home')} />

        <div className="p-4 space-y-4 animate-fade-in flex-1">
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 shadow-md space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-[#00823B] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 animate-spin" /> অপেক্ষমান (পেমেন্ট পর্যালোচনাধীন)
              </span>
              <h2 className="text-xl font-black text-slate-900">রেমিটেন্স সফলভাবে জমা হয়েছে!</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                অ্যাডমিন আপনার পেমেন্ট স্ক্রিনশট যাচাই করে সরাসরি বাংলাদেশে প্রাপকের নম্বরে/অ্যাকাউন্টে টাকা পাঠিয়ে দিবেন।
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">ট্রানজেকশন আইডি:</span>
                <span className="font-mono font-bold text-slate-900">{submittedTx.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">প্রেরিত পরিমাণ:</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{submittedTx.sendAmount} {submittedTx.senderCurrency}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">এক্সচেঞ্জ রেট:</span>
                <span className="font-bold text-slate-700 font-mono">১ {submittedTx.senderCurrency} = {submittedTx.exchangeRate} ৳</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 bg-emerald-50/70 p-2 rounded-xl">
                <span className="text-emerald-900 font-bold">বাংলাদেশে প্রাপক পাবে:</span>
                <span className="font-black text-[#00823B] font-mono text-base">৳ {Number(submittedTx.receiveAmount).toLocaleString('bn-BD')}/=</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500 font-medium">প্রাপক:</span>
                <span className="font-bold text-slate-900 text-right">
                  {submittedTx.recipient?.name} ({submittedTx.recipient?.phone || submittedTx.recipient?.accountNumber})
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => onNavigate('history')}
                className="w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>লেনদেন হিস্ট্রি দেখুন ➔</span>
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-md mx-auto pb-10">
      <StandardHeader title="প্রবাসী রেমিটেন্স সেবা" onBack={() => onNavigate('home')} />

      {/* Top Route Banner */}
      <div className="bg-gradient-to-r from-[#00823B] to-[#005a28] text-white px-5 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇲🇾 🇸🇦 🇦🇪</span>
            <ArrowRight className="w-4 h-4 text-emerald-200" />
            <span className="text-xl">🇧🇩</span>
          </div>
          <span className="bg-white/20 backdrop-blur-xs text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/30">
            ❤️ চার্জ ৳০ (ফ্রি ট্রান্সফার)
          </span>
        </div>
        <p className="text-xs text-emerald-100 mt-2 font-medium">
          মালয়েশিয়া, সৌদি আরব ও দুবাই থেকে বাংলাদেশে দ্রুত, নিরাপদ ও লাইভ রেটে টাকা পাঠান
        </p>
      </div>

      <form onSubmit={handleRemittanceSubmit} className="p-4 space-y-4">
        
        {/* ================= SECTION 1: RECIPIENT SELECTION ================= */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#00823B]" />
              <h3 className="font-black text-slate-900 text-sm">১. বাংলাদেশে প্রাপক নির্বাচন করুন</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddRecipientModal(true)}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#00823B] border border-emerald-300 font-bold text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন প্রাপক</span>
            </button>
          </div>

          {/* Recipients List */}
          {recipients && recipients.length > 0 ? (
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {recipients.map((rec) => {
                const isSelected = rec.id === selectedRecipientId;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecipientId(rec.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'border-[#00823B] bg-emerald-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        rec.channel === 'bank' 
                          ? 'bg-blue-100 text-blue-800' 
                          : (rec.channel === 'cash' ? 'bg-amber-100 text-amber-800' : 'bg-pink-100 text-[#E2136E]')
                      }`}>
                        {rec.channel === 'bank' ? <Building2 className="w-5 h-5" /> : (rec.channel === 'cash' ? <MapPin className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-xs">{rec.name}</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            {rec.relationship || 'পরিবার'}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                          {rec.channel === 'bank' 
                            ? `${rec.bankName || 'ব্যাংক'} • ${rec.accountNumber}`
                            : `${(rec.channel || 'বিকাশ').toUpperCase()}: ${rec.phone}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#00823B] text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-[#00823B]" />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`আপনি কি "${rec.name}" প্রাপক তালিকা থেকে মুছে ফেলতে চান?`)) {
                            deleteRecipient(rec.id);
                          }
                        }}
                        className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2">
              <User className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-600 font-medium">আপনার কোনো সংরক্ষিত প্রাপক নেই</p>
              <button
                type="button"
                onClick={() => setShowAddRecipientModal(true)}
                className="bg-[#00823B] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>প্রথম প্রাপক যোগ করুন</span>
              </button>
            </div>
          )}
        </div>

        {/* ================= SECTION 2: AMOUNT & CURRENCY CALCULATOR ================= */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Globe className="w-5 h-5 text-[#00823B]" />
            <h3 className="font-black text-slate-900 text-sm">২. পাঠানোর পরিমাণ ও লাইভ রেট</h3>
          </div>

          {/* Country / Currency Selection (Malaysia, Saudi Arabia, Dubai) */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">
              প্রেরক দেশ ও কারেন্সি নির্বাচন করুন:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {senderOptions.map((opt) => {
                const isSelected = senderCurrency === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setSenderCurrency(opt.code)}
                    className={`py-2.5 px-2 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'border-[#00823B] bg-emerald-50 text-[#00823B] shadow-xs font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{opt.flag}</span>
                    <span className="text-xs font-black">{opt.code}</span>
                    <span className="text-[10px] text-slate-500 font-normal truncate w-full">{opt.countryBn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Send Amount Input */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              আপনি পাঠাবেন ({senderCurrency}):
            </label>
            <div className="relative flex items-center bg-slate-50 rounded-2xl border-2 border-slate-300 focus-within:border-[#00823B] focus-within:bg-white shadow-xs">
              <span className="pl-4 font-bold text-slate-500 text-sm font-mono">{senderCurrency}</span>
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="পরিমাণ লিখুন"
                className="w-full bg-transparent py-3.5 pl-3 pr-4 text-xl font-bold font-mono text-slate-900 focus:outline-none"
              />
            </div>

            {/* Quick Amounts */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(quickAmountsMap[senderCurrency] || [200, 500, 1000, 2000]).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSendAmount(String(q))}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    sendAmount === String(q)
                      ? 'bg-[#00823B] text-white border-[#00823B] font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  +{q}
                </button>
              ))}
            </div>
          </div>

          {/* Live Rate & Receive BDT Card */}
          <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-900 font-medium">
              <span>লাইভ এক্সচেঞ্জ রেট:</span>
              <span className="font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                ১ {senderCurrency} = {rateToBdt} ৳
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60">
              <span className="text-xs font-bold text-slate-800">বাংলাদেশে প্রাপক পাবে:</span>
              <span className="text-xl font-black text-[#00823B] font-mono">
                ৳ {Number(receiveBdtAmount).toLocaleString('bn-BD')}/=
              </span>
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: ADMIN DEPOSIT ACCOUNT DETAILS ================= */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#00823B]" />
              <h3 className="font-black text-slate-900 text-sm">৩. পেমেন্ট পাঠানোর অ্যাকাউন্ট ({senderCurrency})</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              অফিশিয়াল ডিপোজিট
            </span>
          </div>

          <p className="text-xs text-slate-600 font-normal">
            আপনার লোকাল ব্যাংক বা ওয়ালেট অ্যাপ থেকে নিচের অ্যাকাউন্টে <b>{sendAmount} {senderCurrency}</b> পাঠিয়ে দিন:
          </p>

          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 font-mono text-xs">
            {/* Bank Name & Account Name */}
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">ব্যাংক ও হিসাবধারী:</span>
              <span className="font-bold text-emerald-400 block text-sm font-sans">{currentDepositAccount.bankName}</span>
              <span className="text-slate-300 text-xs font-sans">{currentDepositAccount.accountName}</span>
            </div>

            {/* Account / IBAN Number */}
            <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">অ্যাকাউন্ট / IBAN:</span>
                <span className="text-white font-bold text-sm select-all">{currentDepositAccount.accountNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(currentDepositAccount.accountNumber, "অ্যাকাউন্ট নম্বর")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-all cursor-pointer shrink-0 ml-2"
                title="কপি করুন"
              >
                {copiedField === "অ্যাকাউন্ট নম্বর" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* DuitNow / STC Pay / PayBy if applicable */}
            {(currentDepositAccount.duitNowId || currentDepositAccount.stcPay || currentDepositAccount.payByPhone) && (
              <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                    {senderCurrency === 'MYR' ? 'DuitNow ID / Phone:' : (senderCurrency === 'SAR' ? 'STC Pay ID:' : 'PayBy Phone:')}
                  </span>
                  <span className="text-white font-bold text-sm select-all">
                    {currentDepositAccount.duitNowId || currentDepositAccount.stcPay || currentDepositAccount.payByPhone}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(
                    currentDepositAccount.duitNowId || currentDepositAccount.stcPay || currentDepositAccount.payByPhone,
                    "মোবাইল / আইডি"
                  )}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-all cursor-pointer shrink-0 ml-2"
                  title="কপি করুন"
                >
                  {copiedField === "মোবাইল / আইডি" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= SECTION 4: PAYMENT PROOF & SCREENSHOT ================= */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Upload className="w-5 h-5 text-[#00823B]" />
            <h3 className="font-black text-slate-900 text-sm">৪. পেমেন্ট স্ক্রিনশট ও তথ্য জমা দিন</h3>
          </div>

          {/* Screenshot Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>পেমেন্টের স্ক্রিনশট / রসিদ <span className="text-rose-500">* (আবশ্যক)</span></span>
              {proofImage && <span className="text-[11px] text-emerald-600 font-bold">✓ ছবি নির্বাচিত</span>}
            </label>

            {proofImage ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-900 group">
                <img src={proofImage} alt="Payment Proof" className="w-full max-h-60 object-contain mx-auto" />
                <button
                  type="button"
                  onClick={() => setProofImage(null)}
                  className="absolute top-2 right-2 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-lg transition-all cursor-pointer"
                  title="ছবি মুছুন"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all space-y-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#00823B] shadow-xs">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-900 block">গ্যালারি বা ক্যামেরা থেকে স্ক্রিনশট আপলোড করুন</span>
                  <span className="text-[11px] text-slate-500">JPG, PNG বা WEBP (সর্বোচ্চ ৮ মেগাবাইট)</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Deposit TrxID / Ref */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              ট্রানজেকশন আইডি / রেফারেন্স নম্বর (ব্যাংক রসিদের TrxID):
            </label>
            <input
              type="text"
              value={depositTrxId}
              onChange={(e) => setDepositTrxId(e.target.value)}
              placeholder="যেমন: MBB12345678 বা Ref Number"
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-3 px-3.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00823B]"
            />
          </div>

          {/* Sender Bank / Wallet */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              আপনার ব্যাংক বা অ্যাপের নাম (ঐচ্ছিক):
            </label>
            <input
              type="text"
              value={senderBankName}
              onChange={(e) => setSenderBankName(e.target.value)}
              placeholder="যেমন: Maybank2u, Al Rajhi App, STC Pay..."
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-[#00823B]"
            />
          </div>

          {/* Sender Note */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              অ্যাডমিনের জন্য কোনো বিশেষ নোট (ঐচ্ছিক):
            </label>
            <input
              type="text"
              value={senderNote}
              onChange={(e) => setSenderNote(e.target.value)}
              placeholder="যেমন: জরুরি রেমিটেন্স..."
              className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-3 px-3.5 text-xs text-slate-900 focus:outline-none focus:border-[#00823B]"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading || !selectedRecipient}
          className="w-full bg-[#00823B] hover:bg-[#006837] text-white font-black py-4 rounded-2xl text-sm shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>রেমিটেন্স সাবমিট হচ্ছে...</span>
            </>
          ) : (
            <>
              <span>রেমিটেন্স আবেদন সাবমিট করুন ({sendAmount} {senderCurrency})</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* ================= MODAL: ADD NEW RECIPIENT ================= */}
      {showAddRecipientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md p-5 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#00823B]" />
                <h3 className="font-black text-slate-900 text-sm">বাংলাদেশে নতুন প্রাপক যোগ করুন</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddRecipientModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipient} className="space-y-3.5">
              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  টাকা পাওয়ার মাধ্যম (Payout Channel):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bkash', name: 'বিকাশ', icon: '📱' },
                    { id: 'nagad', name: 'নগদ', icon: '📱' },
                    { id: 'rocket', name: 'রকেট', icon: '📱' },
                    { id: 'upay', name: 'উপায়', icon: '📱' },
                    { id: 'bank', name: 'ব্যাংক একাউন্ট', icon: '🏦' },
                    { id: 'cash', name: 'ক্যাশ পিকআপ', icon: '🏢' }
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setRecipientForm({ ...recipientForm, channel: ch.id })}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        recipientForm.channel === ch.id
                          ? 'border-[#00823B] bg-emerald-50 text-[#00823B] shadow-2xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{ch.icon}</span>
                      <span>{ch.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  প্রাপকের পূর্ণ নাম (এনআইডি অনুযায়ী) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={recipientForm.name}
                  onChange={(e) => setRecipientForm({ ...recipientForm, name: e.target.value })}
                  placeholder="যেমন: মোসাঃ ফাতেমা বেগম"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-2.5 px-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#00823B]"
                />
              </div>

              {/* Mobile Number for MFS & Cash */}
              {recipientForm.channel !== 'bank' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    ১১ ডিজিটের মোবাইল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={recipientForm.phone}
                    onChange={(e) => setRecipientForm({ ...recipientForm, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-2.5 px-3 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:border-[#00823B]"
                  />
                </div>
              )}

              {/* Bank Specific Fields */}
              {recipientForm.channel === 'bank' && (
                <div className="space-y-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      ব্যাংক নির্বাচন করুন <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={recipientForm.bankName}
                      onChange={(e) => setRecipientForm({ ...recipientForm, bankName: e.target.value })}
                      className="w-full bg-white border-2 border-slate-300 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#00823B]"
                    >
                      {bdBanksList.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      ব্যাংক অ্যাকাউন্ট নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientForm.accountNumber}
                      onChange={(e) => setRecipientForm({ ...recipientForm, accountNumber: e.target.value })}
                      placeholder="যেমন: 2050345678901234"
                      className="w-full bg-white border-2 border-slate-300 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00823B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        শাখার নাম (Branch)
                      </label>
                      <input
                        type="text"
                        value={recipientForm.branch}
                        onChange={(e) => setRecipientForm({ ...recipientForm, branch: e.target.value })}
                        placeholder="যেমন: মতিঝিল শাখা"
                        className="w-full bg-white border-2 border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-[#00823B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        নোটিফিকেশন মোবাইল
                      </label>
                      <input
                        type="tel"
                        value={recipientForm.phone}
                        onChange={(e) => setRecipientForm({ ...recipientForm, phone: e.target.value })}
                        placeholder="017XXXXXXXX"
                        className="w-full bg-white border-2 border-slate-300 rounded-xl py-2 px-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#00823B]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Relationship with Recipient */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    সম্পর্ক:
                  </label>
                  <select
                    value={recipientForm.relationship}
                    onChange={(e) => setRecipientForm({ ...recipientForm, relationship: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-2.5 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00823B]"
                  >
                    <option value="মা">মা</option>
                    <option value="বাবা">বাবা</option>
                    <option value="স্ত্রী">স্ত্রী</option>
                    <option value="স্বামী">স্বামী</option>
                    <option value="ভাই">ভাই</option>
                    <option value="বোন">বোন</option>
                    <option value="সন্তান">সন্তান</option>
                    <option value="বন্ধু">বন্ধু</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    জেলা (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={recipientForm.district}
                    onChange={(e) => setRecipientForm({ ...recipientForm, district: e.target.value })}
                    placeholder="যেমন: ঢাকা / কুমিল্লা"
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:border-[#00823B]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRecipientModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  {loading ? "সংরক্ষণ হচ্ছে..." : "প্রাপক সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
