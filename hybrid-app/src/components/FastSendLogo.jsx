import React from 'react';

export const FastSendLogo = ({ size = "md", showText = true, className = "" }) => {
  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-24 h-24"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size] || sizeClasses.md} rounded-[18px] bg-[#9FD3C7] shadow-sm flex items-center justify-center p-0.5 relative overflow-hidden`}>
        {/* Exact Official Woodpecker Bird Emblem */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect width="100" height="100" rx="18" fill="#A8DADC" />
          {/* Bird mint background glow */}
          <circle cx="50" cy="52" r="42" fill="#C8E6C9" />
          
          {/* Body & Dark Green Back */}
          <path d="M48 26 C36 26 24 38 24 58 C24 76 38 90 54 90 C70 90 82 78 82 62 C82 46 64 26 48 26 Z" fill="#0E4D34" />
          
          {/* White Chest & Face */}
          <path d="M50 28 C42 28 36 36 36 46 C36 60 48 76 60 84 C66 78 72 70 72 60 C72 44 62 28 50 28 Z" fill="#FFFFFF" />
          
          {/* Red Crest on Crown */}
          <path d="M46 16 C34 16 30 30 38 42 C44 34 48 24 46 16 Z" fill="#E53935" />
          <circle cx="43" cy="28" r="7" fill="#E53935" />
          
          {/* Eye */}
          <circle cx="52" cy="38" r="4.5" fill="#1E293B" />
          <circle cx="54" cy="36.5" r="1.5" fill="#FFFFFF" />
          
          {/* Sharp Dark Beak */}
          <path d="M58 40 L92 35 L62 48 Z" fill="#0A3622" />
        </svg>
      </div>
      {showText && (
        <span className="font-bold tracking-tight text-white mt-1 text-lg leading-tight">
          Fast Send
        </span>
      )}
    </div>
  );
};
