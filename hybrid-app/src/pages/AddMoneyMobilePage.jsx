import React from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddMoneyMobilePage = ({ onNavigate }) => {
  const { settings } = useApp();

  const wallets = [
    {
      id: 'bkash',
      name: 'বিকাশ (bKash)',
      shortName: 'Bkash',
      type: 'Personal / Merchant',
      badge: 'ইনস্ট্যান্ট',
      logo: (
        <div className="w-10 h-10 rounded-full bg-[#E2136E] flex items-center justify-center p-1.5 shadow-2xs shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="20,30 65,35 55,70" fill="#FFFFFF" />
            <polygon points="65,35 95,45 68,85" fill="#FFE4E6" />
            <polygon points="55,70 68,85 65,35" fill="#FFFFFF" />
            <polygon points="68,85 95,45 88,75" fill="#FCE7F3" />
            <polygon points="95,45 105,52 92,60" fill="#FFFFFF" />
            <polygon points="55,70 68,85 45,95" fill="#FFFFFF" />
          </svg>
        </div>
      )
    },
    {
      id: 'nagad',
      name: 'নগদ (Nagad)',
      shortName: 'Nagad',
      type: 'Personal',
      badge: 'জনপ্রিয়',
      logo: (
        <div className="w-10 h-10 rounded-full bg-[#E23528] flex items-center justify-center p-1.5 shadow-2xs shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="44" fill="#E23528" />
            <path d="M50 25 C65 25 75 35 75 50 C75 65 65 75 50 75 C35 75 25 65 25 50 C25 38 34 30 44 30 C52 30 60 36 60 44 C60 52 52 58 46 58 C41 58 38 52 38 48" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            <circle cx="48" cy="48" r="5" fill="#FFFFFF" />
          </svg>
        </div>
      )
    },
    {
      id: 'rocket',
      name: 'রকেট (Rocket)',
      shortName: 'Rocket',
      type: 'Personal',
      badge: 'ডিবিবিএল',
      logo: (
        <div className="w-10 h-10 rounded-full bg-[#8C3494] flex items-center justify-center p-1.5 shadow-2xs shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M22 65 L60 20 L90 45 L62 82 Z" fill="#FFFFFF" />
            <path d="M60 20 L85 58 L62 82 Z" fill="#E1BEE7" />
            <polygon points="60,20 90,45 85,58" fill="#FFFFFF" />
            <polygon points="22,65 62,82 45,88" fill="#FFFFFF" />
          </svg>
        </div>
      )
    },
    {
      id: 'upay',
      name: 'উপায় (Upay)',
      shortName: 'Upay',
      type: 'Personal',
      badge: 'ইউসিবি',
      logo: (
        <div className="w-10 h-10 rounded-full bg-[#0055A5] flex items-center justify-center p-1.5 shadow-2xs shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="35" cy="35" r="9" fill="#FFFFFF" />
            <circle cx="65" cy="35" r="9" fill="#78BE20" />
            <path d="M26 55 C35 72 65 72 74 55" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      )
    }
  ];

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* Standard Header */}
      <StandardHeader 
        title="মোবাইল ব্যাংকিং" 
        onBack={() => onNavigate('add-money')} 
      />

      {/* Main Content Area */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        <div className="text-center pb-0.5">
          <p className="text-[11px] text-slate-500 font-bold">
            আপনার পছন্দের মোবাইল ওয়ালেট সিলেক্ট করুন:
          </p>
        </div>

        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            onClick={() => onNavigate('add-money-wallet', { selectedWalletId: wallet.id })}
            className="tap-effect bg-white rounded-xl p-3 border border-slate-200 hover:border-[#00823B] cursor-pointer shadow-2xs transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              {wallet.logo}
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#00823B] transition-colors">
                    {wallet.name}
                  </h3>
                  <span className="text-[9px] bg-emerald-50 text-[#00823B] font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                    {wallet.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  {wallet.type} অ্যাকাউন্ট
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00823B] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • শতভাগ নিরাপদ গেটওয়ে
      </div>

    </div>
  );
};
