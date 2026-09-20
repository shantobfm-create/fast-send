import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Users, 
  Search, 
  PlusCircle, 
  MinusCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Ban, 
  Check, 
  X,
  CreditCard,
  UserCheck
} from 'lucide-react';

export const UsersManager = () => {
  const { users, adjustUserBalance, updateUserStatus, loading } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Balance adjust modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState('add'); // 'add' | 'deduct'
  const [reason, setReason] = useState('');

  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm) ||
    u.nid?.includes(searchTerm)
  );

  const pendingAgents = users.filter(u => u.status === 'pending_approval' || (u.userType === 'এজেন্ট' && u.status !== 'active' && u.status !== 'blocked'));

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !adjustAmount) return;

    await adjustUserBalance(selectedUser.phone, adjustAmount, adjustType, reason);
    setSelectedUser(null);
    setAdjustAmount('');
    setReason('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white">গ্রাহক ও ইউজার অ্যাকাউন্ট ম্যানেজমেন্ট</h2>
          <p className="text-xs text-slate-400 mt-0.5">ব্যবহারকারীদের ব্যালেন্স রিচার্জ/কর্তন, এজেন্ট অনুমোদন ও স্ট্যাটাস নিয়ন্ত্রণ</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="নাম, ফোন বা NID..."
            className="bg-slate-950 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56"
          />
        </div>
      </div>

      {/* Pending Agent Requests Notification & Approvals */}
      {pendingAgents.length > 0 && (
        <div className="bg-amber-950/40 border-2 border-amber-600/60 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
              <span>অনুমোদনের অপেক্ষায় নতুন এজেন্ট আবেদন ({pendingAgents.length} টি)</span>
            </h3>
            <span className="text-[11px] bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-bold">
              সুপার অ্যাডমিন অ্যাকশন
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingAgents.map(agent => (
              <div key={agent.phone} className="bg-slate-900 p-4 rounded-xl border border-amber-700/50 flex flex-col justify-between gap-3 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl border-2 border-amber-500 overflow-hidden bg-slate-950 shrink-0">
                    <img src={agent.photo} alt={agent.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-0.5 text-xs text-slate-300 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{agent.name}</span>
                      <span className="text-[10px] bg-amber-900 text-amber-200 px-2 py-0.5 rounded-full">এজেন্ট</span>
                    </div>
                    <p><span className="text-slate-500">ফোন:</span> <b className="font-mono text-white">{agent.phone}</b></p>
                    <p><span className="text-slate-500">ঠিকানা:</span> {agent.address || "দেওয়া হয়নি"}</p>
                    {agent.nid && <p><span className="text-slate-500">NID:</span> <span className="font-mono">{agent.nid}</span></p>}
                    <p className="text-[10px] text-slate-500">আবেদনের সময়: {new Date(agent.createdAt).toLocaleTimeString('bn-BD')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                  <button
                    onClick={() => updateUserStatus(agent.phone, 'rejected')}
                    className="bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold py-2 rounded-lg text-xs transition-all text-center"
                  >
                    বাতিল / রিজেক্ট
                  </button>
                  <button
                    onClick={() => updateUserStatus(agent.phone, 'active')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs shadow-md transition-all text-center flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>অনুমোদন দিন (Approve)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">গ্রাহকের প্রোফাইল</th>
                <th className="p-3.5">ফোন নম্বর</th>
                <th className="p-3.5">বর্তমান ব্যালেন্স</th>
                <th className="p-3.5">অ্যাকাউন্ট টাইপ</th>
                <th className="p-3.5">এনআইডি স্ট্যাটাস</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">ব্যালেন্স ও অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filtered.map(u => (
                <tr key={u.id || u.phone} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-800 overflow-hidden shrink-0 flex items-center justify-center font-bold text-emerald-400">
                        {u.photo ? (
                          <img src={u.photo} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          u.name?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{u.name}</span>
                        <span className="text-[10px] text-slate-400">{u.country || "Bangladesh"}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono font-bold text-slate-300">
                    {u.phone}
                  </td>

                  <td className="p-3.5 font-mono font-black text-sm text-emerald-400">
                    ৳ {Number(u.balance || 0).toLocaleString('bn-BD')}
                  </td>

                  <td className="p-3.5">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-slate-700">
                      {u.userType || "পার্সোনাল"}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.nidStatus === 'ভেরিফাইড' 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {u.nidStatus || "আনভেরিফাইড"}
                      </span>
                      {u.nid && (
                        <button
                          onClick={() => updateUserStatus(u.phone, null, u.nidStatus === 'ভেরিফাইড' ? 'আনভেরিফাইড' : 'ভেরিফাইড')}
                          className="text-[10px] text-slate-400 hover:text-emerald-400 underline"
                          title="ভেরিফিকেশন টগল করুন"
                        >
                          বদলান
                        </button>
                      )}
                    </div>
                    {u.nid && <span className="text-[10px] text-slate-500 block font-mono">NID: {u.nid}</span>}
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.status === 'blocked' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {u.status === 'blocked' ? 'ব্লকড' : 'সক্রিয়'}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setAdjustType('add');
                        }}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1"
                        title="টাকা যোগ/কর্তন করুন"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        ব্যালেন্স এডজাস্ট
                      </button>

                      <button
                        onClick={() => updateUserStatus(u.phone, u.status === 'blocked' ? 'active' : 'blocked')}
                        className={`p-1.5 rounded-lg text-xs transition-all ${
                          u.status === 'blocked' ? 'bg-emerald-900 text-emerald-300 hover:bg-emerald-800' : 'bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800'
                        }`}
                        title={u.status === 'blocked' ? 'আনব্লক করুন' : 'ব্লক করুন'}
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Balance Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">ব্যালেন্স এডজাস্টমেন্ট</h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block">গ্রাহক:</span>
              <span className="font-bold text-white text-sm">{selectedUser.name} ({selectedUser.phone})</span>
              <span className="text-emerald-400 font-mono block mt-1">বর্তমান ব্যালেন্স: ৳{Number(selectedUser.balance || 0).toLocaleString()}</span>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('add')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    adjustType === 'add' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  + ব্যালেন্স যোগ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('deduct')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    adjustType === 'deduct' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  - ব্যালেন্স কর্তন করুন
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">টাকার পরিমাণ (৳)</label>
                <input
                  type="number"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="যেমন: ৫০০০"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">কারণ / রেফারেন্স</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="যেমন: ম্যানুয়াল রিচার্জ বা সংশোধন"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20"
                >
                  নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
