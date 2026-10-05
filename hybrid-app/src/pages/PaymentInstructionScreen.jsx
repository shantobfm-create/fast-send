import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const PaymentInstructionScreen = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { 
    selectedCountry, 
    settings, 
    transferDraft, 
    submitRemittance, 
    setActiveOrder, 
    showToast 
  } = useApp();

  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [loading, setLoading] = useState(false);

  // Bank instruction based on country
  const isMalaysia = selectedCountry === 'MY';
  const foundAccount = Array.isArray(settings?.senderAccounts)
    ? settings.senderAccounts.find(a => a.id === selectedCountry)
    : (isMalaysia ? settings?.senderAccounts?.malaysia : settings?.senderAccounts?.uae);

  const senderBankInfo = isMalaysia
    ? {
        bankName: foundAccount?.bankName || 'Maybank (Malayan Banking Berhad)',
        accountName: foundAccount?.accountName || 'Fast Send Global Services',
        accountNumber: foundAccount?.accountNumber || '1642 9840 2201',
        qrImage: foundAccount?.qrCodeUrl || '/duitnow-qr.png',
        typeLabel: 'Maybank / DuitNow QR'
      }
    : {
        bankName: foundAccount?.bankName || 'Emirates NBD',
        accountName: foundAccount?.accountName || 'Fast Send UAE LLC',
        accountNumber: foundAccount?.accountNumber || foundAccount?.iban || 'AE25 0260 0012 3456 7890 123',
        qrImage: null,
        typeLabel: 'UAE Local Transfer / IBAN'
      };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(t('copied'), 'success');
    setTimeout(() => {
      setCopiedField('');
    }, 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast(language === 'bn' ? 'ছবির সাইজ সর্বোচ্চ ৮ এমবি হতে পারবে' : 'File size cannot exceed 8MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshotPreview(event.target.result);
      setScreenshotBase64(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setScreenshotPreview(null);
    setScreenshotBase64('');
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!screenshotBase64) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে টাকা পাঠানোর রসিদ বা স্ক্রিনশট আপলোড করুন' : 'Please upload payment receipt screenshot', 'error');
      return;
    }

    if (!transferDraft.recipient) {
      showToast('Recipient is missing. Please select recipient first.', 'error');
      onNavigate('select-recipient');
      return;
    }

    setLoading(true);

    const payload = {
      sourceAmount: transferDraft.sourceAmount,
      sourceCurrency: transferDraft.sourceCurrency,
      exchangeRate: transferDraft.exchangeRate,
      targetAmount: transferDraft.targetAmount,
      targetCurrency: 'BDT',
      recipient: transferDraft.recipient,
      senderCountry: selectedCountry,
      bankTransferProof: screenshotBase64,
      referenceNumber: referenceNumber.trim()
    };

    const res = await submitRemittance(payload);
    setLoading(false);

    if (res.success && res.transaction) {
      setActiveOrder(res.transaction);
      onNavigate('order-tracker');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-5 max-w-md mx-auto">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pt-3 pb-4">
          <button
            onClick={() => onNavigate('select-recipient')}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base font-bold text-slate-900">
            {t('paymentTitle')}
          </h2>
          <div className="w-10" />
        </div>

        {/* Deposit Summary Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 mb-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              {language === 'bn' ? 'ট্রান্সফার পরিমাণ (ডিপোজিট করুন):' : 'Amount to Deposit:'}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
              {transferDraft.sourceCurrency}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-emerald-400">
              {transferDraft.sourceAmount} {transferDraft.sourceCurrency}
            </h3>
            <span className="text-xs text-slate-300">
              ➔ ৳{Number(transferDraft.targetAmount).toLocaleString()} BDT
            </span>
          </div>
        </div>

        {/* Admin Bank Details Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {senderBankInfo.typeLabel}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {isMalaysia ? '🇲🇾 Malaysia' : '🇦🇪 UAE (Dubai)'}
            </span>
          </div>

          {/* Bank Name */}
          <div>
            <p className="text-[11px] font-medium text-slate-500">{t('bankName')}</p>
            <p className="text-sm font-bold text-slate-900">{senderBankInfo.bankName}</p>
          </div>

          {/* Account Name */}
          <div>
            <p className="text-[11px] font-medium text-slate-500">{t('accountName')}</p>
            <p className="text-sm font-bold text-slate-900">{senderBankInfo.accountName}</p>
          </div>

          {/* Account / IBAN with 1-click Copy */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase">
                {t('accOrIban')}
              </p>
              <p className="text-sm font-mono font-extrabold text-slate-900 tracking-wide select-all">
                {senderBankInfo.accountNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(senderBankInfo.accountNumber.replace(/\s+/g, ''), 'account')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm active:scale-95 transition-all"
            >
              <span>{copiedField === 'account' ? '✓' : '📋'}</span>
              <span>{copiedField === 'account' ? 'Copied' : t('copy')}</span>
            </button>
          </div>

          {/* DuitNow QR for Malaysia */}
          {isMalaysia && (
            <div className="pt-2 border-t border-slate-100 flex flex-col items-center text-center">
              <p className="text-xs font-bold text-slate-700 mb-2">
                {t('duitNowQr')}
              </p>
              <div className="w-36 h-36 bg-white p-2 rounded-2xl border-2 border-dashed border-emerald-600 flex items-center justify-center shadow-inner relative group">
                {/* Fallback QR placeholder / SVG */}
                <div className="w-full h-full bg-slate-100 rounded-xl flex flex-col items-center justify-center p-2">
                  <div className="w-16 h-16 bg-slate-800 text-white rounded flex items-center justify-center font-bold text-xs">
                    QR CODE
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 font-bold">DuitNow QR</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Receipt Section */}
        <form onSubmit={handleSubmitOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {t('uploadPrompt')} *
            </label>

            {!screenshotPreview ? (
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-white hover:bg-emerald-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-2">
                  📸
                </div>
                <span className="text-sm font-bold text-slate-800">
                  {language === 'bn' ? 'ছবি বা স্ক্রিনশট সিলেক্ট করুন' : 'Tap to upload slip / screenshot'}
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  {t('uploadSubtitle')}
                </span>
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
                <img
                  src={screenshotPreview}
                  alt="Receipt Preview"
                  className="w-full h-52 object-contain bg-black/60"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow flex items-center space-x-1"
                >
                  <span>✕</span>
                  <span>{t('removeImage')}</span>
                </button>
              </div>
            )}
          </div>

          {/* TrxID / Reference Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              {t('referenceLabel')}
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder={t('referencePlaceholder')}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 pb-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all text-base flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>{t('loading')}</span>
              ) : (
                <>
                  <span>{t('submitOrderBtn')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
