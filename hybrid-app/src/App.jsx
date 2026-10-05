import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Toast } from './components/Toast';

// PRD Dedicated Screens
import { OnboardingScreen } from './pages/OnboardingScreen';
import { AuthScreen } from './pages/AuthScreen';
import { HomeScreen } from './pages/HomeScreen';
import { SelectRecipientScreen } from './pages/SelectRecipientScreen';
import { AddRecipientScreen } from './pages/AddRecipientScreen';
import { PaymentInstructionScreen } from './pages/PaymentInstructionScreen';
import { OrderTrackerScreen } from './pages/OrderTrackerScreen';

// Pages
import { FrontAuthPage } from './pages/FrontAuthPage';
import { WelcomeCalculatorPage } from './pages/WelcomeCalculatorPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { AddMoneyPage } from './pages/AddMoneyPage';
import { AddMoneyMobilePage } from './pages/AddMoneyMobilePage';
import { AddMoneyWalletDetailPage } from './pages/AddMoneyWalletDetailPage';
import { AddMoneyBankPage } from './pages/AddMoneyBankPage';
import { AddMoneyCardPage } from './pages/AddMoneyCardPage';
import { AddMoneyCashPage } from './pages/AddMoneyCashPage';
import { ReceiptPage } from './pages/ReceiptPage';
import { TransferPage } from './pages/TransferPage';
import { BankTransferPage } from './pages/BankTransferPage';
import { PromoPage } from './pages/PromoPage';
import { RemittancePage } from './pages/RemittancePage';
import { PayBillPage } from './pages/PayBillPage';
import { HistoryPage } from './pages/HistoryPage';
import { AccountPage } from './pages/AccountPage';
import { RegulatoryPage } from './pages/RegulatoryPage';
import { NoticePage } from './pages/NoticePage';
import { LoanPage } from './pages/LoanPage';
import { SupportPage } from './pages/SupportPage';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const { user, toast } = useApp();
  const [currentScreen, setCurrentScreen] = useState('home');
  const [pageParams, setPageParams] = useState({});
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register' | 'calculator'

  const navigate = (screen, params = {}) => {
    setPageParams(params);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderScreen = () => {
    if (!user) {
      if (currentScreen === 'onboarding') {
        return <OnboardingScreen onNavigate={navigate} />;
      }
      if (currentScreen === 'auth' || currentScreen === 'login' || currentScreen === 'register') {
        return <AuthScreen onNavigate={navigate} defaultTab={pageParams.defaultTab || (currentScreen === 'register' ? 'register' : 'login')} />;
      }
      return <OnboardingScreen onNavigate={navigate} />;
    }

    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onNavigate={navigate} />;
      case 'auth':
        return <AuthScreen onNavigate={navigate} />;
      case 'home':
        return <HomeScreen onNavigate={navigate} />;
      case 'select-recipient':
        return <SelectRecipientScreen onNavigate={navigate} />;
      case 'add-recipient':
        return <AddRecipientScreen onNavigate={navigate} />;
      case 'payment-instruction':
      case 'payment':
        return <PaymentInstructionScreen onNavigate={navigate} />;
      case 'order-tracker':
      case 'receipt':
        return <OrderTrackerScreen onNavigate={navigate} />;
      case 'history':
      case 'statement':
        return <HistoryPage onNavigate={navigate} currentScreen={currentScreen} />;
      case 'account':
      case 'profile':
        return <AccountPage onNavigate={navigate} />;
      case 'support':
      case 'help':
        return <SupportPage onNavigate={navigate} />;
      default:
        return <HomeScreen onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex justify-center items-start sm:py-6">
      <div className={`w-full max-w-md bg-[#F4F7F6] min-h-screen sm:min-h-[844px] sm:rounded-[2.5rem] sm:shadow-2xl sm:border sm:border-slate-700/50 relative flex flex-col font-sans overflow-hidden ${user ? 'pb-20' : ''}`}>
        {renderScreen()}
        
        {/* Fixed Global Bottom Navigation only for logged-in users */}
        {user && (
          <BottomNav 
            currentScreen={currentScreen} 
            onNavigate={navigate}
          />
        )}
        
        <Toast toast={toast} />
      </div>
    </div>
  );
}
