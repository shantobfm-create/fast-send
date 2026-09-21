const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Initial Database Template
const defaultDb = {
  settings: {
    appName: "Fast Send",
    tagline: "❤️ এই ট্রান্সফারে কোনো ট্রান্সফার ফি নেই",
    noticeText: "যেকোনো প্রয়োজনে এই WhatsApp নাম্বারে মেসেজ করুন: +8801754150019 | Fast Send এ দ্রুত ও নিরাপদ রেমিটেন্স সেবা চালু আছে!",
    whatsappNumber: "+8801754150019",
    minTransferLimit: 500,
    maxTransferLimit: 30000,
    supportEmail: "support@fastsend.com",
    supportLiveChatUrl: "https://wa.me/8801754150019",
    paymentMethods: [
      { id: "bkash", name: "বিকাশ", type: "মোবাইল ব্যাংকিং", number: "01754150019", accountType: "Personal", active: true, icon: "bkash" },
      { id: "nagad", name: "নগদ", type: "মোবাইল ব্যাংকিং", number: "01854150019", accountType: "Personal", active: true, icon: "nagad" },
      { id: "rocket", name: "রকেট", type: "মোবাইল ব্যাংকিং", number: "01954150019", accountType: "Personal", active: true, icon: "rocket" },
      { id: "upay", name: "উপায়", type: "মোবাইল ব্যাংকিং", number: "01654150019", accountType: "Personal", active: true, icon: "upay" },
      { id: "bank", name: "ব্যাংক অ্যাড-মানি", type: "ব্যাংক ডিপোজিট", bankName: "Islami Bank Bangladesh PLC", number: "2050345678901234", accountType: "Fast Send Global Ltd", branch: "Motijheel, Dhaka", active: true },
      { id: "card", name: "কার্ড অ্যাড-মানি", type: "ভিসা / মাস্টারকার্ড", number: "যেকোনো ডেবিট / ক্রেডিট কার্ড", accountType: "Instant Gateway", active: true },
      { id: "cash", name: "ক্যাশ-পিকআপ", type: "ক্যাশ পয়েন্ট", number: "নিকটস্থ Fast Send পয়েন্ট", accountType: "Agent Outlet", active: true }
    ],
    exchangeRates: [
      { code: "BDT", name: "বাংলাদেশি টাকা", symbol: "৳", rateToBdt: 1.00, flag: "🇧🇩" },
      { code: "MYR", name: "মালয়েশিয়ান রিঙ্গিত", symbol: "RM", rateToBdt: 27.50, flag: "🇲🇾" },
      { code: "SAR", name: "সৌদি রিয়াল", symbol: "SR", rateToBdt: 32.80, flag: "🇸🇦" },
      { code: "AED", name: "ইউএই দিরহাম", symbol: "AED", rateToBdt: 33.50, flag: "🇦🇪" },
      { code: "USD", name: "ইউএস ডলার", symbol: "$", rateToBdt: 122.50, flag: "🇺🇸" },
      { code: "EUR", name: "ইউরো", symbol: "€", rateToBdt: 133.00, flag: "🇪🇺" },
      { code: "GBP", name: "ব্রিটিশ পাউন্ড", symbol: "£", rateToBdt: 156.00, flag: "🇬🇧" },
      { code: "QAR", name: "কাতারি রিয়াল", symbol: "QR", rateToBdt: 33.60, flag: "🇶🇦" },
      { code: "SGD", name: "সিঙ্গাপুর ডলার", symbol: "S$", rateToBdt: 92.50, flag: "🇸🇬" }
    ],
    banners: [
      {
        id: "b1",
        title: "Fast Send",
        promoCode: "EGALTUBE",
        highlight: "Get 20£, 20€ or 20$ Bonus",
        description: "Use Promo Code EGALTUBE",
        active: true
      }
    ],
    regulatoryInfo: {
      title: "Fast Send Regulatory Licenses",
      lastUpdated: "15 September 2026",
      licensedCountries: ["EU", "UK", "United States", "Canada", "UAE", "Australia", "Malaysia", "Singapore", "Saudi Arabia"],
      companyInfo: "Fast Send Payments Co., incorporated with FinCEN MSB license. All transactions encrypted with 256-bit SSL."
    },
    adminCredentials: {
      username: "superadmin@fastsend.com",
      password: "FS@2026#SecureAdmin!X9",
      role: "Super Admin",
      name: "Fast Send Super Administrator"
    }
  },
  users: [
    {
      id: "u-101",
      name: "shanto haque",
      phone: "01754150019",
      country: "Bangladesh",
      userType: "পার্সোনাল",
      pin: "242312",
      password: "123456",
      balance: 15400,
      nid: "1995874512458",
      nidStatus: "ভেরিফাইড",
      status: "active",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
      createdAt: new Date().toISOString()
    }
  ],
  transactions: [
    {
      id: "TRX-782194",
      type: "add_money",
      method: "bkash",
      methodName: "বিকাশ",
      amount: 5000,
      senderPhone: "01754150019",
      senderName: "shanto haque",
      receiverPhone: "01754150019",
      trxId: "BLM9845712",
      status: "approved",
      requestedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      adminProcessedAt: new Date(Date.now() - 3600000 * 3.8).toISOString(),
      adminNote: "পেমেন্ট নিশ্চিত করা হয়েছে ও ব্যালেন্সে যুক্ত হয়েছে।"
    }
  ],
  auditLogs: []
};

