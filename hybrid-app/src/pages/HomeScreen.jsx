import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const HomeScreen = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const { 
    user, 
    settings, 
    selectedCountry, 
    setCountry, 
    transferDraft, 
    setTransferDraft, 
    transactions, 
    recipients,
    setActiveOrder,
    logout
  } = useApp();

  // Exchange rate lookup
  const sourceCurrency = selectedCountry === 'MY' ? 'MYR' : 'AED';
  const countryFlag = selectedCountry === 'MY' ? '🇲🇾' : '🇦🇪';
  const countryLabel = selectedCountry === 'MY' ? t('countryMalaysia') : t('countryUae');

  const rateObj = settings?.exchangeRates?.find(r => r.code === sourceCurrency);
  const currentRate = rateObj?.rateToBdt || (selectedCountry === 'MY' ? 27.5 : 33.5);

  // Calculator inputs
  const [sendAmount, setSendAmount] = useState(transferDraft.sourceAmount || (selectedCountry === 'MY' ? 1000 : 500));
  const receiveAmount = Math.round(sendAmount * currentRate);

  const handleSendAmountChange = (val) => {
    const num = parseFloat(val) || 0;
    setSendAmount(num);
  };

  const handleReceiveAmountChange = (val) => {
    const num = parseFloat(val) || 0;
    const calcSend = (num / currentRate).toFixed(2);
    setSendAmount(calcSend);
  };

  const handleProceedToSend = (presetRecipient = null) => {
    setTransferDraft({
      sourceAmount: Number(sendAmount),
      sourceCurrency,
      exchangeRate: currentRate,
      targetAmount: receiveAmount,
      targetCurrency: 'BDT',
      recipient: presetRecipient || null,
      paymentMethod: null
    });

    if (presetRecipient) {
      onNavigate('payment-instruction');
    } else {
      onNavigate('select-recipient');
    }
  };

  const handleToggleCountry = () => {
    const next = selectedCountry === 'MY' ? 'AE' : 'MY';
    setCountry(next);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            {t('statusCompleted')}
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            {t('statusProcessing')}
          </span>
        );
      case 'reviewing':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            {t('statusReviewing')}
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            {t('statusRejected')}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {t('statusSubmitted')}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 max-w-md mx-auto">
      {/* Top App Bar Header */}
      <div className="bg-slate-900 text-white px-5 pt-5 pb-6 rounded-b-[2rem] shadow-lg shadow-slate-900/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center font-bold text-emerald-400">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'FS'}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{t('greeting')},</p>
              <h2 className="text-base font-bold text-white truncate max-w-[150px]">
                {user?.name || user?.phone || 'Valued User'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Country Selector Pill */}
            <button
              onClick={handleToggleCountry}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-200 transition-all"
            >
              <span>{countryFlag}</span>
              <span>{sourceCurrency}</span>
              <span className="text-[10px] text-emerald-400 font-normal">({t('changeCountry')})</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-700"
            >
              {language === 'bn' ? 'EN' : 'বাং'}
            </button>
          </div>
        </div>

        {/* Live Exchange Rate Ticker */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300">{t('liveRate')}:</span>
          </div>
          <div className="text-sm font-extrabold text-emerald-400">
            1 {sourceCurrency} = {currentRate} BDT
          </div>
        </div>
      </div>

      <div className="px-5 -mt-3 space-y-5">
        {/* Converter Hero Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-md">
          <div className="space-y-4">
            {/* You Send Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('youSend')}
                </label>
                <span className="text-[11px] font-semibold text-emerald-600">
                  {t('feeFree')}
                </span>
              </div>
              <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-emerald-600 rounded-2xl p-2 transition-all">
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => handleSendAmountChange(e.target.value)}
                  className="w-full bg-transparent px-2 text-2xl font-extrabold text-slate-900 focus:outline-none"
                  placeholder="0"
                />
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-sm shadow-sm shrink-0">
                  <span>{countryFlag}</span>
                  <span>{sourceCurrency}</span>
                </div>
              </div>
            </div>

            {/* Rate Divider Badge */}
            <div className="flex items-center justify-center -my-1">
              <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-[11px] font-bold text-slate-600 flex items-center space-x-1 shadow-sm">
                <span>1 {sourceCurrency}</span>
                <span>=</span>
                <span className="text-emerald-700">{currentRate} BDT</span>
              </div>
            </div>

            {/* Recipient Gets Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t('recipientGets')}
                </label>
                <span className="text-[11px] font-semibold text-slate-500">
                  বাংলাদেশ (BDT)
                </span>
              </div>
              <div className="flex items-center bg-slate-50 border-2 border-slate-200 focus-within:border-emerald-600 rounded-2xl p-2 transition-all">
                <input
                  type="number"
                  value={receiveAmount}
                  onChange={(e) => handleReceiveAmountChange(e.target.value)}
                  className="w-full bg-transparent px-2 text-2xl font-extrabold text-emerald-700 focus:outline-none"
                  placeholder="0"
                />
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-sm shadow-sm shrink-0">
                  <span>🇧🇩</span>
                  <span>BDT</span>
                </div>
              </div>
            </div>

            {/* Send Money Now CTA */}
            <button
              onClick={() => handleProceedToSend()}
              className="w-full mt-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all text-base flex items-center justify-center space-x-2"
            >
              <span>{t('sendNowBtn')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Send (Saved Beneficiaries) */}
        {recipients && recipients.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-bold text-slate-900">
                {t('quickSendTitle')}
              </h3>
              <button 
                onClick={() => onNavigate('select-recipient')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {t('viewAll')}
              </button>
            </div>

            <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
              {/* Add Recipient Quick Button */}
              <button
                onClick={() => onNavigate('add-recipient')}
                className="flex flex-col items-center shrink-0 space-y-1.5 group"
              >
                <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-300 group-hover:border-emerald-600 bg-white flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-slate-600 group-hover:text-emerald-700">
                  {language === 'bn' ? 'নতুন' : 'New'}
                </span>
              </button>

              {/* Saved Avatars */}
              {recipients.slice(0, 5).map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => handleProceedToSend(rec)}
                  className="flex flex-col items-center shrink-0 space-y-1.5 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 group-hover:border-emerald-600 flex items-center justify-center font-bold text-slate-800 group-hover:text-emerald-700 shadow-sm transition-all relative">
                    <span className="text-base">{rec.name ? rec.name.slice(0, 2).toUpperCase() : 'BD'}</span>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-[10px] text-white flex items-center justify-center font-bold">
                      {rec.type === 'bank' ? '🏦' : '📱'}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-700 truncate max-w-[64px]">
                    {rec.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900">
              {t('recentActivity')}
            </h3>
            {transactions?.length > 3 && (
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {t('viewAll')}
              </button>
            )}
          </div>

          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => {
                    setActiveOrder(tx);
                    onNavigate('order-tracker');
                  }}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg">
                      {tx.recipient?.type === 'bank' ? '🏦' : '📱'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        {tx.recipient?.name || 'Bangladesh Recipient'}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {tx.orderId || `#FS-${tx.id.slice(-6)}`} • {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-extrabold text-slate-900">
                      ৳{Number(tx.targetAmount || tx.amount).toLocaleString()}
                    </p>
                    <div className="mt-1">
                      {getStatusBadge(tx.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-2 text-xl">
                💸
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t('noTransactions')}
              </p>
            </div>
          )}
        </div>

        {/* WhatsApp Support Callout */}
        <a
          href={`https://wa.me/${(settings?.whatsappNumber || '+8801754150019').replace(/\+/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/60 transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow-sm">
              💬
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-emerald-900">
                {t('whatsappSupport')}
              </p>
              <p className="text-[11px] text-emerald-700">
                কোনো সমস্যা হলে সরাসরি কথা বলুন
              </p>
            </div>
            <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
};
