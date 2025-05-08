// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjePFVlme3vzAgtSmRqkKxngQ3n8CvjiQ",
  authDomain: "rtoauto-ac8b8.firebaseapp.com",
  databaseURL: "https://rtoauto-ac8b8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rtoauto-ac8b8",
  storageBucket: "rtoauto-ac8b8.firebasestorage.app",
  messagingSenderId: "474488101509",
  appId: "1:474488101509:web:23a49775036caac93e27ec",
  measurementId: "G-F3HSENZFVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
