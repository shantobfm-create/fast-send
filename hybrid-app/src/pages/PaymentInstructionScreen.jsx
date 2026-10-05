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
    accountName: foundAccount?.accountName || 'Fast Send Global Services LLC',
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
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col justify-between w-full">
      <div>
        {/* Top Header - #2677AD */}
        <div className="bg-[#2677AD] text-white px-5 pt-5 pb-5 flex items-center justify-between shadow-md">
          <button
            onClick={() => onNavigate('select-recipient')}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-base font-extrabold text-white tracking-wide uppercase">
            {t('paymentTitle')}
          </h2>
          <div className="w-10" />
        </div>

        <div className="p-5 space-y-4">

        {/* Amount to Pay Header Box */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              {isBn ? 'পরিশোধের পরিমাণ' : 'Amount to Pay'}
            </span>
            <div className="text-2xl font-black text-[#2C3E50] mt-0.5">
              {transferDraft.sourceAmount} <span className="text-lg font-bold text-[#2980B9]">{transferDraft.sourceCurrency}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-400 block">
              {isBn ? 'প্রাপক পাবেন' : 'Recipient gets'}
            </span>
            <span className="text-sm font-black text-[#25CC71]">
              ৳{Number(transferDraft.targetAmount).toLocaleString()} BDT
            </span>
          </div>
        </div>

        {/* Local Payment Method Toggle: Bank Account vs Mobile Wallet */}
        <div className="flex bg-slate-200/70 p-1.5 rounded-2xl mb-4 shadow-inner">
          <button
            type="button"
            onClick={() => setPayChannel('bank')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
              payChannel === 'bank'
                ? 'bg-white text-[#2C3E50] shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-sm">🏦</span>
            <span>{isBn ? 'লোকাল ব্যাংক একাউন্ট' : 'Bank Transfer'}</span>
          </button>
          <button
            type="button"
            onClick={() => setPayChannel('wallet')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
              payChannel === 'wallet'
                ? 'bg-white text-[#2C3E50] shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-sm">📱</span>
            <span>{isBn ? 'মোবাইল ওয়ালেট' : 'Mobile Wallet'}</span>
          </button>
        </div>

        {/* Payment Account Details Box */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm mb-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider">
              {payChannel === 'bank' 
                ? (isMalaysia ? 'Admin Bank Details (Maybank/CIMB)' : 'Admin Bank Details (Emirates NBD)')
                : (isMalaysia ? "Admin Wallet (Touch 'n Go / DuitNow)" : 'Admin Wallet (Careem / Botim / Al Ansari)')}
            </span>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#E8F8F0] text-[#1EA85D]">
              {details.flag} {details.country}
            </span>
          </div>

          {/* If Local Bank Account is selected */}
          {payChannel === 'bank' ? (
            <>
              {/* Primary Bank Name */}
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-xs font-bold text-slate-500">Bank:</span>
                <span className="text-xs font-black text-[#2C3E50] col-span-2 text-right">{details.bankName}</span>
              </div>

              {/* Account Name */}
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-xs font-bold text-slate-500">Acc Name:</span>
                <span className="text-xs font-extrabold text-[#2C3E50] col-span-2 text-right truncate">{details.accountName}</span>
              </div>

              {/* Primary Account / IBAN with 1-click Copy */}
              <div className="p-3.5 bg-[#F4F7F6] rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    {isMalaysia ? 'Maybank Account Number' : 'Emirates NBD IBAN / Account'}
                  </p>
                  <p className="text-sm font-mono font-black text-[#2C3E50] tracking-wider select-all mt-0.5">
                    {details.accountNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(details.accountNumber.replace(/\s+/g, ''), 'bank-acc')}
                  className="px-3.5 py-2 rounded-xl bg-[#25CC71] hover:bg-[#1EA85D] text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-[#25CC71]/20 active:scale-95 transition-all"
                >
                  <span>{copiedField === 'bank-acc' ? '✓' : '📋'}</span>
                  <span>{copiedField === 'bank-acc' ? 'Copied' : t('copy')}</span>
                </button>
              </div>

              {/* Malaysia Optional CIMB Account */}
              {isMalaysia && details.cimbNumber && (
                <div className="p-3.5 bg-[#F4F7F6] rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      CIMB Bank Account Number
                    </p>
                    <p className="text-sm font-mono font-black text-[#2C3E50] tracking-wider select-all mt-0.5">
                      {details.cimbNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(details.cimbNumber.replace(/\s+/g, ''), 'cimb-acc')}
                    className="px-3.5 py-2 rounded-xl bg-[#2980B9] hover:bg-[#1F6391] text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-[#2980B9]/20 active:scale-95 transition-all"
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
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-xs font-bold text-slate-500">Provider:</span>
                <span className="text-xs font-black text-[#25CC71] col-span-2 text-right">{details.walletProvider}</span>
              </div>

              {/* Wallet Account Name */}
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-xs font-bold text-slate-500">Receiver:</span>
                <span className="text-xs font-extrabold text-[#2C3E50] col-span-2 text-right">{details.walletName}</span>
              </div>

              {/* Wallet Number / ID with 1-click Copy */}
              <div className="p-3.5 bg-[#F4F7F6] rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    {isMalaysia ? "TNG / DuitNow ID" : 'Careem / Botim Number'}
                  </p>
                  <p className="text-sm font-mono font-black text-[#2C3E50] tracking-wider select-all mt-0.5">
                    {details.walletNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(details.walletNumber.replace(/\s+/g, ''), 'wallet-num')}
                  className="px-3.5 py-2 rounded-xl bg-[#25CC71] hover:bg-[#1EA85D] text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-[#25CC71]/20 active:scale-95 transition-all"
                >
                  <span>{copiedField === 'wallet-num' ? '✓' : '📋'}</span>
                  <span>{copiedField === 'wallet-num' ? 'Copied' : t('copy')}</span>
                </button>
              </div>

              {/* Malaysia DuitNow QR inside wallet tab */}
              {isMalaysia && (
                <div className="pt-3 border-t border-slate-100 flex flex-col items-center text-center">
                  <div className="w-40 h-40 bg-white p-2.5 rounded-2xl border-2 border-[#25CC71]/50 flex items-center justify-center shadow-md mb-2">
                    <img 
                      src={details.duitNowQr} 
                      alt="DuitNow QR Code" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-wider uppercase shadow-sm">
                    Scan & Pay in your Banking App
                  </div>
                </div>
              )}

              {/* UAE Al Ansari Exchange reference info */}
              {!isMalaysia && details.alAnsariDetails && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
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
          <div className="p-3 bg-[#EBF5FB] rounded-2xl border border-[#2980B9]/20 text-[11px] text-[#1F6391] font-medium leading-relaxed">
            💡 {isBn 
              ? 'উপরের অ্যাকাউন্ট নম্বরটি কপি করে আপনার ব্যাংক বা ওয়ালেট অ্যাপ থেকে টাকা পাঠান এবং রসিদের স্ক্রিনশট নিচে আপলোড করুন।' 
              : 'Copy the account details above, transfer via your banking app or wallet, and upload the successful transaction screenshot below.'}
          </div>
        </div>

        {/* Upload Receipt Section */}
        <form onSubmit={handleSubmitOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider mb-2">
              {isBn ? 'পেমেন্ট প্রুফ আপলোড (রসিদ/স্ক্রিনশট) *' : 'Upload Payment Proof (Receipt/Screenshot) *'}
            </label>

            {!screenshotPreview ? (
              <label className="border-2 border-dashed border-[#25CC71]/60 hover:border-[#25CC71] bg-white hover:bg-[#E8F8F0]/30 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-[#E8F8F0] text-[#25CC71] flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">
                  ☁️
                </div>
                <span className="text-sm font-extrabold text-[#2C3E50]">
                  {isBn ? 'টাকা পাঠানোর রসিদ বা স্ক্রিনশট দিন' : 'Tap to upload slip / screenshot'}
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  {t('uploadSubtitle')}
                </span>
              </label>
            ) : (
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
                <img
                  src={screenshotPreview}
                  alt="Receipt Preview"
                  className="w-full h-52 object-contain bg-black/60"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1"
                >
                  <span>✕</span>
                  <span>{t('removeImage')}</span>
                </button>
              </div>
            )}
          </div>

          {/* TrxID / Reference Input */}
          <div>
            <label className="block text-xs font-extrabold text-[#2C3E50] uppercase tracking-wider mb-1.5">
              {isBn ? 'রেফারেন্স / TrxID' : 'Reference / TrxID'}
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder={isMalaysia ? '[MY-B23458]' : '[DXB-98241]'}
              className="w-full px-4 py-3.5 bg-white border border-slate-200/90 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#25CC71] focus:ring-2 focus:ring-[#25CC71]/20 shadow-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 pb-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-[#25CC71] hover:bg-[#1EA85D] active:scale-[0.99] disabled:opacity-50 text-white font-black rounded-2xl shadow-lg shadow-[#25CC71]/30 transition-all text-base flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>{t('loading')}</span>
              ) : (
                <>
                  <span>{isBn ? 'পেমেন্ট সাবমিট করুন' : 'Submit Payment'}</span>
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
