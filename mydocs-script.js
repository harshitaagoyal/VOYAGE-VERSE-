import { uploadFile, loadFiles, deleteFile } from './mydocs-cloudinary-storage.js';

function createFileElement(category, { fileName, fileUrl, publicId }) {
    const fileDiv = document.createElement("div");
    fileDiv.classList.add("file-item");

    const fileLink = document.createElement("a");
    fileLink.href = fileUrl;
    fileLink.target = "_blank";
    fileLink.textContent = fileName;
    fileLink.classList.add("file-link");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove";
    deleteButton.classList.add("delete-btn");

    deleteButton.onclick = async () => {
        try {
            await deleteFile(category, publicId);
            fileDiv.remove();
        } catch (error) {
            console.error("Delete error:", error);
            alert(`Error deleting file: ${error.message}`);
        }
    };

    fileDiv.appendChild(fileLink);
    fileDiv.appendChild(deleteButton);
    return fileDiv;
}

async function handleFileUpload(button, category) {
    const fileInput = document.getElementById(`${category}Input`);
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first");
        return;
    }

    try {
        button.disabled = true;
        button.textContent = "Uploading...";

        const fileData = await uploadFile(category, file);
        const fileElement = createFileElement(category, fileData);
        const listContainer = document.getElementById(`${category}List`);
        listContainer.appendChild(fileElement);

        fileInput.value = '';
    } catch (error) {
        console.error("Upload process failed:", error);
        alert(`Error uploading file: ${error.message}`);
    } finally {
        button.disabled = false;
        button.textContent = "Add File";
    }
}

function loadExistingFiles(category) {
    const files = loadFiles(category);
    const listContainer = document.getElementById(`${category}List`);

    files.forEach(fileData => {
        const fileElement = createFileElement(category, fileData);
        listContainer.appendChild(fileElement);
    });
}

function initializeEventListeners() {
    document.querySelectorAll('.add-file-btn').forEach(button => {
        const category = button.dataset.category;
        button.addEventListener('click', () => handleFileUpload(button, category));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    ['travelDocs', 'hotelBookings', 'otherBookings'].forEach(category => {
        loadExistingFiles(category);
    });
});

