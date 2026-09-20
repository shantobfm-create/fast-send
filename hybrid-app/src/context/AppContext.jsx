import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fastsend_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [settings, setSettings] = useState({
    appName: "Fast Send",
    tagline: "❤️ এই ট্রান্সফারে কোনো ট্রান্সফার ফি নেই",
    noticeText: "যেকোনো প্রয়োজনে এই WhatsApp নাম্বারে মেসেজ করুন: +8801754150019 | Fast Send এ দ্রুত ও নিরাপদ রেমিটেন্স সেবা চালু আছে!",
    whatsappNumber: "+8801754150019",
    minTransferLimit: 50000,
    maxTransferLimit: 500000,
    paymentMethods: [
      { id: "bkash", name: "বিকাশ", type: "মোবাইল ব্যাংকিং", number: "01754150019", accountType: "Personal", active: true },
      { id: "nagad", name: "নগদ", type: "মোবাইল ব্যাংকিং", number: "01854150019", accountType: "Personal", active: true },
      { id: "rocket", name: "রকেট", type: "মোবাইল ব্যাংকিং", number: "01954150019", accountType: "Personal", active: true },
      { id: "upay", name: "উপায়", type: "মোবাইল ব্যাংকিং", number: "01654150019", accountType: "Personal", active: true },
      { id: "bank", name: "ব্যাংক অ্যাড-মানি", type: "ব্যাংক ডিপোজিট", number: "2050345678901234", bankName: "Islami Bank Bangladesh PLC", active: true },
      { id: "card", name: "কার্ড অ্যাড-মানি", type: "ভিসা / মাস্টারকার্ড", number: "ইনস্ট্যান্ট গেটওয়ে", active: true },
      { id: "cash", name: "ক্যাশ-পিকআপ", type: "ক্যাশ পয়েন্ট", number: "নিকটস্থ এজেন্ট পয়েন্ট", active: true }
    ],
    exchangeRates: [
      { code: "BDT", name: "বাংলাদেশি টাকা", rateToBdt: 1.0, flag: "🇧🇩" },
      { code: "MYR", name: "মালয়েশিয়ান রিঙ্গিত", rateToBdt: 27.5, flag: "🇲🇾" },
      { code: "SAR", name: "সৌদি রিয়াল", rateToBdt: 32.8, flag: "🇸🇦" },
      { code: "AED", name: "ইউএই দিরহাম", rateToBdt: 33.5, flag: "🇦🇪" },
      { code: "USD", name: "ইউএস ডলার", rateToBdt: 122.5, flag: "🇺🇸" },
      { code: "EUR", name: "ইউরো", rateToBdt: 133.0, flag: "🇪🇺" }
    ],
    banners: []
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Fetch settings error:", err);
    }
  };

  const fetchUserData = async (phone) => {
    const targetPhone = phone || (user && user.phone);
    if (!targetPhone) return;

    try {
      const [uRes, tRes] = await Promise.all([
        fetch(`/api/auth/me/${targetPhone}`),
        fetch(`/api/transactions?phone=${targetPhone}`)
      ]);

      const uData = await uRes.json();
      const tData = await tRes.json();

      if (uData.success && uData.user) {
        setUser(uData.user);
        localStorage.setItem('fastsend_user', JSON.stringify(uData.user));
      }
      if (tData.success && tData.transactions) {
        setTransactions(tData.transactions);
      }
    } catch (err) {
      console.error("Fetch user data error:", err);
    }
  };

  useEffect(() => {
    fetchSettings();
    if (user && user.phone) {
      fetchUserData(user.phone);
    }

    let eventSource;
    try {
      eventSource = new EventSource('/api/events');
      eventSource.onmessage = (event) => {
        try {
          fetchSettings();
          if (user && user.phone) {
            fetchUserData(user.phone);
          }
        } catch (e) {}
      };
    } catch (e) {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  const login = async (phone, pin) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pin })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('fastsend_user', JSON.stringify(data.user));
        showToast(data.message || "লগইন সফল হয়েছে!", "success");
        fetchUserData(data.user.phone);
        return { success: true };
      } else {
        showToast(data.message || "লগইন ব্যর্থ হয়েছে।", "error");
        return { success: false, message: data.message };
      }
    } catch (err) {
      setLoading(false);
      showToast("সার্ভারে সংযোগ করা সম্ভব হয়নি।", "error");
      return { success: false, message: err.message };
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        if (data.pendingApproval) {
          showToast(data.message || "এজেন্ট আবেদন জমা হয়েছে! এডমিন অনুমোদনের পর লগইন করতে পারবেন।", "info");
          return { success: true, pendingApproval: true, message: data.message };
        }
        if (data.user) {
          setUser(data.user);
          localStorage.setItem('fastsend_user', JSON.stringify(data.user));
          showToast(data.message || "রেজিস্ট্রেশন সফল হয়েছে!", "success");
          fetchUserData(data.user.phone);
          return { success: true };
        }
        return { success: true };
      } else {
        showToast(data.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।", "error");
        return { success: false, message: data.message };
      }
    } catch (err) {
      setLoading(false);
      showToast("সার্ভারে সংযোগ করা সম্ভব হয়নি।", "error");
      return { success: false, message: err.message };
    }
  };

  const resetPin = async (phone, newPin) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, newPin })
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        showToast(data.message || "পিন সফলভাবে রিসেট হয়েছে!", "success");
        return { success: true };
      } else {
        showToast(data.message || "পিন রিসেট ব্যর্থ হয়েছে।", "error");
        return { success: false };
      }
    } catch (err) {
      setLoading(false);
      showToast("সার্ভার ত্রুটি।", "error");
      return { success: false };
    }
  };

  const logout = () => {
    setUser(null);
    setTransactions([]);
    localStorage.removeItem('fastsend_user');
    showToast("লগআউট সফল হয়েছে।", "info");
  };

  const submitAddMoney = async (payload) => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions/add-money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderPhone: user.phone,
          ...payload
        })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        showToast(data.message, "success");
        fetchUserData(user.phone);
        return { success: true, transaction: data.transaction };
      } else {
        showToast(data.message, "error");
        return { success: false, message: data.message };
      }
    } catch (err) {
      setLoading(false);
      showToast("রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে।", "error");
      return { success: false, message: err.message };
    }
  };

  const submitTransfer = async (payload) => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderPhone: user.phone,
          ...payload
        })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        showToast(data.message, "success");
        fetchUserData(user.phone);
        return { success: true, transaction: data.transaction };
      } else {
        showToast(data.message, "error");
        return { success: false, message: data.message };
      }
    } catch (err) {
      setLoading(false);
      showToast("রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে।", "error");
      return { success: false, message: err.message };
    }
  };

  const submitPayBill = async (payload) => {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions/pay-bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderPhone: user.phone,
          ...payload
        })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        showToast(data.message, "success");
        fetchUserData(user.phone);
        return { success: true, transaction: data.transaction };
      } else {
        showToast(data.message, "error");
        return { success: false, message: data.message };
      }
    } catch (err) {
      setLoading(false);
      showToast("বিল পরিশোধে সমস্যা হয়েছে।", "error");
      return { success: false, message: err.message };
    }
  };

  const changePin = async (oldPin, newPin) => {
    try {
      const res = await fetch('/api/auth/change-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, oldPin, newPin })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        return { success: true };
      } else {
        showToast(data.message, "error");
        return { success: false, message: data.message };
      }
    } catch (err) {
      showToast("পিন পরিবর্তন করা যায়নি।", "error");
      return { success: false, message: err.message };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, oldPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        return { success: true };
      } else {
        showToast(data.message, "error");
        return { success: false, message: data.message };
      }
    } catch (err) {
      showToast("পাসওয়ার্ড পরিবর্তন করা যায়নি।", "error");
      return { success: false, message: err.message };
    }
  };

  const verifyNid = async (nidNumber, nidName) => {
    try {
      const res = await fetch('/api/auth/verify-nid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, nidNumber, nidName })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        fetchUserData(user.phone);
        return { success: true };
      } else {
        showToast(data.message, "error");
        return { success: false };
      }
    } catch (err) {
      showToast("এনআইডি তথ্য জমা দেওয়া যায়নি।", "error");
      return { success: false };
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        settings,
        transactions,
        loading,
        toast,
        showToast,
        login,
        register,
        resetPin,
        logout,
        fetchUserData,
        fetchSettings,
        submitAddMoney,
        submitTransfer,
        submitPayBill,
        changePin,
        changePassword,
        verifyNid
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
