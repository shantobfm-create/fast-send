import React from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { Bell, MessageCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NoticeModal = ({ onNavigate }) => {
  const { settings } = useApp();
  const cleanWhatsapp = (settings.whatsappNumber || "+8801754150019").replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative select-none">
      
      {/* Standard Header */}
      <StandardHeader 
        title="জরুরি নোটিশ বোর্ড" 
        onBack={() => onNavigate('home')} 
      />

      {/* Main Content */}
      <div className="p-4 flex-1 space-y-4 pb-24">
        
        <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Bell className="w-5 h-5 text-[#00823B]" />
            <h3 className="font-bold text-sm text-slate-900">অফিসিয়াল নোটিশ</h3>
          </div>
          
          <p className="text-xs text-slate-700 leading-relaxed">
            {settings.noticeText || "সম্মানিত গ্রাহকবৃন্দ, Fast Send সিস্টেমে আপনাকে স্বাগতম। যেকোনো ধরনের রেমিটেন্স, অ্যাড মানি বা বিল পরিশোধ সেবা পেতে আমাদের ২৪/৭ সাপোর্ট সক্রিয় রয়েছে।"}
          </p>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <p>⚡ <b>সর্বনিম্ন ট্রান্সফার লিমিট:</b> ৳ {settings.minTransferLimit || 50000}</p>
            <p>🔒 <b>নিরাপত্তা:</b> ১০০% সুরক্ষিত ও লাইসেন্সপ্রাপ্ত গেটওয়ে</p>
          </div>
        </div>

        {/* Support Box */}
        <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-xs text-center space-y-3">
          <h4 className="font-bold text-xs text-slate-800 uppercase">জরুরি সহায়তা প্রয়োজন?</h4>
          <a
            href={`https://wa.me/${cleanWhatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="tap-effect inline-flex items-center justify-center gap-2 bg-[#00823B] hover:bg-[#006837] text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md transition-all w-full"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>হোয়াটসঅ্যাপ হেল্পলাইনে চ্যাট করুন</span>
          </a>
        </div>

      </div>

      {/* Footer */}
      <div className="p-3 text-center text-[11px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • সার্বক্ষণিক অফিসিয়াল নোটিফিকেশন
      </div>

    </div>
  );
};
