import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDxb-NUYd7oDoW1p8MIRLJUR5yktlS9ijQ",
    authDomain: "login-form-4ba46.firebaseapp.com",
    projectId: "login-form-4ba46",
    storageBucket: "login-form-4ba46.appspot.com",
    messagingSenderId: "898788993196",
    appId: "1:898788993196:web:00d09ace4765a1fbf25709"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

// profile-script.js



