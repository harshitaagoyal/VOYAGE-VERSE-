
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  GoogleAuthProvider, FacebookAuthProvider, signInWithPopup
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDxb-NUYd7oDoW1p8MIRLJUR5yktlS9ijQ",
  authDomain: "login-form-4ba46.firebaseapp.com",
  projectId: "login-form-4ba46",
  storageBucket: "login-form-4ba46.firebasestorage.app",
  messagingSenderId: "898788993196",
  appId: "1:898788993196:web:00d09ace4765a1fbf25709",
  measurementId: "G-JRH0NY421R"
};

const app = initializeApp(firebaseConfig);


const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.innerHTML = message;
  messageDiv.classList.add('show');
  setTimeout(() => messageDiv.classList.remove('show'), 5000);
}


const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('rEmail').value;
  const password = document.getElementById('rPassword').value;
  const firstName = document.getElementById('fName').value;
  const lastName = document.getElementById('lName').value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName
      };
      showMessage('Account Created Successfully', 'signUpMessage');
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error("error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == 'auth/email-already-in-use') {
        showMessage('Email Address Already Exists !!!', 'signUpMessage');
      }
      else {
        showMessage('unable to create User', 'signUpMessage');
      }
    })
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage('login is successful', 'signInMessage');
      const user = userCredential.user;
      localStorage.setItem('loggedInUserId', user.uid);
      window.location.href = 'dashboard-index.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === 'auth/wrong-password') {
        showMessage('Incorrect Password', 'signInMessage');
      } else if (errorCode === 'auth/user-not-found') {
        showMessage('Account does not Exist', 'signInMessage');
      } else {
        showMessage('Login Failed: ' + error.message, 'signInMessage');
      }
    });
});


document.querySelector('.fa-google').addEventListener('click', () => {
  const auth = getAuth();
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      const userData = {
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || ''
      };

      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);

      setDoc(docRef, userData, { merge: true })
        .then(() => {
          showMessage('Google Sign-in Successful', 'signInMessage');
          localStorage.setItem('loggedInUserId', user.uid);
          window.location.href = 'dashboard-index.html';
        });
    })
    .catch((error) => {
      showMessage('Google Sign-in Failed: ' + error.message, 'signInMessage');
    });
});


document.querySelector('.fa-facebook').addEventListener('click', () => {
  const auth = getAuth();
  signInWithPopup(auth, facebookProvider)
    .then((result) => {
      const user = result.user;
      const userData = {
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || ''
      };

      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);

      setDoc(docRef, userData, { merge: true })
        .then(() => {
          showMessage('Facebook Sign-in Successful', 'signInMessage');
          localStorage.setItem('loggedInUserId', user.uid);
          window.location.href = 'dashboard-index.html';
        });
    })
    .catch((error) => {
      showMessage('Facebook Sign-in Failed: ' + error.message, 'signInMessage');
    });
});




