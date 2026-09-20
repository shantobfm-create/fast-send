import React from 'react';

export const QuickActions = ({ onNavigate }) => {
  const actions = [
    {
      id: 'add-money',
      name: 'অ্যাড-মানি',
      icon: (
        <svg viewBox="0 0 50 50" className="w-10 h-10">
          {/* 3D Wallet Icon */}
          <rect x="6" y="14" width="38" height="26" rx="6" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          <path d="M12 14 C12 14 16 6 25 6 C34 6 38 14 38 14" stroke="#10B981" strokeWidth="4" strokeLinecap="round" fill="none" />
          <rect x="6" y="20" width="38" height="8" fill="#FBBF24" />
          <circle cx="25" cy="27" r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M25 22 L25 32 M20 27 L30 27" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      action: () => onNavigate('add-money')
    },
    {
      id: 'notice',
      name: 'নোটিশ',
      icon: (
        <svg viewBox="0 0 50 50" className="w-10 h-10">
          {/* 3D Smartphone with Megaphone */}
          <rect x="14" y="6" width="22" height="38" rx="4" fill="#93C5FD" stroke="#1D4ED8" strokeWidth="1.5" />
          <rect x="17" y="10" width="16" height="26" rx="2" fill="#FFFFFF" />
          {/* Megaphone */}
          <path d="M23 20 L36 14 L36 30 L23 24 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          <path d="M23 20 L19 20 C18 20 18 24 19 24 L23 24 Z" fill="#EF4444" />
          {/* Sound waves */}
          <path d="M38 18 C40 20 40 24 38 26" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      ),
      action: () => onNavigate('notice')
    },
    {
      id: 'remittance',
      name: 'রেমিটেন্স',
      icon: (
        <svg viewBox="0 0 50 50" className="w-10 h-10">
          {/* 3D Mobile with Dollar / Cash */}
          <rect x="14" y="6" width="22" height="38" rx="4" fill="#6EE7B7" stroke="#047857" strokeWidth="1.5" />
          <rect x="17" y="10" width="16" height="26" rx="2" fill="#FFFFFF" />
          <rect x="12" y="18" width="26" height="14" rx="3" fill="#10B981" stroke="#065F46" strokeWidth="1" />
          <circle cx="25" cy="25" r="5" fill="#FFFFFF" />
          <text x="25" y="28.5" textAnchor="middle" fill="#047857" fontSize="10" fontWeight="bold">৳</text>
        </svg>
      ),
      action: () => onNavigate('remittance')
    },
    {
      id: 'bill-pay',
      name: 'বিল-পে',
      icon: (
        <svg viewBox="0 0 50 50" className="w-10 h-10">
          {/* 3D Invoice with Calculator */}
          <rect x="16" y="6" width="24" height="38" rx="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
          <line x1="22" y1="12" x2="34" y2="12" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="18" x2="34" y2="18" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" />
          {/* Mini Calculator */}
          <rect x="8" y="18" width="16" height="22" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
          <rect x="11" y="21" width="10" height="5" rx="1" fill="#86EFAC" />
          <circle cx="28" cy="36" r="4" fill="#10B981" />
          <text x="28" y="39" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">৳</text>
        </svg>
      ),
      action: () => onNavigate('bill-pay')
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-1.5 px-3 my-1">
      {actions.map((item) => (
        <button
          key={item.id}
          onClick={item.action}
          className="tap-effect bg-[#006837] hover:bg-[#005a2f] text-white rounded-2xl py-2 px-1 flex flex-col items-center justify-center gap-1 shadow-sm transition-all text-center aspect-square cursor-pointer"
        >
          <div className="h-9 w-9 flex items-center justify-center">
            {item.icon}
          </div>
          <span className="text-[11px] font-bold leading-tight text-white drop-shadow-xs whitespace-nowrap">
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
};
