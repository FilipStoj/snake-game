// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1E5Mi2Yi5j2EroX__ld6O9McO2cUljzw",
  authDomain: "snakegame-fd5f0.firebaseapp.com",
  projectId: "snakegame-fd5f0",
  storageBucket: "snakegame-fd5f0.appspot.com",
  messagingSenderId: "993318482135",
  appId: "1:993318482135:web:f97d4b98513709546fc092",
  measurementId: "G-3WGDEDWD6W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export the database for use in other files
export default db;