const UNSPLASH_ACCESS_KEY = "z7ZWrFMcAW_DZIwnf2VdRIXkqm-xOfmmAWBpZZ--m3A";
const WEATHER_API_KEY = "93d9bb8ea3869a8dbb9ffffefec245b"
const TIMEZONE_API_KEY = "RE51E3HMNB80"


function getQueryParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}



async function fetchTime(query) {
    const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${TIMEZONE_API_KEY}&format=json&by=zone&zone=${query}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Time data not found.");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


function updateDynamicContent(html) {
    const dynamicContent = document.getElementById("dynamic-content");
    dynamicContent.innerHTML = html;
}


async function displayTime(query) {
    const timeData = await fetchTime(query);
    if (!timeData) {
        updateDynamicContent("<p>Unable to fetch time data.</p>");
        return;
    }
    const content = `
        <h2>Local Time</h2>
        <p>Current Time: ${timeData.formatted}</p>
    `;
    updateDynamicContent(content);
}


function displayReviews() {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    if (reviews.length === 0) {
        updateDynamicContent("<p>No reviews yet. Add one below!</p>");
        return;
    }
    const content = reviews.map(review => `
        <div>
            <strong>${review.name}</strong>: ${review.text}
        </div>
    `).join("");
    updateDynamicContent(content);
}


function addReviewForm() {
    const content = `
        <h2>Add Your Review</h2>
        <input type="text" id="review-name" placeholder="Your Name"><br><br>
        <textarea id="review-text" placeholder="Your Review"></textarea><br><br>
        <label for="review-image">Upload an Image:</label>
        <input type="file" id="review-image" accept="image/*"><br><br>
        <button id="submit-review">Submit</button>
        <div id="uploaded-image-preview" style="margin-top: 20px;"></div>
    `;
    updateDynamicContent(content);

    const imageInput = document.getElementById("review-image");
    const previewContainer = document.getElementById("uploaded-image-preview");

    imageInput.addEventListener("change", () => {
        const files = imageInput.files;
        if (files.length > 6) {
            alert("You can upload a maximum of 6 images.");
            imageInput.value = "";
            previewContainer.innerHTML = "";
            return;
        }

        previewContainer.innerHTML = "";
        Array.from(files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.alt = `Uploaded Image ${index + 1}`;
                img.style.maxWidth = "100px";
                img.style.height = "auto";
                img.style.margin = "5px";
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    document.getElementById("submit-review").addEventListener("click", () => {
        const name = document.getElementById("review-name").value;
        const text = document.getElementById("review-text").value;
        const files = imageInput.files;
        if (!name || !text) {
            alert("Please fill in both fields.");
            return;
        }

        if (files.length > 6) {
            alert("You can upload a maximum of 6 images.");
            return;
        }

        const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
        const reviewData = { name, text, images: [] };

        if (files.length > 0) {
            let imagesProcessed = 0;

            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    reviewData.images.push(e.target.result);
                    imagesProcessed++;


                    if (imagesProcessed === files.length) {
                        reviews.push(reviewData);
                        localStorage.setItem("reviews", JSON.stringify(reviews));
                        alert("Review added successfully!");
                        displayReviews();
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            reviews.push(reviewData);
            localStorage.setItem("reviews", JSON.stringify(reviews));
            alert("Review added successfully!");
            displayReviews();
        }
    });
}


function displayReviews() {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    if (reviews.length === 0) {
        updateDynamicContent("<p>No reviews yet. Add one below!</p>");
        return;
    }
    const content = reviews
        .map(
            (review, index) => `
            <div class="review-card">
                <strong>${review.name}</strong>: ${review.text}
                <div class="review-images">
                    ${review.images && review.images.length
                    ? review.images


                        .map(
                            (img) =>
                                `<img src="${img}" alt="Review Image" style="max-width: 100px; height: auto; margin: 5px;">`
                        )
                        .join("")
                    : ""
                }
                </div>
                <button class="delete-review-button" data-index="${index}">Delete Review</button>
            </div>
        `
        )
        .join("");
    updateDynamicContent(content);


    document.querySelectorAll(".delete-review-button").forEach((button) => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            deleteReview(index);
        });
    });
}


function deleteReview(index) {
    const reviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    reviews.splice(index, 1);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    alert("Review deleted successfully!");
    displayReviews();
}



function setupActions(query) {

    document.getElementById("time-btn").addEventListener("click", () => displayTime(query));

    document.getElementById("reviews-btn").addEventListener("click", displayReviews);
    document.getElementById("add-review-btn").addEventListener("click", addReviewForm);
}


async function fetchAndDisplayImages(query) {
    const resultsContainer = document.getElementById("results-container");
    const resultsTitle = document.getElementById("results-title");

    resultsTitle.innerText = `Results for "${query}"`;

    const apiUrl = `https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${UNSPLASH_ACCESS_KEY}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch images.");

        const data = await response.json();

        resultsContainer.innerHTML = "";

        if (data.results.length === 0) {
            resultsContainer.innerHTML = "<p>No images found.</p>";
            return;
        }

        data.results.forEach((image) => {
            const imgElement = document.createElement("img");
            imgElement.src = image.urls.small;
            imgElement.alt = image.alt_description || "Unsplash Image";
            resultsContainer.appendChild(imgElement);
        });
    } catch (error) {
        console.error("Error fetching images:", error);
        resultsContainer.innerHTML = "<p>Something went wrong. Try again later.</p>";
    }
}



if (document.getElementById("search-btn")) {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (query) {
            localStorage.setItem("currentSearchQuery", query);
            window.location.href = `dashboard-results.html?query=${encodeURIComponent(query)}`;
        } else {
            alert("Please enter a destination to search!");
        }
    });
}

const query = getQueryParameter("query");
if (query) {
    fetchAndDisplayImages(query);
    setupActions(query);
    updateDynamicContent(`<p>Showing results for: <strong>${query}</strong></p>`);

}

