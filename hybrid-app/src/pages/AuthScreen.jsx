import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const AuthScreen = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { selectedCountry, otpLogin, showToast } = useApp();

  // State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [resendTimer, setResendTimer] = useState(60);
  const [loading, setLoading] = useState(false);

  const countryPrefix = selectedCountry === 'MY' ? '+60' : '+971';
  const countryFlag = selectedCountry === 'MY' ? '🇲🇾' : '🇦🇪';
  const placeholderExample = selectedCountry === 'MY' ? '12-345 6789' : '50 123 4567';

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendOtp = (e) => {
    e.preventDefault();
    const cleanNumber = phone.replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 7) {
      showToast(language === 'bn' ? 'সঠিক ফোন নম্বর লিখুন' : 'Please enter a valid phone number', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setResendTimer(60);
      showToast(
        language === 'bn' 
          ? `ভেরিফিকেশন কোড পাঠানো হয়েছে (${countryPrefix} ${cleanNumber})` 
          : `Verification code sent to ${countryPrefix} ${cleanNumber}`, 
        'info'
      );
    }, 600);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
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

    // Auto-advance
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

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে ৬-সংখ্যার কোড দিন' : 'Please enter the complete 6-digit code', 'error');
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

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    showToast(language === 'bn' ? 'নতুন ওটিপি কোড পাঠানো হয়েছে' : 'New OTP code resent', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-5 max-w-md mx-auto">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pt-3 pb-6">
          <button
            onClick={() => {
              if (step === 'otp') setStep('phone');
              else onNavigate('onboarding');
            }}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Language Switch */}
          <div className="flex items-center bg-white border border-slate-200 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                language === 'bn'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                language === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Content based on step */}
        {step === 'phone' ? (
          <div className="mt-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-4">
              <span>{countryFlag}</span>
              <span>
                {selectedCountry === 'MY' ? t('countryMalaysia') : t('countryUae')}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              {t('authTitle')}
            </h2>
            <p className="text-sm text-slate-500 mt-1 mb-8">
              {t('authSubtitle')}
            </p>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  {t('phonePlaceholder')}
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all text-base flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>{t('loading')}</span>
                  ) : (
                    <>
                      <span>{t('sendOtp')}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {t('otpTitle')}
            </h2>
            <p className="text-sm text-slate-500 mt-1 mb-1">
              {t('otpSubtitle')}
            </p>
            <p className="text-base font-bold text-slate-900 mb-8">
              {countryFlag} {countryPrefix} {phone}
            </p>

            {/* 6-digit OTP Box Grid */}
            <div className="grid grid-cols-6 gap-2 sm:gap-3 mb-6">
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
                  className={`h-14 sm:h-16 text-center text-2xl font-extrabold rounded-xl border-2 transition-all bg-white shadow-sm focus:outline-none ${
                    digit
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-slate-200 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              ))}
            </div>

            {/* Resend Timer / Action */}
            <div className="text-center py-2 mb-4">
              {resendTimer > 0 ? (
                <p className="text-xs font-medium text-slate-500">
                  {t('resendIn')}{' '}
                  <span className="font-bold text-slate-800">
                    {resendTimer}s
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  {t('resendBtn')}
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all text-base flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>{t('loading')}</span>
                ) : (
                  <>
                    <span>{t('verifyBtn')}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center pt-6 pb-2 text-xs text-slate-400 font-medium">
        Fast Send Secure Remittance System
      </div>
    </div>
  );
};
