import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // General
    appName: "Fast Send",
    tagline: "Cross-Border Manual Remittance",
    getStarted: "Get Started",
    continue: "Continue",
    back: "Back",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    copy: "Copy",
    copied: "Copied to clipboard!",
    loading: "Loading...",
    success: "Success",
    error: "Error",
    feeFree: "Fee: RM 0.00 (Zero Fee)",
    customerSupport: "Customer Support",
    whatsappSupport: "Chat on WhatsApp",

    // Screen 1: Onboarding
    welcomeHeading: "Send Money Home, Safely & Fast",
    welcomeSub: "Direct remittance from Malaysia & UAE to Bangladeshi Mobile Wallets and Banks.",
    selectCountryTitle: "Where are you sending from?",
    countryMalaysia: "Malaysia",
    countryUae: "United Arab Emirates",
    currencyMyr: "MYR (Malaysian Ringgit)",
    currencyAed: "AED (UAE Dirham)",
    languageSwitch: "Language",

    // Screen 2: Auth
    authTitle: "Enter your phone number",
    authSubtitle: "We will send an SMS with a 6-digit verification code.",
    phonePlaceholder: "Phone number",
    sendOtp: "Send Verification Code",
    otpTitle: "Verification Code",
    otpSubtitle: "Enter the 6-digit code sent to",
    resendIn: "Resend code in",
    resendBtn: "Resend Code",
    verifyBtn: "Verify & Continue",

    // Screen 3: Home Dashboard
    greeting: "Hello",
    changeCountry: "Change",
    liveRate: "Live Exchange Rate",
    youSend: "You Send",
    recipientGets: "Recipient Gets",
    sendNowBtn: "Send Money Now",
    quickSendTitle: "Quick Send",
    recentActivity: "Recent Activity",
    viewAll: "View All",
    noTransactions: "No remittance orders yet.",
    statusSubmitted: "Submitted",
    statusReviewing: "Under Review",
    statusProcessing: "Processing Payout",
    statusCompleted: "Delivered",
    statusRejected: "Rejected",

    // Screen 4: Recipient Selection
    recipientTitle: "Select Recipient",
    addNewRecipient: "+ Add New Recipient",
    searchRecipientPlaceholder: "Search by name or number...",
    savedRecipients: "Saved Beneficiaries",
    noRecipients: "No recipients found. Add your first beneficiary.",

    // Screen 5: Add Recipient
    addRecipientTitle: "Add Recipient Details",
    mobileWalletTab: "Mobile Wallet",
    bankTransferTab: "Bank Account",
    selectProvider: "Select Provider",
    recipientName: "Recipient Full Name",
    walletNumber: "Wallet Mobile Number (11 digits)",
    accountType: "Account Type",
    personal: "Personal",
    agent: "Agent",
    selectBank: "Select Bank",
    accountNumber: "Account Number",
    accountHolder: "Account Holder Name",
    branchName: "Branch Name / Routing (Optional)",
    relationship: "Relationship",
    family: "Family",
    friend: "Friend",
    saveAndContinue: "Save & Continue",

    // Screen 6: Payment Instruction & Proof Upload
    paymentTitle: "Transfer & Upload Proof",
    depositInstruction: "Deposit exact amount to official account below",
    bankName: "Bank Name",
    accountName: "Account Name",
    accOrIban: "Account / IBAN Number",
    duitNowQr: "DuitNow QR Code",
    downloadQr: "Download QR",
    proofDivider: "Upload proof after payment",
    uploadPrompt: "Select receipt photo or bank slip",
    uploadSubtitle: "Camera or Gallery (JPG, PNG)",
    removeImage: "Remove",
    referenceLabel: "Bank Reference / TrxID",
    referencePlaceholder: "e.g. MB12345678 or ATM Slip Ref",
    submitOrderBtn: "I Have Transferred - Submit Order",

    // Screen 7: Order Success & Timeline
    orderPlacedTitle: "Order Submitted Successfully!",
    orderTrackingId: "Order Tracking ID",
    timelineTitle: "Transfer Progress",
    step1Title: "Order Placed",
    step1Desc: "Receipt submitted to system",
    step2Title: "Admin Verification in Progress",
    step2Desc: "Verifying your deposit (10-30 mins)",
    step3Title: "Sending to Recipient",
    step3Desc: "Transferring BDT to recipient",
    step4Title: "Completed",
    step4Desc: "Successfully delivered to beneficiary",
    orderSummary: "Order Summary",
    transferAmount: "Sent Amount",
    rateUsed: "Exchange Rate",
    bdtDeliver: "Recipient Receives",
    recipientLabel: "Recipient",
    downloadReceipt: "Download Receipt",
    backHome: "Back to Home"
  },
  bn: {
    // General
    appName: "ফাস্ট সেন্ড",
    tagline: "প্রবাসী রেমিটেন্স প্ল্যাটফর্ম",
    getStarted: "শুরু করুন",
    continue: "এগিয়ে যান",
    back: "পেছনে যান",
    cancel: "বাতিল",
    confirm: "নিশ্চিত করুন",
    save: "সংরক্ষণ করুন",
    copy: "কপি",
    copied: "ক্লিপবোর্ডে কপি করা হয়েছে!",
    loading: "লোড হচ্ছে...",
    success: "সফল",
    error: "সমস্যা হয়েছে",
    feeFree: "চার্জ: ৳০.০০ (সম্পূর্ণ ফ্রি)",
    customerSupport: "কাস্টমার সাপোর্ট",
    whatsappSupport: "হোয়াটসঅ্যাপে চ্যাট করুন",

    // Screen 1: Onboarding
    welcomeHeading: "নিরাপদে ও দ্রুত দেশে টাকা পাঠান",
    welcomeSub: "মালয়েশিয়া ও দুবাই থেকে বাংলাদেশের যেকোনো বিকাশ, নগদ, রকেট ও ব্যাংক অ্যাকাউন্টে সরাসরি রেমিটেন্স।",
    selectCountryTitle: "আপনি কোন দেশ থেকে টাকা পাঠাচ্ছেন?",
    countryMalaysia: "মালয়েশিয়া",
    countryUae: "সংযুক্ত আরব আমিরাত (দুবাই)",
    currencyMyr: "MYR (মালয়েশিয়ান রিঙ্গিত)",
    currencyAed: "AED (ইউএই দিরহাম)",
    languageSwitch: "ভাষা",

    // Screen 2: Auth
    authTitle: "আপনার মোবাইল নম্বর দিন",
    authSubtitle: "আমরা একটি ৬-সংখ্যার ওটিপি (OTP) ভেরিফিকেশন কোড পাঠাব।",
    phonePlaceholder: "মোবাইল নম্বর লিখুন",
    sendOtp: "ওটিপি কোড পাঠান",
    otpTitle: "ভেরিফিকেশন কোড",
    otpSubtitle: "এই নম্বরে পাঠানো ৬-সংখ্যার কোডটি দিন:",
    resendIn: "পুনরায় কোড পাঠাতে অপেক্ষা:",
    resendBtn: "আবার কোড পাঠান",
    verifyBtn: "যাচাই ও এগিয়ে যান",

    // Screen 3: Home Dashboard
    greeting: "স্বাগতম",
    changeCountry: "পরিবর্তন",
    liveRate: "লাইভ এক্সচেঞ্জ রেট",
    youSend: "আপনি পাঠাবেন",
    recipientGets: "প্রাপক পাবেন",
    sendNowBtn: "এখনই টাকা পাঠান",
    quickSendTitle: "কুইক সেন্ড (সংরক্ষিত প্রাপক)",
    recentActivity: "সাম্প্রতিক লেনদেন",
    viewAll: "সবগুলো দেখুন",
    noTransactions: "এখনো কোনো রেমিটেন্স অর্ডার নেই।",
    statusSubmitted: "জমা পড়েছে",
    statusReviewing: "যাচাই চলছে",
    statusProcessing: "টাকা পাঠানো হচ্ছে",
    statusCompleted: "ডেলিভারড (সফল)",
    statusRejected: "বাতিল",

    // Screen 4: Recipient Selection
    recipientTitle: "প্রাপক নির্বাচন করুন",
    addNewRecipient: "+ নতুন প্রাপক যোগ করুন",
    searchRecipientPlaceholder: "নাম বা নম্বর দিয়ে খুঁজুন...",
    savedRecipients: "সংরক্ষিত প্রাপক তালিকা",
    noRecipients: "কোনো প্রাপক পাওয়া যায়নি। নতুন প্রাপক যোগ করুন।",

    // Screen 5: Add Recipient
    addRecipientTitle: "নতুন প্রাপকের তথ্য",
    mobileWalletTab: "মোবাইল ওয়ালেট",
    bankTransferTab: "ব্যাংক অ্যাকাউন্ট",
    selectProvider: "ওয়ালেট নির্বাচন করুন",
    recipientName: "প্রাপকের পুরো নাম",
    walletNumber: "১১ সংখ্যার মোবাইল নম্বর",
    accountType: "অ্যাকাউন্টের ধরন",
    personal: "পার্সোনাল",
    agent: "এজেন্ট",
    selectBank: "ব্যাংক নির্বাচন করুন",
    accountNumber: "অ্যাকাউন্ট নম্বর",
    accountHolder: "হিসাবধারীর নাম",
    branchName: "শাখা / রাউটিং নম্বর (ঐচ্ছিক)",
    relationship: "সম্পর্ক",
    family: "পরিবার",
    friend: "বন্ধু",
    saveAndContinue: "সংরক্ষণ ও এগিয়ে যান",

    // Screen 6: Payment Instruction & Proof Upload
    paymentTitle: "পেমেন্ট ও ভাউচার আপলোড",
    depositInstruction: "নিচের অ্যাকাউন্টে সঠিক পরিমাণ ডিপোজিট/ট্রান্সফার করুন",
    bankName: "ব্যাংকের নাম",
    accountName: "অ্যাকাউন্টের নাম",
    accOrIban: "অ্যাকাউন্ট / IBAN নম্বর",
    duitNowQr: "DuitNow QR কোড",
    downloadQr: "QR ডাউনলোড",
    proofDivider: "টাকা পাঠানোর পর প্রুফ জমা দিন",
    uploadPrompt: "রসিদের ছবি বা স্ক্রিনশট সিলেক্ট করুন",
    uploadSubtitle: "ক্যামেরা বা গ্যালারি থেকে ছবি দিন (JPG, PNG)",
    removeImage: "মুছে ফেলুন",
    referenceLabel: "ব্যাংকের রেফারেন্স নম্বর / TrxID",
    referencePlaceholder: "যেমন: MB12345678 বা এটিএম স্লিপ রেফারেন্স",
    submitOrderBtn: "আমি টাকা পাঠিয়েছি - রিকোয়েস্ট জমা দিন",

    // Screen 7: Order Success & Timeline
    orderPlacedTitle: "অর্ডার সফলভাবে জমা হয়েছে!",
    orderTrackingId: "অর্ডার ট্র্যাকিং আইডি",
    timelineTitle: "লেনদেনের বর্তমান অবস্থা",
    step1Title: "অর্ডার জমা পড়েছে",
    step1Desc: "রসিদ ও তথ্য সিস্টেমে জমা হয়েছে",
    step2Title: "এডমিন যাচাই প্রক্রিয়াধীন",
    step2Desc: "আপনার পেমেন্ট স্লিপ যাচাই করা হচ্ছে (১০-৩০ মিনিট)",
    step3Title: "বাংলাদেশে টাকা পাঠানো হচ্ছে",
    step3Desc: "প্রাপকের বিকাশ/ব্যাংকে টাকা পাঠানোর প্রস্তুতি চলছে",
    step4Title: "সফলভাবে ডেলিভারড",
    step4Desc: "প্রাপকের কাছে টাকা সফলভাবে পৌঁছে গেছে",
    orderSummary: "অর্ডার বিবরণী",
    transferAmount: "প্রেরিত অর্থ",
    rateUsed: "এক্সচেঞ্জ রেট",
    bdtDeliver: "প্রাপক পাবেন",
    recipientLabel: "প্রাপক",
    downloadReceipt: "রসিদ ডাউনলোড করুন",
    backHome: "হোম পেজে ফিরে যান"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('fastsend_lang') || 'bn';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('fastsend_lang', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
