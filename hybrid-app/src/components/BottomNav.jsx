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
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
      <div className="bg-[#2677AD] border-t border-white/10 px-4 py-2.5 flex items-center justify-around shadow-2xl sm:rounded-b-[2.5rem]">
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
                  ? 'text-white font-extrabold' 
                  : 'text-white/70 hover:text-white font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5] text-white' : 'stroke-[1.8] text-white/75'}`} />
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-white' : 'text-white/75'}`}>
                {tab.name}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-white mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
