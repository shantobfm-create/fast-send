import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const AuthScreen = ({ onNavigate, defaultTab = 'login' }) => {
  const { t, language, setLanguage } = useLanguage();
  const { selectedCountry, setCountry, login, otpLogin, register, showToast, settings } = useApp();

  const isBn = language === 'bn';

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState(defaultTab || 'login');

  // Login Method: 'otp' | 'pin'
  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' | 'pin'

  // Phone & OTP states
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpStep, setOtpStep] = useState('phone'); // 'phone' | 'otp'
  const [resendTimer, setResendTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  // Register Form states
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    country: selectedCountry === 'MY' ? 'Malaysia' : 'UAE',
    pin: '',
    confirmPin: ''
  });

  const countryPrefix = selectedCountry === 'MY' ? '+60' : '+971';
  const countryFlag = selectedCountry === 'MY' ? '🇲🇾' : '🇦🇪';
  const placeholderExample = selectedCountry === 'MY' ? '12-345 6789' : '50 123 4567';

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (otpStep === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  // Handle OTP send
  const handleSendOtp = (e) => {
    e.preventDefault();
    const cleanNumber = phone.replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 7) {
      showToast(isBn ? 'সঠিক মোবাইল নম্বর লিখুন' : 'Please enter a valid mobile number', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep('otp');
      setResendTimer(60);
      showToast(
        isBn 
          ? `ভেরিফিকেশন কোড পাঠানো হয়েছে (${countryPrefix} ${cleanNumber})` 
          : `Verification code sent to ${countryPrefix} ${cleanNumber}`, 
        'info'
      );
    }, 500);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      pastedDigits.forEach((digit, i) => {
        newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextInput = document.getElementById(`otp-input-${Math.min(pastedDigits.length, 5)}`);
      if (nextInput) nextInput.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // OTP Login verify
  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      showToast(isBn ? '৬-সংখ্যার কোড দিন' : 'Enter 6-digit code', 'error');
      return;
    }

    const fullPhone = `${countryPrefix}${phone.replace(/\D/g, '')}`;
    setLoading(true);

    const res = await otpLogin(fullPhone, otpCode, selectedCountry);
    setLoading(false);

    if (res.success) {
      onNavigate('home');
    }
  };

  // Password / PIN Login
  const handlePinLogin = async (e) => {
    e.preventDefault();
    const cleanNumber = phone.replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 7) {
      showToast(isBn ? 'সঠিক মোবাইল নম্বর লিখুন' : 'Enter valid phone number', 'error');
      return;
    }
    if (!pin) {
      showToast(isBn ? 'আপনার পিন দিন' : 'Enter your PIN', 'error');
      return;
    }

    const fullPhone = `${countryPrefix}${cleanNumber}`;
    setLoading(true);
    const res = await login(fullPhone, pin);
    setLoading(false);

    if (res.success) {
      onNavigate('home');
    }
  };

  // Registration Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.name.trim()) {
      showToast(isBn ? 'আপনার পূর্ণ নাম লিখুন' : 'Enter your full name', 'error');
      return;
    }
    const cleanNumber = regForm.phone.replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 7) {
      showToast(isBn ? 'সঠিক মোবাইল নম্বর লিখুন' : 'Enter valid mobile number', 'error');
      return;
    }
    if (!regForm.pin || regForm.pin.length < 4) {
      showToast(isBn ? 'কমপক্ষে ৪ ডিজিটের পিন দিন' : 'PIN must be at least 4 digits', 'error');
      return;
    }
    if (regForm.pin !== regForm.confirmPin) {
      showToast(isBn ? 'পিন কনফার্মেশন মেলেনি' : 'PIN confirmation does not match', 'error');
      return;
    }

    setLoading(true);
    const fullPhone = `${countryPrefix}${cleanNumber}`;
    const payload = {
      name: regForm.name.trim(),
      phone: fullPhone,
      country: selectedCountry === 'MY' ? 'Malaysia' : 'UAE',
      pin: regForm.pin,
      password: regForm.pin,
      userType: 'পার্সোনাল'
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      showToast(isBn ? 'রেজিস্ট্রেশন সফল হয়েছে!' : 'Registration successful!', 'success');
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto">
      <div>
        {/* Top Header - Black Theme */}
        <div className="bg-slate-950 text-white px-5 pt-4 pb-4 border-b border-slate-800 flex items-center justify-between shadow-md">
          <button
            onClick={() => onNavigate('onboarding')}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-800 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 className="text-base font-bold text-white tracking-wide">
            {authMode === 'login' 
              ? (isBn ? 'লগইন (Login)' : 'Log In') 
              : (isBn ? 'রেজিস্ট্রেশন (Register)' : 'Register')}
          </h2>

          {/* Language Switch */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                language === 'bn'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              বাং
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                language === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Country Flag Badge & Switch */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-3 mb-4 shadow-xs">
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl">{countryFlag}</span>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {selectedCountry === 'MY' ? 'Malaysia (মালয়েশিয়া)' : 'UAE (দুবাই)'}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {selectedCountry === 'MY' ? 'Country Code: +60' : 'Country Code: +971'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCountry(selectedCountry === 'MY' ? 'AE' : 'MY')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200"
            >
              {isBn ? 'দেশ পরিবর্তন' : 'Change'}
            </button>
          </div>

          {/* Top Auth Mode Tabs: Login vs Register */}
          <div className="flex bg-slate-200/80 p-1 rounded-2xl mb-5 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setOtpStep('phone');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔑</span>
              <span>{isBn ? 'লগইন করুন' : 'Log In'}</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                authMode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📝</span>
              <span>{isBn ? 'নতুন রেজিস্ট্রেশন' : 'Register'}</span>
            </button>
          </div>

          {/* ===================== LOGIN FORM ===================== */}
          {authMode === 'login' && (
            <div>
              {/* Login Method Toggle: OTP vs PIN */}
              <div className="flex items-center justify-center space-x-4 mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod('otp');
                    setOtpStep('phone');
                  }}
                  className={`pb-1 border-b-2 transition-all ${
                    loginMethod === 'otp'
                      ? 'border-emerald-600 text-emerald-700 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  ⚡ {isBn ? 'ওটিপি দিয়ে লগইন' : 'Login via OTP'}
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('pin')}
                  className={`pb-1 border-b-2 transition-all ${
                    loginMethod === 'pin'
                      ? 'border-emerald-600 text-emerald-700 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  🔒 {isBn ? 'পিন/পাসওয়ার্ড দিয়ে লগইন' : 'Login via PIN'}
                </button>
              </div>

              {loginMethod === 'otp' ? (
                /* OTP Flow */
                otpStep === 'phone' ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        {isBn ? 'আপনার মোবাইল নম্বর দিন' : 'Enter mobile number'}
                      </label>
                      <div className="flex items-center bg-white border-2 border-slate-200 focus-within:border-emerald-600 rounded-2xl p-1 transition-all shadow-sm">
                        <div className="flex items-center space-x-1.5 px-3.5 py-3 border-r border-slate-200 text-slate-800 font-bold text-base">
                          <span>{countryFlag}</span>
                          <span>{countryPrefix}</span>
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={placeholderExample}
                          autoFocus
                          className="w-full px-4 py-3 bg-transparent text-slate-900 font-semibold text-lg focus:outline-none placeholder-slate-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all text-base flex items-center justify-center space-x-2"
                    >
                      <span>{isBn ? 'ওটিপি কোড পাঠান ➔' : 'Send OTP Code ➔'}</span>
                    </button>
                  </form>
                ) : (
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      {isBn ? '৬-সংখ্যার কোডটি দিন যা পাঠানো হয়েছে:' : 'Enter 6-digit code sent to:'}
                    </p>
                    <p className="text-base font-bold text-slate-900 mb-6">
                      {countryFlag} {countryPrefix} {phone}
                    </p>

                    <div className="grid grid-cols-6 gap-2 mb-6">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(idx, e)}
                          autoFocus={idx === 0}
                          className="h-14 text-center text-2xl font-extrabold rounded-xl border-2 transition-all bg-white border-slate-200 focus:border-emerald-600 focus:outline-none text-slate-900"
                        />
                      ))}
                    </div>

                    <div className="text-center mb-5">
                      {resendTimer > 0 ? (
                        <p className="text-xs text-slate-400">
                          {isBn ? `পুনরায় কোড পাঠাতে অপেক্ষা করুন ${resendTimer} সেকেন্ড` : `Resend in ${resendTimer}s`}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setResendTimer(60)}
                          className="text-xs font-bold text-emerald-600 underline"
                        >
                          {isBn ? 'আবার কোড পাঠান' : 'Resend Code'}
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all text-base"
                    >
                      {loading ? (isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying...') : (isBn ? 'যাচাই ও প্রবেশ করুন ✓' : 'Verify & Log In ✓')}
                    </button>
                  </div>
                )
              ) : (
                /* PIN / Password Login */
                <form onSubmit={handlePinLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'}
                    </label>
                    <div className="flex items-center bg-white border-2 border-slate-200 focus-within:border-emerald-600 rounded-2xl p-1 transition-all shadow-sm">
                      <div className="flex items-center space-x-1.5 px-3.5 py-3 border-r border-slate-200 text-slate-800 font-bold text-base">
                        <span>{countryFlag}</span>
                        <span>{countryPrefix}</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={placeholderExample}
                        className="w-full px-4 py-3 bg-transparent text-slate-900 font-semibold text-lg focus:outline-none placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      {isBn ? 'সিকিউরিটি পিন (PIN)' : 'Security PIN'}
                    </label>
                    <div className="relative flex items-center bg-white border-2 border-slate-200 focus-within:border-emerald-600 rounded-2xl p-1 transition-all shadow-sm">
                      <input
                        type={showPin ? "text" : "password"}
                        value={pin}
                        maxLength={6}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="••••"
                        className="w-full px-4 py-3 bg-transparent text-slate-900 font-mono font-bold text-lg focus:outline-none placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="px-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        {showPin ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all text-base"
                  >
                    {loading ? (isBn ? 'লগইন হচ্ছে...' : 'Logging in...') : (isBn ? 'লগইন করুন ➔' : 'Log In ➔')}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ===================== REGISTRATION FORM ===================== */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  {isBn ? 'আপনার পূর্ণ নাম' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder={isBn ? 'যেমন: মোহাম্মদ রহিম' : 'e.g. Mohammad Rahim'}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'} *
                </label>
                <div className="flex items-center bg-white border-2 border-slate-200 focus-within:border-emerald-600 rounded-2xl p-1 transition-all shadow-sm">
                  <div className="flex items-center space-x-1.5 px-3.5 py-2.5 border-r border-slate-200 text-slate-800 font-bold text-sm">
                    <span>{countryFlag}</span>
                    <span>{countryPrefix}</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder={placeholderExample}
                    className="w-full px-3 py-2 bg-transparent text-slate-900 font-semibold text-base focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  {isBn ? 'সিকিউরিটি পিন (৪ বা ৬ সংখ্যা)' : 'Security PIN'} *
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={regForm.pin}
                  onChange={(e) => setRegForm({ ...regForm, pin: e.target.value })}
                  placeholder="••••"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  {isBn ? 'পিন পুনরায় লিখুন (Confirm PIN)' : 'Confirm PIN'} *
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={regForm.confirmPin}
                  onChange={(e) => setRegForm({ ...regForm, confirmPin: e.target.value })}
                  placeholder="••••"
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all text-base flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>{isBn ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating account...'}</span>
                  ) : (
                    <span>{isBn ? 'অ্যাকাউন্ট তৈরি করুন ➔' : 'Create Account ➔'}</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Switch tab footer text */}
          <div className="text-center pt-5">
            {authMode === 'login' ? (
              <p className="text-xs text-slate-500">
                {isBn ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="font-bold text-emerald-600 hover:underline ml-1"
                >
                  {isBn ? 'এখানে রেজিস্টার করুন' : 'Register Here'}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                {isBn ? 'আগে থেকেই অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-bold text-emerald-600 hover:underline ml-1"
                >
                  {isBn ? 'এখানে লগইন করুন' : 'Log In Here'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
