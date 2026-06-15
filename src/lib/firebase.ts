import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJNytBpTUmP-aeaPzzRor9F3Rcf5L6Eew",
  authDomain: "studio-6557539989-4cdbc.firebaseapp.com",
  projectId: "studio-6557539989-4cdbc",
  storageBucket: "studio-6557539989-4cdbc.firebasestorage.app",
  messagingSenderId: "561994232778",
  appId: "1:561994232778:web:2c938c1cfedd63a35d5533",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };