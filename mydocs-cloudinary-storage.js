import { cloudinaryConfig } from './mydocs-cloudinary-config.js';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`;

export async function uploadFile(category, file) {
    if (!file) {
        throw new Error("No file selected");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('folder', category);

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();

        const files = JSON.parse(localStorage.getItem(category) || '[]');
        const fileData = {
            fileName: file.name,
            fileUrl: data.secure_url,
            publicId: data.public_id,
            uploadDate: new Date().toISOString()
        };
        files.push(fileData);
        localStorage.setItem(category, JSON.stringify(files));

        return fileData;
    } catch (error) {
        console.error("Upload process failed:", error);
        throw error;
    }
}

export function loadFiles(category) {
    const files = JSON.parse(localStorage.getItem(category) || '[]');
    return files;
}

export async function deleteFile(category, publicId) {
    const files = JSON.parse(localStorage.getItem(category) || '[]');
    const updatedFiles = files.filter(file => file.publicId !== publicId);
    localStorage.setItem(category, JSON.stringify(updatedFiles));
}