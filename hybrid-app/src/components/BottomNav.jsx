import React from 'react';
import { Home, Send, Clock, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const BottomNav = ({ currentScreen, onNavigate }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const tabs = [
    { id: 'home', name: isBn ? 'হোম' : 'Home', icon: Home },
    { id: 'select-recipient', name: isBn ? 'সেন্ড মানি' : 'Send', icon: Send },
    { id: 'history', name: isBn ? 'হিস্ট্রি' : 'History', icon: Clock },
    { id: 'account', name: isBn ? 'অ্যাকাউন্ট' : 'Account', icon: User }
  ];

  const handleTabClick = (tabId) => {
    onNavigate(tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-40">
      <div className="bg-slate-950 border-t border-slate-800 px-4 py-2.5 flex items-center justify-around shadow-2xl shadow-black">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = 
            currentScreen === tab.id || 
            (tab.id === 'home' && currentScreen === 'order-tracker') ||
            (tab.id === 'select-recipient' && (currentScreen === 'add-recipient' || currentScreen === 'payment-instruction')) ||
            (tab.id === 'account' && (currentScreen === 'profile' || currentScreen === 'account'));

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'text-emerald-400 font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5] text-emerald-400' : 'stroke-[1.8] text-slate-400'}`} />
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-emerald-400' : 'text-slate-400'}`}>
                {tab.name}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
