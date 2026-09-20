import React from 'react';
import { BalanceCard } from '../components/BalanceCard';
import { NoticeMarquee } from '../components/NoticeMarquee';
import { QuickActions } from '../components/QuickActions';
import { PromoSlider } from '../components/PromoSlider';
import { MfsGrid } from '../components/MfsGrid';
import { ServicesGrid } from '../components/ServicesGrid';
import { BottomNav } from '../components/BottomNav';
import { InstallAppBanner } from '../components/InstallAppBanner';

export const HomePage = ({ onNavigate, currentScreen }) => {
  const handleSelectMfs = (mfsId) => {
    // When clicking বিকাশ / নগদ / রকেট / উপায়, open transfer screen for that wallet
    onNavigate('transfer', { selectedWallet: mfsId });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col max-w-md mx-auto relative">
      {/* 1. Top Profile Card */}
      <BalanceCard onNavigate={onNavigate} />

      {/* 2. Android App Install Banner */}
      <InstallAppBanner />

      {/* 3. WhatsApp Notice Bar */}
      <NoticeMarquee />

      {/* 3. Row 1: Top 4 Green Actions (অ্যাড-মানি, নোটিশ, রেমিটেন্স, বিল-পে) */}
      <QuickActions onNavigate={onNavigate} />

      {/* 4. Promo Banner */}
      <PromoSlider />

      {/* 5. Row 2: 4 Color-Branded Mobile Wallets (বিকাশ, নগদ, রকেট, উপায়) */}
      <MfsGrid onSelectMfs={handleSelectMfs} />

      {/* 6. Row 3 & 4: 8 Green Service Squares */}
      <ServicesGrid onNavigate={onNavigate} />
    </div>
  );
};
