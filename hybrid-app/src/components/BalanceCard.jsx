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
    <div className="bg-white text-black p-4 pt-3 pb-4 border-b border-neutral-200">
      <div className="flex items-start justify-between">
        {/* User Info Left */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onNavigate('account')}
            className="w-14 h-14 rounded-full border-2 border-neutral-300 bg-neutral-100 overflow-hidden shadow-xs shrink-0 cursor-pointer"
          >
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold text-lg font-mono">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-sm text-black leading-tight">
                {user?.name || "shanto haque"} <span className="font-normal text-[11px] text-neutral-500">| {user?.userType || "প্রবাসী"}</span>
              </h2>
            </div>
            
            <p className="text-xs text-neutral-600 font-mono tracking-wide mt-0.5">
              {user?.phone || "+60123456789"}
            </p>

            <div className="flex items-center gap-1 text-[11px] text-neutral-600 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-black" />
              <span>{user?.country || "মালয়েশিয়া"}</span>
            </div>
          </div>
        </div>

        {/* Logo Right */}
        <div className="shrink-0 cursor-pointer pt-1" onClick={() => onNavigate('regulatory')}>
          <FastSendLogo size="sm" showText={false} />
        </div>
      </div>

      {/* Tap for Balance Button */}
      <div className="mt-3 flex justify-start">
        <button
          onClick={() => setShowBalance(prev => !prev)}
          className="tap-effect bg-neutral-100 hover:bg-neutral-200 text-black rounded-full px-3.5 py-1.5 shadow-2xs flex items-center gap-2 transition-all border border-neutral-300 cursor-pointer"
        >
          <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs font-mono">
            ৳
          </div>
          
          <div className="text-left font-bold text-xs min-w-[90px]">
            {showBalance ? (
              <span className="text-black font-mono font-bold text-xs tracking-wide">
                ৳ {formattedBalance}
              </span>
            ) : (
              <span className="text-neutral-700 text-xs font-medium">
                ব্যালেন্স দেখুন
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
};