// Database Helpers
function loadDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf8');
      return defaultDb;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return defaultDb;
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    broadcastSSE({ type: 'DATABASE_UPDATED', timestamp: new Date().toISOString() });
  } catch (err) {}
}

let sseClients = [];
function broadcastSSE(eventData) {
  sseClients.forEach(client => {
    try {
      client.res.write(`data: ${JSON.stringify(eventData)}\n\n`);
    } catch (e) {}
  });
}

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = uuidv4();
  sseClients.push({ id: clientId, res });

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', (req, res) => {
  const { name, phone, country, address, userType, pin, password, nid, photo } = req.body;
  if (!phone || !pin) return res.status(400).json({ success: false, message: "ফোন নাম্বার ও পিন অবশ্যই দিতে হবে।" });

  const db = loadDb();
  const cleanPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
  
  // Strict phone validation for Bangladesh & Malaysia
  const isBd = /^(?:\+?880|880)?0?1[3-9]\d{8}$/.test(cleanPhone);
  const isMy = /^(?:\+?60|60)?0?1[0-9]\d{7,8}$/.test(cleanPhone);

  if (!isBd && !isMy) {
    return res.status(400).json({ 
      success: false, 
      message: "অবৈধ মোবাইল নম্বর! রেজিস্ট্রেশনের জন্য শুধুমাত্র বাংলাদেশ (যেমন: 017xxxxxxxx) বা মালয়েশিয়ার (যেমন: 012xxxxxxx) সঠিক নম্বর দিন।" 
    });
  }

  const existing = db.users.find(u => {
    const up = (u.phone || '').trim().replace(/[\s\-\(\)]/g, '');
    return up === cleanPhone || up.replace(/^\+?880?/, '') === cleanPhone.replace(/^\+?880?/, '') || up.replace(/^\+?60?/, '') === cleanPhone.replace(/^\+?60?/, '');
  });
  if (existing) return res.status(400).json({ success: false, message: "এই ফোন নাম্বার দিয়ে ইতিমধ্যে একটি একাউন্ট তৈরি করা আছে।" });

  const isAgent = userType === 'এজেন্ট' || userType === 'Agent';
  const initialStatus = isAgent ? 'pending_approval' : 'active';

  const newUser = {
    id: "u-" + Math.floor(1000 + Math.random() * 9000),
    name: name || "গ্রাহক",
    phone: cleanPhone,
    country: country || "Bangladesh",
    address: address || "",
    userType: isAgent ? "এজেন্ট" : "পার্সোনাল",
    pin: pin.trim(),
    password: password ? password.trim() : pin.trim(),
    balance: isAgent ? 0 : 500, // Welcome gift for personal
    nid: nid || "",
    nidStatus: nid ? "পেন্ডিং ভেরিফিকেশন" : "আনভেরিফাইড",
    status: initialStatus,
    photo: photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces",
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb(db);

  if (isAgent) {
    return res.json({ 
      success: true, 
      pendingApproval: true, 
      message: "আপনার এজেন্ট আবেদনের তথ্য সফলভাবে সুপার এডমিনের কাছে পাঠানো হয়েছে। অনুমোদন পেলে আপনি লগইন করতে পারবেন।",
      user: newUser 
    });
  }

  return res.json({ success: true, message: "রেজিস্ট্রেশন সফল হয়েছে!", user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { phone, pin, password } = req.body;
  const db = loadDb();
  
  const cleanInput = (phone || '').trim().replace(/[\s\-()]/g, '');
  const user = db.users.find(u => {
    const userPhone = (u.phone || '').trim().replace(/[\s\-()]/g, '');
    if (!userPhone) return false;
    if (userPhone === cleanInput) return true;
    if (userPhone.replace(/^\+88/, '') === cleanInput.replace(/^\+88/, '')) return true;
    if (userPhone.replace(/^\+60/, '') === cleanInput.replace(/^\+60/, '')) return true;
    if (userPhone.replace(/^0+/, '') === cleanInput.replace(/^0+/, '')) return true;
    return false;
  });
  
  if (!user) return res.status(404).json({ success: false, message: "এই ফোন নাম্বারে কোনো একাউন্ট পাওয়া যায়নি।" });

  const credential = pin || password;
  if (user.pin !== credential && user.password !== credential) {
    return res.status(401).json({ success: false, message: "ভুল পিন বা পাসওয়ার্ড।" });
  }

  if (user.status === 'pending_approval') {
    return res.status(403).json({ 
      success: false, 
      message: "আপনার এজেন্ট একাউন্টটি বর্তমানে সুপার এডমিনের অনুমোদনের অপেক্ষায় রয়েছে। অনুমোদন পাওয়ার পর লগইন করতে পারবেন।" 
    });
  }

  if (user.status === 'blocked') {
    return res.status(403).json({ success: false, message: "আপনার একাউন্টটি সাময়িকভাবে ব্লক করা হয়েছে। সাপোর্টে যোগাযোগ করুন।" });
  }

  return res.json({ success: true, message: "লগইন সফল হয়েছে!", user });
});

app.get('/api/auth/me/:phone', (req, res) => {
  const db = loadDb();
  const user = db.users.find(u => u.phone === req.params.phone);
  if (!user) return res.status(404).json({ success: false, message: "ব্যবহারকারী পাওয়া যায়নি।" });
  return res.json({ success: true, user });
});

app.post('/api/auth/change-pin', (req, res) => {
  const { phone, oldPin, newPin } = req.body;
  const db = loadDb();
  const user = db.users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ success: false, message: "ব্যবহারকারী পাওয়া যায়নি।" });
  if (user.pin !== oldPin) return res.status(400).json({ success: false, message: "পুরনো পিন সঠিক নয়।" });

  user.pin = newPin;
  saveDb(db);
  return res.json({ success: true, message: "পিন সফলভাবে পরিবর্তন হয়েছে!" });
});

