import React from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddMoneyPage = ({ onNavigate }) => {
  const { settings } = useApp();

  const categories = [
    {
      id: 'mobile',
      route: 'add-money-mobile',
      title: 'মোবাইল ব্যাংকিং',
      subtitle: 'বিকাশ, নগদ, রকেট ও উপায় দিয়ে ইনস্ট্যান্ট রিচার্জ',
      badge: 'জনপ্রিয় ও দ্রুত',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#00823B] flex items-center justify-center font-bold">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
            <rect x="5" y="2" width="14" height="20" rx="3" />
            <line x1="12" y1="18" x2="12" y2="18.01" />
          </svg>
        </div>
      )
    },
    {
      id: 'bank',
      route: 'add-money-bank',
      title: 'ব্যাংক ডিপোজিট',
      subtitle: 'ইসলামী ব্যাংক বা যেকোনো ব্যাংক অ্যাকাউন্ট থেকে ডিপোজিট',
      badge: 'বড় অঙ্কের জন্য',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
            <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M14 10v11M12 2L2 7h20L12 2z" />
          </svg>
        </div>
      )
    },
    {
      id: 'card',
      route: 'add-money-card',
      title: 'কার্ড অ্যাড-মানি',
      subtitle: 'ভিসা ও মাস্টারকার্ড ডেবিট/ক্রেডিট কার্ড দিয়ে জমা',
      badge: 'ইনস্ট্যান্ট',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </div>
      )
    },
    {
      id: 'cash',
      route: 'add-money-cash',
      title: 'ক্যাশ-পিকআপ পয়েন্ট',
      subtitle: 'নিকটস্থ অনুমোদিত Fast Send এজেন্ট পয়েন্টে নগদ জমা',
      badge: 'এজেন্ট সার্ভিস',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v12M15 9.5c0-1.5-1.5-2-3-2s-3 .5-3 2 1.5 2 3 2 3 .5 3 2-1.5 2-3 2-3-.5-3-2" />
          </svg>
        </div>
      )
    }
  ];

  const cleanWhatsapp = (settings.whatsappNumber || "+8801754150019").replace(/[^0-9]/g, '');

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* Standard Clean Header */}
      <StandardHeader 
        title="অ্যাড মানি মেথড" 
        onBack={() => onNavigate('home')} 
      />

      {/* Main Options List */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        <div className="text-center pb-0.5">
          <p className="text-[11px] text-slate-500 font-bold">
            টাকা যোগ করার যেকোনো একটি মাধ্যম বেছে নিন:
          </p>
        </div>

        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate(cat.route)}
            className="tap-effect bg-white rounded-xl p-3 border border-slate-200 hover:border-[#00823B] cursor-pointer shadow-2xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              {cat.icon}
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#00823B] transition-colors">
                    {cat.title}
                  </h3>
                  <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full border border-emerald-200">
                    {cat.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {cat.subtitle}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00823B] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
          </div>
        ))}

        {/* Support Section */}
        <div className="pt-3 pb-1 text-center space-y-2">
          <p className="text-[11px] text-slate-600 font-medium px-4">
            টাকা যোগ করতে যেকোনো সহায়তার জন্য অফিসিয়াল হোয়াটসঅ্যাপে যোগাযোগ করুন।
          </p>

          <a
            href={`https://wa.me/${cleanWhatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="tap-effect inline-flex items-center gap-1.5 bg-[#00823B] hover:bg-[#006837] text-white font-bold px-4 py-2 rounded-xl shadow-2xs text-xs"
          >
            <span>লাইভ চ্যাটে সাহায্য নিন 💬</span>
          </a>
        </div>
      </div>

      {/* Security Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • শতভাগ নিরাপদ ও এনক্রিপ্টেড পেমেন্ট গেটওয়ে
      </div>

    </div>
  );
};
