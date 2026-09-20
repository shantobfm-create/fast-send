import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Users, 
  Settings, 
  TrendingUp, 
  Activity,
  ExternalLink
} from 'lucide-react';

export const Sidebar = ({ currentTab, onSelectTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড ওভারভিউ', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'লাইভ লেনদেন ও রিকোয়েস্ট', icon: <ArrowLeftRight className="w-5 h-5" /> },
    { id: 'users', label: 'গ্রাহক ও ইউজার তালিকা', icon: <Users className="w-5 h-5" /> },
    { id: 'settings', label: 'পেমেন্ট নম্বর ও সিস্টেম সেটিংস', icon: <Settings className="w-5 h-5" /> },
    { id: 'rates', label: 'এক্সচেঞ্জ রেট ও কারেন্সি', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'logs', label: 'সিস্টেম অডিট ও অ্যাক্টিভিটি লগ', icon: <Activity className="w-5 h-5" /> }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00823B] flex items-center justify-center text-white font-black text-xl shadow-md">
            FS
          </div>
          <div>
            <h1 className="font-black text-base text-slate-900 tracking-tight leading-tight">
              Fast Send
            </h1>
            <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-[#00823B] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Mobile App Link */}
      <div className="p-4 border-t border-slate-100">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between bg-emerald-50 hover:bg-emerald-100 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold transition-all group"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>হাইব্রিড অ্যাপ ভিউ</span>
          </div>
          <ExternalLink className="w-4 h-4 text-emerald-700" />
        </a>
      </div>
    </aside>
  );
};