app.post('/api/auth/change-password', (req, res) => {
  const { phone, oldPassword, newPassword } = req.body;
  const db = loadDb();
  const user = db.users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ success: false, message: "ব্যবহারকারী পাওয়া যায়নি।" });

  user.password = newPassword;
  saveDb(db);
  return res.json({ success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!" });
});

app.post('/api/auth/verify-nid', (req, res) => {
  const { phone, nidNumber, nidName } = req.body;
  const db = loadDb();
  const user = db.users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ success: false, message: "ব্যবহারকারী পাওয়া যায়নি।" });

  user.nid = nidNumber;
  user.nidName = nidName;
  user.nidStatus = "পেন্ডিং ভেরিফিকেশন";
  saveDb(db);
  return res.json({ success: true, message: "এনআইডি ভেরিফিকেশনের জন্য জমা হয়েছে।" });
});

// Settings
app.get('/api/settings', (req, res) => {
  const db = loadDb();
  return res.json({ success: true, settings: db.settings });
});

// Transactions
app.get('/api/transactions', (req, res) => {
  const { phone } = req.query;
  const db = loadDb();
  if (phone) {
    const clean = phone.trim();
    const userTx = db.transactions.filter(t => 
      (t.senderPhone && t.senderPhone.trim() === clean) || 
      (t.receiverPhone && t.receiverPhone.trim() === clean)
    );
    return res.json({ success: true, transactions: userTx });
  }
  return res.json({ success: true, transactions: db.transactions });
});

