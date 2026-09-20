import React, { useState, useEffect } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { Clock, CheckCircle2, XCircle, ArrowUpRight, ArrowDownLeft, Receipt, Filter } from 'lucide-react';
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
          <span className="flex items-center gap-1 bg-emerald-100 text-[#00823B] px-2 py-0.2 rounded-full text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            সফল
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 bg-rose-100 text-rose-800 px-2 py-0.2 rounded-full text-[10px] font-bold">
            <XCircle className="w-3 h-3" />
            বাতিল
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full text-[10px] font-bold animate-pulse">
            <Clock className="w-3 h-3" />
            অপেক্ষমান
          </span>
        );
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "প্রক্রিয়াধীন";
    try {
      const d = new Date(isoString);
      return d.toLocaleString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* Standard Header */}
      <StandardHeader 
        title="লেনদেন হিস্ট্রি" 
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
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
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
      <div className="p-3 flex-1 space-y-2 pb-20">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center shadow-2xs border border-slate-200 mt-2">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-slate-700">কোনো লেনদেন বিবরণী পাওয়া যায়নি</p>
            <p className="text-[11px] text-slate-400 mt-0.5">আপনার করা সকল লেনদেনের হিসেব এখানে থাকবে</p>
          </div>
        ) : (
          filtered.map(tx => {
            const isAdd = tx.type === 'add_money' || tx.type === 'admin_credit';

            return (
              <div
                key={tx.id}
                className="bg-white rounded-xl p-3 shadow-2xs border border-slate-200 space-y-2 transition-all hover:border-[#00823B]"
              >
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      isAdd ? 'bg-emerald-100 text-[#00823B]' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isAdd ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        {tx.methodName || (isAdd ? "অ্যাড মানি" : "টাকা ট্রান্সফার")}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-500">ID: {tx.id}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-black font-mono ${isAdd ? 'text-[#00823B]' : 'text-slate-900'}`}>
                      {isAdd ? '+' : '-'} ৳{Number(tx.amount).toLocaleString('bn-BD')}
                    </span>
                    <div className="mt-0.5">{getStatusBadge(tx.status)}</div>
                  </div>
                </div>

                {/* Detailed Information Rows */}
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] space-y-0.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">প্রেরক:</span>
                    <span className="font-semibold">{tx.senderName || user?.name} ({tx.senderPhone})</span>
                  </div>

                  {tx.receiverPhone && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">প্রাপক:</span>
                      <span className="font-semibold text-emerald-950 font-mono">
                        {tx.receiverName ? `${tx.receiverName} - ` : ''}{tx.receiverPhone}
                      </span>
                    </div>
                  )}

                  {tx.trxId && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">রেফারেন্স / TrxID:</span>
                      <span className="font-mono font-bold text-slate-800">{tx.trxId}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-0.5 border-t border-slate-200">
                    <span className="text-slate-500">সময়:</span>
                    <span className="font-medium text-slate-800">{formatDateTime(tx.requestedAt)}</span>
                  </div>

                  {tx.adminNote && (
                    <div className="pt-0.5 text-[10px] text-slate-600 italic bg-white p-1.5 rounded border border-slate-200">
                      💬 <b className="text-slate-800">নোট:</b> {tx.adminNote}
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
