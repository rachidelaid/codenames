import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBi1B6qvLRTm_Kdqi36MW1px2q1oXb5VnA",
  authDomain: "wordsgame-c3789.firebaseapp.com",
  projectId: "wordsgame-c3789",
  storageBucket: "wordsgame-c3789.appspot.com",
  messagingSenderId: "797244131809",
  appId: "1:797244131809:web:170e5edbf529a0b72e2aa0",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
