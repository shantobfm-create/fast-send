import React, { useState, useEffect } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  Check, 
  X, 
  Share2, 
  Building2, 
  Smartphone, 
  MapPin, 
  Bell, 
  Calendar,
  Image as ImageIcon,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HistoryPage = ({ onNavigate, currentScreen }) => {
  const { transactions, user, fetchUserData, settings, showToast } = useApp();

  // Top Tabs: 'transactions' | 'notifications'
  const [topTab, setTopTab] = useState('transactions');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'remittance' | 'add_money' | 'transfer'
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Selected Transaction for Details Modal
  const [selectedTx, setSelectedTx] = useState(null);
  const [copiedField, setCopiedField] = useState('');
  const [showFullProof, setShowFullProof] = useState(false);

  useEffect(() => {
    if (user?.phone) {
      fetchUserData(user.phone);
    }
  }, [user]);

  // Notifications (dynamically derived from transactions + system notices)
  const notifications = [
    {
      id: 'notif-1',
      title: 'রেমিটেন্স সফল ও অনুমোদিত',
      message: 'আপনার পাঠানো রেমিটেন্স যাচাই করে বাংলাদেশে প্রাপকের একাউন্টে টাকা সফলভাবে পাঠিয়ে দেওয়া হয়েছে।',
      time: 'আজ ০২:১৫ PM',
      type: 'success',
      unread: true
    },
    {
      id: 'notif-2',
      title: 'লাইভ রেট আপডেট',
      message: 'আজকের মালয়েশিয়ান রিঙ্গিত (MYR) এবং সৌদি রিয়াল (SAR) রেট আপডেট করা হয়েছে। এখন পাঠালে পাচ্ছেন সর্বোচ্চ রেট!',
      time: 'গতকাল ০৮:০০ AM',
      type: 'info',
      unread: true
    },
    {
      id: 'notif-3',
      title: 'নিরাপত্তা অ্যালার্ট',
      message: 'আপনার ফাস্ট সেন্ড অ্যাকাউন্ট সফলভাবে সুরক্ষিত আছে। কোনো সমস্যায় ২৪/৭ হোয়াটসঅ্যাপ সাপোর্টে যোগাযোগ করুন।',
      time: '৩ দিন আগে',
      type: 'security',
      unread: false
    }
  ];

  const unreadNotifCount = notifications.filter(n => n.unread).length;

  // Filtered transactions
  const filtered = (transactions || []).filter(tx => {
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !term ||
      (tx.id && tx.id.toLowerCase().includes(term)) ||
      (tx.trxId && tx.trxId.toLowerCase().includes(term)) ||
      (tx.receiverPhone && tx.receiverPhone.includes(term)) ||
      (tx.receiverName && tx.receiverName.toLowerCase().includes(term)) ||
      (tx.recipient?.name && tx.recipient.name.toLowerCase().includes(term)) ||
      (tx.recipient?.phone && tx.recipient.phone.includes(term)) ||
      (tx.recipient?.accountNumber && tx.recipient.accountNumber.includes(term));

    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      return d.toLocaleString('bn-BD', {
        hour: '2-digit', minute: '2-digit', hour12: true,
        day: '2-digit', month: '2-digit', year: '2-digit'
      });
    } catch { return isoString; }
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`${fieldName} কপি করা হয়েছে!`, "info");
    setTimeout(() => setCopiedField(''), 2500);
  };

  // Helper to determine title, icon & color based on transaction
  const getTxMeta = (tx) => {
    const isRemittance = tx.type === 'remittance';
    const isAddMoney = tx.type === 'add_money' || tx.type === 'admin_credit';
    const isTransfer = tx.type === 'transfer' || tx.type === 'send_money';

    if (isRemittance) {
      return {
        title: 'রেমিটেন্স প্রেরণ',
        colorBg: 'bg-purple-100 text-purple-700',
        initial: (tx.recipient?.name?.[0] || 'R').toUpperCase(),
        isOutgoing: true,
        receiverLabel: tx.recipient?.name || tx.receiverName || 'প্রাপক',
        receiverSub: tx.recipient?.phone || tx.recipient?.accountNumber || tx.receiverPhone
      };
    } else if (isAddMoney) {
      return {
        title: 'অ্যাড-মানি গ্রহণ',
        colorBg: 'bg-emerald-100 text-[#00823B]',
        initial: '+',
        isOutgoing: false,
        receiverLabel: 'ব্যালেন্সে যুক্ত',
        receiverSub: tx.methodName || 'ডিপোজিট'
      };
    } else {
      return {
        title: 'সেন্ড মানি',
        colorBg: 'bg-rose-100 text-rose-600',
        initial: (tx.receiverName?.[0] || 'S').toUpperCase(),
        isOutgoing: true,
        receiverLabel: tx.receiverName || 'প্রাপক',
        receiverSub: tx.receiverPhone
      };
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans pb-24">
      
      {/* ================= TOP BRAND HEADER ================= */}
      <div className="bg-gradient-to-r from-[#00823B] to-[#006837] text-white pt-4 pb-3 px-5 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">ইনবক্স</h1>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-5 h-5 fill-white">
              <path d="M5,20 L35,5 L25,35 L18,22 Z" />
            </svg>
          </div>
        </div>

        {/* 2 Tabs: লেনদেন vs নোটিফিকেশন */}
        <div className="flex border-b border-white/20 mt-3">
          <button
            onClick={() => setTopTab('transactions')}
            className={`flex-1 pb-2.5 text-center text-sm font-bold transition-all relative cursor-pointer ${
              topTab === 'transactions' ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            <span>লেনদেন</span>
            {topTab === 'transactions' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => setTopTab('notifications')}
            className={`flex-1 pb-2.5 text-center text-sm font-bold transition-all relative flex items-center justify-center gap-1.5 cursor-pointer ${
              topTab === 'notifications' ? 'text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            <span>নোটিফিকেশন</span>
            {unreadNotifCount > 0 && (
              <span className="w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold font-mono">
                {unreadNotifCount}
              </span>
            )}
            {topTab === 'notifications' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* ================= TAB 1: TRANSACTIONS LIST ================= */}
      {topTab === 'transactions' && (
        <div className="flex-1 flex flex-col">
          
          {/* Search Bar & Filter Button */}
          <div className="p-3.5 bg-white border-b border-slate-200/80 flex items-center gap-2.5 shadow-2xs">
            <div className="relative flex-1 flex items-center bg-slate-100 rounded-2xl border border-slate-200/80 focus-within:border-[#00823B] focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="TrxID বা নম্বর দিয়ে খুঁজুন"
                className="w-full bg-transparent py-2.5 pl-9 pr-3 text-xs font-medium text-slate-900 focus:outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="pr-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilterModal(true)}
              className={`p-2.5 px-3.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                typeFilter !== 'all'
                  ? 'bg-emerald-50 text-[#00823B] border-[#00823B]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>ফিল্টার</span>
            </button>
          </div>

          {/* Subtitle: Transactions from last 90 days */}
          <div className="px-4 py-2 bg-slate-50 text-[11px] font-medium text-slate-500 border-b border-slate-100 flex items-center justify-between">
            <span>বিগত ৯০ দিনের লেনদেন বিবরণী</span>
            <span className="font-mono font-bold text-slate-600">মোট: {filtered.length} টি</span>
          </div>

          {/* List Items */}
          <div className="bg-white divide-y divide-slate-100 flex-1">
            {filtered.length === 0 ? (
              <div className="py-16 text-center space-y-3 px-4">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">কোনো লেনদেন পাওয়া যায়নি</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  আপনার এখনো কোনো লেনদেন নেই অথবা সার্চের সাথে কোনো ফলাফল মেলেনি।
                </p>
                <button
                  onClick={() => onNavigate('remittance')}
                  className="bg-[#00823B] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>রেমিটেন্স পাঠান</span>
                </button>
              </div>
            ) : (
              filtered.map((tx) => {
                const meta = getTxMeta(tx);
                const displayAmount = Number(tx.amount || tx.receiveAmount || 0).toLocaleString('bn-BD', { minimumFractionDigits: 2 });
                const isApproved = tx.status === 'approved';
                const isPending = tx.status === 'pending';

                return (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="p-3.5 hover:bg-slate-50/80 active:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer group"
                  >
                    {/* Left: Avatar / Initial Circle */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${meta.colorBg}`}>
                        {meta.initial}
                      </div>

                      {/* Middle: Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-xs truncate">
                            {meta.title}
                          </h4>
                          {isPending && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" title="অপেক্ষমান" />
                          )}
                        </div>

                        <p className="text-[11px] font-medium text-slate-600 truncate mt-0.5">
                          {meta.receiverLabel} {meta.receiverSub ? `• ${meta.receiverSub}` : ''}
                        </p>

                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                          TrxID : {tx.trxId || tx.id}
                        </p>
                      </div>
                    </div>

                    {/* Right: Amount & Date */}
                    <div className="text-right shrink-0 ml-3">
                      <div className="flex items-center justify-end gap-1">
                        <span className={`font-mono font-bold text-xs ${
                          meta.isOutgoing ? 'text-rose-600' : 'text-[#00823B]'
                        }`}>
                          {meta.isOutgoing ? `- ৳${displayAmount}` : `+ ৳${displayAmount}`}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>

                      <p className="text-[10px] font-mono text-slate-500 mt-1">
                        {formatDateTime(tx.requestedAt)}
                      </p>

                      {isPending && (
                        <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                          যাচাই হচ্ছে
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: NOTIFICATIONS ================= */}
      {topTab === 'notifications' && (
        <div className="p-3 space-y-2.5 flex-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all ${
                n.unread 
                  ? 'bg-white border-emerald-300 shadow-xs' 
                  : 'bg-white/80 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    n.type === 'success' 
                      ? 'bg-emerald-100 text-[#00823B]' 
                      : (n.type === 'security' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700')
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{n.title}</h4>
                    <span className="text-[10px] font-medium text-slate-400 font-mono">{n.time}</span>
                  </div>
                </div>
                {n.unread && (
                  <span className="w-2 h-2 rounded-full bg-[#00823B]" />
                )}
              </div>
              <p className="text-xs text-slate-600 mt-2 font-normal leading-relaxed">
                {n.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ================= DETAILS MODAL / BOTTOM SHEET ================= */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto p-5 shadow-2xl space-y-4">
            
            {/* Modal Header Bar */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-sm">লেনদেনের বিস্তারিত রসিদ</h3>
              <button 
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Big Amount Card */}
            <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-200 space-y-2">
              <div className="flex items-center justify-center">
                {selectedTx.status === 'approved' && (
                  <span className="flex items-center gap-1.5 bg-emerald-100 text-[#00823B] px-3 py-1 rounded-full text-xs font-bold border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>সফল ও অনুমোদিত (Paid)</span>
                  </span>
                )}
                {selectedTx.status === 'rejected' && (
                  <span className="flex items-center gap-1.5 bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold border border-rose-300">
                    <XCircle className="w-4 h-4" />
                    <span>বাতিল (Rejected)</span>
                  </span>
                )}
                {selectedTx.status === 'pending' && (
                  <span className="flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-bold border border-amber-300 animate-pulse">
                    <Clock className="w-4 h-4" />
                    <span>অপেক্ষমান (এডমিন যাচাই প্রক্রিয়াধীন)</span>
                  </span>
                )}
              </div>

              {/* BDT Amount */}
              <div>
                <span className="text-[11px] text-slate-500 block font-medium">বাংলাদেশে প্রদেয় মোট টাকা:</span>
                <span className="text-2xl font-black text-[#00823B] font-mono block">
                  ৳ {Number(selectedTx.amount || selectedTx.receiveAmount || 0).toLocaleString('bn-BD', { minimumFractionDigits: 2 })}/=
                </span>
              </div>

              {/* Foreign Currency Equivalent if Remittance */}
              {selectedTx.sendAmount && (
                <div className="pt-1 border-t border-slate-200/80 flex items-center justify-center gap-2 text-xs font-mono font-bold text-slate-700">
                  <span>প্রেরিত: {selectedTx.sendAmount} {selectedTx.senderCurrency || 'MYR'}</span>
                  <span>•</span>
                  <span>রেট: ১ {selectedTx.senderCurrency || 'MYR'} = {selectedTx.exchangeRate} ৳</span>
                </div>
              )}
            </div>

            {/* Detailed Key-Value Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
              
              {/* TrxID */}
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500">ট্রানজেকশন আইডি (TrxID):</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900 select-all">
                    {selectedTx.trxId || selectedTx.id}
                  </span>
                  <button
                    onClick={() => handleCopy(selectedTx.trxId || selectedTx.id, "TrxID")}
                    className="text-slate-400 hover:text-[#00823B] p-0.5 cursor-pointer"
                  >
                    {copiedField === "TrxID" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Type */}
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500">লেনদেনের ধরন:</span>
                <span className="font-bold text-slate-900">
                  {selectedTx.type === 'remittance' 
                    ? `প্রবাসী রেমিটেন্স (${selectedTx.senderCurrency || 'MYR'} ➔ BDT)` 
                    : (selectedTx.methodName || selectedTx.method || 'ট্রান্সফার')}
                </span>
              </div>

              {/* Recipient Details */}
              <div className="p-3 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">প্রাপকের নাম:</span>
                  <span className="font-bold text-slate-900">
                    {selectedTx.recipient?.name || selectedTx.receiverName || "প্রাপক"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">
                    {selectedTx.recipient?.channel === 'bank' ? 'ব্যাংক হিসাব নম্বর:' : 'প্রাপকের মোবাইল:'}
                  </span>
                  <span className="font-mono font-bold text-emerald-800">
                    {selectedTx.recipient?.accountNumber || selectedTx.recipient?.phone || selectedTx.receiverPhone}
                  </span>
                </div>
                {selectedTx.recipient?.bankName && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">ব্যাংক ও শাখা:</span>
                    <span className="font-bold text-slate-800">
                      {selectedTx.recipient.bankName} {selectedTx.recipient.branch ? `(${selectedTx.recipient.branch})` : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Sender Details */}
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500">প্রেরক:</span>
                <span className="font-bold text-slate-900">
                  {selectedTx.senderName || user?.name} ({selectedTx.senderPhone})
                </span>
              </div>

              {/* Time */}
              <div className="p-3 flex justify-between items-center">
                <span className="text-slate-500">তারিখ ও সময়:</span>
                <span className="font-mono font-medium text-slate-800">
                  {formatDateTime(selectedTx.requestedAt)}
                </span>
              </div>

              {/* Fees */}
              <div className="p-3 flex justify-between items-center bg-emerald-50/50">
                <span className="text-emerald-900 font-bold">সার্ভিস ফি ও ভ্যাট:</span>
                <span className="font-bold text-[#00823B]">৳ ০.০০ (সম্পূর্ণ ফ্রি)</span>
              </div>

              {/* Admin Note or BD Payout Trx */}
              {selectedTx.payoutTrxId && (
                <div className="p-3 flex justify-between items-center bg-emerald-50">
                  <span className="text-emerald-900 font-bold">বিডি ডেলিভারি TrxID:</span>
                  <span className="font-mono font-bold text-[#00823B]">{selectedTx.payoutTrxId}</span>
                </div>
              )}

              {selectedTx.adminNote && (
                <div className="p-3">
                  <span className="text-slate-500 block mb-0.5">এডমিন স্ট্যাটাস নোট:</span>
                  <span className="font-medium text-slate-800 text-[11px] italic">"{selectedTx.adminNote}"</span>
                </div>
              )}
            </div>

            {/* Proof Screenshot if exists */}
            {selectedTx.proofImage && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 block">আপনার আপলোড করা পেমেন্ট স্ক্রিনশট:</span>
                <div 
                  onClick={() => setShowFullProof(true)}
                  className="rounded-xl overflow-hidden border border-slate-300 max-h-36 bg-black cursor-pointer relative group"
                >
                  <img src={selectedTx.proofImage} alt="Proof" className="w-full h-36 object-contain mx-auto" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                    🔍 বড় করে দেখুন
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  showToast("রসিদের বিবরণ কপি করা হয়েছে!", "success");
                  handleCopy(
                    `Fast Send Receipt\nTrxID: ${selectedTx.trxId || selectedTx.id}\nAmount: ৳ ${selectedTx.amount}\nTo: ${selectedTx.recipient?.name || selectedTx.receiverName} (${selectedTx.recipient?.phone || selectedTx.receiverPhone})\nStatus: ${selectedTx.status}`,
                    "Receipt"
                  );
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>রসিদ শেয়ার</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer text-center"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Viewer for Proof */}
      {showFullProof && selectedTx?.proofImage && (
        <div 
          onClick={() => setShowFullProof(false)}
          className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-lg max-h-[90vh]">
            <button 
              onClick={() => setShowFullProof(false)}
              className="absolute top-2 right-2 bg-white/20 text-white p-2 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={selectedTx.proofImage} 
              alt="Screenshot Full" 
              className="max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xs p-5 shadow-2xl space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">লেনদেনের ধরন ফিল্টার</h3>
              <button onClick={() => setShowFilterModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            <div className="space-y-1.5">
              {[
                { id: 'all', label: 'সকল লেনদেন' },
                { id: 'remittance', label: 'প্রবাসী রেমিটেন্স' },
                { id: 'add_money', label: 'অ্যাড-মানি' },
                { id: 'transfer', label: 'অভ্যন্তরীণ ট্রান্সফার' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setTypeFilter(f.id);
                    setShowFilterModal(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                    typeFilter === f.id
                      ? 'bg-emerald-50 text-[#00823B] border border-emerald-300'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{f.label}</span>
                  {typeFilter === f.id && <Check className="w-4 h-4 text-[#00823B]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
