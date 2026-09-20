import React, { useState, useRef } from 'react';
import { FastSendLogo } from './FastSendLogo';
import { useApp } from '../context/AppContext';
import { Sparkles, Gift } from 'lucide-react';

export const PromoSlider = () => {
  const { settings, showToast } = useApp();
  const [activeIdx, setActiveIdx] = useState(0);

  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const banners = [
    {
      id: 'b1',
      code: 'EGALTUBE',
      title: 'Fast Send স্পেশাল অফার',
      sub: 'Use Promo Code',
      highlight: 'Get 20£, 20€ or 20$ Bonus',
      bg: 'from-[#22D3EE] via-[#FDE047] to-[#FACC15]'
    },
    {
      id: 'b2',
      code: 'FASTSEND50',
      title: 'প্রথম ট্রান্সফারে ক্যাশব্যাক',
      sub: '৫০৳ ইনস্ট্যান্ট বোনাস',
      highlight: 'বিকাশ ও নগদে প্রথম ট্রান্সফারে',
      bg: 'from-emerald-400 via-teal-300 to-emerald-500'
    },
    {
      id: 'b3',
      code: 'FREEBANK',
      title: 'ফ্রি ব্যাংক ট্রান্সফার',
      sub: 'কোনো চার্জ ছাড়াই',
      highlight: 'বাংলাদেশের সকল ব্যাংকে ০% ফি',
      bg: 'from-rose-400 via-pink-400 to-amber-300'
    }
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`প্রোমো কোড ${code} কপি হয়েছে!`, "success");
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollPos = sliderRef.current.scrollLeft;
    const width = sliderRef.current.offsetWidth;
    const newIdx = Math.round(scrollPos / width);
    setActiveIdx(newIdx);
  };

  return (
    <div className="px-3 my-1.5">
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex overflow-x-auto gap-2.5 pb-1 scrollbar-none cursor-grab active:cursor-grabbing select-none"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {banners.map((b, idx) => (
          <div
            key={b.id}
            onClick={() => handleCopy(b.code)}
            style={{ scrollSnapAlign: 'center' }}
            className={`min-w-[100%] rounded-xl shadow-2xs border border-amber-200 bg-gradient-to-r ${b.bg} p-2.5 text-center flex flex-col items-center justify-center cursor-pointer transition-transform`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <div className="w-7 h-7 rounded-full bg-white/90 p-0.5 shadow-2xs">
                <FastSendLogo size="sm" showText={false} />
              </div>
              <span className="text-xs font-bold text-slate-800 tracking-tight">
                {b.title}
              </span>
            </div>

            <span className="text-[10px] text-slate-700 font-semibold uppercase tracking-wider block">
              {b.sub}
            </span>

            <span className="text-xs font-black text-slate-900 font-mono tracking-wider block my-0.5 bg-white/40 px-2 py-0.2 rounded-full border border-black/10">
              {b.code}
            </span>

            <span className="text-[11px] font-bold text-slate-900 block">
              {b.highlight}
            </span>

            {/* Dots */}
            <div className="flex justify-center gap-1 mt-1.5">
              {banners.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    activeIdx === i ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
