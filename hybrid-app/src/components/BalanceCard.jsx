import React, { useState } from 'react';
import { FastSendLogo } from './FastSendLogo';
import { useApp } from '../context/AppContext';
import { MapPin } from 'lucide-react';

export const BalanceCard = ({ onNavigate }) => {
  const { user } = useApp();
  const [showBalance, setShowBalance] = useState(false);

  const formattedBalance = Number(user?.balance || 0).toLocaleString('bn-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="bg-[#00823B] text-white p-4 pt-3 pb-4 shadow-md">
      <div className="flex items-start justify-between">
        {/* User Info Left */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('account')}
            className="w-16 h-16 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm shrink-0 cursor-pointer"
          >
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-900 text-white font-bold text-xl">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-base text-white leading-tight">
                {user?.name || "shanto haque"} <span className="font-normal text-xs opacity-90">| {user?.userType || "পার্সোনাল"}</span>
              </h2>
            </div>
            
            <p className="text-sm text-white font-mono tracking-wide mt-0.5">
              {user?.phone || "01754150019"}
            </p>

            <div className="flex items-center gap-1 text-xs text-white/95 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span>{user?.country || "বাংলাদেশ"}</span>
            </div>
          </div>
        </div>

        {/* Logo Right */}
        <div className="shrink-0 cursor-pointer pt-1" onClick={() => onNavigate('regulatory')}>
          <FastSendLogo size="sm" showText={false} />
        </div>
      </div>

      {/* Tap for Balance Button matching Image 2 */}
      <div className="mt-2.5 flex justify-start">
        <button
          onClick={() => setShowBalance(prev => !prev)}
          className="tap-effect bg-white hover:bg-slate-50 text-[#006837] rounded-full px-3.5 py-1 shadow-sm flex items-center gap-2 transition-all border border-slate-100"
        >
          <div className="w-5 h-5 rounded-full bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs shadow-inner">
            ৳
          </div>
          
          <div className="text-left font-bold text-xs min-w-[100px]">
            {showBalance ? (
              <span className="text-[#006837] font-black text-sm tracking-wide">
                ৳ {formattedBalance}
              </span>
            ) : (
              <span className="text-[#006837] text-xs font-bold">
                ব্যালেন্স দেখুন
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
