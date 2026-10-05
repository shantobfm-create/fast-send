import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const OnboardingScreen = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { selectedCountry, setCountry } = useApp();

  const handleSelectCountry = (code) => {
    setCountry(code);
  };

  const handleStart = () => {
    onNavigate('auth');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col justify-between w-full">
      {/* Top Header - #2677AD Brand Color */}
      <div className="bg-[#2677AD] text-white px-5 pt-5 pb-5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm font-black text-xl">
            FS
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-tight">
              {t('appName')}
            </h1>
            <p className="text-[11px] text-white/80 font-medium">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Language Switcher Pill */}
        <div className="flex items-center bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-1 shadow-sm">
          <button
            onClick={() => setLanguage('bn')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              language === 'bn'
                ? 'bg-white text-[#2677AD] shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            বাংলা
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-white text-[#2677AD] shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        {/* Main Content */}
        <div>

        {/* Hero Section */}
        <div className="mt-4 mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <span>✨</span>
            <span>{t('feeFree')}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 leading-snug">
            {t('welcomeHeading')}
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {t('welcomeSub')}
          </p>
        </div>

        {/* Country Selection Title */}
        <div className="mb-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t('selectCountryTitle')}
          </p>
        </div>

        {/* Country Cards */}
        <div className="space-y-3.5">
          {/* Malaysia Card */}
          <button
            type="button"
            onClick={() => handleSelectCountry('MY')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
              selectedCountry === 'MY'
                ? 'border-emerald-600 bg-white shadow-md shadow-emerald-600/10'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="text-3xl p-1 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                🇲🇾
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">
                  {t('countryMalaysia')}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {t('currencyMyr')}
                </p>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedCountry === 'MY'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300'
              }`}
            >
              {selectedCountry === 'MY' && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>

          {/* UAE Card */}
          <button
            type="button"
            onClick={() => handleSelectCountry('AE')}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
              selectedCountry === 'AE'
                ? 'border-emerald-600 bg-white shadow-md shadow-emerald-600/10'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center space-x-3.5">
              <div className="text-3xl p-1 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                🇦🇪
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">
                  {t('countryUae')}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {t('currencyAed')}
                </p>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedCountry === 'AE'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-300'
              }`}
            >
              {selectedCountry === 'AE' && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Security & Speed Trust Badges */}
        <div className="mt-8 grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-[#25CC71] font-black text-sm">⚡ ১০-৩০ মিনিট</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">দ্রুত ভেরিফিকেশন ও ডেলিভারি</p>
          </div>
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-[#2980B9] font-black text-sm">🔒 ১০০% নিরাপদ</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">ম্যানুয়াল ভেরিফাইড ট্রানজেকশন</p>
          </div>
        </div>
      </div>

      {/* CTA Buttons: Get Started / Register vs Login */}
      <div className="pt-6 pb-2 space-y-3">
        <button
          onClick={() => onNavigate('auth', { defaultTab: 'register' })}
          className="w-full py-4 px-6 bg-[#25CC71] hover:bg-[#1EA85D] active:scale-[0.99] text-white font-black rounded-2xl shadow-lg shadow-[#25CC71]/30 flex items-center justify-center space-x-2 transition-all text-base"
        >
          <span>{language === 'bn' ? 'নতুন রেজিস্ট্রেশন করুন ➔' : 'Register Now ➔'}</span>
        </button>

        <button
          onClick={() => onNavigate('auth', { defaultTab: 'login' })}
          className="w-full py-3.5 px-6 bg-[#2C3E50] hover:bg-[#1C3144] active:scale-[0.99] text-white font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all text-sm shadow-md"
        >
          <span>{language === 'bn' ? 'লগইন করুন (Log In)' : 'Log In to Account'}</span>
        </button>
      </div>
      </div>
    </div>
  );
};
