import React, { useState } from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { 
  User, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  LogOut, 
  CheckCircle2, 
  Headphones, 
  FileText, 
  CreditCard,
  Building2,
  Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BottomNav } from '../components/BottomNav';
import { InstallAppBanner } from '../components/InstallAppBanner';

export const AccountPage = ({ onNavigate }) => {
  const { user, logout, changePin, changePassword, showToast, loading } = useApp();

  // Accordion toggle states
  const [openSection, setOpenSection] = useState(null); // 'pin' | 'password' | 'limits' | null

  // Form states
  const [pinForm, setPinForm] = useState({ oldPin: '', newPin: '', confirmPin: '' });
  const [pwdForm, setPwdForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

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
      setOpenSection(null);
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
      setOpenSection(null);
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen">
      
      {/* Standard Header */}
      <StandardHeader 
        title="আমার অ্যাকাউন্ট" 
        onBack={() => onNavigate('home')} 
      />

      {/* Main Content Area - Compact & Tight */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-[#00823B] overflow-hidden flex items-center justify-center shrink-0">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-[#00823B] text-lg">
                {user?.name?.[0] || 'U'}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {user?.name || "সম্মানিত গ্রাহক"}
              </h2>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00823B] shrink-0" />
            </div>
            
            <p className="text-xs font-mono font-bold text-slate-600">
              {user?.phone || "017XXXXXXXX"}
            </p>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] bg-emerald-50 text-[#00823B] font-bold px-2 py-0.2 rounded-full border border-emerald-200">
                {user?.userType === 'এজেন্ট' ? 'অফিসিয়াল এজেন্ট' : 'পার্সোনাল'}
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.2 rounded-full border border-slate-200">
                সক্রিয়
              </span>
            </div>
          </div>
        </div>

        {/* Balance Snapshot Card */}
        <div className="bg-gradient-to-r from-[#00823B] to-emerald-800 text-white rounded-xl p-3 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] text-emerald-100 font-medium">বর্তমান ব্যালেন্স</p>
            <p className="text-xl font-black font-mono tracking-tight">
              ৳{(user?.balance || 0).toLocaleString('bn-BD')}
            </p>
          </div>
          <button
            onClick={() => onNavigate('add-money')}
            className="tap-effect bg-white text-[#00823B] font-bold text-xs px-3 py-1.5 rounded-lg shadow-2xs hover:bg-emerald-50 transition-all"
          >
            + টাকা যোগ করুন
          </button>
        </div>

        {/* Section Title */}
        <div className="pt-0.5">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            নিরাপত্তা ও সেটিংস
          </h3>
        </div>

        {/* Option 1: Change PIN */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('pin')}
            className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#00823B] flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">পিন পরিবর্তন</h4>
                <p className="text-[10px] text-slate-500">আপনার ৪-ডিজিটের সিকিউরিটি পিন বদলান</p>
              </div>
            </div>
            {openSection === 'pin' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Collapsible Form */}
          {openSection === 'pin' && (
            <form onSubmit={handlePinSubmit} className="p-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-0.5">বর্তমান পিন</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={pinForm.oldPin}
                  onChange={(e) => setPinForm({ ...pinForm, oldPin: e.target.value })}
                  placeholder="বর্তমান পিন দিন"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold focus:border-[#00823B] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">নতুন পিন</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={pinForm.newPin}
                    onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value })}
                    placeholder="নতুন পিন"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold focus:border-[#00823B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">কনফার্ম নতুন পিন</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={pinForm.confirmPin}
                    onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value })}
                    placeholder="আবার লিখুন"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold focus:border-[#00823B] focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-2 rounded-lg text-xs shadow-2xs"
              >
                {loading ? "পরিবর্তন হচ্ছে..." : "পিন সংরক্ষণ করুন"}
              </button>
            </form>
          )}
        </div>

        {/* Option 2: Change Password */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('password')}
            className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">পাসওয়ার্ড পরিবর্তন</h4>
                <p className="text-[10px] text-slate-500">লগইন সিকিউরিটি পাসওয়ার্ড আপডেট করুন</p>
              </div>
            </div>
            {openSection === 'password' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Collapsible Form */}
          {openSection === 'password' && (
            <form onSubmit={handlePwdSubmit} className="p-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-0.5">বর্তমান পাসওয়ার্ড</label>
                <input
                  type="password"
                  required
                  value={pwdForm.oldPassword}
                  onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
                  placeholder="বর্তমান পাসওয়ার্ড দিন"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold focus:border-[#00823B] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">নতুন পাসওয়ার্ড</label>
                  <input
                    type="password"
                    required
                    value={pwdForm.newPassword}
                    onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                    placeholder="নতুন পাসওয়ার্ড"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold focus:border-[#00823B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">কনফার্ম পাসওয়ার্ড</label>
                  <input
                    type="password"
                    required
                    value={pwdForm.confirmPassword}
                    onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                    placeholder="আবার লিখুন"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold focus:border-[#00823B] focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-2 rounded-lg text-xs shadow-2xs"
              >
                {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
              </button>
            </form>
          )}
        </div>

        {/* Option 3: Transaction Limits */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('limits')}
            className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">লেনদেন লিমিট</h4>
                <p className="text-[10px] text-slate-500">আপনার দৈনিক ও মাসিক লেনদেন সীমা</p>
              </div>
            </div>
            {openSection === 'limits' ? (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSection === 'limits' && (
            <div className="p-3 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-0.5 text-[11px]">
                  <span>দৈনিক সেন্ড লিমিট</span>
                  <span className="font-mono text-emerald-800">৳১,০০,০০০</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00823B] h-full w-[15%] rounded-full"></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">আজকের অবশিষ্ট লিমিট: ৳৮৫,০০০</p>
              </div>

              <div className="pt-1.5 border-t border-slate-200">
                <div className="flex justify-between font-bold text-slate-700 mb-0.5 text-[11px]">
                  <span>মাসিক ট্রান্সফার লিমিট</span>
                  <span className="font-mono text-emerald-800">৳৫,০০,০০০</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[10%] rounded-full"></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">এই মাসের অবশিষ্ট লিমিট: ৳৪,৫০,০০০</p>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: General & Support Links */}
        <div className="pt-0.5">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            সহায়তা ও তথ্য
          </h3>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {/* Live Support */}
          <div
            onClick={() => onNavigate('support')}
            className="p-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">২৪/৭ কাস্টমার সাপোর্ট</h4>
                <p className="text-[10px] text-slate-500">হোয়াটসঅ্যাপ চ্যাট ও কল হেল্পলাইন</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Terms and Regulatory */}
          <div
            onClick={() => onNavigate('regulatory')}
            className="p-2.5 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">লাইসেন্স ও শর্তাবলী</h4>
                <p className="text-[10px] text-slate-500">সরকারি নীতিমালা ও রেগুলেশন</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Android App Installation Banner */}
        <InstallAppBanner />

        {/* Logout Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={logout}
            className="tap-effect w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>অ্যাকাউন্ট থেকে লগআউট করুন</span>
          </button>
        </div>

      </div>

      {/* Standard Bottom Navigation */}
      <BottomNav currentScreen="account" onNavigate={onNavigate} />

    </div>
  );
};
