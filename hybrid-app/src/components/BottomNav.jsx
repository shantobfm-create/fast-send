import React from 'react';
import { Home, Send, Inbox, User } from 'lucide-react';

export const BottomNav = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { id: 'home', name: 'হোম', icon: Home },
    { id: 'remittance', name: 'রেমিটেন্স', icon: Send },
    { id: 'history', name: 'ইনবক্স', icon: Inbox, badge: 3 },
    { id: 'account', name: 'অ্যাকাউন্ট', icon: User }
  ];

  const handleTabClick = (tabId) => {
    onNavigate(tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
      <div className="bg-white/95 backdrop-blur-md border-t border-neutral-200 px-3 py-2 flex items-center justify-around shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = 
            currentScreen === tab.id || 
            (tab.id === 'history' && (currentScreen === 'statement' || currentScreen === 'history')) || 
            (tab.id === 'account' && (currentScreen === 'profile' || currentScreen === 'account'));

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center relative py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive 
                  ? 'text-black font-bold' 
                  : 'text-neutral-400 hover:text-neutral-700 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge && !isActive && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-black text-white rounded-full text-[9px] font-bold flex items-center justify-center font-mono">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? 'font-bold text-black' : 'text-neutral-400'}`}>
                {tab.name}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-black mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
