import { auth, db } from './profile-firebaseConfig.js';
import { onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const profilePic = document.getElementById('profilePic');

// Cloudinary configuration
const cloudinaryWidget = cloudinary.createUploadWidget(
    {
        cloudName: 'dtwbilva0', // Replace with your Cloudinary cloud name
        uploadPreset: 'voyage verse', // Replace with your upload preset
        sources: ['local', 'camera'],
        multiple: false,
        maxFiles: 1,
        cropping: true,
        styles: {
            palette: {
                window: "#FFFFFF",
                windowBorder: "#90A0B3",
                tabIcon: "#0078FF",
                menuIcons: "#5A616A",
                textDark: "#000000",
                textLight: "#FFFFFF",
                link: "#0078FF",
                action: "#FF620C",
                inactiveTabIcon: "#0E2F5A",
                error: "#F44235",
                inProgress: "#0078FF",
                complete: "#20B832",
                sourceBg: "#E4EBF1"
            }
        }
    },
    async (error, result) => {
        if (!error && result && result.event === "success") {
            const imageUrl = result.info.secure_url;
            const user = auth.currentUser;

            try {
                // Update Firebase Auth profile
                await updateProfile(user, {
                    photoURL: imageUrl
                });

                // Update Firestore document
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    photoURL: imageUrl
                });

                // Update UI
                profilePic.src = imageUrl;
                alert("Profile picture updated successfully!");
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("Failed to update profile picture. Please try again.");
            }
        }
    }
);

// Add click event listener to upload button
document.getElementById('upload_widget').addEventListener('click', () => {
    cloudinaryWidget.open();
});

async function showProfilePage() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            try {
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    userName.textContent = `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "No Name Provided";
                    if (userData.photoURL) {
                        profilePic.src = userData.photoURL;
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
            userEmail.textContent = user.email || "No Email Provided";
        } else {
            window.location.href = '../index.html';
        }
    });
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
window.editProfile = editProfile;




