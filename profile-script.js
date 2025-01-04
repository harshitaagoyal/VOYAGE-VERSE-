import { auth, db } from './profile-firebaseConfig.js';
import { onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";


const storage = getStorage();

const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const profilePic = document.getElementById('profilePic');
const uploadPic = document.getElementById('uploadPic');


async function showProfilePage() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            try {
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    userName.textContent = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "No Name Provided";
                    profilePic.src = userData.photoURL || "default-avatar.png";
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
            userEmail.textContent = user.email || "No Email Provided";
        } else {
            window.location.href = 'index.html';
        }
    });
}


async function uploadProfilePicture() {
    const file = uploadPic.files[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) return;

    try {

        const storageRef = ref(storage, `profile-pictures/${user.uid}/${file.name}`);


        const snapshot = await uploadBytes(storageRef, file);


        const downloadURL = await getDownloadURL(snapshot.ref);


        await updateProfile(user, {
            photoURL: downloadURL
        });


        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            photoURL: downloadURL
        });


        profilePic.src = downloadURL;

        alert("Profile picture updated successfully!");
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload profile picture. Please try again.");
    }
}


async function editProfile() {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();


    const firstName = prompt("Enter first name:", userData.firstName || "");
    const lastName = prompt("Enter last name:", userData.lastName || "");

    if (firstName === null || lastName === null) return;

    try {

        await updateDoc(userRef, {
            firstName: firstName.trim(),
            lastName: lastName.trim()
        });


        userName.textContent = `${firstName} ${lastName}`.trim();
        alert("Profile updated successfully!");
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
    }
}


document.addEventListener('DOMContentLoaded', showProfilePage);


window.uploadProfilePicture = uploadProfilePicture;
window.editProfile = editProfile;

export { showProfilePage, uploadProfilePicture, editProfile };


