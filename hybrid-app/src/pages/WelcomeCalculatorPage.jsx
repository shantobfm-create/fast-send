import React, { useState } from 'react';
import { FastSendLogo } from '../components/FastSendLogo';
import { useApp } from '../context/AppContext';
import { ArrowRightLeft, ShieldCheck, Heart } from 'lucide-react';

export const WelcomeCalculatorPage = ({ onNavigate }) => {
  const { settings } = useApp();
  const exchangeRates = settings.exchangeRates || [
    { code: "BDT", name: "বাংলাদেশি টাকা", rateToBdt: 1.0, flag: "🇧🇩" },
    { code: "MYR", name: "মালয়েশিয়ান রিঙ্গিত", rateToBdt: 27.5, flag: "🇲🇾" },
    { code: "SAR", name: "সৌদি রিয়াল", rateToBdt: 32.8, flag: "🇸🇦" },
    { code: "AED", name: "ইউএই দিরহাম", rateToBdt: 33.5, flag: "🇦🇪" },
    { code: "USD", name: "ইউএস ডলার", rateToBdt: 122.5, flag: "🇺🇸" },
    { code: "EUR", name: "ইউরো", rateToBdt: 133.0, flag: "🇪🇺" },
    { code: "GBP", name: "ব্রিটিশ পাউন্ড", rateToBdt: 156.0, flag: "🇬🇧" }
  ];

  const [sendAmount, setSendAmount] = useState('100');
  const [selectedCurrency, setSelectedCurrency] = useState('MYR');

  const currentRateObj = exchangeRates.find(r => r.code === selectedCurrency) || exchangeRates[0];
  const rateToBdt = currentRateObj?.rateToBdt || 1.0;
  
  const parsedSend = parseFloat(sendAmount) || 0;
  const receiveBdt = (parsedSend * rateToBdt).toFixed(2);

  return (
    <div className="min-h-screen bg-emerald-800 flex flex-col justify-between text-slate-800">
      {/* Top Green Brand Banner */}
      <div className="pt-10 pb-6 px-6 text-center text-white flex flex-col items-center">
        <FastSendLogo size="lg" showText={true} />
        
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-100 bg-emerald-900/60 px-3.5 py-1.5 rounded-full border border-emerald-600/40">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>{settings.tagline || "এই ট্রান্সফারে কোনো ট্রান্সফার ফি নেই"}</span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-t-3xl p-6 shadow-2xl flex-1 flex flex-col justify-between max-w-md mx-auto w-full">
        
        {/* Exchange Calculator Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg relative">
          
          {/* Sender Input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              আপনি দিবেন
            </label>
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1.5 focus-within:border-emerald-600 transition-colors">
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="text-2xl font-black text-slate-800 w-full focus:outline-none bg-transparent"
                placeholder="0.00"
              />
              
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full shrink-0 border">
                <span className="text-base">{currentRateObj.flag || "🇲🇾"}</span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {exchangeRates.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Receiver Output */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              তারা পাবে
            </label>
            <div className="flex items-center justify-between border-b-2 border-slate-200 pb-1.5">
              <span className="text-2xl font-black text-emerald-700">
                {receiveBdt}
              </span>
              
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full shrink-0 border border-emerald-200">
                <span className="text-base">🇧🇩</span>
                <span className="text-xs font-black text-emerald-800">BDT</span>
              </div>
            </div>
          </div>

          {/* Rate Notice */}
          <div className="pt-2 text-center text-xs font-bold text-slate-600 flex items-center justify-center gap-1">
            <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              এক্সচেঞ্জ রেট: 1 {selectedCurrency} = {rateToBdt} BDT
            </span>
          </div>
        </div>

        {/* Security / Trust note */}
        <div className="my-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>নিরাপদ ও তাৎক্ষণিক রেমিটেন্স ডেলিভারি</span>
        </div>

        {/* Action Buttons: Login & Registration */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onNavigate('login')}
            className="tap-effect bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold py-3.5 rounded-xl text-sm shadow-sm transition-all text-center"
          >
            লগইন
          </button>
          
          <button
            onClick={() => onNavigate('register')}
            className="tap-effect bg-white hover:bg-emerald-50 text-emerald-800 border-2 border-emerald-700 font-bold py-3.5 rounded-xl text-sm shadow-sm transition-all text-center"
          >
            রেজিস্ট্রেশন
          </button>
        </div>

      </div>
    </div>
  );
};
