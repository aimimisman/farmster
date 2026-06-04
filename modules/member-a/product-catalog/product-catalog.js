console.log("JS FILE LOADED");

// =======================
// CONFIG
// =======================
const selectedFarm = localStorage.getItem("selectedFarm");

const url = "https://script.google.com/macros/s/AKfycbythF64y6uKVZxgPq7YvkmQph9Z2ty2_2doXm3DoJzHMNH49bd6ieO2XmzHHvu6A8s-1A/exec";

// =======================  
// STATE
// =======================
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 8;
let currentFarmer = null;

const loading = document.getElementById("loading");
const productContainer = document.getElementById("productContainer");

function showLoading() {
    loading.style.display = "block";
    productContainer.style.display = "none";
}

function hideLoading() {
    loading.style.display = "none";
    productContainer.style.display = "grid";
}

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {

    const farmName = localStorage.getItem("selectedFarmName");

    const productTitle = document.getElementById("productTitle");

    if (productTitle) {
        productTitle.innerText = "Product From " + (farmName || "");
    }

    loadFarmInfo();
    loadProducts();
});

// =======================
// UPDATE INFO GRID
// =======================
function updateInfoGrid(products) {

    const productCount = document.getElementById("productCount");
    const rating = document.getElementById("ratingValue");
    const followers = document.getElementById("followersValue");
    const joined = document.getElementById("joinedValue");

    if (productCount) productCount.innerText = products.length;
    if (rating) rating.innerText = "4.8 ⭐";
    if (followers) followers.innerText = "120";

    // 🔥 SAFE JOIN DATE
    if (joined) {

        const raw = currentFarmer?.createdAt;

        if (raw) {
            const d = new Date(raw);

            if (!isNaN(d.getTime())) {
                joined.innerText = d.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                });
            } else {
                joined.innerText = "-";
            }
        } else {
            joined.innerText = "-";
        }
    }
}

// =======================
// FETCH PRODUCTS
// =======================

showLoading();

function loadProducts() {

    fetch(url + "?action=products")
        .then(res => res.json())
        .then(data => {

            const products = data.data || [];

            allProducts = selectedFarm
                ? products.filter(p => p.farmId === selectedFarm)
                : products;

            updateInfoGrid(allProducts);

            currentPage = 1;
            renderProducts();
            renderPagination();

            hideLoading(); // 
        })
        .catch(err => {
            console.error(err);
            hideLoading(); // 
        });
}

// =======================
// FARM INFO
// =======================
function loadFarmInfo() {

    Promise.all([
        fetch(url + "?action=marketplace").then(res => res.json()),
        fetch(url + "?action=dataprofile").then(res => res.json())
    ])

    .then(([marketRes, profileRes]) => {

        const farms = marketRes.data || [];
        const profiles = profileRes.data || [];

        const farm = farms.find(f =>
            String(f.farmId || "").trim() === String(selectedFarm || "").trim()
        );

        if (!farm) return;

        document.getElementById("farmTitle").innerText = farm.name || "-";
        document.querySelector(".farm-location").innerHTML = `📍 ${farm.location || "-"}`;
        document.querySelector(".farm-desc").innerHTML = `📝 ${farm.description || "-"}`;

        const farmLogo = document.querySelector(".farm-logo img");
        if (farmLogo) farmLogo.src = farm.image || "";

        // 🔥 SET FARMER FIRST
        currentFarmer = profiles.find(p =>
            String(p.farmId || "").trim() === String(selectedFarm || "").trim()
        );

        const contactEl = document.querySelector(".contact-no");
        const ownerEl = document.querySelector(".owner-name");

        if (currentFarmer) {
            if (contactEl) contactEl.innerText = "📞 " + (currentFarmer.contact || "-");
            if (ownerEl) ownerEl.innerText = "👨‍🌾 " + `${currentFarmer.firstname || ""} ${currentFarmer.lastname || ""}`;
        }

        // 🔥 NOW SAFE TO UPDATE GRID
        updateInfoGrid(allProducts);
        

    })
    .catch(err => console.error(err));
}

