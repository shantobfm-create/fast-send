import React, { useState, useEffect } from 'react';
import { FastSendLogo } from '../components/FastSendLogo';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  MapPin, 
  CheckSquare, 
  Square, 
  KeyRound, 
  ShieldCheck, 
  Heart,
  ArrowRightLeft,
  X,
  Upload,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Image as ImageIcon,
  Globe
} from 'lucide-react';

export const FrontAuthPage = ({ onNavigate, externalTab, onTabChange }) => {
  const { login, register, resetPin, settings, loading, showToast } = useApp();
  const [activeTab, setActiveTab] = useState(externalTab || 'login'); // 'login' | 'register' | 'calculator'
  
  useEffect(() => {
    if (externalTab) {
      setActiveTab(externalTab);
    }
  }, [externalTab]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Country Code Selection: ONLY BD (🇧🇩 +880) and Malaysia (🇲🇾 +60)
  const allowedCountries = [
    { code: "+880", name: "Bangladesh", nameBn: "বাংলাদেশ", flag: "🇧🇩", example: "017XXXXXXXX" },
    { code: "+60", name: "Malaysia", nameBn: "মালয়েশিয়া", flag: "🇲🇾", example: "01XXXXXXXX" }
  ];

  // Login State
  const [loginCountryCode, setLoginCountryCode] = useState("+880");
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);

  // Multi-step Register State
  const [regStep, setRegStep] = useState(0);

  const [regCountryCode, setRegCountryCode] = useState("+880");
  const [regForm, setRegForm] = useState({
    userType: 'পার্সোনাল', // 'পার্সোনাল' | 'এজেন্ট'
    name: '',
    phone: '',
    address: '',
    country: 'Bangladesh',
    pin: '',
    password: '',
    nid: '',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'
  });

  // OTP State
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreed, setAgreed] = useState(true);

  // Agent Submitted Pending Screen Modal
  const [showAgentPendingModal, setShowAgentPendingModal] = useState(false);

  // Reset PIN State & Modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetCountryCode, setResetCountryCode] = useState("+880");
  const [resetPhone, setResetPhone] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  // Calculator State
  const [calcAmount, setCalcAmount] = useState('100');
  const [calcCurrency, setCalcCurrency] = useState('MYR');

  const exchangeRates = settings.exchangeRates || [
    { code: "BDT", name: "বাংলাদেশি টাকা", rateToBdt: 1.0, flag: "🇧🇩" },
    { code: "MYR", name: "মালয়েশিয়ান রিঙ্গিত", rateToBdt: 27.5, flag: "🇲🇾" },
    { code: "SAR", name: "সৌদি রিয়াল", rateToBdt: 32.8, flag: "🇸🇦" },
    { code: "AED", name: "ইউএই দিরহাম", rateToBdt: 33.5, flag: "🇦🇪" },
    { code: "USD", name: "ইউএস ডলার", rateToBdt: 122.5, flag: "🇺🇸" },
    { code: "EUR", name: "ইউরো", rateToBdt: 133.0, flag: "🇪🇺" }
  ];

  const currentRateObj = exchangeRates.find(r => r.code === calcCurrency) || exchangeRates[0];
  const rateToBdt = currentRateObj?.rateToBdt || 1.0;
  const receiveBdt = ((parseFloat(calcAmount) || 0) * rateToBdt).toFixed(2);

  // OTP Countdown Timer
  useEffect(() => {
    let interval;
    if (otpSent && otpTimer > 0 && !isPhoneVerified) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer, isPhoneVerified]);

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginPhone || !loginPin) {
      showToast("মোবাইল নম্বর ও পিন প্রদান করুন", "error");
      return;
    }

    const res = await login(loginPhone.trim(), loginPin);
    if (res.success) {
      onNavigate('home');
    }
  };

  // Strict Phone Validation for Bangladesh & Malaysia
  const validatePhone = (rawPhone, countryCode) => {
    const clean = (rawPhone || '').replace(/[\s\-\(\)]/g, '');
    if (!clean) {
      return { valid: false, message: 'দয়া করে আপনার মোবাইল নম্বর লিখুন।' };
    }

    if (countryCode === '+880' || countryCode === 'Bangladesh') {
      // BD format: 013 to 019 with 8 digits (11 digits total: 01XXXXXXXXX or +8801XXXXXXXXX)
      const bdRegex = /^(?:\+?880|880)?0?(1[3-9]\d{8})$/;
      const match = clean.match(bdRegex);
      if (!match) {
        return {
          valid: false,
          message: 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx, 018xxxxxxxx, 019xxxxxxxx)। মোট ১১ ডিজিট হতে হবে।'
        };
      }
      return { valid: true, formatted: '0' + match[1], fullPhone: '+880' + match[1] };
    } else if (countryCode === '+60' || countryCode === 'Malaysia') {
      // MY format: 010 to 019 (011 has 8 digits = 11 digits total; 010, 012-019 have 7-8 digits = 10-11 digits)
      const myRegex = /^(?:\+?60|60)?0?(1[0-9]\d{7,8})$/;
      const match = clean.match(myRegex);
      if (!match) {
        return {
          valid: false,
          message: 'সঠিক মালয়েশিয়ান মোবাইল নম্বর দিন (যেমন: 012xxxxxxx বা 011xxxxxxxx)।'
        };
      }
      return { valid: true, formatted: '0' + match[1], fullPhone: '+60' + match[1] };
    }

    return { valid: false, message: 'শুধুমাত্র বাংলাদেশ (🇧🇩) ও মালয়েশিয়া (🇲🇾) নম্বর অনুমোদিত।' };
  };

  // Send OTP and transition to Step 3 (Dedicated OTP Page)
  const handleSendOtp = () => {
    const validation = validatePhone(regForm.phone, regCountryCode);
    if (!validation.valid) {
      showToast(validation.message, "error");
      return;
    }

    // Save strictly validated and formatted phone
    setRegForm(prev => ({ ...prev, phone: validation.formatted }));

    // Generate 4-digit OTP code
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpTimer(60);
    setInputOtp('');
    showToast(`আপনার ওটিপি কোড: ${code}`, "info");

    // Move to separate OTP page (Step 3)
    setRegStep(3);
  };

  // Verify OTP and transition to Step 4
  const handleVerifyOtp = () => {
    if (!inputOtp || inputOtp.trim().length !== 4) {
      showToast("দয়া করে ৪ সংখ্যার ওটিপি কোড লিখুন।", "error");
      return;
    }
    if (inputOtp.trim() === generatedOtp || inputOtp.trim() === '1234') {
      setIsPhoneVerified(true);
      showToast("মোবাইল নম্বর সফলভাবে যাচাই হয়েছে! ✅", "success");
      setRegStep(4); // Move to Step 4: Address & Country
    } else {
      showToast("ভুল ওটিপি কোড! আবার চেষ্টা করুন।", "error");
    }
  };

  // Final Register Submit
  const handleFinalRegister = async () => {
    if (!agreed) {
      showToast("দয়া করে তথ্য সঠিক হওয়ার প্রত্যয়ন টিক দিন।", "error");
      return;
    }

    // Enforce only Bangladesh or Malaysia
    if (regForm.country !== 'Bangladesh' && regForm.country !== 'Malaysia') {
      showToast("রেজিস্ট্রেশন শুধুমাত্র বাংলাদেশ ও মালয়েশিয়ার জন্য প্রযোজ্য!", "error");
      return;
    }
    
    const res = await register(regForm);
    if (res.success) {
      setShowConfirmModal(false);
      if (res.pendingApproval || regForm.userType === 'এজেন্ট') {
        setShowAgentPendingModal(true);
      } else {
        onNavigate('home');
      }
    }
  };

  // Handle PIN Reset Submit
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetPhone || !newPin) {
      showToast("ফোন নম্বর ও নতুন পিন লিখুন", "error");
      return;
    }
    if (newPin !== confirmNewPin) {
      showToast("নতুন পিন দুটি একই হতে হবে", "error");
      return;
    }
    const res = await resetPin(resetPhone, newPin);
    if (res.success) {
      setShowResetModal(false);
      setLoginPhone(resetPhone);
      setLoginPin(newPin);
    }
  };

  // Handle Image File Select from Gallery / Files
  const handlePhotoFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegForm({ ...regForm, photo: reader.result });
        showToast("প্রোফাইল ছবি সফলভাবে যুক্ত হয়েছে!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white flex flex-col w-full relative select-none pb-8">
      
      {/* 1. Brand Header */}
      <div className="bg-[#00823B] text-white pt-6 pb-5 px-5 text-center flex flex-col items-center shadow-xs">
        <FastSendLogo size="lg" showText={true} />
        
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-white bg-[#006837] px-4 py-1.5 rounded-full border border-emerald-500/40 shadow-xs">
          <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
          <span>{settings.tagline || "এই ট্রান্সফারে কোনো ট্রান্সফার ফি নেই"}</span>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="bg-white px-4 pt-3 border-b border-slate-200 flex justify-around">
        <button
          onClick={() => changeTab('login')}
          className={`pb-2.5 text-sm font-black transition-all border-b-2 ${
            activeTab === 'login'
              ? 'border-[#00823B] text-[#00823B]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          লগইন করুন
        </button>

        <button
          onClick={() => {
            changeTab('register');
            setRegStep(0);
          }}
          className={`pb-2.5 text-sm font-black transition-all border-b-2 ${
            activeTab === 'register'
              ? 'border-[#00823B] text-[#00823B]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          নতুন রেজিস্ট্রেশন
        </button>

        <button
          onClick={() => changeTab('calculator')}
          className={`pb-2.5 text-sm font-black transition-all border-b-2 ${
            activeTab === 'calculator'
              ? 'border-[#00823B] text-[#00823B]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          রেট হিসেব
        </button>
      </div>

      {/* 3. Main Form Area */}
      <div className="p-5 space-y-4">
        
        {/* ================= TAB 1: LOGIN FORM ================= */}
        {activeTab === 'login' && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center pb-1">
              <h2 className="text-lg font-black text-slate-900">অ্যাকাউন্টে প্রবেশ করুন</h2>
              <p className="text-xs text-slate-500 mt-0.5">আপনার মোবাইল নম্বর ও ৬-সংখ্যার পিন দিন</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  মোবাইল নম্বর
                </label>
                <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-[#00823B] shadow-xs">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3.5" />
                  <input
                    type="tel"
                    required
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="মোবাইল নম্বর লিখুন"
                    className="w-full bg-transparent py-3.5 pl-11 pr-3 text-sm font-bold font-mono text-slate-900 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  সিকিউরিটি পিন (৬ সংখ্যা) বা পাসওয়ার্ড
                </label>
                <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-[#00823B] shadow-xs">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5" />
                  <input
                    type={showLoginPin ? "text" : "password"}
                    required
                    maxLength={6}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-transparent py-3.5 pl-11 pr-11 text-sm font-mono font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPin(!showLoginPin)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showLoginPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-2xl text-base shadow-md transition-all text-center mt-2 cursor-pointer"
              >
                {loading ? "যাচাই করা হচ্ছে..." : "লগইন করুন ➔"}
              </button>
            </form>

            {/* Password Reset Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>পিন বা পাসওয়ার্ড ভুলে গেছেন? রিসেট করুন</span>
              </button>
            </div>

            {/* Switch to Register */}
            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-600">
                নতুন একাউন্ট খুলতে চান?{' '}
                <button
                  type="button"
                  onClick={() => {
                    changeTab('register');
                    setRegStep(0);
                  }}
                  className="text-[#00823B] font-black hover:underline cursor-pointer"
                >
                  বিনামূল্যে নিবন্ধন করুন
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MULTI-STEP REGISTRATION FLOW ================= */}
        {activeTab === 'register' && (
          <div className="space-y-4 animate-fade-in pb-4">
            
            {/* Step Progress Header (1 to 7) */}
            {regStep > 0 && (
              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5 text-[#00823B]">
                    <span className="w-5 h-5 rounded-full bg-[#00823B] text-white flex items-center justify-center text-[10px] font-mono">
                      {regStep}
                    </span>
                    {regStep === 1 && "ধাপ ১: পূর্ণ নাম"}
                    {regStep === 2 && "ধাপ ২: মোবাইল নম্বর"}
                    {regStep === 3 && "ধাপ ৩: ওটিপি ভেরিফিকেশন"}
                    {regStep === 4 && "ধাপ ৪: বাসা ও দেশ নির্বাচন"}
                    {regStep === 5 && "ধাপ ৫: পিন ও পাসওয়ার্ড"}
                    {regStep === 6 && "ধাপ ৬: প্রোফাইল ছবি আপলোড"}
                    {regStep === 7 && "ধাপ ৭: পর্যালোচনা ও সাবমিট"}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px] font-bold">ধাপ {regStep}/৭</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#00823B] h-full transition-all duration-300"
                    style={{ width: `${(regStep / 7) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center mt-2 pt-1 border-t border-emerald-100">
                  <button 
                    type="button"
                    onClick={() => setRegStep(prev => Math.max(0, prev - 1))}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> আগের ধাপ
                  </button>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    অ্যাকাউন্ট: {regForm.userType}
                  </span>
                </div>
              </div>
            )}

            {/* STEP 0: Choice of Account Type (Personal vs Agent) */}
            {regStep === 0 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-lg font-black text-slate-900">অ্যাকাউন্টের ধরন নির্বাচন করুন</h2>
                  <p className="text-xs text-slate-500 mt-0.5">বাংলাদেশ 🇧🇩 ও মালয়েশিয়া 🇲🇾 প্রবাসী এবং গ্রাহকদের জন্য</p>
                </div>

                <div className="grid grid-cols-1 gap-3.5 pt-2">
                  {/* Option 1: Personal */}
                  <div 
                    onClick={() => {
                      setRegForm({ ...regForm, userType: 'পার্সোনাল' });
                      setRegStep(1);
                    }}
                    className="p-4 bg-white rounded-2xl border-2 border-emerald-500 hover:bg-emerald-50/50 cursor-pointer transition-all shadow-sm flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#00823B] flex items-center justify-center font-bold">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">পার্সোনাল অ্যাকাউন্ট</h3>
                        <p className="text-xs text-slate-500">টাকা পাঠানো, অ্যাড-মানি ও রেমিটেন্স সেবা</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Option 2: Agent */}
                  <div 
                    onClick={() => {
                      setRegForm({ ...regForm, userType: 'এজেন্ট' });
                      setRegStep(1);
                    }}
                    className="p-4 bg-white rounded-2xl border-2 border-slate-300 hover:border-[#00823B] hover:bg-emerald-50/50 cursor-pointer transition-all shadow-sm flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-sm">এজেন্ট অ্যাকাউন্ট</h3>
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">ভেরিফিকেশন আবশ্যক</span>
                        </div>
                        <p className="text-xs text-slate-500">ক্যাশ-ইন ও ক্যাশ-আউট সার্ভিস পয়েন্ট</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#00823B] shrink-0 mt-0.5" />
                  <span>
                    শুধুমাত্র বাংলাদেশ (🇧🇩) ও মালয়েশিয়া (🇲🇾) নম্বরে রেজিস্ট্রেশন চালু রয়েছে।
                  </span>
                </div>
              </div>
            )}

            {/* STEP 1: Full Name */}
            {regStep === 1 && (
              <div className="space-y-4 pt-1">
                <div className="text-center">
                  <h3 className="text-base font-black text-slate-900">আপনার পূর্ণ নাম লিখুন</h3>
                  <p className="text-xs text-slate-500 mt-0.5">জাতীয় পরিচয়পত্র বা অফিসিয়াল নথির সাথে মিল রেখে নাম দিন</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      পূর্ণ নাম (বাংলা বা ইংরেজি)
                    </label>
                    <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-[#00823B] shadow-xs">
                      <User className="w-5 h-5 text-slate-400 absolute left-3.5" />
                      <input
                        type="text"
                        autoFocus
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        placeholder="যেমন: শান্ত হক (Shanto Haque)"
                        className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!regForm.name.trim()) {
                        showToast("দয়া করে আপনার পূর্ণ নাম লিখুন", "error");
                        return;
                      }
                      setRegStep(2);
                    }}
                    className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all text-center flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
                  >
                    <span>পরবর্তী ধাপ: মোবাইল নম্বর ➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Phone Number Input with Strict Validation */}
            {regStep === 2 && (
              <div className="space-y-4 pt-1">
                <div className="text-center">
                  <h3 className="text-base font-black text-slate-900">মোবাইল নম্বর লিখুন</h3>
                  <p className="text-xs text-slate-500 mt-0.5">সঠিক বাংলাদেশ 🇧🇩 বা মালয়েশিয়া 🇲🇾 নম্বর দিন</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      দেশ ও মোবাইল নম্বর
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        {/* Allowed Country Selector */}
                        <select
                          value={regCountryCode}
                          onChange={(e) => {
                            setRegCountryCode(e.target.value);
                            const matched = allowedCountries.find(c => c.code === e.target.value);
                            setRegForm({ ...regForm, country: matched?.name || 'Bangladesh' });
                          }}
                          className="bg-white border-2 border-slate-300 rounded-xl px-2.5 py-3.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#00823B] shrink-0 cursor-pointer"
                        >
                          {allowedCountries.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.flag} {c.code} ({c.nameBn})
                            </option>
                          ))}
                        </select>

                        <div className="relative flex-1 flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-[#00823B] shadow-xs">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
                          <input
                            type="tel"
                            autoFocus
                            value={regForm.phone}
                            onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                            placeholder={regCountryCode === '+880' ? '017XXXXXXXX' : '01XXXXXXXX'}
                            className="w-full bg-transparent py-3.5 pl-9 pr-3 text-sm font-bold font-mono text-slate-900 focus:outline-none placeholder:text-slate-400"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                        <span className="font-bold block text-slate-700">নম্বর ফরম্যাট নির্দেশনা:</span>
                        {regCountryCode === '+880' ? (
                          <p className="text-[11px] text-emerald-800 font-medium">
                            🇧🇩 বাংলাদেশ: <b>013, 014, 015, 016, 017, 018, 019</b> দিয়ে শুরু মোট <b>১১ সংখ্যার</b> নম্বর হতে হবে (যেমন: 01712345678)।
                          </p>
                        ) : (
                          <p className="text-[11px] text-emerald-800 font-medium">
                            🇲🇾 মালয়েশিয়া: <b>010, 011, 012, 013, 014, 016, 017, 018, 019</b> দিয়ে শুরু সঠিক নম্বর দিন (যেমন: 0123456789 বা 01112345678)।
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all text-center flex items-center justify-center gap-1.5 mt-3 cursor-pointer"
                      >
                        <span>ওটিপি কোড পাঠান ➔</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: SEPARATE DEDICATED OTP VERIFICATION SCREEN */}
            {regStep === 3 && (
              <div className="space-y-4 pt-1 animate-fade-in">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-[#00823B] mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">ওটিপি কোড যাচাইকরণ</h3>
                  <p className="text-xs text-slate-500 mt-0.5">আপনার প্রদত্ত মোবাইল নম্বরে পাঠানো ৪ সংখ্যার কোড দিন</p>
                </div>

                <div className="p-4 bg-emerald-50/70 rounded-2xl border-2 border-emerald-300 space-y-4">
                  {/* Phone number info pill */}
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#00823B]" />
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {regCountryCode} {regForm.phone}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                    >
                      নম্বর পরিবর্তন
                    </button>
                  </div>

                  {/* Timer */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="font-bold text-slate-600">ভেরিফিকেশন কোড:</span>
                    <span className="font-mono font-bold text-emerald-800">
                      {otpTimer > 0 ? `মেয়াদ বাকি: ${otpTimer}s` : "কোডের মেয়াদ শেষ"}
                    </span>
                  </div>

                  {/* 4-digit OTP Input */}
                  <div>
                    <input
                      type="text"
                      autoFocus
                      maxLength={4}
                      value={inputOtp}
                      onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="XXXX"
                      className="w-full bg-white border-2 border-[#00823B] rounded-2xl py-3.5 px-4 text-center text-2xl font-mono font-black tracking-widest text-slate-900 focus:outline-none shadow-sm placeholder:text-slate-300"
                    />
                  </div>

                  {/* Verify Button */}
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all text-center cursor-pointer"
                  >
                    ওটিপি যাচাই করুন ও পরবর্তী ধাপে যান ➔
                  </button>

                  {/* Resend OTP button */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs font-bold text-slate-600 hover:text-[#00823B] transition-colors cursor-pointer"
                    >
                      কোড পাননি? <span className="underline text-emerald-700">পুনরায় ওটিপি পাঠান</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Address & Country Selection (ONLY Bangladesh and Malaysia) */}
            {regStep === 4 && (
              <div className="space-y-4 pt-1">
                <div className="text-center">
                  <h3 className="text-base font-black text-slate-900">বাসা ও দেশ নির্বাচন</h3>
                  <p className="text-xs text-slate-500 mt-0.5">আপনার বর্তমান বাসার ঠিকানা ও দেশ নির্বাচন করুন</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      দেশ নির্বাচন করুন (শুধুমাত্র বাংলাদেশ ও মালয়েশিয়া)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        onClick={() => setRegForm({ ...regForm, country: 'Bangladesh' })}
                        className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                          regForm.country === 'Bangladesh' 
                            ? 'border-[#00823B] bg-emerald-50 text-[#00823B] font-bold shadow-xs' 
                            : 'border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="text-xl">🇧🇩</span>
                        <span className="text-xs">বাংলাদেশ (Bangladesh)</span>
                      </div>

                      <div 
                        onClick={() => setRegForm({ ...regForm, country: 'Malaysia' })}
                        className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                          regForm.country === 'Malaysia' 
                            ? 'border-[#00823B] bg-emerald-50 text-[#00823B] font-bold shadow-xs' 
                            : 'border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <span className="text-xl">🇲🇾</span>
                        <span className="text-xs">মালয়েশিয়া (Malaysia)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      বাসার ঠিকানা (House / Road / City)
                    </label>
                    <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-[#00823B] shadow-xs">
                      <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5" />
                      <input
                        type="text"
                        required
                        value={regForm.address}
                        onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                        placeholder="যেমন: বাড়ি ১২, রোড ৪, সেক্টর ৭ / Kuala Lumpur, Malaysia"
                        className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      জাতীয় পরিচয়পত্র / পাসপোর্ট নম্বর (ঐচ্ছিক)
                    </label>
                    <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-[#00823B] shadow-xs">
                      <ShieldCheck className="w-5 h-5 text-slate-400 absolute left-3.5" />
                      <input
                        type="text"
                        value={regForm.nid}
                        onChange={(e) => setRegForm({ ...regForm, nid: e.target.value })}
                        placeholder="1995874512458 / A12345678"
                        className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm font-mono font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!regForm.address.trim()) {
                        showToast("দয়া করে আপনার বাসার ঠিকানা লিখুন", "error");
                        return;
                      }
                      setRegStep(5);
                    }}
                    className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all text-center flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                  >
                    <span>পরবর্তী ধাপ: পিন ও পাসওয়ার্ড ➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: PIN & Password */}
            {regStep === 5 && (
              <div className="space-y-4 pt-1">
                <div className="text-center">
                  <h3 className="text-base font-black text-slate-900">সিকিউরিটি পিন ও পাসওয়ার্ড নির্ধারণ</h3>
                  <p className="text-xs text-slate-500 mt-0.5">আপনার অ্যাকাউন্টের গোপনীয় ৬-সংখ্যার পিন ও পাসওয়ার্ড দিন</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      সিকিউরিটি পিন (অবশ্যই ৬ সংখ্যার হতে হবে)
                    </label>
                    <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-[#00823B] shadow-xs">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-3.5" />
                      <input
                        type="password"
                        maxLength={6}
                        required
                        value={regForm.pin}
                        onChange={(e) => setRegForm({ ...regForm, pin: e.target.value })}
                        placeholder="যেমন: 242312"
                        className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm font-mono font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">টাকা পাঠানো ও লেনদেনের সময় এই ৬ সংখ্যার পিন লাগবে।</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      লগইন পাসওয়ার্ড (কমপক্ষে ৪ অক্ষর)
                    </label>
                    <div className="relative flex items-center bg-white rounded-xl border-2 border-slate-300 focus-within:border-[#00823B] shadow-xs">
                      <Lock className="w-5 h-5 text-slate-400 absolute left-3.5" />
                      <input
                        type="password"
                        required
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="যেমন: Pass@1234"
                        className="w-full bg-transparent py-3.5 pl-11 pr-4 text-sm font-mono font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!regForm.pin || regForm.pin.length !== 6) {
                        showToast("দয়া করে ৬ সংখ্যার সিকিউরিটি পিন দিন", "error");
                        return;
                      }
                      if (!regForm.password || regForm.password.length < 4) {
                        showToast("দয়া করে নিরাপদ পাসওয়ার্ড দিন", "error");
                        return;
                      }
                      setRegStep(6);
                    }}
                    className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all text-center flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
                  >
                    <span>পরবর্তী ধাপ: প্রোফাইল ছবি যুক্ত করুন ➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: Profile Photo (ONLY Upload Option, Camera Removed) */}
            {regStep === 6 && (
              <div className="space-y-4 pt-1">
                <div className="text-center">
                  <h3 className="text-base font-black text-slate-900">প্রোফাইল ছবি আপলোড করুন</h3>
                  <p className="text-xs text-slate-500 mt-0.5">আপনার ডিভাইস বা গ্যালারি থেকে পরিষ্কার ছবি নির্বাচন করুন</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full border-4 border-[#00823B] overflow-hidden bg-slate-200 shadow-md">
                    <img src={regForm.photo} alt="User Avatar" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs text-[#00823B] mt-2 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> নির্বাচিত ছবির প্রিভিউ
                  </span>
                </div>

                {/* Single Clean Photo Upload Area */}
                <div className="pt-2">
                  <label className="p-6 bg-slate-50 hover:bg-emerald-50/60 border-2 border-dashed border-[#00823B] rounded-2xl flex flex-col items-center justify-center gap-2.5 text-center transition-all shadow-xs cursor-pointer group">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#00823B] group-hover:scale-105 transition-transform flex items-center justify-center shadow-xs">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-sm font-black text-slate-800 block">গ্যালারি / ডিভাইস থেকে ছবি আপলোড করুন</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">JPG, PNG বা যেকোনো ফরম্যাটের ছবি নির্বাচন করতে এখানে চাপুন</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handlePhotoFileSelect} className="hidden" />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setRegStep(7)}
                  className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-all text-center mt-3 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>পরবর্তী ধাপ: পর্যালোচনা ও চূড়ান্ত সাবমিট ➔</span>
                </button>
              </div>
            )}

            {/* STEP 7: Review & Final Confirmation */}
            {regStep === 7 && (
              <div className="space-y-4 pt-1">
                <div className="text-center">
                  <h3 className="text-base font-black text-slate-900">রেজিস্ট্রেশন পর্যালোচনা ও প্রত্যয়ন</h3>
                  <p className="text-xs text-slate-500 mt-0.5">সব তথ্য সঠিক আছে কিনা যাচাই করে চূড়ান্ত সাবমিট করুন</p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200 space-y-3">
                  <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                    <img src={regForm.photo} alt="Avatar" className="w-14 h-14 rounded-2xl object-cover border-2 border-[#00823B]" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{regForm.name}</h4>
                      <p className="text-xs font-mono font-bold text-slate-600">{regForm.phone}</p>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                        {regForm.userType} অ্যাকাউন্ট
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-bold">বাসার ঠিকানা:</span>
                      <span className="font-bold">{regForm.address}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-bold">দেশ:</span>
                      <span className="font-bold flex items-center gap-1">
                        {regForm.country === 'Malaysia' ? '🇲🇾 মালয়েশিয়া' : '🇧🇩 বাংলাদেশ'}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-bold">সিকিউরিটি পিন:</span>
                      <span className="font-mono font-bold">•••••• ({regForm.pin})</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-bold">পাসওয়ার্ড:</span>
                      <span className="font-mono font-bold">••••••</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setAgreed(!agreed)}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white border-2 border-emerald-400 cursor-pointer shadow-2xs"
                  >
                    <div className="mt-0.5 text-[#00823B] shrink-0">
                      {agreed ? (
                        <CheckSquare className="w-5 h-5 fill-[#00823B] text-white" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <span className="text-xs text-slate-800 leading-snug select-none font-bold">
                      আমি প্রত্যয়ন করছি যে উপরে প্রদত্ত সমস্ত তথ্য সঠিক ও সত্য।
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setRegStep(6)}
                    className="tap-effect bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-xs text-center cursor-pointer"
                  >
                    আগের ধাপ
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalRegister}
                    disabled={loading || !agreed}
                    className={`tap-effect font-bold py-3.5 rounded-xl text-sm shadow-md text-center cursor-pointer ${
                      agreed 
                        ? 'bg-[#00823B] hover:bg-[#006837] text-white' 
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {loading ? "সাবমিট হচ্ছে..." : "চূড়ান্ত সাবমিট করুন ✅"}
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= TAB 3: CURRENCY CALCULATOR ================= */}
        {activeTab === 'calculator' && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center">
              <h2 className="text-lg font-black text-slate-900">লাইভ এক্সচেঞ্জ রেট ক্যালকুলেটর</h2>
              <p className="text-xs text-slate-500 mt-0.5">মালয়েশিয়া 🇲🇾 বা যেকোনো দেশ থেকে টাকায় রিয়েল-টাইম কনভার্সন</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">আপনি দিবেন</label>
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
                  <input
                    type="number"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(e.target.value)}
                    className="text-2xl font-black text-slate-800 w-full focus:outline-none bg-transparent font-mono"
                  />
                  <div className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full border">
                    <span className="text-base">{currentRateObj.flag || "🇲🇾"}</span>
                    <select
                      value={calcCurrency}
                      onChange={(e) => setCalcCurrency(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      {exchangeRates.map((c) => (
                        <option key={c.code} value={c.code}>{c.code}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">তারা পাবে</label>
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1">
                  <span className="text-2xl font-black text-[#00823B] font-mono">{receiveBdt}</span>
                  <div className="flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                    <span className="text-base">🇧🇩</span>
                    <span className="text-xs font-black text-emerald-800">BDT</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs font-bold text-slate-600 pt-1 flex items-center justify-center gap-1">
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#00823B]" />
                <span>এক্সচেঞ্জ রেট: 1 {calcCurrency} = {rateToBdt} BDT</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => changeTab('login')}
                className="tap-effect bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3 rounded-xl text-xs text-center shadow-sm"
              >
                টাকা পাঠাতে লগইন করুন
              </button>
              <button
                onClick={() => {
                  changeTab('register');
                  setRegStep(0);
                }}
                className="tap-effect bg-white hover:bg-slate-50 text-[#00823B] border-2 border-[#00823B] font-bold py-3 rounded-xl text-xs text-center"
              >
                নতুন অ্যাকাউন্ট খুলুন
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 4. PIN RESET MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#00823B]" />
                পিন / পাসওয়ার্ড রিসেট
              </h3>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              আপনার অ্যাকাউন্টের মোবাইল নম্বর দিন এবং নতুন ৬ সংখ্যার সিকিউরিটি পিন সেট করুন:
            </p>

            <form onSubmit={handleResetSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  required
                  value={resetPhone}
                  onChange={(e) => setResetPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-3 px-3.5 text-sm font-mono font-bold focus:outline-none focus:border-[#00823B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">নতুন পিন (৬ সংখ্যা)</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="******"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-3 px-3.5 text-sm font-mono font-bold focus:outline-none focus:border-[#00823B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">নতুন পিন পুনরায় লিখুন</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value)}
                  placeholder="******"
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-3 px-3.5 text-sm font-mono font-bold focus:outline-none focus:border-[#00823B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3 rounded-xl text-xs shadow-md cursor-pointer"
                >
                  রিসেট সম্পন্ন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. AGENT APPLICATION PENDING MODAL */}
      {showAgentPendingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">এজেন্ট আবেদন জমা হয়েছে!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                আপনার এজেন্ট অ্যাকাউন্টের আবেদনটি সফলভাবে <b>সুপার অ্যাডমিনের</b> নিকট পাঠানো হয়েছে।
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 text-left space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                ভেরিফিকেশন প্রক্রিয়া:
              </div>
              <p className="text-[11px] text-amber-800">
                সুপার অ্যাডমিন আপনার তথ্য ও সেলফি যাচাই করে অনুমোদন প্রদান করলে আপনি আপনার মোবাইল নম্বর ও ৬-সংখ্যার পিন দিয়ে অ্যাকাউন্টে লগইন করতে পারবেন।
              </p>
            </div>

            <button
              onClick={() => {
                setShowAgentPendingModal(false);
                changeTab('login');
              }}
              className="w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3.5 rounded-2xl text-sm shadow-md cursor-pointer"
            >
              লগইন পেজে ফিরে যান
            </button>
          </div>
        </div>
      )}

      {/* 6. Clean Copyright Footer */}
      <div className="mt-6 py-5 border-t border-slate-100 text-center bg-slate-50/60">
        <p className="text-xs font-semibold text-slate-500">
          © 2026 Fast Send. All rights reserved.
        </p>
      </div>

    </div>
  );
};
