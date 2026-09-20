import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { TrendingUp, Save, CheckCircle2, ArrowRightLeft } from 'lucide-react';

export const ExchangeRatesManager = () => {
  const { settings, saveSettings, loading } = useAdmin();
  const [rates, setRates] = useState([]);

  useEffect(() => {
    if (settings && settings.exchangeRates) {
      setRates(settings.exchangeRates);
    }
  }, [settings]);

  const handleRateChange = (index, value) => {
    const updated = [...rates];
    updated[index].rateToBdt = parseFloat(value) || 0;
    setRates(updated);
  };

  const handleSave = async () => {
    await saveSettings({ exchangeRates: rates });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white">লাইভ কারেন্সি এক্সচেঞ্জ রেট কন্ট্রোল</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            যে দেশের রেট এখানে পরিবর্তন করবেন, মোবাইল অ্যাপের ক্যালকুলেটরে সাথে সাথে সেই রেট কাজ করবে
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "সংরক্ষণ হচ্ছে..." : "রেট আপডেট ও লাইভ সিঙ্ক"}</span>
        </button>
      </div>

      {/* Rates Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-3.5">দেশ ও কারেন্সি</th>
              <th className="p-3.5">কারেন্সি কোড</th>
              <th className="p-3.5">বর্তমান রেট (1 Foreign Currency =)</th>
              <th className="p-3.5 text-right">বাংলাদেশি টাকা (BDT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-200">
            {rates.map((r, idx) => (
              <tr key={r.code || idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{r.flag || "🌐"}</span>
                    <span className="font-bold text-white">{r.name}</span>
                  </div>
                </td>

                <td className="p-3.5 font-mono font-black text-emerald-400">
                  {r.code}
                </td>

                <td className="p-3.5 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">1 {r.code} =</span>
                    <input
                      type="number"
                      step="0.01"
                      value={r.rateToBdt}
                      onChange={(e) => handleRateChange(idx, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-black w-28 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-emerald-400 font-bold">BDT</span>
                  </div>
                </td>

                <td className="p-3.5 text-right font-mono font-bold text-slate-300">
                  {Number(r.rateToBdt).toFixed(2)} ৳
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
