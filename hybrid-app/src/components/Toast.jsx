import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white border-emerald-500',
    error: 'bg-rose-600 text-white border-rose-500',
    info: 'bg-slate-800 text-white border-slate-700'
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-200 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-200 shrink-0" />
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm animate-bounce-in">
      <div className={`flex items-center gap-3 p-3.5 rounded-xl shadow-xl border text-sm font-medium ${bgStyles[toast.type] || bgStyles.info}`}>
        {icons[toast.type] || icons.info}
        <span className="flex-1 text-left leading-snug">{toast.message}</span>
        {onClose && (
          <button onClick={onClose} className="p-1 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
