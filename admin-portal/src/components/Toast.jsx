import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast }) => {
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white border-emerald-500',
    error: 'bg-rose-600 text-white border-rose-500',
    info: 'bg-slate-800 text-white border-slate-700'
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-bounce-in max-w-sm">
      <div className={`flex items-center gap-3 p-3.5 rounded-xl shadow-2xl border text-xs font-bold ${bgStyles[toast.type] || bgStyles.info}`}>
        {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-200" /> : <AlertCircle className="w-5 h-5 text-rose-200" />}
        <span className="flex-1 leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};
