import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: "AIzaSyAM9sWgVoNu0wa3WScsN6ynqKNWuEUrz_c",
  authDomain: "yummyfood-50bab.firebaseapp.com",
  projectId: "yummyfood-50bab",
  storageBucket: "yummyfood-50bab.appspot.com",
  messagingSenderId: "560909382938",
  appId: "1:560909382938:ios:c7e29bec06b66ebf1828a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

export { auth, db };
