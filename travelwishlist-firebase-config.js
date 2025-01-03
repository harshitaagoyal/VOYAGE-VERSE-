
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc }
    from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';


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
const db = getFirestore(app);
const auth = getAuth(app);


export function getCurrentUserId() {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user ? user.uid : null);
        });
    });
}


export async function saveWishlistItem(userId, country) {
    try {
        const docRef = await addDoc(collection(db, "wishlists"), {
            userId: userId,
            country: country,
            completed: false,
            createdAt: new Date()
        });
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
}


export async function getUserWishlist(userId) {
    try {
        const q = query(collection(db, "wishlists"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const wishlist = [];
        querySnapshot.forEach((doc) => {
            wishlist.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return wishlist;
    } catch (error) {
        console.error("Error getting wishlist: ", error);
        throw error;
    }
}


export async function deleteWishlistItem(documentId) {
    try {
        await deleteDoc(doc(db, "wishlists", documentId));
        console.log("Document successfully deleted");
    } catch (error) {
        console.error("Error removing document: ", error);
        throw error;
    }
}


export async function updateWishlistItemStatus(documentId, completed) {
    try {
        await updateDoc(doc(db, "wishlists", documentId), {
            completed: completed
        });
        console.log("Document successfully updated");
    } catch (error) {
        console.error("Error updating document: ", error);
        throw error;
    }
}