const UNSPLASH_ACCESS_KEY = "z7ZWrFMcAW_DZIwnf2VdRIXkqm-xOfmmAWBpZZ--m3A";

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const country = urlParams.get("country");
    const countryTitle = document.getElementById("country-title");
    const imagesContainer = document.getElementById("images");

    countryTitle.textContent = `Images of ${country}`;

    fetchImages(country);

    function fetchImages(query) {
        fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(photo => {
                    const img = document.createElement("img");
                    img.src = photo.urls.small;
                    img.alt = query;
                    img.style.margin = "0.5rem";
                    imagesContainer.appendChild(img);
                });
            })
            .catch(error => {
                console.error("Error fetching images:", error);
                imagesContainer.innerHTML = "<p>Unable to fetch images. Please try again later.</p>";
            });
    }
});
