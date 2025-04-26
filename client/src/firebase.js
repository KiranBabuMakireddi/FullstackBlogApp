// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-574e6.firebaseapp.com",
  projectId: "mern-blog-574e6",
  storageBucket: "mern-blog-574e6.firebasestorage.app",
  messagingSenderId: "786102913116",
  appId: "1:786102913116:web:8acf44ce075afd850bbe99",
  measurementId: "G-W58SKE1P3C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);