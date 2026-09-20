import React from 'react';
import { Users, Wallet, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { StatCard } from '../components/StatCard';

export const DashboardOverview = ({ onSelectTab }) => {
  const { stats, transactions, updateTransactionStatus } = useAdmin();
  const pendingTxs = transactions.filter(t => t.status === 'pending');

  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      return d.toLocaleString('bn-BD', {
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="মোট নিবন্ধিত গ্রাহক" value={stats.totalUsers || 0} subtext="সিস্টেম ইউজার সংখ্যা" badge="সক্রিয়" icon={<Users className="w-6 h-6" />} gradient="bg-blue-600" />
        <StatCard title="মোট সফল লেনদেন ভলিউম" value={`৳ ${Number(stats.totalVolume || 0).toLocaleString('bn-BD')}`} subtext="সফল পরিশোধ ও রেমিটেন্স" badge="লাইভ" icon={<Wallet className="w-6 h-6" />} gradient="bg-[#00823B]" />
        <StatCard title="অপেক্ষমান অ্যাড-মানি" value={stats.pendingAddMoney || 0} subtext="ডিপোজিট ভেরিফিকেশন" badge={stats.pendingAddMoney > 0 ? "অ্যাকশন প্রয়োজন" : "স্বাভাবিক"} icon={<ArrowDownLeft className="w-6 h-6" />} gradient="bg-amber-500" />
        <StatCard title="অপেক্ষমান ট্রান্সফার" value={stats.pendingTransfer || 0} subtext="টাকা ডেলিভারি অনুমোদন" badge={stats.pendingTransfer > 0 ? "জরুরি" : "ক্লিয়ার"} icon={<ArrowUpRight className="w-6 h-6" />} gradient="bg-rose-600" />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              জরুরি অপেক্ষমান রিকোয়েস্টসমূহ ({pendingTxs.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">নিচের রিকোয়েস্টগুলো যাচাই করে ১ ক্লিকেই অনুমোদন বা বাতিল করতে পারেন</p>
          </div>
          <button onClick={() => onSelectTab('transactions')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 font-bold transition-all">
            সকল লেনদেন দেখুন →
          </button>
        </div>

        {pendingTxs.length === 0 ? (
          <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">কোনো অপেক্ষমান রিকোয়েস্ট নেই</p>
            <p className="text-xs text-slate-500 mt-1">সবগুলো লেনদেন অনুমোদিত ও নিয়মিত রয়েছে</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-3">আইডি ও ধরন</th>
                  <th className="p-3">টাকা পাঠানোর সময়</th>
                  <th className="p-3">প্রেরক</th>
                  <th className="p-3">প্রাপক</th>
                  <th className="p-3">পরিমাণ</th>
                  <th className="p-3">মেথড</th>
                  <th className="p-3 text-right">এডমিন অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {pendingTxs.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-900">{tx.id}</td>
                    <td className="p-3 font-mono text-amber-700">{formatDateTime(tx.requestedAt)}</td>
                    <td className="p-3 font-bold text-slate-900">{tx.senderPhone}</td>
                    <td className="p-3 font-mono font-bold text-emerald-800">{tx.receiverPhone || "-"}</td>
                    <td className="p-3 font-mono font-black text-[#00823B] text-sm">৳ {Number(tx.amount).toLocaleString('bn-BD')}</td>
                    <td className="p-3 font-bold text-slate-700">{tx.methodName || tx.method}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => updateTransactionStatus(tx.id, 'approved', 'অনুমোদিত')} className="bg-[#00823B] text-white font-bold px-2.5 py-1 rounded-lg text-xs">
                          অনুমোদন
                        </button>
                        <button onClick={() => updateTransactionStatus(tx.id, 'rejected', 'বাতিল')} className="bg-rose-600 text-white font-bold px-2.5 py-1 rounded-lg text-xs">
                          বাতিল
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
