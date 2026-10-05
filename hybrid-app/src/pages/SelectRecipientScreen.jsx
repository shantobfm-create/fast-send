import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const SelectRecipientScreen = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { recipients, transferDraft, setTransferDraft } = useApp();
  const [search, setSearch] = useState('');

  const filteredRecipients = (recipients || []).filter((r) => {
    const q = search.toLowerCase();
    const nameMatch = r.name?.toLowerCase().includes(q);
    const phoneMatch = r.phone?.includes(q) || r.accountNumber?.includes(q);
    const providerMatch = r.provider?.toLowerCase().includes(q) || r.bankName?.toLowerCase().includes(q);
    return nameMatch || phoneMatch || providerMatch;
  });

  const handleSelectRecipient = (recipient) => {
    setTransferDraft({
      ...transferDraft,
      recipient
    });
    onNavigate('payment-instruction');
  };

  const getProviderIcon = (provider, type) => {
    if (type === 'bank') return '🏦';
    switch (provider?.toLowerCase()) {
      case 'bkash':
        return '🌸';
      case 'nagad':
        return '🟠';
      case 'rocket':
        return '🟣';
      case 'upay':
        return '🔵';
      default:
        return '📱';
    }
  };

  const maskNumber = (num) => {
    if (!num) return '';
    if (num.length <= 6) return num;
    return `${num.slice(0, 4)}••••${num.slice(-3)}`;
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col justify-between w-full">
      <div>
        {/* Top Header - Secondary Brand Ocean Blue */}
        <div className="bg-gradient-to-r from-[#1F6391] to-[#2980B9] text-white px-5 pt-5 pb-5 flex items-center justify-between shadow-md">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base font-extrabold text-white tracking-wide uppercase">
            {t('recipientTitle')}
          </h2>
          <div className="w-10" />
        </div>

        <div className="p-5 space-y-4">

        {/* Transfer amount reminder summary */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 mb-4 flex items-center justify-between shadow-sm">
          <span className="text-xs font-semibold text-slate-500">
            {language === 'bn' ? 'প্রাপক পাবেন:' : 'Recipient receives:'}
          </span>
          <span className="text-sm font-black text-[#25CC71]">
            ৳{Number(transferDraft.targetAmount || 0).toLocaleString()} BDT
          </span>
        </div>

        {/* Action Card: + Add New Recipient */}
        <button
          onClick={() => onNavigate('add-recipient')}
          className="w-full mb-4 p-4 rounded-2xl border-2 border-dashed border-[#25CC71] bg-[#E8F8F0]/70 hover:bg-[#E8F8F0] text-[#1EA85D] font-black flex items-center justify-center space-x-2 transition-all shadow-sm group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#25CC71] text-white flex items-center justify-center text-base font-bold shadow-sm group-hover:scale-105 transition-transform">
            +
          </div>
          <span className="text-sm font-extrabold">{t('addNewRecipient')}</span>
        </button>

        {/* Search Bar */}
        <div className="relative mb-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchRecipientPlaceholder')}
            className="w-full px-4 py-3.5 pl-11 bg-white border border-slate-200/90 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#25CC71] focus:ring-2 focus:ring-[#25CC71]/20 shadow-sm placeholder-slate-400 transition-all"
          />
          <div className="absolute left-3.5 top-4 text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Saved Beneficiaries Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider">
            {t('savedRecipients')} ({filteredRecipients.length})
          </h3>
        </div>

        {/* Recipient List */}
        {filteredRecipients.length > 0 ? (
          <div className="space-y-3">
            {filteredRecipients.map((rec) => (
              <div
                key={rec.id}
                onClick={() => handleSelectRecipient(rec)}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-[#25CC71] hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#E8F8F0] border border-[#25CC71]/20 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                    {getProviderIcon(rec.provider, rec.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#2C3E50] group-hover:text-[#25CC71] transition-colors">
                      {rec.name}
                    </h4>
                    <p className="text-xs font-medium text-slate-500">
                      {rec.type === 'bank' ? (
                        <span>{rec.bankName} • {maskNumber(rec.accountNumber)}</span>
                      ) : (
                        <span>
                          {rec.provider?.toUpperCase()} • {maskNumber(rec.phone || rec.accountNumber)}
                          {rec.accountType && ` (${rec.accountType})`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#25CC71] text-slate-400 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#E8F8F0] flex items-center justify-center mx-auto text-[#25CC71] mb-3 text-2xl">
              👥
            </div>
            <p className="text-sm font-extrabold text-[#2C3E50] mb-1">
              {t('noRecipients')}
            </p>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'টাকা পাঠাতে নতুন প্রাপক যোগ করুন' : 'Add beneficiary to transfer money'}
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
