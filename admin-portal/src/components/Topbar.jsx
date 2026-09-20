import React from 'react';
import { Bell, RefreshCw, Radio, LogOut, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const Topbar = () => {
  const { stats, fetchAllData, loading, adminUser, logoutAdmin } = useAdmin();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 font-semibold">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span>রিয়েল-টাইম লাইভ সিঙ্ক সক্রিয়</span>
        </div>

        {stats.pendingCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-300 font-bold animate-bounce">
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>{stats.pendingCount} টি নতুন অনুরোধ অপেক্ষমান</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={fetchAllData}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#00823B] flex items-center justify-center font-bold text-xs text-white shadow-sm">
            ADM
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-slate-800 block leading-tight">{adminUser?.name || "সুপার এডমিন"}</span>
            <span className="text-[10px] text-emerald-600 font-bold">অনলাইন</span>
          </div>
        </div>

        <button
          onClick={logoutAdmin}
          title="লগআউট করুন"
          className="flex items-center gap-1 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1.5 rounded-xl border border-rose-200 font-bold transition-all cursor-pointer ml-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>লগআউট</span>
        </button>
      </div>
    </header>
  );
};
