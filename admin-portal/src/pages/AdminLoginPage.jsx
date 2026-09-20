import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, Sparkles, KeyRound, CheckCircle, ArrowRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminLoginPage = () => {
  const { loginAdmin, loading } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('ইউজারনেম / ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    const res = await loginAdmin(username.trim(), password);
    if (!res.success) {
      setError(res.message || 'ভুল ইউজারনেম বা পাসওয়ার্ড।');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4 font-sans select-none text-slate-100">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Card Container */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl shadow-emerald-950/50 space-y-6">
          
          {/* Brand Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00823B] to-emerald-700 text-white shadow-lg shadow-emerald-900/40 mb-2 border border-emerald-400/30">
              <ShieldCheck className="w-9 h-9" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-wide">Fast Send</h1>
                <span className="text-[11px] uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                সুপার এডমিনিস্ট্রেটর পোর্টাল সিকিউর এক্সেস
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-rose-950/70 border border-rose-800/80 rounded-2xl text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>এডমিন ইউজারনেম / ইমেইল</span>
                <span className="text-[10px] text-slate-500">Super Admin ID</span>
              </label>
              <div className="relative flex items-center bg-slate-800/80 border border-slate-700 rounded-xl focus-within:border-[#00823B] focus-within:ring-2 focus-within:ring-[#00823B]/30 transition-all">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin@fastsend.com"
                  className="w-full bg-transparent py-3 pl-10 pr-3 text-sm font-medium text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>এডমিন সিকিউরিটি পাসওয়ার্ড</span>
                <span className="text-[10px] text-slate-500">Master Password</span>
              </label>
              <div className="relative flex items-center bg-slate-800/80 border border-slate-700 rounded-xl focus-within:border-[#00823B] focus-within:ring-2 focus-within:ring-[#00823B]/30 transition-all">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-transparent py-3 pl-10 pr-11 text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-white p-1 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="tap-effect w-full bg-gradient-to-r from-[#00823B] to-emerald-600 hover:from-[#006837] hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>যাচাই করা হচ্ছে...</span>
              ) : (
                <>
                  <span>এডমিন পোর্টালে প্রবেশ করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Assurance Badge */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              ২৫৬-বিট এনক্রিপ্টেড সেশন
            </span>
            <span>Fast Send Enterprise v2.0</span>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 mt-4">
          অননুমোদিত প্রবেশ আইনত দণ্ডনীয় • Fast Send Security Systems
        </div>

      </div>
    </div>
  );
};
