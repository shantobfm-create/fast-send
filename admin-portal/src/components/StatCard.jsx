import React from 'react';

export const StatCard = ({ title, value, subtext, icon, gradient, badge }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${gradient} text-white shadow-sm`}>
          {icon}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">{subtext}</span>
        {badge && (
          <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
