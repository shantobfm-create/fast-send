import React from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { Gift, Sparkles, Tag, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PromoPage = ({ onNavigate }) => {
  const { showToast } = useApp();

  const promos = [
    {
      id: 'promo-1',
      title: 'প্রথম ট্রান্সফারে ৫০৳ ক্যাশব্যাক',
      code: 'FIRST50',
      description: 'যেকোনো মোবাইল ওয়ালেটে প্রথমবার ১০০০৳ বা তার বেশি পাঠালে সাথে সাথে পাবেন ৫০৳ ক্যাশব্যাক।',
      badge: 'নতুন গ্রাহক',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'promo-2',
      title: '০% ফি ব্যাংক ট্রান্সফার উৎসব',
      code: 'FREEBANK',
      description: 'বাংলাদেশের যেকোনো ব্যাংক অ্যাকাউন্টে টাকা পাঠাতে পুরো মাস জুড়ে সম্পূর্ণ ফ্রি চার্জ।',
      badge: 'হট অফার',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      id: 'promo-3',
      title: 'রেমিটেন্স বোনাস ২.৫%',
      code: 'REMIT25',
      description: 'বিদেশ থেকে পাঠানো প্রতি রেমিটেন্সে সরকারি প্রণোদনা সহ অতিরিক্ত ২.৫% বিশেষ বোনাস।',
      badge: 'স্পেশাল',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`প্রোমো কোড ${code} কপি করা হয়েছে!`, "success");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative select-none">
      
      {/* Standard Header */}
      <StandardHeader 
        title="প্রোমো অফার ও ছাড়" 
        onBack={() => onNavigate('home')} 
      />

      {/* Content */}
      <div className="p-4 flex-1 space-y-4 pb-24">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-[#00823B] text-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold text-amber-300 shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold">বিশেষ অফার ও ক্যাশব্যাক</h3>
            <p className="text-xs text-emerald-100">প্রোমো কোড ব্যবহার করে আকর্ষণীয় পুরস্কার ও বোনাস পান</p>
          </div>
        </div>

        {/* Promo Cards List */}
        <div className="space-y-3">
          {promos.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs hover:border-[#00823B] transition-all"
            >
              <div className={`bg-gradient-to-r ${p.color} text-white px-4 py-2 flex items-center justify-between`}>
                <span className="text-[11px] font-bold uppercase tracking-wider">{p.badge}</span>
                <span className="text-xs font-mono font-bold bg-black/20 px-2 py-0.5 rounded">
                  {p.code}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(p.code)}
                    className="text-xs font-bold text-[#00823B] hover:text-[#006837] flex items-center gap-1"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>কোড কপি করুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('transfer')}
                    className="tap-effect bg-[#00823B] hover:bg-[#006837] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1"
                  >
                    <span>ব্যবহার করুন</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Footer */}
      <div className="p-3 text-center text-[11px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • সার্বক্ষণিক প্রোমো ও অফার
      </div>

    </div>
  );
};
