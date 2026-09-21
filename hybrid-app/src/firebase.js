import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbTti7e1AfmMKDUVmxwVqMLhjoWkF08-I",
  authDomain: "fast-send-64ad0.firebaseapp.com",
  projectId: "fast-send-64ad0",
  storageBucket: "fast-send-64ad0.firebasestorage.app",
  messagingSenderId: "130382017591",
  appId: "1:130382017591:web:2af6bbcb370503a90f3bb2",
  measurementId: "G-BN5SBHTMWE"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };
