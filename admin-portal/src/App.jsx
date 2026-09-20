import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Toast } from './components/Toast';
import { useAdmin } from './context/AdminContext';

// Pages
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { TransactionsManager } from './pages/TransactionsManager';
import { UsersManager } from './pages/UsersManager';
import { SettingsManager } from './pages/SettingsManager';
import { ExchangeRatesManager } from './pages/ExchangeRatesManager';
import { AuditLogs } from './pages/AuditLogs';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const { adminUser, toast } = useAdmin();

  if (!adminUser) {
    return (
      <>
        <AdminLoginPage />
        <Toast toast={toast} />
      </>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardOverview onSelectTab={setCurrentTab} />;
      case 'transactions':
        return <TransactionsManager />;
      case 'users':
        return <UsersManager />;
      case 'settings':
        return <SettingsManager />;
      case 'rates':
        return <ExchangeRatesManager />;
      case 'logs':
        return <AuditLogs />;
      default:
        return <DashboardOverview onSelectTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Admin Toast */}
      <Toast toast={toast} />
    </div>
  );
}
