import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCegsrJJDryMoXgNB3r7F_ywtUzJAGjwU0",
  authDomain: "todolist-alos.firebaseapp.com",
  projectId: "todolist-alos",
  storageBucket: "todolist-alos.firebasestorage.app",
  messagingSenderId: "1030535580845",
  appId: "1:1030535580845:web:fe6e93468f53b231ac8a24",
  measurementId: "G-0T7SYPQT6P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Export Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { analytics };
