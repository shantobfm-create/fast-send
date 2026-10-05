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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-5 max-w-md mx-auto">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pt-3 pb-4">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base font-bold text-slate-900">
            {t('recipientTitle')}
          </h2>
          <div className="w-10" />
        </div>

        {/* Transfer amount reminder summary */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 mb-4 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            {language === 'bn' ? 'প্রাপক পাবেন:' : 'Recipient receives:'}
          </span>
          <span className="text-sm font-extrabold text-emerald-700">
            ৳{Number(transferDraft.targetAmount || 0).toLocaleString()} BDT
          </span>
        </div>

        {/* Action Card: + Add New Recipient */}
        <button
          onClick={() => onNavigate('add-recipient')}
          className="w-full mb-4 p-4 rounded-2xl border-2 border-dashed border-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center space-x-2 transition-all shadow-sm"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-base">
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
            className="w-full px-4 py-3 pl-11 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm placeholder-slate-400"
          />
          <div className="absolute left-3.5 top-3.5 text-slate-400">
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
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-600 hover:shadow-md cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shrink-0 group-hover:border-emerald-300">
                    {getProviderIcon(rec.provider, rec.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
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

                <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400 mb-3 text-2xl">
              👥
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">
              {t('noRecipients')}
            </p>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'টাকা পাঠাতে নতুন প্রাপক যোগ করুন' : 'Add beneficiary to transfer money'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
