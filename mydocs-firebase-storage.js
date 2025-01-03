
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { storage, db } from './firebase-config.js';

export async function uploadFile(category, file) {
    console.log("Upload started", category, file);
    if (!file) {
        throw new Error("No file selected");
    }

    const storageRef = ref(storage, `${category}/${file.name}`);

    try {

        try {
            const snapshot = await uploadBytes(storageRef, file);
            console.log("File uploaded to storage successfully:", snapshot);
        } catch (uploadError) {
            console.error("Error uploading to storage:", uploadError);
            throw uploadError;
        }

        try {
            const fileUrl = await getDownloadURL(snapshot.ref);
            console.log("Download URL obtained:", fileUrl);
        } catch (urlError) {
            console.error("Error getting download URL:", urlError);
            throw urlError;
        }

        try {
            const docRef = await addDoc(collection(db, category), {
                fileName: file.name,
                fileUrl: fileUrl,
                uploadDate: new Date().toISOString()
            });
            console.log("Added to Firestore with ID:", docRef.id);
        } catch (firestoreError) {
            console.error("Error adding to Firestore:", firestoreError);
            throw firestoreError;
        }

        return {
            fileName: file.name,
            fileUrl: fileUrl,
            docId: docRef.id
        };
    } catch (error) {
        console.error("Upload process failed:", error);
        throw error;
    }
}

export async function loadFiles(category) {
    const files = [];
    const querySnapshot = await getDocs(collection(db, category));
    querySnapshot.forEach((doc) => {
        files.push({
            ...doc.data(),
            docId: doc.id
        });
    });
    return files;
}

export async function deleteFile(category, fileName, docId) {
    const storageRef = ref(storage, `${category}/${fileName}`);
    await deleteObject(storageRef);
    await deleteDoc(doc(db, category, docId));
}