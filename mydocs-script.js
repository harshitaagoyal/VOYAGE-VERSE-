
import { uploadFile, loadFiles, deleteFile } from './firebase-storage.js';

console.log("Script loading");

function createFileElement(category, { fileName, fileUrl, docId }) {
    console.log("Creating file element:", { category, fileName, fileUrl, docId });

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
            console.log("Attempting to delete file:", { category, fileName, docId });
            await deleteFile(category, fileName, docId);
            console.log("File deleted successfully");
            fileDiv.remove();
        } catch (error) {
            console.error("Delete error:", error);
            alert(`Error deleting file: ${error.message}`);
        }
    };

    fileDiv.appendChild(fileLink);
    fileDiv.appendChild(deleteButton);

    console.log("File element created successfully");
    return fileDiv;
}

async function handleFileUpload(button, category) {
    console.log("Handling file upload for category:", category);
    const fileInput = document.getElementById(`${category}Input`);
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first");
        return;
    }

    try {

        button.disabled = true;
        button.textContent = "Uploading...";
        console.log("Starting upload process for:", file.name);

        const fileData = await uploadFile(category, file);
        console.log("Upload successful. File data:", fileData);


        const fileElement = createFileElement(category, fileData);
        const listContainer = document.getElementById(`${category}List`);
        listContainer.appendChild(fileElement);


        fileInput.value = '';
        console.log("File element added to list successfully");

    } catch (error) {
        console.error("Upload process failed:", error);
        alert(`Error uploading file: ${error.message}`);
    } finally {

        button.disabled = false;
        button.textContent = "Add File";
    }
}

async function loadExistingFiles(category) {
    console.log(`Loading existing files for category: ${category}`);
    try {
        const files = await loadFiles(category);
        console.log(`Retrieved ${files.length} files for ${category}:`, files);

        const listContainer = document.getElementById(`${category}List`);
        files.forEach(fileData => {
            try {
                const fileElement = createFileElement(category, fileData);
                listContainer.appendChild(fileElement);
            } catch (error) {
                console.error(`Error creating element for file: ${fileData.fileName}`, error);
            }
        });
        console.log(`Successfully loaded files for ${category}`);
    } catch (error) {
        console.error(`Error loading files for ${category}:`, error);
    }
}

function initializeEventListeners() {
    console.log("Initializing event listeners");
    document.querySelectorAll('.add-file-btn').forEach(button => {
        const category = button.dataset.category;
        console.log(`Setting up button for category: ${category}`);

        button.addEventListener('click', () => handleFileUpload(button, category));
    });
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded - initializing application");


    initializeEventListeners();


    ['travelDocs', 'hotelBookings', 'otherBookings'].forEach(category => {
        loadExistingFiles(category);
    });

    console.log("Application initialization complete");
});


window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
});


window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

