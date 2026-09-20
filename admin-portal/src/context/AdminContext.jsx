import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fastsend_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingCount: 0,
    approvedCount: 0,
    totalVolume: 0,
    totalUserBalance: 0,
    pendingAddMoney: 0,
    pendingTransfer: 0
  });

  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const loginAdmin = async (username, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setAdminUser(data.admin);
        localStorage.setItem('fastsend_admin_user', JSON.stringify(data.admin));
        showToast(data.message || "লগইন সফল হয়েছে!", "success");
        fetchAllData();
        return { success: true };
      } else {
        return { success: false, message: data.message || "লগইন ব্যর্থ হয়েছে।" };
      }
    } catch (err) {
      setLoading(false);
      return { success: false, message: "সার্ভারে সংযোগ করা সম্ভব হয়নি।" };
    }
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('fastsend_admin_user');
    showToast("সুপার এডমিন সেশন সমাপ্ত হয়েছে।", "info");
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAllData = async () => {
    try {
      const [statsRes, txRes, usersRes, setRes, logsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/transactions'),
        fetch('/api/admin/users'),
        fetch('/api/settings'),
        fetch('/api/admin/audit-logs')
      ]);

      const [sData, tData, uData, setData, lData] = await Promise.all([
        statsRes.json(),
        txRes.json(),
        usersRes.json(),
        setRes.json(),
        logsRes.json()
      ]);

      if (sData.success) setStats(sData.stats);
      if (tData.success) setTransactions(tData.transactions);
      if (uData.success) setUsers(uData.users);
      if (setData.success) setSettings(setData.settings);
      if (lData.success) setAuditLogs(lData.logs || []);
    } catch (err) {
      console.error("Admin fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAllData();

    // SSE Realtime Sync
    let eventSource;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("⚡ Admin received live sync update:", data);
          fetchAllData();
        } catch (e) {
          console.error(e);
        }
      };
    } catch (e) {
      console.error(e);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // Approve or Reject Transaction
  const updateTransactionStatus = async (id, status, adminNote = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/transactions/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        showToast(data.message, "success");
        fetchAllData();
        return { success: true };
      } else {
        showToast(data.message, "error");
        return { success: false };
      }
    } catch (err) {
      setLoading(false);
      showToast("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।", "error");
      return { success: false };
    }
  };

  // Adjust User Balance
  const adjustUserBalance = async (phone, amount, type, reason) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users/adjust-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, amount, type, reason })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        showToast(data.message, "success");
        fetchAllData();
        return { success: true };
      } else {
        showToast(data.message, "error");
        return { success: false };
      }
    } catch (err) {
      setLoading(false);
      showToast("ব্যালেন্স আপডেট করতে সমস্যা হয়েছে।", "error");
      return { success: false };
    }
  };

  // Update User Status
  const updateUserStatus = async (phone, status, nidStatus) => {
    try {
      const res = await fetch('/api/admin/users/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, status, nidStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        fetchAllData();
        return { success: true };
      }
    } catch (err) {
      showToast("স্ট্যাটাস পরিবর্তন করা যায়নি।", "error");
    }
  };

  // Save Settings
  const saveSettings = async (newSettings) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        showToast("সিস্টেম সেটিংস সফলভাবে আপডেট ও লাইভ অ্যাপে সিঙ্ক হয়েছে!", "success");
        fetchAllData();
        return { success: true };
      } else {
        showToast("সেটিংস সংরক্ষণ ব্যর্থ হয়েছে।", "error");
        return { success: false };
      }
    } catch (err) {
      setLoading(false);
      showToast("সার্ভার ত্রুটি।", "error");
      return { success: false };
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        loginAdmin,
        logoutAdmin,
        stats,
        transactions,
        users,
        settings,
        auditLogs,
        loading,
        toast,
        showToast,
        fetchAllData,
        updateTransactionStatus,
        adjustUserBalance,
        updateUserStatus,
        saveSettings
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
