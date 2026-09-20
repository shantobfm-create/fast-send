import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { Activity, Clock, ShieldCheck } from 'lucide-react';

export const AuditLogs = () => {
  const { auditLogs } = useAdmin();

  const formatDateTime = (isoString) => {
    if (!isoString) return "-";
    try {
      const d = new Date(isoString);
      return d.toLocaleString('bn-BD', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          সিস্টেম অডিট ও রিয়েল-টাইম লগ
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          সিস্টেমে হওয়া প্রতিটি রেজিস্ট্রেশন, ট্রানজেকশন রিকোয়েস্ট, অনুমোদন এবং এডমিন আপডেটের নির্ভুল টাইমস্ট্যাম্প লগ
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="space-y-3">
          {auditLogs.length === 0 ? (
            <p className="text-center text-xs text-slate-500 py-6">কোনো অডিট লগ রেকর্ড নেই</p>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                  <div>
                    <span className="font-bold text-white block">{log.details}</span>
                    <span className="text-[10px] text-emerald-400 font-mono mt-0.5 inline-block bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                      {log.action}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-4">
                  {formatDateTime(log.time)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
