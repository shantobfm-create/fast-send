import React, { useState } from 'react';
import { FastSendLogo } from '../components/FastSendLogo';
import { useApp } from '../context/AppContext';
import { ArrowLeft, User, Phone, MapPin, Lock, Camera, CheckSquare, Square, ShieldCheck, X } from 'lucide-react';

export const RegisterPage = ({ onNavigate }) => {
  const { register, loading, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: 'shanto haque',
    country: 'Bangladesh',
    phone: '01754150019',
    userType: 'পার্সোনাল',
    pin: '242312',
    password: '123456',
    nid: '1995874512458',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces'
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.pin) {
      showToast("দয়া করে নাম, ফোন ও পিন সঠিকভাবে পূরণ করুন।", "error");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    if (!agreed) {
      showToast("দয়া করে তথ্য সঠিক হওয়ার প্রত্যয়ন টিক দিন।", "error");
      return;
    }
    const res = await register(formData);
    if (res.success) {
      setShowConfirmModal(false);
      onNavigate('home');
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto relative">
      {/* Top Header */}
      <div className="bg-emerald-800 text-white p-4 flex items-center justify-between shadow-md">
        <button onClick={() => onNavigate('calculator')} className="p-1 hover:bg-emerald-700 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">নিবন্ধন করুন</h1>
        <div className="w-6" />
      </div>

      {/* Main Registration Form */}
      <div className="p-5 flex-1 overflow-y-auto">
        
        {/* Photo Upload Card */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-700 overflow-hidden bg-slate-200 shadow-md">
              <img src={formData.photo} alt="User Profile" className="w-full h-full object-cover" />
            </div>
            <label className="absolute bottom-0 right-0 bg-emerald-700 hover:bg-emerald-800 text-white p-1.5 rounded-full shadow-md cursor-pointer">
              <Camera className="w-4 h-4" />
              <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
            </label>
          </div>
          <span className="text-[11px] text-slate-500 mt-1">প্রোফাইল ছবি দিন</span>
        </div>

        <form onSubmit={handleOpenConfirm} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="আপনার নাম লিখুন"
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নাম্বার (ওটিপি ও লগইনের জন্য)</label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="017XXXXXXXX"
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">দেশ</label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">অ্যাকাউন্টের ধরন</label>
              <select
                value={formData.userType}
                onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-emerald-600"
              >
                <option value="পার্সোনাল">পার্সোনাল</option>
                <option value="এজেন্ট">এজেন্ট</option>
                <option value="মার্চেন্ট">মার্চেন্ট</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">সিকিউরিটি পিন (৬ ডিজিট)</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  placeholder="242312"
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-sm font-mono focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">পাসওয়ার্ড</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="123456"
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">এনআইডি নম্বর (ঐচ্ছিক / ভেরিফিকেশন)</label>
            <input
              type="text"
              value={formData.nid}
              onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
              placeholder="1995874512458"
              className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-emerald-600 font-mono"
            />
          </div>

          <button
            type="submit"
            className="tap-effect w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl text-base shadow-lg shadow-emerald-700/20 transition-all mt-4"
          >
            পরবর্তী ধাপে যান
          </button>
        </form>

        <div className="text-center mt-4 pb-6">
          <p className="text-xs text-slate-600">
            আগে থেকেই একাউন্ট আছে?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-emerald-700 font-bold hover:underline"
            >
              লগইন করুন
            </button>
          </p>
        </div>
      </div>

      {/* EXACT CONFIRMATION MODAL AS SHOWN IN IMAGE 9 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-[#F8F9FA] rounded-t-3xl sm:rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-slate-200 animate-slide-up">
            
            {/* Modal Title */}
            <h3 className="text-xl font-bold text-center text-slate-800 mb-4 font-serif">
              কনফার্ম রেজিস্ট্রেশন
            </h3>

            {/* Profile Photo Preview */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-28 rounded-xl bg-slate-300 overflow-hidden shadow-inner border-2 border-slate-400">
                <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Form Details List matching Image 9 */}
            <div className="space-y-1.5 text-slate-800 text-sm mb-5 px-2">
              <p><span className="font-semibold text-slate-600">Name:</span> {formData.name}</p>
              <p><span className="font-semibold text-slate-600">Country:</span> {formData.country}</p>
              <p><span className="font-semibold text-slate-600">Phone:</span> {formData.phone}</p>
              <p><span className="font-semibold text-slate-600">Type:</span> {formData.userType}</p>
              <p><span className="font-semibold text-slate-600">Pin:</span> {formData.pin}</p>
              <p><span className="font-semibold text-slate-600">Password:</span> {formData.password}</p>
            </div>

            {/* Agreement Checkbox matching Image 9 */}
            <div 
              onClick={() => setAgreed(!agreed)}
              className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200 cursor-pointer mb-5"
            >
              <div className="mt-0.5 text-emerald-700 shrink-0">
                {agreed ? (
                  <CheckSquare className="w-5 h-5 fill-emerald-600 text-white" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <span className="text-xs text-slate-700 leading-snug select-none">
                আমি প্রত্যয়ন করছি যে উপরে প্রদত্ত সমস্ত তথ্য সঠিক।
              </span>
            </div>

            {/* Buttons: Cancel & Submit matching Image 9 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="tap-effect bg-[#F93A00] hover:bg-[#d83200] text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all text-center"
              >
                ক্যানসেল
              </button>

              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={loading}
                className={`tap-effect font-bold py-3 rounded-xl text-sm shadow-md transition-all text-center ${
                  agreed 
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white' 
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {loading ? "সাবমিট হচ্ছে..." : "সাবমিট"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
