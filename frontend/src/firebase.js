// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBO6IqUNBsK02rmzqeWaHOWoQD0zeQpSQE",
  authDomain: "arcv-645e1.firebaseapp.com",
  projectId: "arcv-645e1",
  storageBucket: "arcv-645e1.firebasestorage.app",
  messagingSenderId: "161424187146",
  appId: "1:161424187146:web:6a0177701383318386a4f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;