// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Get API key from Vite env
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Your Firebase config
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "leave-app-mern.firebaseapp.com",
  projectId: "leave-app-mern",
  storageBucket: "leave-app-mern.appspot.com",
  messagingSenderId: "454653751258",
  appId: "1:454653751258:web:f5000241ca816153881ae3",
  measurementId: "G-LVHE3LK8NG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth and Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
