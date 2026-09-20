import React from 'react';
import { useApp } from '../context/AppContext';

export const NoticeMarquee = () => {
  const { settings } = useApp();
  const notice = settings.noticeText || "যেকোনো প্রয়োজনে এই WhatsApp নাম্বারে মেসেজ করুন: +8801754150019";
  const whatsappNumber = settings.whatsappNumber || "+8801754150019";
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="px-3 my-2">
      <a
        href={`https://wa.me/${cleanNumber}`}
        target="_blank"
        rel="noreferrer"
        className="bg-white rounded-full px-4 py-2 flex items-center shadow-xs border border-slate-200/80 text-xs text-slate-800 hover:bg-slate-50 transition-all overflow-hidden"
      >
        <span className="whitespace-nowrap font-medium text-slate-700 truncate w-full text-center">
          যেকোনো প্রয়োজনে এই WhatsApp নাম্বারে মেসেজ করুন: <b className="text-emerald-800 font-mono">{whatsappNumber}</b>
        </span>
      </a>
    </div>
  );
};
