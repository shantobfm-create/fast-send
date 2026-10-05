import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const AddRecipientScreen = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { addRecipient, transferDraft, setTransferDraft, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('wallet'); // 'wallet' | 'bank'
  const [selectedWallet, setSelectedWallet] = useState('bkash');
  const [walletType, setWalletType] = useState('Personal'); // 'Personal' | 'Agent'
  const [relationship, setRelationship] = useState('Family');

  // Form Fields
  const [name, setName] = useState('');
  const [walletNumber, setWalletNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('Islami Bank Bangladesh PLC');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchName, setBranchName] = useState('');
  const [loading, setLoading] = useState(false);

  const walletOptions = [
    { id: 'bkash', name: 'বিকাশ (bKash)', icon: '🌸', color: 'border-pink-500 text-pink-600 bg-pink-50/30' },
    { id: 'nagad', name: 'নগদ (Nagad)', icon: '🟠', color: 'border-orange-500 text-orange-600 bg-orange-50/30' },
    { id: 'rocket', name: 'রকেট (Rocket)', icon: '🟣', color: 'border-purple-500 text-purple-600 bg-purple-50/30' },
    { id: 'upay', name: 'উপায় (Upay)', icon: '🔵', color: 'border-blue-500 text-blue-600 bg-blue-50/30' },
  ];

  const bdBanks = [
    'Islami Bank Bangladesh PLC',
    'Dutch-Bangla Bank (DBBL)',
    'BRAC Bank PLC',
    'City Bank PLC',
    'Sonali Bank PLC',
    'Eastern Bank PLC (EBL)',
    'Pubali Bank PLC',
    'Mutual Trust Bank (MTB)'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast(language === 'bn' ? 'প্রাপকের পুরো নাম লিখুন' : 'Please enter recipient name', 'error');
      return;
    }

    let payload = {};

    if (activeTab === 'wallet') {
      const cleanPhone = walletNumber.replace(/\D/g, '');
      if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
        showToast(
          language === 'bn' 
            ? 'সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)' 
            : 'Enter valid 11-digit BD mobile number (e.g. 017xxxxxxxx)', 
          'error'
        );
        return;
      }

      payload = {
        name: name.trim(),
        phone: cleanPhone,
        type: 'wallet',
        provider: selectedWallet,
        accountType: walletType,
        relationship
      };
    } else {
      if (!accountNumber.trim() || accountNumber.length < 8) {
        showToast(language === 'bn' ? 'সঠিক ব্যাংক অ্যাকাউন্ট নম্বর দিন' : 'Enter valid bank account number', 'error');
        return;
      }

      payload = {
        name: name.trim(),
        type: 'bank',
        bankName: selectedBank,
        accountNumber: accountNumber.trim(),
        branchName: branchName.trim() || 'Online/Principal',
        relationship
      };
    }

    setLoading(true);
    const res = await addRecipient(payload);
    setLoading(false);

    if (res.success && res.recipient) {
      setTransferDraft({
        ...transferDraft,
        recipient: res.recipient
      });
      onNavigate('payment-instruction');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between w-full">
      <div>
        {/* Top Header - Black Theme */}
        <div className="bg-slate-950 text-white px-5 pt-4 pb-4 border-b border-slate-800 flex items-center justify-between shadow-md">
          <button
            onClick={() => onNavigate('select-recipient')}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-800 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base font-bold text-white tracking-wide">
            {t('addRecipientTitle')}
          </h2>
          <div className="w-10" />
        </div>

        <div className="p-5 space-y-4">

        {/* Tab Toggle: Mobile Wallet vs Bank Account */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl mb-5 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'wallet'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📱</span>
            <span>{t('mobileWalletTab')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'bank'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏦</span>
            <span>{t('bankTransferTab')}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Recipient Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              {t('recipientName')} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: মোহাম্মদ রহিম' : 'e.g. Mohammad Rahim'}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
            />
          </div>

          {activeTab === 'wallet' ? (
            <>
              {/* Wallet Provider Selector Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  {t('selectProvider')} *
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {walletOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setSelectedWallet(opt.id)}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center space-x-2.5 transition-all ${
                        selectedWallet === opt.id
                          ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-xs font-bold text-slate-900">
                        {opt.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallet Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  {t('walletNumber')} *
                </label>
                <div className="flex items-center bg-white border border-slate-200 focus-within:border-emerald-600 rounded-2xl p-1 shadow-sm transition-all">
                  <div className="flex items-center space-x-1 px-3 py-2 border-r border-slate-200 text-xs font-bold text-slate-700">
                    <span>🇧🇩</span>
                    <span>+880</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    value={walletNumber}
                    onChange={(e) => setWalletNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3 py-2 bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Account Type (Personal / Agent) */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  {t('accountType')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWalletType('Personal')}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      walletType === 'Personal'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {t('personal')} (Personal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalletType('Agent')}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      walletType === 'Agent'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    {t('agent')} (Agent)
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Bank Name Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  {t('selectBank')} *
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                >
                  {bdBanks.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bank Account Number */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  {t('accountNumber')} *
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="2050XXXXXXXXXXXX"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>

              {/* Branch / Routing */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  {t('branchName')}
                </label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: গুলশান শাখা / অনলাইন' : 'e.g. Gulshan Branch / Online'}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
                />
              </div>
            </>
          )}

          {/* Relationship */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              {t('relationship')}
            </label>
            <div className="flex space-x-2">
              {['Family', 'Friend', 'Self'].map((rel) => (
                <button
                  type="button"
                  key={rel}
                  onClick={() => setRelationship(rel)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                    relationship === rel
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  {rel === 'Family' ? t('family') : rel === 'Friend' ? t('friend') : 'নিজ'}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all text-base flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>{t('loading')}</span>
              ) : (
                <>
                  <span>{t('saveAndContinue')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};
