import React from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { Headphones, MessageCircle, PhoneCall, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SupportPage = ({ onNavigate }) => {
  const { settings } = useApp();
  const cleanWhatsapp = (settings.whatsappNumber || "+8801754150019").replace(/[^0-9]/g, '');

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* Standard Header */}
      <StandardHeader 
        title="২৪/৭ কাস্টমার সাপোর্ট" 
        onBack={() => onNavigate('home')} 
      />

      {/* Content */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs text-center space-y-1.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#00823B] flex items-center justify-center mx-auto shadow-2xs">
            <Headphones className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">আমরা সার্বক্ষণিক আপনার সেবায় নিয়োজিত</h3>
          <p className="text-[11px] text-slate-500">টাকা পাঠানো বা জমার যেকোনো সমস্যার জন্য সরাসরি যোগাযোগ করুন</p>
        </div>

        <div className="space-y-2">
          <a
            href={`https://wa.me/${cleanWhatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="tap-effect bg-white rounded-xl p-3 flex items-center gap-3 border border-emerald-200 hover:border-[#00823B] shadow-2xs transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-[#00823B] text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-xs text-slate-900">অফিসিয়াল হোয়াটসঅ্যাপ সাপোর্ট</h4>
              <p className="text-[11px] text-[#00823B] font-mono font-bold">{settings.whatsappNumber || "+880 1754 150019"}</p>
            </div>
          </a>

          <a
            href={`tel:${cleanWhatsapp}`}
            className="tap-effect bg-white rounded-xl p-3 flex items-center gap-3 border border-slate-200 hover:border-[#00823B] shadow-2xs transition-all"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-xs text-slate-900">সরাসরি ফোন কল হেল্পলাইন</h4>
              <p className="text-[11px] text-slate-600 font-mono font-bold">২৪ ঘন্টা খোলা থাকে</p>
            </div>
          </a>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2">
          <h4 className="font-bold text-[11px] text-slate-900 flex items-center gap-1.5 uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-[#00823B]" />
            সাধারণ জিজ্ঞাসাসমূহ (FAQ)
          </h4>
          <div className="text-[11px] text-slate-600 space-y-1.5 divide-y divide-slate-100">
            <div className="pt-1">
              <p className="font-bold text-slate-800">প্রশ্ন: টাকা পৌঁছাতে কতক্ষণ সময় লাগে?</p>
              <p className="text-slate-500 mt-0.5">উত্তর: সাধারণত ৩ থেকে ৫ মিনিটের মধ্যে স্বয়ংক্রিয়ভাবে প্রসেস হয়।</p>
            </div>
            <div className="pt-1.5">
              <p className="font-bold text-slate-800">প্রশ্ন: ভুল নম্বরে টাকা পাঠালে করণীয় কি?</p>
              <p className="text-slate-500 mt-0.5">উত্তর: দ্রুত ট্রানজেকশন আইডি সহ আমাদের হোয়াটসঅ্যাপে মেসেজ দিন।</p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • সার্বক্ষণিক কাস্টমার কেয়ার
      </div>

    </div>
  );
};
