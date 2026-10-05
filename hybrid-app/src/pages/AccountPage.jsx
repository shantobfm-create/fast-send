import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  LogOut, 
  ChevronRight, 
  Lock, 
  CheckCircle2, 
  Phone, 
  Building2, 
  X,
  MessageCircle,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountPage = ({ onNavigate }) => {
  const { user, logout, changePin, changePassword, settings, showToast, loading } = useApp();

  // Active Modal: 'personal' | 'cards' | 'security' | 'support' | 'legal' | null
  const [activeModal, setActiveModal] = useState(null);

  // Security Form State
  const [pinForm, setPinForm] = useState({ oldPin: '', newPin: '', confirmPin: '' });
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pinForm.oldPin || !pinForm.newPin) {
      showToast("সবগুলো ফিল্ড পূরণ করুন", "error");
      return;
    }
    if (pinForm.newPin !== pinForm.confirmPin) {
      showToast("নতুন পিন দুটি একই হতে হবে", "error");
      return;
    }
    if (pinForm.newPin.length < 4) {
      showToast("পিন কমপক্ষে ৪ ডিজিটের হতে হবে", "error");
      return;
    }

    const res = await changePin(pinForm.oldPin, pinForm.newPin);
    if (res.success) {
      setPinForm({ oldPin: '', newPin: '', confirmPin: '' });
      setActiveModal(null);
    }
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    if (!pwdForm.oldPassword || !pwdForm.newPassword) {
      showToast("সবগুলো ফিল্ড পূরণ করুন", "error");
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      showToast("নতুন পাসওয়ার্ড দুটি একই হতে হবে", "error");
      return;
    }

    const res = await changePassword(pwdForm.oldPassword, pwdForm.newPassword);
    if (res.success) {
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setActiveModal(null);
    }
  };

  const menuItems = [
    {
      id: 'personal',
      title: 'অ্যাকাউন্ট',
      englishTitle: 'Account',
      subtitle: 'আপনার ব্যক্তিগত তথ্য ও প্রোফাইল বিবরণী',
      icon: User,
      action: () => setActiveModal('personal')
    },
    {
      id: 'cards',
      title: 'কার্ড ও ব্যাংক অ্যাকাউন্ট',
      englishTitle: 'Manage cards & accounts',
      subtitle: 'আপনার কার্ড ও ব্যাংক অ্যাকাউন্ট পরিচালনা করুন',
      icon: CreditCard,
      action: () => setActiveModal('cards')
    },
    {
      id: 'security',
      title: 'নিরাপত্তা ও সেটিংস',
      englishTitle: 'Settings & Security',
      subtitle: 'ডিভাইস সেটিংস ও সিকিউরিটি পিন পরিবর্তন',
      icon: ShieldCheck,
      action: () => setActiveModal('security')
    },
    {
      id: 'support',
      title: 'সাহায্য ও সাপোর্ট',
      englishTitle: 'Support & FAQs',
      subtitle: 'সাধারণ জিজ্ঞাসার উত্তর ও হোয়াটসঅ্যাপ সাপোর্ট',
      icon: HelpCircle,
      action: () => setActiveModal('support')
    },
    {
      id: 'legal',
      title: 'আইনি ও নিয়মনীতি',
      englishTitle: 'Legal Documents',
      subtitle: 'লাইসেন্স, রেগুলেটরি নোটিশ ও নীতিমালা',
      icon: FileText,
      action: () => setActiveModal('legal')
    }
  ];

  return (
    <div className="bg-white flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans pb-24">
      
      {/* Top Header & Profile Banner */}
      <div className="bg-[#2677AD] text-white pt-6 px-6 pb-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {user?.name || "Hasibul Hasan Santo"}
            </h1>
            <p className="text-xs font-mono font-medium text-white/80 mt-0.5">
              {user?.phone || "+880 1754-150019"}
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 overflow-hidden flex items-center justify-center shadow-xs shrink-0">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-white text-base">
                {user?.name?.[0] || 'H'}
              </span>
            )}
          </div>
        </div>

        {/* User Badges */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[11px] bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full border border-white/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-300" />
            <span>ভেরিফাইড অ্যাকাউন্ট</span>
          </span>
          <span className="text-[11px] bg-white/15 text-white/90 font-bold px-2.5 py-0.5 rounded-full border border-white/20">
            {user?.country === 'Saudi Arabia' ? '🇸🇦 সৌদি আরব' : (user?.country === 'UAE' ? '🇦🇪 দুবাই' : '🇲🇾 মালয়েশিয়া')}
          </span>
        </div>
      </div>

      {/* Modern Card List (Matching Screenshot 1) */}
      <div className="divide-y divide-slate-100 px-3 py-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full py-4 px-3 flex items-center justify-between text-left hover:bg-slate-50/80 active:bg-slate-100 rounded-2xl transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-full bg-slate-100 group-hover:bg-emerald-50 group-hover:text-[#00823B] text-slate-700 flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#00823B] transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-normal text-slate-400 truncate mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-700 transition-all shrink-0 ml-2" />
            </button>
          );
        })}

        {/* Log Out Button */}
        <div className="pt-4 px-3">
          <button
            onClick={() => {
              if (confirm("আপনি কি নিশ্চিত যে অ্যাকাউন্ট থেকে লগআউট করতে চান?")) {
                logout();
                onNavigate('home');
              }
            }}
            className="w-full py-3.5 px-4 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-100/60 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট (Log Out)</span>
          </button>
        </div>
      </div>

      {/* ================= MODAL: 1. ACCOUNT PERSONAL INFO ================= */}
      {activeModal === 'personal' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">ব্যক্তিগত তথ্য ও প্রোফাইল</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">পূর্ণ নাম:</span>
                <span className="font-bold text-slate-900 text-sm">{user?.name}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">মোবাইল নম্বর:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{user?.phone}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">প্রেরক দেশ:</span>
                <span className="font-bold text-slate-900">{user?.country} ({user?.currency || 'MYR'})</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-medium">জাতীয় পরিচয়পত্র / পাসপোর্ট:</span>
                <span className="font-bold text-emerald-800">{user?.nid || "ভেরিফাইড"}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-[#00823B] text-white font-bold py-3 rounded-xl text-xs shadow-xs"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: 2. MANAGE CARDS & ACCOUNTS ================= */}
      {activeModal === 'cards' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">সংরক্ষিত কার্ড ও ব্যাংক</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Fast Send Visa Debit</span>
                  <CreditCard className="w-5 h-5 text-slate-300" />
                </div>
                <p className="font-mono text-sm tracking-widest text-slate-200">•••• •••• •••• 5019</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>{user?.name || "CARDHOLDER"}</span>
                  <span>EXP: 12/29</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveModal(null);
                  onNavigate('select-recipient');
                }}
                className="w-full bg-emerald-50 text-[#00823B] border border-emerald-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <span>+ নতুন প্রাপক / ব্যাংক যুক্ত করুন</span>
              </button>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: 3. SETTINGS & SECURITY ================= */}
      {activeModal === 'security' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">পিন ও পাসওয়ার্ড পরিবর্তন</h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-xs text-slate-800">৪-ডিজিটের পিন পরিবর্তন:</h4>
              <input
                type="password"
                maxLength={6}
                required
                value={pinForm.oldPin}
                onChange={(e) => setPinForm({ ...pinForm, oldPin: e.target.value })}
                placeholder="বর্তমান পিন দিন"
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold focus:border-[#00823B] focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={pinForm.newPin}
                  onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
                  placeholder="নতুন পিন"
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold focus:border-[#00823B] focus:outline-none"
                />
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={pinForm.confirmPin}
                  onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
                  placeholder="কনফার্ম পিন"
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold focus:border-[#00823B] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00823B] text-white font-bold py-2.5 rounded-xl text-xs shadow-xs"
              >
                পিন আপডেট করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: 4. SUPPORT ================= */}
      {activeModal === 'support' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-[#00823B] rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">২৪/৭ কাস্টমার সাপোর্ট</h3>
              <p className="text-xs text-slate-500 mt-1">
                যেকোনো প্রয়োজনে আমাদের অফিসিয়াল হোয়াটসঅ্যাপে যোগাযোগ করুন
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono font-bold text-slate-800">
              {settings?.whatsappNumber || "+8801754150019"}
            </div>

            <a
              href={`https://wa.me/${(settings?.whatsappNumber || '8801754150019').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে চ্যাট করুন</span>
            </a>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: 5. LEGAL ================= */}
      {activeModal === 'legal' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">রেগুলেটরি লাইসেন্স ও শর্তাবলী</h3>
              <button onClick={() => setActiveModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed">
              <p><b>কোম্পানি:</b> Fast Send Payments Co.</p>
              <p><b>নিবন্ধন:</b> FinCEN MSB Licensed & Bank Negara Malaysia compliance partner.</p>
              <p><b>এনক্রিপশন:</b> All international money transfer transactions are encrypted with 256-bit SSL technology.</p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
