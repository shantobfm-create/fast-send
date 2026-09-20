import React, { useState } from 'react';
import { FastSendLogo } from '../components/FastSendLogo';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Phone, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export const LoginPage = ({ onNavigate }) => {
  const { login, loading } = useApp();
  const [phone, setPhone] = useState('01754150019');
  const [pin, setPin] = useState('242312');
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !pin) return;
    const res = await login(phone, pin);
    if (res.success) {
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto">
      {/* Top Header */}
      <div className="bg-emerald-800 text-white p-4 flex items-center justify-between shadow-md">
        <button onClick={() => onNavigate('calculator')} className="p-1 hover:bg-emerald-700 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">লগইন করুন</h1>
        <div className="w-6" />
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          <FastSendLogo size="md" showText={false} className="mb-2" />
          <h2 className="text-2xl font-black text-emerald-950">Fast Send</h2>
          <p className="text-xs text-slate-500 mt-1">আপনার ফোন নাম্বার ও পিন দিয়ে প্রবেশ করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ফোন নাম্বার
            </label>
            <div className="relative flex items-center">
              <Phone className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              পিন বা পাসওয়ার্ড
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type={showPin ? "text" : "password"}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="******"
                className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-11 pr-11 text-sm font-semibold focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="tap-effect w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl text-base shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? "যাচাই করা হচ্ছে..." : "লগইন করুন"}
          </button>
        </form>

        {/* Quick Demo Test Credential Pill */}
        <div className="mt-5 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
          <p className="font-bold flex items-center gap-1 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            ডেমো ইউজার অ্যাকাউন্ট:
          </p>
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span>ফোন: <b>01754150019</b></span>
            <span>পিন: <b>242312</b></span>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-600">
            নতুন একাউন্ট খুলতে চান?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-emerald-700 font-bold hover:underline"
            >
              রেজিস্ট্রেশন করুন
            </button>
          </p>
        </div>
      </div>

      <div className="p-4 text-center text-[11px] text-slate-400">
        © 2026 Fast Send • সুরক্ষিত ও লাইসেন্সপ্রাপ্ত ফিনটেক সেবা
      </div>
    </div>
  );
};