app.post('/api/transactions/add-money', (req, res) => {
  const { senderPhone, methodId, amount, adminNumber, trxId, note, proofImage } = req.body;
  const db = loadDb();
  const user = db.users.find(u => u.phone === (senderPhone || '').trim());
  if (!user) return res.status(404).json({ success: false, message: "ব্যবহারকারী পাওয়া যায়নি।" });

  const method = db.settings.paymentMethods.find(m => m.id === methodId) || { name: methodId || "মোবাইল ব্যাংকিং" };

  const newTx = {
    id: "TRX-" + Math.floor(100000 + Math.random() * 900000),
    type: "add_money",
    method: methodId,
    methodName: method.name,
    amount: Number(amount),
    senderPhone: user.phone,
    senderName: user.name,
    receiverPhone: adminNumber || method.number || "Fast Send Admin",
    trxId: trxId || ("DEP" + Math.floor(100000 + Math.random() * 900000)),
    note: note || "",
    proofImage: proofImage || null,
    status: "pending",
    requestedAt: new Date().toISOString(),
    adminProcessedAt: null,
    adminNote: "এডমিন পর্যালোচনার জন্য অপেক্ষমান।"
  };

  db.transactions.unshift(newTx);
  saveDb(db);

  return res.json({ success: true, message: "অ্যাড-মানি রিকোয়েস্ট পাঠানো হয়েছে! এডমিন দ্রুত টাকা যুক্ত করবেন।", transaction: newTx });
});

app.post('/api/transactions/transfer', (req, res) => {
  const { senderPhone, receiverNid, receiverName, receiverPhone, amount, pin, method } = req.body;
  const db = loadDb();
  const sender = db.users.find(u => u.phone === (senderPhone || '').trim());
  if (!sender) return res.status(404).json({ success: false, message: "ব্যবহারকারী পাওয়া যায়নি।" });

  if (sender.pin !== pin && sender.password !== pin) {
    return res.status(401).json({ success: false, message: "৬-সংখ্যার সিকিউরিটি পিন সঠিক নয়।" });
  }

  const numAmount = Number(amount);
  const minLimit = 500;
  const maxLimit = 30000;
  if (numAmount < minLimit) {
    return res.status(400).json({ success: false, message: `মোবাইল ওয়ালেটে সর্বনিম্ন ট্রান্সফার লিমিট ৳${minLimit}/= টাকা!` });
  }
  if (numAmount > maxLimit) {
    return res.status(400).json({ success: false, message: `মোবাইল ওয়ালেটে প্রতি লেনদেনে সর্বোচ্চ লিমিট ৳${maxLimit}/= টাকা!` });
  }

  if (sender.balance < numAmount) {
    return res.status(400).json({ success: false, message: `পর্যাপ্ত ব্যালেন্স নেই! বর্তমান ব্যালেন্স: ৳${sender.balance}` });
  }

  sender.balance -= numAmount;

  const newTx = {
    id: "TRX-" + Math.floor(100000 + Math.random() * 900000),
    type: "transfer",
    method: method || "direct",
    methodName: method ? method.toUpperCase() : "পিন ট্রান্সফার",
    amount: numAmount,
    senderPhone: sender.phone,
    senderName: sender.name,
    receiverPhone: (receiverPhone || '').trim(),
    receiverName: receiverName || "প্রাপক",
    receiverNid: receiverNid || "",
    status: "pending",
    requestedAt: new Date().toISOString(),
    adminProcessedAt: null,
    adminNote: "এডমিন ডেলিভারির জন্য প্রক্রিয়াধীন।"
  };

  db.transactions.unshift(newTx);
  saveDb(db);

  return res.json({ success: true, message: "টাকা ট্রান্সফার রিকোয়েস্ট সফল হয়েছে!", transaction: newTx, newBalance: sender.balance });
});

