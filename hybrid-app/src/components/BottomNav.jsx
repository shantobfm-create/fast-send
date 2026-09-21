import React from 'react';
import { Home, History, User } from 'lucide-react';

export const BottomNav = ({ currentScreen, onNavigate }) => {
  const tabs = [
    { id: 'home', name: 'হোম', icon: Home },
    { id: 'history', name: 'হিস্ট্রি', icon: History },
    { id: 'account', name: 'প্রোফাইল', icon: User }
  ];

  const handleTabClick = (tabId) => {
    onNavigate(tabId);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40">
      <div className="bg-[#00823B] text-white flex items-center justify-around py-2.5 px-4 shadow-2xl border-t border-emerald-600/60 backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = (currentScreen === tab.id || (tab.id === 'history' && currentScreen === 'statement') || (tab.id === 'account' && currentScreen === 'profile'));

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`tap-effect flex items-center justify-center gap-1.5 py-1.5 px-4 rounded-full transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#005a2f] text-white font-bold shadow-inner ring-1 ring-emerald-400/50' 
                  : 'text-white/80 hover:text-white hover:bg-emerald-700/40 font-medium'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-xs tracking-wide whitespace-nowrap">{tab.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
