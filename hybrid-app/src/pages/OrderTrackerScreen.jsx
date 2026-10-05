import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const OrderTrackerScreen = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { activeOrder, settings, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  // If no active order, return fallback
  if (!activeOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="text-4xl mb-3">🔍</div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          {language === 'bn' ? 'কোনো সক্রিয় অর্ডার পাওয়া যায়নি' : 'No Active Order Found'}
        </h3>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow"
        >
          {t('backHome')}
        </button>
      </div>
    );
  }

  const orderId = activeOrder.orderId || `#FS-${activeOrder.id.slice(-6)}`;
  const status = activeOrder.status || 'submitted';

  // 4-step timeline logic
  // Steps: 1: Order Placed, 2: Admin Verification, 3: Sending to Recipient, 4: Completed
  const getStepStatus = (stepNumber) => {
    if (status === 'completed' || status === 'approved') return 'completed';
    if (status === 'rejected') {
      if (stepNumber === 1) return 'completed';
      return 'rejected';
    }

    if (stepNumber === 1) return 'completed';
    if (stepNumber === 2) {
      if (status === 'reviewing') return 'active';
      if (status === 'processing') return 'completed';
      return 'active'; // default for submitted
    }
    if (stepNumber === 3) {
      if (status === 'processing') return 'active';
      return 'pending';
    }
    if (stepNumber === 4) {
      return 'pending';
    }
    return 'pending';
  };

  const steps = [
    {
      step: 1,
      title: t('step1Title'),
      desc: t('step1Desc'),
      time: activeOrder.createdAt ? new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
    },
    {
      step: 2,
      title: t('step2Title'),
      desc: t('step2Desc'),
      time: '10-30m'
    },
    {
      step: 3,
      title: t('step3Title'),
      desc: t('step3Desc'),
      time: ''
    },
    {
      step: 4,
      title: t('step4Title'),
      desc: t('step4Desc'),
      time: ''
    }
  ];

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    showToast(t('copied'), 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col justify-between w-full pb-12">
      <div>
        {/* Top Header - #2677AD */}
        <div className="bg-[#2677AD] text-white px-5 pt-5 pb-5 flex items-center justify-between shadow-md">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base font-extrabold text-white tracking-wide uppercase">
            {t('timelineTitle')}
          </h2>
          <div className="w-10" />
        </div>

        <div className="p-5 space-y-4">

        {/* Transaction Header Pill */}
        <div className="text-center py-2 mb-1">
          <div className="inline-flex items-center space-x-2 bg-white border border-slate-200/90 px-4 py-2 rounded-full shadow-sm">
            <span className="text-xs font-bold text-slate-500">{t('orderTrackingId')}:</span>
            <span className="text-xs font-mono font-black text-[#25CC71]">{orderId}</span>
            <button
              onClick={handleCopyOrderId}
              className="text-slate-400 hover:text-[#25CC71] transition-colors ml-1"
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
          <div className="mt-2 text-xs font-extrabold text-[#2C3E50]">
            {status === 'completed' || status === 'approved' ? (
              <span className="text-[#1EA85D]">● {t('statusCompleted')}</span>
            ) : status === 'rejected' ? (
              <span className="text-rose-600">● {t('statusRejected')}</span>
            ) : (
              <span className="text-[#2980B9]">● {isBn ? 'যাচাইকরণ প্রক্রিয়াধীন' : 'Verification in Progress'}</span>
            )}
          </div>
        </div>

        {/* Receipt Ticket Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="text-center pb-3 border-b border-dashed border-slate-200">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">
              {isBn ? 'মানি ট্রান্সফার রসিদ' : 'Transfer Receipt'}
            </span>
            <div className="text-2xl font-black text-[#2C3E50] mt-1">
              ৳{Number(activeOrder.targetAmount || activeOrder.amount).toLocaleString()} <span className="text-sm font-bold text-[#25CC71]">BDT</span>
            </div>
          </div>

          <div className="py-3.5 space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">{t('recipientLabel')}:</span>
              <span className="font-extrabold text-[#2C3E50]">
                {activeOrder.recipient?.name || 'Beneficiary'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">{isBn ? 'পেমেন্ট মেথড' : 'Method'}:</span>
              <span className="font-bold text-[#2980B9]">
                {activeOrder.recipient?.type === 'bank'
                  ? `${activeOrder.recipient.bankName}`
                  : `${activeOrder.recipient?.provider?.toUpperCase() || 'Wallet'} (${activeOrder.recipient?.accountType || 'Personal'})`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">{t('transferAmount')}:</span>
              <span className="font-bold text-slate-700">
                {activeOrder.sourceAmount} {activeOrder.sourceCurrency}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">{t('rateUsed')}:</span>
              <span className="font-bold text-slate-700">
                1 {activeOrder.sourceCurrency} = {activeOrder.exchangeRate || (activeOrder.sourceCurrency === 'MYR' ? 27.5 : 33.5)} BDT
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <span className="text-slate-500 font-medium">{isBn ? 'তারিখ ও সময়' : 'Date & Time'}:</span>
              <span className="font-semibold text-slate-600">
                {activeOrder.createdAt ? new Date(activeOrder.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now'}
              </span>
            </div>
          </div>
        </div>

        {/* 4-Step Vertical Timeline */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <h4 className="text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider">
              {t('timelineTitle')}
            </h4>
            <span className="text-[11px] font-black text-[#25CC71] bg-[#E8F8F0] px-2.5 py-0.5 rounded-full">
              {status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-6 relative">
            {/* Timeline track line */}
            <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-slate-200 -z-0"></div>

            {steps.map((st) => {
              const stepState = getStepStatus(st.step);

              let badgeBg = 'bg-slate-200 text-slate-600';
              let titleColor = 'text-slate-500';

              if (stepState === 'completed') {
                badgeBg = 'bg-[#25CC71] text-white ring-4 ring-[#E8F8F0]';
                titleColor = 'text-[#2C3E50] font-extrabold';
              } else if (stepState === 'active') {
                badgeBg = 'bg-[#2980B9] text-white ring-4 ring-[#EBF5FB] animate-pulse';
                titleColor = 'text-[#2980B9] font-extrabold';
              } else if (stepState === 'rejected') {
                badgeBg = 'bg-rose-600 text-white ring-4 ring-rose-50';
                titleColor = 'text-rose-900 font-bold';
              }

              return (
                <div key={st.step} className="flex items-start space-x-3.5 relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${badgeBg}`}>
                    {stepState === 'completed' ? '✓' : st.step}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-baseline justify-between">
                      <p className={`text-sm ${titleColor}`}>
                        {st.title}
                      </p>
                      {st.time && (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {st.time}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {status === 'rejected' && activeOrder.rejectionReason && (
            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">
              <span className="font-extrabold">বাতিলের কারণ: </span>
              {activeOrder.rejectionReason}
            </div>
          )}
        </div>

        {/* Support Buttons */}
        <div className="space-y-3 pt-1">
          <a
            href={`https://wa.me/${(settings?.whatsappNumber || '+8801754150019').replace(/\+/g, '')}?text=Help with order ${orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-4 bg-[#E8F8F0] hover:bg-[#D4F4E4] border border-[#25CC71]/40 text-[#1EA85D] font-black rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-sm transition-all"
          >
            <span>💬</span>
            <span>{t('whatsappSupport')}</span>
          </a>

          <button
            onClick={() => onNavigate('home')}
            className="w-full py-4 px-4 bg-[#2C3E50] hover:bg-[#1C3144] text-white font-black rounded-2xl flex items-center justify-center text-sm shadow-md transition-all"
          >
            {t('backHome')}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
