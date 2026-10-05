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

  const isBn = language === 'bn';
  const isMalaysia = selectedCountry === 'MY';

  // Payment channel toggle: 'bank' vs 'wallet'
  const [payChannel, setPayChannel] = useState('bank'); // 'bank' | 'wallet'
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [loading, setLoading] = useState(false);

  // Retrieve account settings from database
  const foundAccount = Array.isArray(settings?.senderAccounts)
    ? settings.senderAccounts.find(a => a.id === selectedCountry)
    : (isMalaysia ? settings?.senderAccounts?.malaysia : settings?.senderAccounts?.uae);

  // Country specific details
  const myrDetails = {
    country: 'Malaysia',
    currency: 'MYR',
    flag: '🇲🇾',
    // Bank info
    bankName: foundAccount?.bankName || 'Maybank (Malayan Banking Berhad)',
    secondaryBank: foundAccount?.secondaryBankName || 'CIMB Bank / RHB Bank',
    accountName: foundAccount?.accountName || 'Fast Send Global Services (M) Sdn Bhd',
    accountNumber: foundAccount?.accountNumber || '1642 9840 2201',
    cimbNumber: foundAccount?.cimbAccountNumber || '8009 1234 5678',
    // Mobile Wallet info
    walletProvider: foundAccount?.walletProvider || "Touch 'n Go (TNG) eWallet",
    walletNumber: foundAccount?.walletNumber || '+6012 345 6789',
    walletName: foundAccount?.walletName || 'Fast Send TNG Official',
    duitNowId: foundAccount?.duitNowId || '+6012 345 6789',
    duitNowQr: foundAccount?.duitNowQr || 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DuitNow-164298402201-FastSend'
  };

  const uaeDetails = {
    country: 'UAE (Dubai)',
    currency: 'AED',
    flag: '🇦🇪',
    // Bank info
    bankName: foundAccount?.bankName || 'Emirates NBD',
    secondaryBank: foundAccount?.secondaryBankName || 'Mashreq Bank / Abu Dhabi Islamic Bank (ADIB)',
    accountName: foundAccount?.accountName || 'Fast Send Global Remittance LLC',
    accountNumber: foundAccount?.accountNumber || foundAccount?.iban || 'AE25 0260 0012 3456 7890 123',
    iban: foundAccount?.iban || foundAccount?.accountNumber || 'AE25 0260 0012 3456 7890 123',
    // Mobile Wallet info
    walletProvider: foundAccount?.walletProvider || 'Careem Pay / Botim Pay / Al Ansari Exchange',
    walletNumber: foundAccount?.walletNumber || '+971 50 123 4567',
    walletName: foundAccount?.walletName || 'Fast Send Dubai Official',
    payByPhone: foundAccount?.payByPhone || '+971 50 123 4567',
    alAnsariDetails: foundAccount?.alAnsariDetails || 'Fast Send UAE LLC (Deira, Dubai Branch)'
  };

  const details = isMalaysia ? myrDetails : uaeDetails;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
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
      showToast(isBn ? 'ছবির সাইজ সর্বোচ্চ ৮ এমবি হতে পারবে' : 'File size cannot exceed 8MB', 'error');
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
      showToast(isBn ? 'অনুগ্রহ করে টাকা পাঠানোর রসিদ বা স্ক্রিনশট আপলোড করুন' : 'Please upload payment receipt screenshot', 'error');
      return;
    }

    if (!transferDraft.recipient) {
      showToast('Recipient is missing. Please select recipient first.', 'error');
      onNavigate('select-recipient');
      return;
    }

    setLoading(true);

    const payload = {
      sendAmount: Number(transferDraft.sourceAmount),
      sourceAmount: Number(transferDraft.sourceAmount),
      senderCurrency: transferDraft.sourceCurrency,
      sourceCurrency: transferDraft.sourceCurrency,
      exchangeRate: transferDraft.exchangeRate,
      receiveAmount: Number(transferDraft.targetAmount),
      targetAmount: Number(transferDraft.targetAmount),
      receiveCurrency: 'BDT',
      targetCurrency: 'BDT',
      recipient: transferDraft.recipient,
      senderCountry: selectedCountry,
      paymentChannel: payChannel === 'bank' ? 'Local Bank Account' : 'Local Mobile Wallet',
      proofImage: screenshotBase64,
      bankTransferProof: screenshotBase64,
      trxId: referenceNumber.trim(),
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
            {t('paymentTitle')}
          </h2>
          <div className="w-10" />
        </div>

        <div className="p-5 space-y-4">

        {/* Amount to Deposit Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 mb-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">
              {isBn ? 'ট্রান্সফার পরিমাণ (ডিপোজিট করুন):' : 'Amount to Deposit:'}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
              {details.flag} {transferDraft.sourceCurrency}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-black text-emerald-400">
              {transferDraft.sourceAmount} {transferDraft.sourceCurrency}
            </h3>
            <span className="text-xs text-slate-300 font-medium">
              ➔ ৳{Number(transferDraft.targetAmount).toLocaleString()} BDT
            </span>
          </div>
        </div>

        {/* Local Payment Method Toggle: Bank Account vs Mobile Wallet */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl mb-4 shadow-inner">
          <button
            type="button"
            onClick={() => setPayChannel('bank')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              payChannel === 'bank'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏦</span>
            <span>{isBn ? 'লোকাল ব্যাংক অ্যাকাউন্ট' : 'Local Bank Account'}</span>
          </button>
          <button
            type="button"
            onClick={() => setPayChannel('wallet')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
              payChannel === 'wallet'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📱</span>
            <span>{isBn ? 'লোকাল মোবাইল ওয়ালেট' : 'Mobile Wallet / P2P'}</span>
          </button>
        </div>

        {/* Payment Account Details Box */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {payChannel === 'bank' 
                ? (isMalaysia ? 'Maybank / CIMB Transfer' : 'UAE Local Bank Transfer')
                : (isMalaysia ? "Touch 'n Go (TNG) / DuitNow" : 'Careem Pay / Botim / Al Ansari')}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {details.flag} {details.country}
            </span>
          </div>

          {/* If Local Bank Account is selected */}
          {payChannel === 'bank' ? (
            <>
              {/* Primary Bank Name */}
              <div>
                <p className="text-[11px] font-medium text-slate-500">{t('bankName')}</p>
                <p className="text-sm font-bold text-slate-900">{details.bankName}</p>
                {details.secondaryBank && (
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {isBn ? 'বিকল্প ব্যাংক:' : 'Alternative:'} {details.secondaryBank}
                  </p>
                )}
              </div>

              {/* Account Name */}
              <div>
                <p className="text-[11px] font-medium text-slate-500">{t('accountName')}</p>
                <p className="text-sm font-bold text-slate-900">{details.accountName}</p>
              </div>

              {/* Primary Account / IBAN with 1-click Copy */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    {isMalaysia ? 'Maybank Account Number' : 'Emirates NBD IBAN / Account'}
                  </p>
                  <p className="text-sm font-mono font-extrabold text-slate-900 tracking-wide select-all">
                    {details.accountNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(details.accountNumber.replace(/\s+/g, ''), 'bank-acc')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm active:scale-95 transition-all"
                >
                  <span>{copiedField === 'bank-acc' ? '✓' : '📋'}</span>
                  <span>{copiedField === 'bank-acc' ? 'Copied' : t('copy')}</span>
                </button>
              </div>

              {/* Malaysia Optional CIMB Account */}
              {isMalaysia && details.cimbNumber && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      CIMB Bank Account Number
                    </p>
                    <p className="text-sm font-mono font-extrabold text-slate-900 tracking-wide select-all">
                      {details.cimbNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(details.cimbNumber.replace(/\s+/g, ''), 'cimb-acc')}
                    className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1 shadow-sm active:scale-95 transition-all"
                  >
                    <span>{copiedField === 'cimb-acc' ? '✓' : '📋'}</span>
                    <span>{copiedField === 'cimb-acc' ? 'Copied' : t('copy')}</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* If Local Mobile Wallet / P2P is selected */
            <>
              {/* Wallet Provider Name */}
              <div>
                <p className="text-[11px] font-medium text-slate-500">
                  {isBn ? 'ওয়ালেট / পেমেন্ট প্ল্যাটফর্ম' : 'Wallet Provider'}
                </p>
                <p className="text-sm font-bold text-emerald-700">
                  {details.walletProvider}
                </p>
              </div>

              {/* Wallet Account Name */}
              <div>
                <p className="text-[11px] font-medium text-slate-500">
                  {isBn ? 'ওয়ালেট রিসিভার নাম' : 'Wallet Receiver Name'}
                </p>
                <p className="text-sm font-bold text-slate-900">{details.walletName}</p>
              </div>

              {/* Wallet Number / ID with 1-click Copy */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    {isMalaysia ? "TNG Number / DuitNow ID" : 'Careem Pay / Botim / Mobile'}
                  </p>
                  <p className="text-sm font-mono font-extrabold text-slate-900 tracking-wide select-all">
                    {details.walletNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(details.walletNumber.replace(/\s+/g, ''), 'wallet-num')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm active:scale-95 transition-all"
                >
                  <span>{copiedField === 'wallet-num' ? '✓' : '📋'}</span>
                  <span>{copiedField === 'wallet-num' ? 'Copied' : t('copy')}</span>
                </button>
              </div>

              {/* Malaysia DuitNow QR inside wallet tab */}
              {isMalaysia && (
                <div className="pt-2 border-t border-slate-100 flex flex-col items-center text-center">
                  <p className="text-xs font-bold text-slate-700 mb-2">
                    {isBn ? 'অথবা স্ক্যান করুন DuitNow QR কোড:' : 'Or Scan DuitNow QR Code:'}
                  </p>
                  <div className="w-36 h-36 bg-white p-2 rounded-2xl border-2 border-dashed border-emerald-600 flex items-center justify-center shadow-inner">
                    <img 
                      src={details.duitNowQr} 
                      alt="DuitNow QR Code" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* UAE Al Ansari Exchange reference info */}
              {!isMalaysia && details.alAnsariDetails && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-[10px] font-bold text-amber-800 uppercase">
                    Al Ansari Exchange পিকআপ ডিটেইলস:
                  </p>
                  <p className="text-xs font-bold text-amber-950 mt-0.5">
                    {details.alAnsariDetails}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Transfer Instruction Guide Note */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            💡 {isBn 
              ? 'উপরের অ্যাকাউন্ট নম্বরটি কপি করে আপনার মোবাইল ব্যাংকিং বা ওয়ালেট অ্যাপ থেকে টাকা পাঠান এবং পেমেন্ট সফল হওয়ার স্ক্রিনশট নিচে আপলোড করুন।' 
              : 'Copy the account details above, transfer via your banking app or wallet, and upload the successful transaction screenshot below.'}
          </div>
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
                  {isBn ? 'টাকা পাঠানোর রসিদ বা স্ক্রিনশট দিন' : 'Tap to upload slip / screenshot'}
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
              placeholder={isMalaysia ? 'e.g. MB12345678 বা TNG Ref' : 'e.g. ENBD Ref / Careem TrxID'}
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
    </div>
  );
};
