import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';

export const StandardHeader = ({ title, onBack, rightAction }) => {
  return (
    <div className="bg-white text-black px-4 py-3.5 flex items-center justify-between border-b border-neutral-200 sticky top-0 z-40 select-none">
      <button 
        onClick={onBack} 
        className="p-1.5 -ml-1.5 hover:bg-neutral-100 rounded-xl transition-colors flex items-center justify-center text-black tap-effect cursor-pointer"
        title="পেছনে যান"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      <h1 className="text-base font-bold text-black tracking-tight text-center flex-1 truncate px-2">
        {title}
      </h1>

      <div className="min-w-[36px] flex items-center justify-end">
        {rightAction ? (
          rightAction
        ) : (
          <a
            href="https://wa.me/8801754150019"
            target="_blank"
            rel="noreferrer"
            className="p-1.5 hover:bg-neutral-100 rounded-xl text-black transition-colors flex items-center justify-center"
            title="সাপোর্ট চ্যাট"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
};
