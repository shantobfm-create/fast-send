import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Toast } from './components/Toast';

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

  const navigate = (screen, params = {}) => {
    setPageParams(params);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderScreen = () => {
    if (!user) {
      return <FrontAuthPage onNavigate={navigate} />;
    }

    switch (currentScreen) {
      case 'calculator':
        return <WelcomeCalculatorPage onNavigate={navigate} />;
      case 'remittance':
        return <RemittancePage onNavigate={navigate} />;
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;
      case 'home':
        return <HomePage onNavigate={navigate} currentScreen={currentScreen} />;
      case 'add-money':
        return <AddMoneyPage onNavigate={navigate} initialMfs={pageParams.selectedMfs} />;
      case 'add-money-mobile':
        return <AddMoneyMobilePage onNavigate={navigate} />;
      case 'add-money-wallet':
        return <AddMoneyWalletDetailPage onNavigate={navigate} selectedWalletId={pageParams.selectedWalletId} />;
      case 'add-money-bank':
        return <AddMoneyBankPage onNavigate={navigate} />;
      case 'add-money-card':
        return <AddMoneyCardPage onNavigate={navigate} />;
      case 'add-money-cash':
        return <AddMoneyCashPage onNavigate={navigate} />;
      case 'receipt':
        return <ReceiptPage onNavigate={navigate} txData={pageParams.txData} />;
      case 'transfer':
        return <TransferPage onNavigate={navigate} selectedWallet={pageParams.selectedWallet} />;
      case 'bank-transfer':
        return <BankTransferPage onNavigate={navigate} />;
      case 'promo':
        return <PromoPage onNavigate={navigate} />;
      case 'bill-pay':
        return <PayBillPage onNavigate={navigate} />;
      case 'history':
      case 'statement':
        return <HistoryPage onNavigate={navigate} currentScreen={currentScreen} />;
      case 'account':
      case 'profile':
        return <AccountPage onNavigate={navigate} />;
      case 'regulatory':
      case 'about':
        return <RegulatoryPage onNavigate={navigate} />;
      case 'notice':
      case 'notice-modal':
        return <NoticePage onNavigate={navigate} />;
      case 'loan':
        return <LoanPage onNavigate={navigate} />;
      case 'support':
      case 'help':
        return <SupportPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} currentScreen={currentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex justify-center items-start sm:py-4">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-0 sm:rounded-3xl sm:shadow-2xl border border-slate-200 relative flex flex-col font-sans pb-28">
        {renderScreen()}
        {user && <BottomNav currentScreen={currentScreen} onNavigate={navigate} />}
        <Toast toast={toast} />
      </div>
    </div>
  );
}
