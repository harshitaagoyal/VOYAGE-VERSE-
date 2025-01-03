import { saveWishlistItem, getUserWishlist, deleteWishlistItem, updateWishlistItemStatus, getCurrentUserId }
    from './firebase-config.js';

const wishlist = document.getElementById("wishlist");
const countryInput = document.getElementById("countryInput");
const addButton = document.getElementById("addButton");
const filterButtons = document.querySelectorAll(".filter-btn");

const countryCategories = {
    beaches: ["Maldives", "Hawaii", "Goa", "Bahamas", "Bali"],
    mountains: ["Switzerland", "Nepal", "Bhutan", "Colorado", "Rocky Mountains"],
    family: ["Disneyland", "Singapore", "London", "Tokyo", "Sydney"],
    couple: ["Paris", "Venice", "Santorini", "Prague", "Kyoto"],
    "pets-allowed": ["Amsterdam", "Berlin", "Austin", "Seattle", "Portland"],
    "pets-not-allowed": ["Dubai", "Beijing", "Moscow", "Riyadh", "Cairo"],
};

let userWishlist = [];
let originalWishlist = [];
let currentUserId = null;

async function initializeApp() {
    try {
        currentUserId = await getCurrentUserId();
        if (currentUserId) {
            await loadWishlist();
            enableWishlistUI();
        } else {
            disableWishlistUI();
            console.log("No user is currently logged in");
        }
    } catch (error) {
        console.error("Error initializing app:", error);
        disableWishlistUI();
    }
}

function enableWishlistUI() {
    addButton.disabled = false;
    countryInput.disabled = false;
}

function disableWishlistUI() {
    addButton.disabled = true;
    countryInput.disabled = true;
    wishlist.innerHTML = "<p>Please access this page from the dashboard.</p>";
}

async function loadWishlist() {
    try {
        const wishlistItems = await getUserWishlist(currentUserId);
        userWishlist = wishlistItems; // Store the full items, not just country names
        originalWishlist = [...userWishlist];
        renderWishlist(userWishlist);
    } catch (error) {
        console.error("Error loading wishlist:", error);
    }
}

addButton.addEventListener("click", async function () {
    if (!currentUserId) {
        console.log("No user is currently logged in");
        return;
    }

    const countryName = countryInput.value.trim();
    if (countryName) {
        try {
            const newItem = await saveWishlistItem(currentUserId, countryName);
            userWishlist.push({
                id: newItem.id,
                country: countryName,
                completed: false
            });
            originalWishlist = [...userWishlist];
            renderWishlist(userWishlist);
            countryInput.value = "";
        } catch (error) {
            console.error("Error saving wishlist item:", error);
        }
    }
});

function renderWishlist(items) {
    wishlist.innerHTML = "";
    items.forEach((item) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        checkbox.checked = item.completed || false;

        if (item.completed) {
            li.classList.add("completed");
        }

        checkbox.addEventListener("change", async function () {
            try {
                await updateWishlistItemStatus(item.id, checkbox.checked);
                item.completed = checkbox.checked;
                if (checkbox.checked) {
                    li.classList.add("completed");
                } else {
                    li.classList.remove("completed");
                }
            } catch (error) {
                console.error("Error updating status:", error);
                // Revert checkbox state if update fails
                checkbox.checked = !checkbox.checked;
            }
        });

        const text = document.createTextNode(item.country);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", async function () {
            try {
                await deleteWishlistItem(item.id);
                userWishlist = userWishlist.filter((wishlistItem) => wishlistItem.id !== item.id);
                originalWishlist = [...userWishlist];
                renderWishlist(userWishlist);
            } catch (error) {
                console.error("Error deleting item:", error);
            }
        });

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(deleteBtn);
        wishlist.appendChild(li);
    });
}

filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const filter = button.getAttribute("data-filter");
        const filteredItems = originalWishlist.filter((item) =>
            countryCategories[filter]?.includes(item.country)
        );
        renderWishlist(filteredItems);
    });
});

document.body.addEventListener("click", function (e) {
    if (!e.target.matches(".filter-btn")) {
        renderWishlist(originalWishlist);
    }
});

document.addEventListener('DOMContentLoaded', initializeApp);