app.post('/api/transactions/pay-bill', (req, res) => {
  const { senderPhone, billerId, amount } = req.body;
  const db = loadDb();
  const sender = db.users.find(u => u.phone === senderPhone);
  if (!sender) return res.status(404).json({ success: false, message: "ব্যবহারকারী পাওয়া যায়নি।" });

  const numAmount = Number(amount);
  if (sender.balance < numAmount) return res.status(400).json({ success: false, message: `অপর্যাপ্ত ব্যালেন্স!` });

  sender.balance -= numAmount;

  const newTx = {
    id: "BILL-" + Math.floor(100000 + Math.random() * 900000),
    type: "pay_bill",
    method: "utility",
    methodName: "পে-বিল",
    amount: numAmount,
    senderPhone: sender.phone,
    senderName: sender.name,
    receiverPhone: billerId,
    status: "approved",
    requestedAt: new Date().toISOString(),
    adminProcessedAt: new Date().toISOString(),
    adminNote: `বিল পরিশোধ সম্পন্ন (আইডি: ${billerId})`
  };

  db.transactions.unshift(newTx);
  saveDb(db);
  return res.json({ success: true, message: "বিল পরিশোধ সম্পন্ন হয়েছে!", transaction: newTx, newBalance: sender.balance });
});

// Admin Routes
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const db = loadDb();
  const adminCreds = db.settings.adminCredentials || {
    username: "superadmin@fastsend.com",
    password: "FS@2026#SecureAdmin!X9",
    role: "Super Admin",
    name: "Fast Send Super Administrator"
  };

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "ইউজারনেম ও পাসওয়ার্ড প্রদান করুন।" });
  }

  if (username.trim() === adminCreds.username && password === adminCreds.password) {
    return res.json({
      success: true,
      message: "সুপার এডমিন লগইন সফল হয়েছে!",
      admin: {
        username: adminCreds.username,
        name: adminCreds.name || "সুপার এডমিনিস্ট্রেটর",
        role: "Super Admin",
        token: "fs-admin-token-" + Date.now()
      }
    });
  } else {
    return res.status(401).json({ success: false, message: "ভুল ইউজারনেম বা পাসওয়ার্ড! পুনরায় চেষ্টা করুন।" });
  }
});

app.get('/api/admin/stats', (req, res) => {
  const db = loadDb();
  const pending = db.transactions.filter(t => t.status === 'pending');
  const approved = db.transactions.filter(t => t.status === 'approved');
  return res.json({
    success: true,
    stats: {
      totalUsers: db.users.length,
      pendingCount: pending.length,
      approvedCount: approved.length,
      totalVolume: approved.reduce((a, b) => a + (Number(b.amount) || 0), 0),
      pendingAddMoney: pending.filter(t => t.type === 'add_money').length,
      pendingTransfer: pending.filter(t => t.type === 'transfer').length
    }
  });
});

app.get('/api/admin/users', (req, res) => {
  const db = loadDb();
  return res.json({ success: true, users: db.users });
});

