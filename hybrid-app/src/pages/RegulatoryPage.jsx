import React from 'react';
import { StandardHeader } from '../components/StandardHeader';
import { FastSendLogo } from '../components/FastSendLogo';
import { useApp } from '../context/AppContext';
import { ShieldCheck } from 'lucide-react';

export const RegulatoryPage = ({ onNavigate }) => {
  const { settings } = useApp();
  const reg = settings.regulatoryInfo || {};
  const countries = reg.licensedCountries || ["EU", "UK", "United States", "Canada", "UAE", "Australia", "Malaysia", "Singapore", "Saudi Arabia"];

  return (
    <div className="bg-slate-50 flex flex-col max-w-md mx-auto relative select-none w-full min-h-screen font-sans">
      
      {/* Standard Header */}
      <StandardHeader 
        title="রেগুলেশন ও লাইসেন্স" 
        onBack={() => onNavigate('home')} 
      />

      {/* Main Content */}
      <div className="p-3 flex-1 space-y-2.5 pb-20">
        
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex flex-col items-center text-center">
          <FastSendLogo size="sm" showText={false} className="mb-1" />
          <h2 className="text-xs font-bold text-slate-900">
            Fast Send Global Regulatory Compliance
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">
            সর্বশেষ আপডেট: {reg.lastUpdated || "১৫ সেপ্টেম্বর ২০২৬"}
          </p>
        </div>

        {/* Licensed Countries Grid */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#00823B]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>অনুমোদিত দেশসমূহ</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {countries.map((c, i) => (
              <div
                key={i}
                className="bg-emerald-50 text-emerald-800 font-bold text-center text-[10px] py-1.5 px-1 rounded-lg border border-emerald-200"
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Legal text */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs text-[11px] text-slate-600 leading-relaxed space-y-1.5">
          <p>
            Fast Send Payments Co., incorporated in Delaware, company number 4229202, registered with FinCEN with MSB registration number 31000306745734.
          </p>
          <p>
            Fast Send Payments Co is licensed in global jurisdictions and strictly compliant with Central Bank and international anti-money laundering (AML) protocols.
          </p>
        </div>

        {/* Agreement Button */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="tap-effect w-full bg-[#00823B] hover:bg-[#006837] text-white font-bold py-3 rounded-xl text-xs shadow-xs transition-all text-center"
        >
          আমি সম্মত জানাচ্ছি ✅
        </button>

      </div>

      {/* Footer */}
      <div className="p-2.5 text-center text-[10px] text-slate-400 border-t border-slate-200 bg-white">
        © 2026 Fast Send • শতভাগ বৈধ ও লাইসেন্সপ্রাপ্ত গ্লোবাল প্ল্যাটফর্ম
      </div>

    </div>
  );
};
