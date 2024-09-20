// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAcPbUHzDzNn4aCVavWob0EhWE7a_4Rcdc",
  authDomain: "reamovo-16c1d.firebaseapp.com",
  projectId: "reamovo-16c1d",
  storageBucket: "reamovo-16c1d.appspot.com",
  messagingSenderId: "501245921497",
  appId: "1:501245921497:web:bbb39f3ed2fe044af116c8",
  measurementId: "G-8M0VP2RQ0F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(app)

export { app, auth, googleProvider };