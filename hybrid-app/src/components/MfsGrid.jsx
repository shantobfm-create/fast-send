import React from 'react';

export const MfsGrid = ({ onSelectMfs }) => {
  const mfsList = [
    {
      id: 'bkash',
      name: 'বিকাশ',
      logo: (
        <div className="flex items-center justify-center w-full h-full px-1">
          {/* bKash Official Wordmark + Faceted Origami Bird (Inline Vector - 100% Crystal Clear) */}
          <svg viewBox="0 0 160 55" className="w-full h-auto max-h-10">
            {/* bKash Text */}
            <text x="2" y="38" fontFamily="system-ui, -apple-system, sans-serif" fontSize="32" fontWeight="900" fill="#000000" letterSpacing="-0.5">
              bKash
            </text>
            {/* bKash Origami Bird */}
            <g transform="translate(100, 2) scale(0.44)">
              {/* Upper Wing */}
              <polygon points="12,18 48,22 42,48" fill="#E2136E" />
              {/* Main Wing Top */}
              <polygon points="48,22 82,34 56,66" fill="#F06292" />
              {/* Center Body */}
              <polygon points="42,48 56,66 48,22" fill="#D81B60" />
              {/* Wing Flap */}
              <polygon points="56,66 82,34 76,58" fill="#C2185B" />
              {/* Head / Beak */}
              <polygon points="82,34 94,40 84,48" fill="#E53935" />
              {/* Throat */}
              <polygon points="82,34 84,48 76,58" fill="#B71C1C" />
              {/* Tail 1 */}
              <polygon points="42,48 56,66 36,86" fill="#AD1457" />
              {/* Tail 2 */}
              <polygon points="36,86 56,66 44,92" fill="#880E4F" />
            </g>
          </svg>
        </div>
      )
    },
    {
      id: 'nagad',
      name: 'নগদ',
      logo: (
        <div className="flex items-center justify-center w-full h-full px-1">
          {/* Nagad Official Swirl & Wordmark (Inline Vector) */}
          <svg viewBox="0 0 150 55" className="w-full h-auto max-h-10">
            {/* Swirl Logo */}
            <g transform="translate(2, 6) scale(0.55)">
              <circle cx="36" cy="36" r="34" fill="#E23528" />
              <path d="M36 18 C46 18 54 26 54 36 C54 46 46 54 36 54 C26 54 18 46 18 36 C18 28 24 22 32 22 C38 22 44 26 44 32 C44 38 38 42 34 42 C30 42 28 38 28 35 C28 32 30 30 33 30" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="35" cy="35" r="4" fill="#FFFFFF" />
            </g>
            {/* Bengali Text */}
            <text x="54" y="38" fontFamily="'Hind Siliguri', 'Noto Sans Bengali', sans-serif" fontSize="34" fontWeight="900" fill="#E23528">
              নগদ
            </text>
          </svg>
        </div>
      )
    },
    {
      id: 'rocket',
      name: 'রকেট',
      logo: (
        <div className="flex items-center justify-center w-full h-full px-1">
          {/* Rocket Official Icon & Wordmark (Inline Vector) */}
          <svg viewBox="0 0 150 55" className="w-full h-auto max-h-10">
            <g transform="translate(4, 8) scale(0.55)">
              <rect width="68" height="68" rx="16" fill="#8C3494" />
              <path d="M16 48 L46 14 L76 34 L52 60 Z" fill="#FFFFFF" />
              <path d="M46 14 L68 44 L52 60 Z" fill="#E1BEE7" />
              <polygon points="46,14 76,34 68,44" fill="#FFFFFF" />
              <polygon points="16,48 52,60 36,64" fill="#FFFFFF" />
            </g>
            <g transform="translate(52, 12)">
              <text x="0" y="12" fontFamily="'Segoe UI', sans-serif" fontSize="10" fontWeight="bold" fill="#6B21A8" letterSpacing="0.5">ROCKET</text>
              <text x="0" y="34" fontFamily="'Hind Siliguri', sans-serif" fontSize="26" fontWeight="900" fill="#8C3494">রকেট</text>
            </g>
          </svg>
        </div>
      )
    },
    {
      id: 'upay',
      name: 'উপায়',
      logo: (
        <div className="flex items-center justify-center w-full h-full px-1">
          {/* Upay Official Smile & Wordmark (Inline Vector) */}
          <svg viewBox="0 0 150 55" className="w-full h-auto max-h-10">
            <g transform="translate(6, 10) scale(0.65)">
              <circle cx="18" cy="16" r="5.5" fill="#0055A5" />
              <circle cx="38" cy="16" r="5.5" fill="#78BE20" />
              <path d="M14 28 C20 40 36 40 42 28" stroke="#0055A5" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </g>
            <text x="50" y="38" fontFamily="'Hind Siliguri', sans-serif" fontSize="34" fontWeight="900" fill="#0055A5">
              উপায়
            </text>
          </svg>
        </div>
      )
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-2 px-3 my-2">
      {mfsList.map((mfs) => (
        <button
          key={mfs.id}
          onClick={() => onSelectMfs(mfs.id)}
          className="tap-effect bg-white hover:bg-slate-50 rounded-2xl p-2.5 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all aspect-square border-2 border-slate-200/90"
          title={mfs.name}
        >
          <div className="w-full h-full flex items-center justify-center">
            {mfs.logo}
          </div>
        </button>
      ))}
    </div>
  );
};
