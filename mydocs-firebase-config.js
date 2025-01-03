import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

console.log("Firebase config loading...");

const firebaseConfig = {
    apiKey: "AIzaSyDxb-NUYd7oDoW1p8MIRLJUR5yktlS9ijQ",
    authDomain: "login-form-4ba46.firebaseapp.com",
    projectId: "login-form-4ba46",
    storageBucket: "login-form-4ba46.appspot.com",
    messagingSenderId: "898788993196",
    appId: "1:898788993196:web:00d09ace4765a1fbf25709",
    measurementId: "G-JRH0NY421R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

console.log("Firebase initialized");

export { app, db, storage, auth };