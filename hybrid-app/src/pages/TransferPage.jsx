import React from 'react';
import { RemittancePage } from './RemittancePage';

export const TransferPage = ({ onNavigate, selectedWallet = 'bkash' }) => {
  // Senders are from Malaysia, Saudi Arabia, Dubai sending money to BD wallets (bKash, Nagad, Rocket, Upay, Bank)
  return <RemittancePage onNavigate={onNavigate} initialChannel={selectedWallet} />;
};
