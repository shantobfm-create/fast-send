import React, { useState, useEffect } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { Clock, CheckCircle2, XCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, UserCheck, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HistoryPage = ({ onNavigate, currentScreen }) => {
  const { transactions, user, fetchUserData } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'add_money' | 'transfer' | 'pay_bill'

  useEffect(() => {
    if (user && user.phone) {
      fetchUserData(user.phone);
    }
  }, [user]);

  const filtered = transactions.filter(t => {
    if (activeTab === 'all') return true;
    return t.type === activeTab;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 bg-emerald-100 text-[#00823B] px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3 h-3" />
            সফল ও অনুমোদিত
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold border border-rose-300 shadow-2xs">
            <XCircle className="w-3 h-3" />
            বাতিল
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-300 shadow-2xs animate-pulse">
            <Clock className="w-3 h-3" />
            অপেক্ষমান (Pending)
          </span>
        );
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "অপেক্ষমান";
    try {
      const d = new Date(isoString);
      return d.toLocaleString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans pb-24">
      
      {/* Standard Header */}
      <StandardHeader 
        title="লেনদেন হিস্ট্রি ও অডিট ট্রেইল" 
        onBack={() => onNavigate('home')} 
      />

      {/* Filter Tabs */}
      <div className="bg-white p-2 shadow-2xs border-b border-slate-200 flex gap-1.5 overflow-x-auto">
        {[
          { id: 'all', label: 'সকল লেনদেন' },
          { id: 'add_money', label: 'অ্যাড মানি' },
          { id: 'transfer', label: 'ট্রান্সফার' },
          { id: 'pay_bill', label: 'পে-বিল' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#00823B] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="p-3.5 flex-1 space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xs border border-slate-200 mt-2">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">কোনো লেনদেন পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400 mt-0.5">আপনার করা সকল রিকোয়েস্ট ও এডমিন অনুমোদনের বিবরণ এখানে দেখা যাবে</p>
          </div>
        ) : (
          filtered.map(tx => {
            const isAdd = tx.type === 'add_money' || tx.type === 'admin_credit';
            const isApproved = tx.status === 'approved';
            const isRejected = tx.status === 'rejected';

            return (
              <div
                key={tx.id}
                className="bg-white rounded-2xl p-3.5 shadow-2xs border-2 border-slate-200 space-y-2.5 transition-all hover:border-[#00823B]"
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
                      isAdd ? 'bg-emerald-100 text-[#00823B]' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isAdd ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        {tx.methodName || (isAdd ? "অ্যাড মানি" : "টাকা ট্রান্সফার")}
                      </h4>
                      <p className="text-[10px] font-mono font-bold text-slate-500">ID: {tx.id}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-base font-black font-mono ${isAdd ? 'text-[#00823B]' : 'text-slate-900'}`}>
                      {isAdd ? '+' : '-'} ৳{Number(tx.amount).toLocaleString('bn-BD')}
                    </span>
                    <div className="mt-0.5">{getStatusBadge(tx.status)}</div>
                  </div>
                </div>

                {/* Detailed Information Rows */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">প্রেরক:</span>
                    <span className="font-bold text-slate-900">{tx.senderName || user?.name} ({tx.senderPhone})</span>
                  </div>

                  {tx.receiverPhone && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">প্রাপক:</span>
                      <span className="font-bold text-emerald-950 font-mono">
                        {tx.receiverName ? `${tx.receiverName} - ` : ''}{tx.receiverPhone}
                      </span>
                    </div>
                  )}

                  {tx.trxId && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">TrxID / রেফারেন্স:</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{tx.trxId}</span>
                    </div>
                  )}

                  {/* Complete Time Tracking Timeline */}
                  <div className="pt-2 border-t border-slate-200 space-y-1.5 font-sans">
                    {/* 1. Request Time (টাকা পাঠানোর সময়) */}
                    <div className="flex items-center justify-between text-[11px] bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-slate-600 font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        টাকা পাঠানোর সময়:
                      </span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatDateTime(tx.requestedAt)}
                      </span>
                    </div>

                    {/* 2. Admin Approval Time (এডমিন অনুমোদনের সময়) */}
                    <div className={`flex items-center justify-between text-[11px] p-2 rounded-lg border ${
                      isApproved 
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
                        : isRejected
                          ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                          : 'bg-amber-50/80 border-amber-300 text-amber-950'
                    }`}>
                      <span className="font-bold flex items-center gap-1">
                        {isApproved ? (
                          <UserCheck className="w-3.5 h-3.5 text-[#00823B]" />
                        ) : isRejected ? (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                        )}
                        এডমিন অনুমোদনের সময়:
                      </span>
                      <span className="font-mono font-black">
                        {tx.adminProcessedAt ? formatDateTime(tx.adminProcessedAt) : "অপেক্ষমান (Pending)"}
                      </span>
                    </div>
                  </div>

                  {tx.adminNote && (
                    <div className="mt-1 text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
                      💬 <b className="text-slate-900">এডমিন নোট:</b> {tx.adminNote}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
