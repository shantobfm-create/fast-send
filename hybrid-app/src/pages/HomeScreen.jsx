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
    setActiveOrder
  } = useApp();

  const isBn = language === 'bn';
  const sourceCurrency = selectedCountry === 'MY' ? 'MYR' : 'AED';
  const countryFlag = selectedCountry === 'MY' ? '🇲🇾' : '🇦🇪';

  const rateObj = settings?.exchangeRates?.find(r => r.code === sourceCurrency);
  const currentRate = rateObj?.rateToBdt || (selectedCountry === 'MY' ? 27.5 : 33.5);

  const [sendAmount, setSendAmount] = useState(transferDraft.sourceAmount || (selectedCountry === 'MY' ? 500 : 500));
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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F0] text-[#1EA85D] border border-[#25CC71]/30">
            {t('statusCompleted')}
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF5FB] text-[#2980B9] border border-[#2980B9]/30">
            {t('statusProcessing')}
          </span>
        );
      case 'reviewing':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
            {t('statusReviewing')}
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            {t('statusRejected')}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {t('statusSubmitted')}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] pb-20 w-full">
      {/* Top App Header with Primary Emerald Gradient & Brand Identity */}
      <div className="bg-gradient-to-br from-[#1F6391] via-[#2980B9] to-[#25CC71] text-white px-5 pt-6 pb-8 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-white shadow-sm text-base">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'FS'}
            </div>
            <div>
              <p className="text-[11px] text-white/80 font-medium leading-none">{t('greeting')},</p>
              <h2 className="text-base font-extrabold text-white truncate max-w-[150px] mt-0.5">
                {user?.name || user?.phone || 'Valued User'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Country Selector Pill */}
            <button
              onClick={handleToggleCountry}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/25 text-xs font-bold text-white transition-all shadow-xs"
            >
              <span>{countryFlag}</span>
              <span>{sourceCurrency}</span>
              <span className="text-[10px] text-white/70 font-normal">({t('changeCountry')})</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold text-white hover:bg-white/25"
            >
              {language === 'bn' ? 'EN' : 'বাং'}
            </button>
          </div>
        </div>

        {/* Live Exchange Rate Bar */}
        <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center justify-between mt-4 shadow-inner">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25CC71] ring-4 ring-[#25CC71]/30 animate-pulse"></span>
            <span className="text-xs font-semibold text-white/90">{t('liveRate')}:</span>
          </div>
          <div className="text-sm font-black text-white tracking-wide">
            1 {sourceCurrency} = <span className="text-[#A7F3D0]">{currentRate} BDT</span>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-5">
        {/* Converter Hero Card - DeshRemit Modern Card Style */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-lg shadow-slate-200/50">
          <div className="space-y-4">
            {/* From (You Send) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  From: {t('youSend')}
                </span>
                <span className="text-[11px] font-bold text-[#1EA85D]">
                  {t('feeFree')}
                </span>
              </div>
              <div className="flex items-center bg-[#F4F7F6] border-2 border-slate-200 focus-within:border-[#25CC71] rounded-2xl p-2.5 transition-all">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-sm shadow-xs shrink-0">
                  <span className="text-lg">{countryFlag}</span>
                  <span className="font-extrabold">{sourceCurrency}</span>
                </div>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => handleSendAmountChange(e.target.value)}
                  className="w-full bg-transparent px-3 text-right text-2xl font-black text-slate-900 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Switch Icon Divider */}
            <div className="flex items-center justify-center -my-1">
              <div className="w-9 h-9 rounded-full bg-[#E8F8F0] border border-[#25CC71]/40 text-[#25CC71] flex items-center justify-center font-bold shadow-xs">
                ⇄
              </div>
            </div>

            {/* To (Recipient Gets BDT) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  To: {t('recipientGets')}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  বাংলাদেশ 🇧🇩
                </span>
              </div>
              <div className="flex items-center bg-[#F4F7F6] border-2 border-slate-200 focus-within:border-[#25CC71] rounded-2xl p-2.5 transition-all">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-sm shadow-xs shrink-0">
                  <span className="text-lg">🇧🇩</span>
                  <span className="font-extrabold">BDT</span>
                </div>
                <input
                  type="number"
                  value={receiveAmount}
                  onChange={(e) => handleReceiveAmountChange(e.target.value)}
                  className="w-full bg-transparent px-3 text-right text-2xl font-black text-[#1EA85D] focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Rate Badge */}
            <div className="bg-[#E8F8F0] border border-[#25CC71]/30 rounded-2xl py-2 px-4 text-center">
              <p className="text-xs font-bold text-[#178449]">
                Exchange Rate: 1 {sourceCurrency} = {currentRate} BDT
              </p>
            </div>

            {/* Primary Action Button (Brand Emerald #25CC71) */}
            <button
              onClick={() => handleProceedToSend()}
              className="w-full py-4 px-6 bg-[#25CC71] hover:bg-[#1EA85D] active:scale-[0.99] text-white font-extrabold rounded-2xl shadow-lg shadow-[#25CC71]/30 transition-all text-base flex items-center justify-center space-x-2 cursor-pointer"
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
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('quickSendTitle')}
              </h3>
              <button 
                onClick={() => onNavigate('select-recipient')}
                className="text-xs font-bold text-[#2980B9] hover:underline"
              >
                {t('viewAll')}
              </button>
            </div>

            <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => onNavigate('add-recipient')}
                className="flex flex-col items-center shrink-0 space-y-1.5 group"
              >
                <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-[#25CC71] bg-[#E8F8F0] flex items-center justify-center text-[#25CC71] transition-all">
                  <span className="text-xl font-black">+</span>
                </div>
                <span className="text-[11px] font-bold text-slate-600">
                  {isBn ? 'নতুন' : 'New'}
                </span>
              </button>

              {recipients.slice(0, 5).map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => handleProceedToSend(rec)}
                  className="flex flex-col items-center shrink-0 space-y-1.5 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 group-hover:border-[#25CC71] flex items-center justify-center font-extrabold text-slate-800 shadow-xs transition-all relative">
                    <span className="text-sm">{rec.name ? rec.name.slice(0, 2).toUpperCase() : 'BD'}</span>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2980B9] text-[10px] text-white flex items-center justify-center font-bold">
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

        {/* Recent Transfers (Matching DeshRemit Style) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('recentActivity')}
            </h3>
            {transactions?.length > 3 && (
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-bold text-[#2980B9] hover:underline"
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
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-[#25CC71] shadow-xs cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#E8F8F0] text-[#1EA85D] flex items-center justify-center text-lg font-bold shrink-0">
                      {tx.recipient?.type === 'bank' ? '🏦' : '📱'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        {tx.recipient?.name || 'Bangladesh Recipient'}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {tx.orderId || `#FS-${tx.id.slice(-6)}`} • {new Date(tx.createdAt || tx.requestedAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">
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
              <div className="w-12 h-12 rounded-full bg-[#F4F7F6] flex items-center justify-center mx-auto text-slate-400 mb-2 text-xl">
                💸
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t('noTransactions')}
              </p>
            </div>
          )}
        </div>

        {/* WhatsApp Customer Support */}
        <a
          href={`https://wa.me/${(settings?.whatsappNumber || '+8801754150019').replace(/\+/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-2xl bg-white border border-[#25CC71]/40 hover:bg-[#E8F8F0]/50 transition-all shadow-xs"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#25CC71] text-white flex items-center justify-center text-xl shadow-xs">
              💬
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">
                {t('whatsappSupport')}
              </p>
              <p className="text-[11px] text-slate-500">
                ২৪/৭ গ্রাহক সেবা ও তাৎক্ষণিক সহায়তা
              </p>
            </div>
            <span className="text-[#25CC71] font-bold text-sm">➔</span>
          </div>
        </a>
      </div>
    </div>
  );
};
