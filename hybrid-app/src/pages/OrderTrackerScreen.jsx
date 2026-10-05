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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto pb-12">
      <div>
        {/* Top Header - Black Theme */}
        <div className="bg-slate-950 text-white px-5 pt-4 pb-4 border-b border-slate-800 flex items-center justify-between shadow-md">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-800 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base font-bold text-white tracking-wide">
            {t('timelineTitle')}
          </h2>
          <div className="w-10" />
        </div>

        <div className="p-5 space-y-4">

        {/* Success Header Banner */}
        <div className="text-center py-4 mb-2">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-3 shadow-inner">
            ✓
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {t('orderPlacedTitle')}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn' ? 'অর্ডার প্রসেসিং শুরু হয়েছে' : 'Order verification has started'}
          </p>

          {/* Copyable Order ID Pill */}
          <div className="mt-3 inline-flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="text-xs font-bold text-slate-500">{t('orderTrackingId')}:</span>
            <span className="text-xs font-mono font-extrabold text-emerald-700">{orderId}</span>
            <button
              onClick={handleCopyOrderId}
              className="text-slate-400 hover:text-emerald-600 transition-colors"
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
        </div>

        {/* 4-Step Vertical Timeline */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-5">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            {t('timelineTitle')}
          </h4>

          <div className="space-y-6 relative">
            {/* Timeline track line */}
            <div className="absolute left-[17px] top-3 bottom-3 w-0.5 bg-slate-200 -z-0"></div>

            {steps.map((st) => {
              const stepState = getStepStatus(st.step);

              let badgeBg = 'bg-slate-200 text-slate-600';
              let titleColor = 'text-slate-500';

              if (stepState === 'completed') {
                badgeBg = 'bg-emerald-600 text-white ring-4 ring-emerald-50';
                titleColor = 'text-slate-900 font-bold';
              } else if (stepState === 'active') {
                badgeBg = 'bg-blue-600 text-white ring-4 ring-blue-50 animate-pulse';
                titleColor = 'text-blue-900 font-bold';
              } else if (stepState === 'rejected') {
                badgeBg = 'bg-rose-600 text-white ring-4 ring-rose-50';
                titleColor = 'text-rose-900 font-bold';
              }

              return (
                <div key={st.step} className="flex items-start space-x-3.5 relative z-10">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm ${badgeBg}`}>
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
                    <p className="text-xs text-slate-500 mt-0.5">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {status === 'rejected' && activeOrder.rejectionReason && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              <span className="font-bold">বাতিলের কারণ: </span>
              {activeOrder.rejectionReason}
            </div>
          )}
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-5 space-y-2.5">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
            {t('orderSummary')}
          </h4>

          <div className="flex justify-between text-xs">
            <span className="text-slate-500">{t('transferAmount')}:</span>
            <span className="font-bold text-slate-800">
              {activeOrder.sourceAmount} {activeOrder.sourceCurrency}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-slate-500">{t('rateUsed')}:</span>
            <span className="font-bold text-slate-800">
              1 {activeOrder.sourceCurrency} = {activeOrder.exchangeRate || (activeOrder.sourceCurrency === 'MYR' ? 27.5 : 33.5)} BDT
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-slate-500">{t('bdtDeliver')}:</span>
            <span className="font-extrabold text-emerald-700">
              ৳{Number(activeOrder.targetAmount || activeOrder.amount).toLocaleString()} BDT
            </span>
          </div>

          <div className="flex justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500">{t('recipientLabel')}:</span>
            <span className="font-bold text-slate-800 text-right">
              {activeOrder.recipient?.name || 'Beneficiary'}
              <br />
              <span className="text-[11px] text-slate-500 font-normal">
                {activeOrder.recipient?.type === 'bank'
                  ? `${activeOrder.recipient.bankName} (${activeOrder.recipient.accountNumber})`
                  : `${activeOrder.recipient?.provider?.toUpperCase()} (${activeOrder.recipient?.phone || activeOrder.recipient?.accountNumber})`}
              </span>
            </span>
          </div>
        </div>

        {/* Support Buttons */}
        <div className="space-y-2.5">
          <a
            href={`https://wa.me/${(settings?.whatsappNumber || '+8801754150019').replace(/\+/g, '')}?text=Help with order ${orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-emerald-900 font-bold rounded-2xl flex items-center justify-center space-x-2 text-sm shadow-sm transition-all"
          >
            <span>💬</span>
            <span>{t('whatsappSupport')}</span>
          </a>

          <button
            onClick={() => onNavigate('home')}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl flex items-center justify-center text-sm shadow-md transition-all"
          >
            {t('backHome')}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
