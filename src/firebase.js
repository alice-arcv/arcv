// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
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
const db = getFirestore(app);

export { db };