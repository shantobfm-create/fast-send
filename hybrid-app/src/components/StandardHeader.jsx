import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';

export const StandardHeader = ({ title, onBack, rightAction }) => {
  return (
    <div className="bg-gradient-to-r from-[#1F6391] to-[#2980B9] text-white px-5 py-4 flex items-center justify-between sticky top-0 z-40 select-none shadow-md">
      <button 
        onClick={onBack} 
        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-sm tap-effect cursor-pointer"
        title="পেছনে যান"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      <h1 className="text-base font-extrabold text-white uppercase tracking-wide text-center flex-1 truncate px-2">
        {title}
      </h1>

      <div className="min-w-[40px] flex items-center justify-end">
        {rightAction ? (
          rightAction
        ) : (
          <a
            href="https://wa.me/8801754150019"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shadow-sm"
            title="সাপোর্ট চ্যাট"
          >
            <MessageCircle className="w-5 h-5 stroke-[2.2]" />
          </a>
        )}
      </div>
    </div>
  );
};
