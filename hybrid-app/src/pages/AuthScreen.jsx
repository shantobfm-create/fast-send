import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const AuthScreen = ({ onNavigate, defaultTab = 'login' }) => {
  const { t, language, setLanguage } = useLanguage();
  const { selectedCountry, setCountry, login, register, showToast } = useApp();

  const isBn = language === 'bn';

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState(defaultTab || 'login');

  // Login Form States (Phone + Password/PIN)
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);

  // Register Form States
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    country: selectedCountry === 'MY' ? 'Malaysia' : 'UAE',
    pin: '',
    confirmPin: ''
  });
  const [showRegPin, setShowRegPin] = useState(false);

  const countryPrefix = selectedCountry === 'MY' ? '+60' : '+971';
  const countryFlag = selectedCountry === 'MY' ? '🇲🇾' : '🇦🇪';
  const placeholderExample = selectedCountry === 'MY' ? '12-345 6789' : '50 123 4567';

  // Password / PIN Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanNumber = phone.replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 7) {
      showToast(isBn ? 'সঠিক মোবাইল নম্বর লিখুন' : 'Enter valid phone number', 'error');
      return;
    }
    if (!pin) {
      showToast(isBn ? 'আপনার পাসওয়ার্ড বা পিন দিন' : 'Enter your password or PIN', 'error');
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
      showToast(isBn ? 'কমপক্ষে ৪ সংখ্যার পাসওয়ার্ড/পিন দিন' : 'Password/PIN must be at least 4 characters', 'error');
      return;
    }
    if (regForm.pin !== regForm.confirmPin) {
      showToast(isBn ? 'পাসওয়ার্ড কনফার্মেশন মেলেনি' : 'Password confirmation does not match', 'error');
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
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col justify-between w-full">
      <div>
        {/* Top Header - #2677AD */}
        <div className="bg-[#2677AD] text-white px-5 pt-5 pb-5 flex items-center justify-between shadow-md">
          <button
            onClick={() => onNavigate('onboarding')}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 className="text-base font-extrabold text-white tracking-wide uppercase">
            {authMode === 'login' 
              ? (isBn ? 'লগইন (Login)' : 'Log In') 
              : (isBn ? 'রেজিস্ট্রেশন (Register)' : 'Register')}
          </h2>

          {/* Language Switch */}
          <div className="flex items-center bg-black/20 border border-white/20 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                language === 'bn'
                  ? 'bg-[#25CC71] text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              বাং
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold transition-all ${
                language === 'en'
                  ? 'bg-[#25CC71] text-white shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Country Flag Badge & Switch */}
          <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-3 mb-4 shadow-sm">
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl">{countryFlag}</span>
              <div>
                <p className="text-xs font-black text-[#2C3E50]">
                  {selectedCountry === 'MY' ? 'Malaysia (মালয়েশিয়া)' : 'UAE (দুবাই)'}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold">
                  {selectedCountry === 'MY' ? 'Country Code: +60' : 'Country Code: +971'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCountry(selectedCountry === 'MY' ? 'AE' : 'MY')}
              className="text-xs font-extrabold text-[#25CC71] hover:text-[#1EA85D] bg-[#E8F8F0] px-3 py-1.5 rounded-xl border border-[#25CC71]/20 transition-all"
            >
              {isBn ? 'দেশ পরিবর্তন' : 'Change'}
            </button>
          </div>

          {/* Top Auth Mode Tabs: Login vs Register */}
          <div className="flex bg-slate-200/70 p-1.5 rounded-2xl mb-5 shadow-inner">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
                authMode === 'login'
                  ? 'bg-white text-[#2C3E50] shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔑</span>
              <span>{isBn ? 'লগইন করুন' : 'Log In'}</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
                authMode === 'register'
                  ? 'bg-white text-[#2C3E50] shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📝</span>
              <span>{isBn ? 'নতুন রেজিস্ট্রেশন' : 'Register'}</span>
            </button>
          </div>

          {/* ===================== PASSWORD & NUMBER LOGIN FORM ===================== */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Phone Number Field */}
              <div>
                <label className="block text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider mb-2">
                  {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'} *
                </label>
                <div className="flex items-center bg-white border border-slate-200/90 focus-within:border-[#25CC71] focus-within:ring-2 focus-within:ring-[#25CC71]/20 rounded-2xl p-1 transition-all shadow-sm">
                  <div className="flex items-center space-x-1.5 px-3.5 py-3 border-r border-slate-200 text-[#2C3E50] font-black text-base">
                    <span>{countryFlag}</span>
                    <span>{countryPrefix}</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={placeholderExample}
                    autoFocus
                    className="w-full px-4 py-3 bg-transparent text-slate-900 font-bold text-lg focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Password / PIN Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider">
                    {isBn ? 'পাসওয়ার্ড / পিন' : 'Password / PIN'} *
                  </label>
                </div>
                <div className="relative flex items-center bg-white border border-slate-200/90 focus-within:border-[#25CC71] focus-within:ring-2 focus-within:ring-[#25CC71]/20 rounded-2xl p-1 transition-all shadow-sm">
                  <input
                    type={showPin ? "text" : "password"}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder={isBn ? 'পাসওয়ার্ড বা পিন লিখুন' : 'Enter password or PIN'}
                    className="w-full px-4 py-3 bg-transparent text-slate-900 font-bold text-base focus:outline-none placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="px-4 py-2 text-slate-400 hover:text-slate-700 text-xs font-extrabold tracking-wider uppercase transition-colors"
                  >
                    {showPin ? (isBn ? 'আড়াল' : 'Hide') : (isBn ? 'দেখান' : 'Show')}
                  </button>
                </div>
              </div>

              {/* Submit Log In CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-[#25CC71] hover:bg-[#1EA85D] active:scale-[0.99] disabled:opacity-50 text-white font-black rounded-2xl shadow-lg shadow-[#25CC71]/30 transition-all text-base flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>{isBn ? 'লগইন হচ্ছে...' : 'Logging in...'}</span>
                  ) : (
                    <>
                      <span>{isBn ? 'লগইন করুন ➔' : 'Log In ➔'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ===================== REGISTRATION FORM ===================== */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1.5">
                  {isBn ? 'আপনার পূর্ণ নাম' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder={isBn ? 'যেমন: মোহাম্মদ রহিম' : 'e.g. Mohammad Rahim'}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#25CC71] focus:ring-2 focus:ring-[#25CC71]/20 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1.5">
                  {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'} *
                </label>
                <div className="flex items-center bg-white border border-slate-200/90 focus-within:border-[#25CC71] focus-within:ring-2 focus-within:ring-[#25CC71]/20 rounded-2xl p-1 transition-all shadow-sm">
                  <div className="flex items-center space-x-1.5 px-3.5 py-2.5 border-r border-slate-200 text-[#2C3E50] font-black text-sm">
                    <span>{countryFlag}</span>
                    <span>{countryPrefix}</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder={placeholderExample}
                    className="w-full px-3 py-2 bg-transparent text-slate-900 font-bold text-base focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1.5">
                  {isBn ? 'পাসওয়ার্ড / পিন' : 'Password / PIN'} *
                </label>
                <div className="relative flex items-center bg-white border border-slate-200/90 focus-within:border-[#25CC71] focus-within:ring-2 focus-within:ring-[#25CC71]/20 rounded-2xl p-1 transition-all shadow-sm">
                  <input
                    type={showRegPin ? "text" : "password"}
                    required
                    value={regForm.pin}
                    onChange={(e) => setRegForm({ ...regForm, pin: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-transparent text-slate-900 font-bold text-base focus:outline-none placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPin(!showRegPin)}
                    className="px-3 text-slate-400 hover:text-slate-700 text-xs font-bold"
                  >
                    {showRegPin ? (isBn ? 'আড়াল' : 'Hide') : (isBn ? 'দেখান' : 'Show')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1.5">
                  {isBn ? 'পাসওয়ার্ড পুনরায় লিখুন (Confirm)' : 'Confirm Password'} *
                </label>
                <input
                  type={showRegPin ? "text" : "password"}
                  required
                  value={regForm.confirmPin}
                  onChange={(e) => setRegForm({ ...regForm, confirmPin: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#25CC71] focus:ring-2 focus:ring-[#25CC71]/20 shadow-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-[#25CC71] hover:bg-[#1EA85D] active:scale-[0.99] disabled:opacity-50 text-white font-black rounded-2xl shadow-lg shadow-[#25CC71]/30 transition-all text-base flex items-center justify-center space-x-2"
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

          {/* Switch Tab Footer Text */}
          <div className="text-center pt-5">
            {authMode === 'login' ? (
              <p className="text-xs text-slate-500 font-medium">
                {isBn ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="font-extrabold text-[#25CC71] hover:underline ml-1"
                >
                  {isBn ? 'এখানে রেজিস্টার করুন' : 'Register Here'}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium">
                {isBn ? 'আগে থেকেই অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-extrabold text-[#25CC71] hover:underline ml-1"
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
