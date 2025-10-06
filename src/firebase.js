// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9JJ0yQDHQuXj3jYWAzID4iy0PQyRfp_4",
  authDomain: "faithstream-9dae1.firebaseapp.com",
  projectId: "faithstream-9dae1",
  storageBucket: "faithstream-9dae1.firebasestorage.app",
  messagingSenderId: "440987580469",
  appId: "1:440987580469:web:ce998036005df4921e997c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