app.post('/api/admin/users/adjust-balance', (req, res) => {
  const { phone, amount, type, reason } = req.body;
  const db = loadDb();
  const user = db.users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ success: false, message: "ইউজার পাওয়া যায়নি।" });

  const num = Math.abs(Number(amount));
  if (type === 'add') user.balance += num;
  else user.balance = Math.max(0, user.balance - num);

  db.transactions.unshift({
    id: "ADJ-" + Math.floor(100000 + Math.random() * 900000),
    type: type === 'add' ? 'admin_credit' : 'admin_debit',
    method: "manual",
    methodName: "এডমিন এডজাস্টমেন্ট",
    amount: num,
    senderPhone: type === 'add' ? "Fast Send System" : user.phone,
    receiverPhone: user.phone,
    receiverName: user.name,
    status: "approved",
    requestedAt: new Date().toISOString(),
    adminProcessedAt: new Date().toISOString(),
    adminNote: reason || "এডমিন কর্তৃক ব্যালেন্স আপডেট"
  });

  saveDb(db);
  return res.json({ success: true, message: "ব্যালেন্স আপডেট হয়েছে!", user });
});

app.post('/api/admin/users/update-status', (req, res) => {
  const { phone, status, nidStatus } = req.body;
  const db = loadDb();
  const user = db.users.find(u => u.phone === phone);
  if (!user) return res.status(404).json({ success: false, message: "ইউজার পাওয়া যায়নি।" });

  if (status) user.status = status;
  if (nidStatus) user.nidStatus = nidStatus;
  saveDb(db);
  return res.json({ success: true, message: "স্ট্যাটাস আপডেট হয়েছে!", user });
});

app.post('/api/admin/transactions/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, adminNote } = req.body;
  const db = loadDb();
  const tx = db.transactions.find(t => t.id === id);
  if (!tx) return res.status(404).json({ success: false, message: "ট্রানজেকশন পাওয়া যায়নি।" });

  const old = tx.status;
  tx.status = status;
  tx.adminProcessedAt = new Date().toISOString();
  if (adminNote) tx.adminNote = adminNote;

  const sender = db.users.find(u => u.phone === tx.senderPhone);
  if (tx.type === 'add_money' && status === 'approved' && old !== 'approved') {
    if (sender) sender.balance += Number(tx.amount);
  }
  if (tx.type === 'transfer' && status === 'rejected' && old === 'pending') {
    if (sender) sender.balance += Number(tx.amount);
  }

  saveDb(db);
  return res.json({ success: true, message: `ট্রানজেকশন ${status === 'approved' ? 'অনুমোদন' : 'বাতিল'} হয়েছে!`, transaction: tx });
});

app.post('/api/admin/settings', (req, res) => {
  const db = loadDb();
  db.settings = { ...db.settings, ...req.body };
  saveDb(db);
  return res.json({ success: true, message: "সেটিংস আপডেট হয়েছে!", settings: db.settings });
});

app.get('/api/admin/audit-logs', (req, res) => {
  const db = loadDb();
  return res.json({ success: true, logs: db.auditLogs || [] });
});

// ==================== STATIC SERVING FOR PRODUCTION ====================
// Serve Static dists directly on port 5000 so there is NEVER a blank screen or port issue!
const hybridDistPath = path.join(__dirname, '../hybrid-app/dist');
const adminDistPath = path.join(__dirname, '../admin-portal/dist');

// PWA Static routes at root & app paths
app.get(['/manifest.json', '/app/manifest.json'], (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.sendFile(path.join(hybridDistPath, 'manifest.json'));
});
app.get(['/sw.js', '/app/sw.js'], (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(hybridDistPath, 'sw.js'));
});
app.get(['/icon-192.png', '/app/icon-192.png'], (req, res) => {
  res.sendFile(path.join(hybridDistPath, 'icon-192.png'));
});
app.get(['/icon-512.png', '/app/icon-512.png'], (req, res) => {
  res.sendFile(path.join(hybridDistPath, 'icon-512.png'));
});
app.get(['/maskable-icon-512.png', '/app/maskable-icon-512.png'], (req, res) => {
  res.sendFile(path.join(hybridDistPath, 'maskable-icon-512.png'));
});
app.get(['/logo.svg', '/app/logo.svg'], (req, res) => {
  res.sendFile(path.join(hybridDistPath, 'logo.svg'));
});