// =======================
// RENDER PRODUCTS
// =======================
function renderProducts() {

    const container = document.getElementById("productContainer");
    container.innerHTML = "";

    if (!allProducts.length) {
        container.innerHTML = "<p>No products found for this farm</p>";
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const paginatedItems = allProducts.slice(start, end);

    paginatedItems.forEach(p => {

        const card = document.createElement("div");
        card.className = "card";

        const imageUrl =
    p.image && p.image.trim() !== ""
    ? p.image
    : "https://via.placeholder.com/300x200?text=No+Image";

card.innerHTML = `
    <img src="${imageUrl}"
         class="product-img"
         onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200?text=No+Image';">

    <h3>${p.productName}</h3>

    <p>
        <b>Price:</b>
        RM ${parseFloat(p.price || 0).toFixed(2)}
        ${p.unit ? '/ ' + p.unit : ''}
    </p>

    <button class="detailBtn">View Detail</button>
`;

        // ONLY BUTTON CLICK (SAFE)
        card.querySelector(".detailBtn").addEventListener("click", (e) => {
            e.stopPropagation();

            viewProductDetail(p);

            setTimeout(() => {
                document.getElementById("productDetail")
                    .scrollIntoView({ behavior: "smooth", block: "start" });
            }, 50);
        });

        container.appendChild(card);
    });
}


// =======================
// PAGINATION
// =======================
function renderPagination() {

    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const pageCount = Math.ceil(allProducts.length / itemsPerPage);

    // PREV
    const prev = document.createElement("button");
    prev.innerText = "Prev";
    prev.disabled = currentPage === 1;

    prev.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
            renderPagination();
        }
    };

    pagination.appendChild(prev);

    // PAGE NUMBERS
    for (let i = 1; i <= pageCount; i++) {

        const btn = document.createElement("button");
        btn.innerText = i;

        if (i === currentPage) {
            btn.style.background = "#2e7d32";
            btn.style.color = "white";
        }

        btn.onclick = () => {
            currentPage = i;
            renderProducts();
            renderPagination();
        };

        pagination.appendChild(btn);
    }

    // NEXT
    const next = document.createElement("button");
    next.innerText = "Next";
    next.disabled = currentPage === pageCount;

    next.onclick = () => {
        if (currentPage < pageCount) {
            currentPage++;
            renderProducts();
            renderPagination();
        }
    };

    pagination.appendChild(next);
}


// =======================
// PRODUCT DETAIL
// =======================
function viewProductDetail(product) {

    const detail = document.getElementById("productDetail");

    detail.classList.remove("hidden");

    detail.innerHTML = `
        <div class="detail-wrapper">

            <div class="img-box">
                <img src="${product.image || 'https://via.placeholder.com/400x300?text=No+Image'}"
     class="detail-img"
     onerror="this.onerror=null;this.src='https://via.placeholder.com/400x300?text=No+Image';">
            </div>

            <div class="detail-info">
            
            <span class="close-btn" onclick="closeDetail()">✖</span>
            
            <h1>${product.productName}</h1>
                

                <p><b>Category:</b> ${product.category}</p>
                <p><b>Quantity:</b> ${product.quantity}</p>
                <p><b>Price:</b> RM ${parseFloat(product.price).toFixed(2)} ${product.unit ? '/ ' + product.unit : ''}</p>
                <p><b>Farm ID:</b> ${product.farmId}</p>

                <p class="desc">${product.description}</p>

                <div class="action-buttons">

                    <button class="compare-btn"
                        onclick='goToMarketPrice(${JSON.stringify(product)})'>
                        Compare Price
                    </button>

                    <button class="chat-btn"
                        onclick="goToChat('${product.farmId}')">
                        Chat Seller
                    </button>

                </div>

            </div>

        </div>
    `;

    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, 50);
}

function closeDetail() {
    const detail = document.getElementById("productDetail");
    detail.classList.add("hidden");
}

// =======================
// NAVIGATION
// =======================

// from kard item yang dipilih

function goToMarketPrice(product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    localStorage.setItem("openPage", "comparison");

    const BASE_URL = window.location.hostname.includes("github.io")
        ? "https://aimimisman.github.io/farmster"
        : "";

    window.location.href = BASE_URL + "/modules/member-a/market-price/market-price.html";
}

function goToChat(farmId) {
    localStorage.setItem("selectedFarm", farmId);
    window.location.href = "../chat/chat.html";
}

function goHome() {
    const BASE_URL = window.location.hostname.includes("github.io")
        ? "https://aimimisman.github.io/farmster"
        : "";

    window.location.href = BASE_URL + "/index.html";
}

function goMarketplace() {
    const BASE_URL = window.location.hostname.includes("github.io")
        ? "https://aimimisman.github.io/farmster"
        : "";

    window.location.href = BASE_URL + "/modules/member-a/marketplace/marketplace.html";
}

// from top menu
function goMarketPrice() {
    const BASE_URL = window.location.hostname.includes("github.io")
        ? "https://aimimisman.github.io/farmster"
        : "";

    window.location.href = BASE_URL + "/modules/member-a/market-price/market-price.html";
}