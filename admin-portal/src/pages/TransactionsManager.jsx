import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  Image as ImageIcon,
  Send,
  Building2,
  Smartphone,
  MapPin,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const TransactionsManager = () => {
  const { transactions, updateTransactionStatus, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [payoutTrxId, setPayoutTrxId] = useState('');
  const [copiedText, setCopiedText] = useState('');
  const [showScreenshotModal, setShowScreenshotModal] = useState(null);

  const filtered = transactions.filter(t => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      t.id.toLowerCase().includes(term) ||
      (t.senderPhone && t.senderPhone.includes(term)) ||
      (t.receiverPhone && t.receiverPhone.includes(term)) ||
      (t.senderName && t.senderName.toLowerCase().includes(term)) ||
      (t.receiverName && t.receiverName.toLowerCase().includes(term)) ||
      (t.trxId && t.trxId.toLowerCase().includes(term)) ||
      (t.recipient?.name && t.recipient.name.toLowerCase().includes(term)) ||
      (t.recipient?.phone && t.recipient.phone.includes(term)) ||
      (t.recipient?.accountNumber && t.recipient.accountNumber.includes(term));

    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      return d.toLocaleString('bn-BD', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      });
    } catch { return isoString; }
  };

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2500);
  };

  const handleAction = async (status) => {
    if (!selectedTx) return;
    await updateTransactionStatus(selectedTx.id, status, adminNote, payoutTrxId);
    setSelectedTx(null);
    setAdminNote('');
    setPayoutTrxId('');
  };

  return (
    <div className="space-y-5">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900">প্রবাসী রেমিটেন্স ও লেনদেন বিবরণী</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            মালয়েশিয়া, সৌদি আরব ও দুবাই থেকে আসা রেমিটেন্সের স্ক্রিনশট যাচাই করুন এবং বাংলাদেশের প্রাপককে টাকা পাঠিয়ে অনুমোদন করুন
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="ফোন, নাম বা TrxID..." 
              className="bg-slate-50 border border-slate-300 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-[#00823B] w-52" 
            />
          </div>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)} 
            className="bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-700 font-bold focus:border-[#00823B]"
          >
            <option value="all">সকল ধরন</option>
            <option value="remittance">🌟 প্রবাসী রেমিটেন্স</option>
            <option value="add_money">অ্যাড মানি</option>
            <option value="transfer">অভ্যন্তরীণ ট্রান্সফার</option>
            <option value="pay_bill">পে-বিল</option>
          </select>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-700 font-bold focus:border-[#00823B]"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="pending">⏳ অপেক্ষমান (Pending)</option>
            <option value="approved">✅ সফল (Approved)</option>
            <option value="rejected">❌ বাতিল (Rejected)</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="p-3.5">আইডি ও ধরন</th>
                <th className="p-3.5">তারিখ ও সময়</th>
                <th className="p-3.5">প্রেরক (প্রবাসী)</th>
                <th className="p-3.5">প্রাপক (বাংলাদেশ)</th>
                <th className="p-3.5">প্রেরিত ➔ প্রদেয় টাকা</th>
                <th className="p-3.5">পেমেন্ট প্রুফ</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.map(tx => {
                const isRemittance = tx.type === 'remittance';
                const recipientObj = tx.recipient || {};
                const payoutNumber = recipientObj.phone || recipientObj.accountNumber || tx.receiverPhone;

                return (
                  <tr key={tx.id} className={`hover:bg-slate-50 ${isRemittance && tx.status === 'pending' ? 'bg-emerald-50/20' : ''}`}>
                    <td className="p-3.5 font-mono">
                      <span className="font-bold text-slate-900 block">{tx.id}</span>
                      {isRemittance ? (
                        <span className="text-[10px] bg-emerald-100 text-[#00823B] font-bold px-1.5 py-0.5 rounded-sm inline-block mt-0.5">
                          রেমিটেন্স ({tx.senderCurrency || 'MYR'})
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{tx.type}</span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">
                      {formatDateTime(tx.requestedAt)}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{tx.senderName || "গ্রাহক"}</span>
                      <span className="text-slate-500 font-mono text-[11px]">{tx.senderPhone}</span>
                      {tx.senderCountry && (
                        <span className="text-[10px] text-emerald-800 font-bold block">{tx.senderCountry}</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">
                          {recipientObj.name || tx.receiverName || "-"}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-emerald-900 font-mono font-bold text-[11px] select-all">
                            {payoutNumber || "-"}
                          </span>
                          {payoutNumber && (
                            <button
                              onClick={() => handleCopy(payoutNumber, tx.id)}
                              className="text-slate-400 hover:text-[#00823B] p-0.5"
                              title="কপি করুন"
                            >
                              {copiedText === tx.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm font-semibold">
                          {recipientObj.channelName || recipientObj.channel || tx.methodName || tx.method}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {isRemittance && (
                        <span className="text-[11px] text-slate-500 font-mono font-bold block">
                          {tx.sendAmount} {tx.senderCurrency} (রেট: {tx.exchangeRate})
                        </span>
                      )}
                      <span className="text-[#00823B] font-black font-mono text-sm block">
                        ৳ {Number(tx.amount || tx.receiveAmount).toLocaleString('bn-BD')}/=
                      </span>
                    </td>
                    <td className="p-3.5">
                      {tx.proofImage ? (
                        <button
                          onClick={() => setShowScreenshotModal(tx.proofImage)}
                          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#00823B]" />
                          <span>স্ক্রিনশট</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">নেই</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {tx.status === 'approved' && <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10px]">সফল / পেইড</span>}
                      {tx.status === 'rejected' && <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-bold text-[10px]">বাতিল</span>}
                      {tx.status === 'pending' && <span className="bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold text-[10px] animate-pulse">অপেক্ষমান</span>}
                    </td>
                    <td className="p-3.5 text-right">
                      <button 
                        onClick={() => setSelectedTx(tx)} 
                        className={`font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shadow-xs ${
                          tx.status === 'pending'
                            ? 'bg-[#00823B] hover:bg-[#006837] text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tx.status === 'pending' ? 'রিভিউ ও পে' : 'ডিটেইলস'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= REVIEW & PAYOUT MODAL ================= */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-lg">💸</span>
                <h3 className="font-black text-slate-900 text-base">
                  {selectedTx.type === 'remittance' ? 'রেমিটেন্স রিভিউ ও প্রাপককে টাকা প্রদান' : 'ট্রানজেকশন বিবরণী'}
                </h3>
              </div>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient BD Payout Callout */}
            <div className="bg-emerald-50 border-2 border-[#00823B] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                  🎯 যে অ্যাকাউন্টে টাকা পাঠাতে হবে (Payout Details):
                </span>
                <span className="text-xs bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  বাংলাদেশ 🇧🇩
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">প্রাপকের নাম:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedTx.recipient?.name || selectedTx.receiverName || "-"}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-600 font-bold">
                    {selectedTx.recipient?.channel === 'bank' ? 'ব্যাংক একাউন্ট:' : 'মোবাইল নম্বর:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-base text-[#00823B] select-all">
                      {selectedTx.recipient?.accountNumber || selectedTx.recipient?.phone || selectedTx.receiverPhone}
                    </span>
                    <button
                      onClick={() => handleCopy(
                        selectedTx.recipient?.accountNumber || selectedTx.recipient?.phone || selectedTx.receiverPhone,
                        "payout-modal"
                      )}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded-md transition-all cursor-pointer"
                      title="কপি করুন"
                    >
                      {copiedText === "payout-modal" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {selectedTx.recipient?.bankName && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">ব্যাংকের নাম:</span>
                    <span className="font-bold text-slate-800">{selectedTx.recipient.bankName}</span>
                  </div>
                )}

                {selectedTx.recipient?.branch && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">শাখা:</span>
                    <span className="font-bold text-slate-800">{selectedTx.recipient.branch}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-slate-600 font-bold">বাংলাদেশে প্রদেয় মোট টাকা:</span>
                  <span className="text-lg font-black text-[#00823B] font-mono">
                    ৳ {Number(selectedTx.amount || selectedTx.receiveAmount).toLocaleString('bn-BD')}/=
                  </span>
                </div>
              </div>
            </div>

            {/* Sender & Deposit Verification */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">প্রেরক (প্রবাসী):</span>
                <span className="font-bold text-slate-900">{selectedTx.senderName} ({selectedTx.senderPhone})</span>
              </div>
              {selectedTx.senderCountry && (
                <div className="flex justify-between">
                  <span className="text-slate-500">প্রেরক দেশ ও কারেন্সি:</span>
                  <span className="font-bold text-slate-900">{selectedTx.senderCountry} • {selectedTx.sendAmount} {selectedTx.senderCurrency} (রেট: {selectedTx.exchangeRate})</span>
                </div>
              )}
              {selectedTx.trxId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">ডিপোজিট TrxID / Ref:</span>
                  <span className="font-mono font-bold text-emerald-800">{selectedTx.trxId}</span>
                </div>
              )}
              {selectedTx.senderNote && (
                <div className="flex justify-between">
                  <span className="text-slate-500">প্রেরকের নোট:</span>
                  <span className="font-bold text-slate-800 italic">"{selectedTx.senderNote}"</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">সাবমিশন সময়:</span>
                <span className="font-mono">{formatDateTime(selectedTx.requestedAt)}</span>
              </div>
            </div>

            {/* Payment Proof Screenshot Preview */}
            {selectedTx.proofImage && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 block">প্রেরকের পেমেন্ট স্ক্রিনশট:</span>
                <div 
                  onClick={() => setShowScreenshotModal(selectedTx.proofImage)}
                  className="rounded-xl overflow-hidden border-2 border-slate-300 max-h-48 cursor-pointer hover:border-[#00823B] transition-all relative group bg-black"
                >
                  <img src={selectedTx.proofImage} alt="Proof" className="w-full h-48 object-contain mx-auto" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                    🔍 বড় করে দেখুন
                  </div>
                </div>
              </div>
            )}

            {/* Pending Action Form */}
            {selectedTx.status === 'pending' ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বিডি পেমেন্ট TrxID / রেফারেন্স (প্রাপককে টাকা পাঠানোর পর TrxID লিখুন):
                  </label>
                  <input
                    type="text"
                    value={payoutTrxId}
                    onChange={(e) => setPayoutTrxId(e.target.value)}
                    placeholder="যেমন: bKash TrxID বা Bank Ref..."
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-2 px-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#00823B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    এডমিন নোট (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="যেমন: টাকা প্রাপকের বিকাশে সফলভাবে পাঠানো হয়েছে।"
                    className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-[#00823B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => handleAction('rejected')} 
                    disabled={loading}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    বাতিল (Reject)
                  </button>
                  <button 
                    onClick={() => handleAction('approved')} 
                    disabled={loading}
                    className="bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>টাকা পাঠানো হয়েছে ও অনুমোদন করুন</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                {selectedTx.payoutTrxId && (
                  <p className="text-xs bg-emerald-50 text-emerald-900 p-2.5 rounded-xl border border-emerald-200 mb-3">
                    <b>বিডি পেমেন্ট TrxID:</b> <span className="font-mono font-bold">{selectedTx.payoutTrxId}</span>
                  </p>
                )}
                <button 
                  onClick={() => setSelectedTx(null)} 
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= FULL SCREENSHOT VIEWER MODAL ================= */}
      {showScreenshotModal && (
        <div 
          onClick={() => setShowScreenshotModal(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-black rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setShowScreenshotModal(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-xs z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={showScreenshotModal} 
              alt="Screenshot Full" 
              className="max-h-[85vh] max-w-full object-contain mx-auto rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
