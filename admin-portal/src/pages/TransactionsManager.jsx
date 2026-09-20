import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Search, CheckCircle2, XCircle, Clock, X } from 'lucide-react';

export const TransactionsManager = () => {
  const { transactions, updateTransactionStatus, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const filtered = transactions.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.senderPhone && t.senderPhone.includes(searchTerm)) ||
      (t.receiverPhone && t.receiverPhone.includes(searchTerm)) ||
      (t.senderName && t.senderName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.trxId && t.trxId.toLowerCase().includes(searchTerm.toLowerCase()));

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

  const handleAction = async (status) => {
    if (!selectedTx) return;
    await updateTransactionStatus(selectedTx.id, status, adminNote);
    setSelectedTx(null);
    setAdminNote('');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900">লাইভ লেনদেন বিবরণী ও অডিট</h2>
          <p className="text-xs text-slate-500 mt-0.5">কে কখন পাঠাল, কার একাউন্টে গেল এবং এডমিন কখন অনুমোদন করল—সব বিস্তারিত তথ্য</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="ফোন বা TrxID..." className="bg-slate-50 border border-slate-300 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 focus:outline-none focus:border-[#00823B] w-48" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-700 font-bold focus:border-[#00823B]">
            <option value="all">সকল ধরন</option>
            <option value="add_money">অ্যাড মানি</option>
            <option value="transfer">ট্রান্সফার</option>
            <option value="pay_bill">পে-বিল</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-700 font-bold focus:border-[#00823B]">
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="pending">অপেক্ষমান (Pending)</option>
            <option value="approved">অনুমোদিত (Approved)</option>
            <option value="rejected">বাতিল (Rejected)</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider text-[11px] font-bold">
              <tr>
                <th className="p-3.5">আইডি ও TrxID</th>
                <th className="p-3.5">টাকা পাঠানোর সময়</th>
                <th className="p-3.5">প্রেরক</th>
                <th className="p-3.5">প্রাপক</th>
                <th className="p-3.5">মেথড ও পরিমাণ</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5">এডমিন অনুমোদনের সময়</th>
                <th className="p-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono">
                    <span className="font-bold text-slate-900 block">{tx.id}</span>
                    {tx.trxId && <span className="text-[10px] text-emerald-800 font-bold">Trx: {tx.trxId}</span>}
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{formatDateTime(tx.requestedAt)}</td>
                  <td className="p-3.5"><span className="font-bold text-slate-900 block">{tx.senderName || "গ্রাহক"}</span><span className="text-slate-500 font-mono">{tx.senderPhone}</span></td>
                  <td className="p-3.5"><span className="font-bold text-slate-900 block">{tx.receiverName || "-"}</span><span className="text-emerald-800 font-mono font-bold">{tx.receiverPhone || "-"}</span></td>
                  <td className="p-3.5"><span className="text-[#00823B] font-black font-mono text-sm block">৳ {Number(tx.amount).toLocaleString('bn-BD')}</span><span className="text-[11px] text-slate-500 font-bold">{tx.methodName || tx.method}</span></td>
                  <td className="p-3.5">
                    {tx.status === 'approved' && <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10px]">সফল</span>}
                    {tx.status === 'rejected' && <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-bold text-[10px]">বাতিল</span>}
                    {tx.status === 'pending' && <span className="bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold text-[10px] animate-pulse">অপেক্ষমান</span>}
                  </td>
                  <td className="p-3.5 font-mono text-xs text-emerald-800 font-bold">{tx.adminProcessedAt ? formatDateTime(tx.adminProcessedAt) : <span className="text-slate-400 italic">প্রক্রিয়াধীন</span>}</td>
                  <td className="p-3.5 text-right">
                    <button onClick={() => setSelectedTx(tx)} className="bg-[#00823B] text-white font-bold px-2.5 py-1 rounded-lg text-xs">
                      {tx.status === 'pending' ? 'পর্যালোচনা' : 'ডিটেইলস'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-black text-slate-900">ট্রানজেকশন বিবরণ</h3>
              <button onClick={() => setSelectedTx(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border space-y-1.5 text-xs">
              <p><b className="text-slate-500">আইডি:</b> {selectedTx.id}</p>
              <p><b className="text-slate-500">পরিমাণ:</b> <span className="text-[#00823B] font-black font-mono">৳ {Number(selectedTx.amount).toLocaleString('bn-BD')}</span></p>
              <p><b className="text-slate-500">প্রেরক:</b> {selectedTx.senderPhone} ({selectedTx.senderName})</p>
              <p><b className="text-slate-500">প্রাপক:</b> {selectedTx.receiverPhone || "-"} ({selectedTx.receiverName || "-"})</p>
              <p><b className="text-slate-500">সাবমিশন সময়:</b> {formatDateTime(selectedTx.requestedAt)}</p>
              {selectedTx.adminProcessedAt && <p><b className="text-slate-500">অনুমোদন সময়:</b> {formatDateTime(selectedTx.adminProcessedAt)}</p>}
            </div>
            {selectedTx.status === 'pending' ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => handleAction('rejected')} className="bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs">বাতিল</button>
                <button onClick={() => handleAction('approved')} className="bg-[#00823B] text-white font-bold py-2.5 rounded-xl text-xs">অনুমোদন করুন</button>
              </div>
            ) : (
              <button onClick={() => setSelectedTx(null)} className="w-full bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-xs">বন্ধ করুন</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
