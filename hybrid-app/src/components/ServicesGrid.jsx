import React from 'react';

export const ServicesGrid = ({ onNavigate }) => {
  const row1 = [
    {
      id: 'banking',
      name: 'ব্যাংকিং',
      icon: (
        <svg viewBox="0 0 50 50" className="w-9 h-9">
          {/* 3D Bank Building */}
          <rect x="8" y="36" width="34" height="6" fill="#FDE047" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M6 18 L25 8 L44 18 Z" fill="#93C5FD" stroke="#1E293B" strokeWidth="1.5" />
          <rect x="10" y="16" width="30" height="4" fill="#60A5FA" />
          <text x="25" y="15" textAnchor="middle" fill="#1E293B" fontSize="6.5" fontWeight="bold">BANK</text>
          <rect x="11" y="20" width="5" height="16" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
          <rect x="22.5" y="20" width="5" height="16" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
          <rect x="34" y="20" width="5" height="16" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1" />
        </svg>
      ),
      action: () => onNavigate('bank-transfer')
    },
    {
      id: 'promo',
      name: 'প্রোমো অফার',
      icon: (
        <svg viewBox="0 0 50 50" className="w-9 h-9">
          {/* 3D Pink Gift Box with Ribbon */}
          <rect x="10" y="18" width="30" height="24" rx="4" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.5" />
          <rect x="8" y="14" width="34" height="7" rx="2" fill="#FB7185" stroke="#BE123C" strokeWidth="1.5" />
          <rect x="22" y="14" width="6" height="28" fill="#FDE047" />
          <circle cx="21" cy="11" r="4.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
          <circle cx="29" cy="11" r="4.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
          <rect x="30" y="26" width="12" height="10" rx="2" fill="#38BDF8" />
          <text x="36" y="33" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="black">%</text>
        </svg>
      ),
      action: () => onNavigate('promo')
    },
    {
      id: 'loan',
      name: 'লোন',
      icon: (
        <svg viewBox="0 0 50 50" className="w-9 h-9">
          {/* 3D Money Sack with Pen & Hand */}
          <path d="M22 14 C16 14 12 20 12 30 C12 40 18 44 26 44 C34 44 40 40 40 30 C40 20 36 14 30 14 Z" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          <circle cx="26" cy="30" r="8" fill="#FDE047" />
          <text x="26" y="34" textAnchor="middle" fill="#854D0E" fontSize="11" fontWeight="bold">৳</text>
          {/* Pen */}
          <path d="M34 10 L44 20 L26 38 L16 38 L16 28 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
        </svg>
      ),
      action: () => onNavigate('loan')
    },
    {
      id: 'support',
      name: 'সাপোর্ট',
      icon: (
        <svg viewBox="0 0 50 50" className="w-9 h-9">
          {/* Support Agent Woman with Headset */}
          <circle cx="25" cy="22" r="12" fill="#FDE047" />
          <path d="M15 16 C15 10 20 6 25 6 C30 6 35 10 35 16 C35 18 34 20 32 20 C30 20 28 14 25 14 C22 14 20 20 18 20 C16 20 15 18 15 16 Z" fill="#78350F" />
          <path d="M12 44 C12 34 18 32 25 32 C32 32 38 34 38 44" fill="#EF4444" />
          {/* Headset */}
          <path d="M14 22 C14 14 18 10 25 10 C32 10 36 14 36 22" stroke="#1E293B" strokeWidth="3" fill="none" />
          <circle cx="13" cy="22" r="3.5" fill="#F59E0B" />
          <circle cx="37" cy="22" r="3.5" fill="#F59E0B" />
          <path d="M37 22 L37 28 L30 30" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      ),
      action: () => onNavigate('support')
    }
  ];

  const row2 = [
    {
      id: 'help',
      name: 'হেল্প সেন্টার',
      icon: (
        <svg viewBox="0 0 50 50" className="w-9 h-9">
          {/* Live Chat Monitor */}
          <rect x="8" y="10" width="34" height="24" rx="4" fill="#FDE047" stroke="#1E293B" strokeWidth="1.5" />
          <rect x="12" y="14" width="26" height="16" rx="2" fill="#1E293B" />
          <text x="25" y="25" textAnchor="middle" fill="#FDE047" fontSize="8" fontWeight="900">LIVE</text>
          <path d="M18 34 L25 40 L32 34 Z" fill="#FDE047" stroke="#1E293B" strokeWidth="1.5" />
          {/* Headset on monitor */}
          <path d="M8 20 C8 12 14 8 25 8 C36 8 42 12 42 20" stroke="#2563EB" strokeWidth="2.5" fill="none" />
        </svg>
      ),
      action: () => onNavigate('support')
    },
    {
      id: 'history',
      name: 'হিস্ট্রি',
      icon: (
        <svg viewBox="0 0 50 50" className="w-9 h-9">
          {/* Scroll Parchment with Analog Clock */}
          <rect x="12" y="8" width="26" height="34" rx="3" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="25" cy="25" r="10" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
          <circle cx="25" cy="25" r="8" fill="#FFFFFF" />
          <path d="M25 20 L25 25 L29 25" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      action: () => onNavigate('history')
    },
    {
      id: 'about',
      name: 'আমাদের সম্পর্কে',
      icon: (
        <svg viewBox="0 0 50 50" className="w-9 h-9">
          {/* 3D Glass Towers & Growth Chart */}
          <rect x="10" y="16" width="12" height="26" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
          <rect x="24" y="8" width="16" height="34" rx="2" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
          {/* Growth Chart */}
          <path d="M6 38 L18 26 L28 32 L42 16" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>
      ),
      action: () => onNavigate('regulatory')
    },
    {
      id: 'profile',
      name: 'প্রোফাইল',
      icon: (
        <svg viewBox="0 0 50 50" className="w-9 h-9">
          {/* Businessman Avatar in Circle */}
          <circle cx="25" cy="25" r="18" fill="#93C5FD" stroke="#2563EB" strokeWidth="1.5" />
          <circle cx="25" cy="18" r="7" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
          <path d="M12 39 C12 31 18 28 25 28 C32 28 38 31 38 39" fill="#1E293B" />
          <polygon points="25,28 23,34 25,38 27,34" fill="#EF4444" />
        </svg>
      ),
      action: () => onNavigate('account')
    }
  ];

  return (
    <div className="space-y-2 px-3 my-1 pb-24">
      {/* Row 3 */}
      <div className="grid grid-cols-4 gap-2">
        {row1.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="tap-effect bg-[#006837] hover:bg-[#005a2f] text-white rounded-2xl py-2 px-1 flex flex-col items-center justify-center gap-1 shadow-sm transition-all text-center aspect-square"
          >
            <div className="h-9 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-xs font-bold leading-none text-white drop-shadow-xs">
              {item.name}
            </span>
          </button>
        ))}
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-4 gap-2">
        {row2.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="tap-effect bg-[#006837] hover:bg-[#005a2f] text-white rounded-2xl py-2 px-1 flex flex-col items-center justify-center gap-1 shadow-sm transition-all text-center aspect-square"
          >
            <div className="h-9 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-xs font-bold leading-none text-white drop-shadow-xs">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