// Static assets
app.use('/assets', express.static(path.join(hybridDistPath, 'assets')));
app.use('/admin/assets', express.static(path.join(adminDistPath, 'assets')));
app.use('/app/assets', express.static(path.join(hybridDistPath, 'assets')));
app.use(express.static(hybridDistPath));

// Direct Android App Install & Download Route
app.get(['/download/FastSend.apk', '/FastSend.apk', '/download', '/apk'], (req, res) => {
  return res.redirect('/app?install=true');
});

// Mobile App Route
app.get('/app*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(hybridDistPath, 'index.html'));
});

// Admin Portal Route
app.get('/admin*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(adminDistPath, 'index.html'));
});

// Root Hub Route - Split Interactive Dashboard
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fast Send - Live Control Hub</title>
  <link rel="manifest" href="/manifest.json">
  <link rel="icon" type="image/png" href="/icon-192.png">
  <meta name="theme-color" content="#00823B">
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Hind Siliguri', Segoe UI, sans-serif; }
    body { background: #F1F5F9; color: #0F172A; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
    header { background: #00823B; color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .logo-badge { background: #006837; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold; }
    .split-view { display: flex; flex: 1; gap: 14px; padding: 14px; height: calc(100vh - 54px); }
    .app-pane { width: 440px; background: white; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #CBD5E1; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .admin-pane { flex: 1; background: white; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #CBD5E1; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .pane-bar { background: #F8FAFC; padding: 10px 16px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 13px; color: #00823B; }
    iframe { width: 100%; height: 100%; border: none; flex: 1; background: white; }
    .btn { background: white; color: #00823B; padding: 6px 14px; border-radius: 10px; font-weight: bold; text-decoration: none; font-size: 12px; border: 1px solid #CBD5E1; transition: all 0.2s; }
    .btn:hover { background: #006837; color: white; }
    .btn-top { background: #006837; color: white; border: 1px solid rgba(255,255,255,0.3); padding: 5px 12px; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: bold; margin-left: 8px; }
    .btn-top:hover { background: white; color: #00823B; }
  </style>
</head>
<body>
  <header>
    <div style="display:flex; align-items:center; gap:10px;">
      <span style="font-size:18px; font-weight:900;">🚀 Fast Send লাইভ প্লাটফর্ম</span>
      <span class="logo-badge">⚡ রিয়েল-টাইম লাইভ সিঙ্ক সক্রিয়</span>
    </div>
    <div>
      <a href="/app" target="_blank" class="btn-top">📱 মোবাইল অ্যাপ আলাদা ট্যাবে</a>
      <a href="/admin" target="_blank" class="btn-top">💻 এডমিন পোর্টাল আলাদা ট্যাবে</a>
    </div>
  </header>

  <div class="split-view">
    <!-- Left Mobile Frame -->
    <div class="app-pane">
      <div class="pane-bar">
        <span>📱 Fast Send হাইব্রিড মোবাইল অ্যাপ (গ্রাহক)</span>
        <a href="/app" target="_blank" class="btn">পূর্ণ স্ক্রিনে খুলুন ↗</a>
      </div>
      <iframe src="/app"></iframe>
    </div>

    <!-- Right Admin Dashboard -->
    <div class="admin-pane">
      <div class="pane-bar">
        <span>💻 কেন্দ্রীয় এডমিন কন্ট্রোল পোর্টাল (এডমিন)</span>
        <a href="/admin" target="_blank" class="btn">পূর্ণ স্ক্রিনে খুলুন ↗</a>
      </div>
      <iframe src="/admin"></iframe>
    </div>
  </div>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Fast Send Main Server running on http://localhost:${PORT}`);
  console.log(`📱 App available at http://localhost:${PORT}/app`);
  console.log(`💻 Admin available at http://localhost:${PORT}/admin`);
});
