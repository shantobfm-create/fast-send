import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { 
  Save, 
  Smartphone, 
  Bell, 
  MessageCircle, 
  DollarSign, 
  ShieldAlert, 
  Plus, 
  Trash2,
  CheckCircle2,
  Building,
  CreditCard
} from 'lucide-react';

export const SettingsManager = () => {
  const { settings, saveSettings, loading } = useAdmin();
  const [form, setForm] = useState({
    appName: "Fast Send",
    tagline: "",
    noticeText: "",
    whatsappNumber: "",
    minTransferLimit: 50000,
    paymentMethods: [],
    banners: []
  });

  useEffect(() => {
    if (settings) {
      setForm({
        appName: settings.appName || "Fast Send",
        tagline: settings.tagline || "",
        noticeText: settings.noticeText || "",
        whatsappNumber: settings.whatsappNumber || "",
        minTransferLimit: settings.minTransferLimit || 50000,
        paymentMethods: settings.paymentMethods || [],
        banners: settings.banners || []
      });
    }
  }, [settings]);

  const handleMethodChange = (index, field, value) => {
    const updated = [...form.paymentMethods];
    updated[index][field] = value;
    setForm({ ...form, paymentMethods: updated });
  };

  const handleToggleMethod = (index) => {
    const updated = [...form.paymentMethods];
    updated[index].active = !updated[index].active;
    setForm({ ...form, paymentMethods: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveSettings(form);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white">পেমেন্ট নম্বর ও সিস্টেম সেটিংস</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            এখানে কোনো তথ্য আপডেট করলে হাইব্রিড মোবাইল অ্যাপে তা রিয়েল-টাইমে লাইভ পরিবর্তন হবে
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "সংরক্ষণ হচ্ছে..." : "সেটিংস সংরক্ষণ ও লাইভ সিঙ্ক"}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Payment Numbers & Gateways Control (bKash, Nagad, Rocket, Bank) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">ডিপোজিট ও অ্যাড-মানি নম্বরসমূহ (Payment Numbers)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {form.paymentMethods.map((m, idx) => (
              <div
                key={m.id || idx}
                className={`p-4 rounded-2xl border transition-all ${
                  m.active
                    ? 'bg-slate-950/80 border-slate-800 shadow-md'
                    : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                    {m.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleMethod(idx)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                      m.active
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {m.active ? "সক্রিয় (Active)" : "নিষ্ক্রিয় (Disabled)"}
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">এডমিন নম্বর / অ্যাকাউন্ট নম্বর</label>
                    <input
                      type="text"
                      value={m.number || ''}
                      onChange={(e) => handleMethodChange(idx, 'number', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {m.bankName && (
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">ব্যাংকের নাম</label>
                      <input
                        type="text"
                        value={m.bankName || ''}
                        onChange={(e) => handleMethodChange(idx, 'bankName', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">অ্যাকাউন্টের ধরন / লেবেল</label>
                    <input
                      type="text"
                      value={m.accountType || ''}
                      onChange={(e) => handleMethodChange(idx, 'accountType', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Notice & Announcement Bar Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">স্ক্রলিং নোটিশ ও মারকুই মেসেজ (App Announcement)</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                মোবাইল অ্যাপের ওপর চলমান স্ক্রলিং নোটিশ টেক্সট
              </label>
              <textarea
                rows={3}
                value={form.noticeText}
                onChange={(e) => setForm({ ...form, noticeText: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                placeholder="যেকোনো প্রয়োজনে এই WhatsApp নাম্বারে মেসেজ করুন: +8801754150019..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  হোয়াটসঅ্যাপ সাপোর্ট নম্বর (WhatsApp Hotline)
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.whatsappNumber}
                    onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  সর্বনিম্ন ট্রান্সফার লিমিট (Minimum Transfer Limit ৳)
                </label>
                <input
                  type="number"
                  value={form.minTransferLimit}
                  onChange={(e) => setForm({ ...form, minTransferLimit: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Promo Banner Editor */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">প্রোমো অফার ও ব্যানার সেটিংস</h3>
          </div>

          <div className="space-y-3">
            {form.banners.map((b, bIdx) => (
              <div key={b.id || bIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">ব্যানার টাইটেল</label>
                    <input
                      type="text"
                      value={b.title || ''}
                      onChange={(e) => {
                        const updated = [...form.banners];
                        updated[bIdx].title = e.target.value;
                        setForm({ ...form, banners: updated });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">প্রোমো কোড</label>
                    <input
                      type="text"
                      value={b.promoCode || ''}
                      onChange={(e) => {
                        const updated = [...form.banners];
                        updated[bIdx].promoCode = e.target.value;
                        setForm({ ...form, banners: updated });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-amber-300 font-mono font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">অফার হাইলাইট</label>
                    <input
                      type="text"
                      value={b.highlight || ''}
                      onChange={(e) => {
                        const updated = [...form.banners];
                        updated[bIdx].highlight = e.target.value;
                        setForm({ ...form, banners: updated });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-emerald-400 font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </form>
    </div>
  );
};
