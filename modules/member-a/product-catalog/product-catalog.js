console.log("JS FILE LOADED");

// =======================
// CONFIG
// =======================
const selectedFarm = localStorage.getItem("selectedFarm");

// Apps Script URL
const url = "https://script.google.com/macros/s/AKfycbxbGh0dJIUUQPPyr3g_nD3SZEaqBSfJevDyIOgcr2rRVygpq5y6T3Amni995cqh_dbzeA/exec";
// =======================
// STATE
// =======================
let allProducts = [];
let currentPage = 1;
const itemsPerPage = 8;

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {

    // ✅ ambil nama farm dari localStorage
    const farmName = localStorage.getItem("selectedFarmName");

    const productTitle = document.getElementById("productTitle");

    if (productTitle) {
        productTitle.innerText = "Product From " + (farmName || "");
    }

    // existing function
    loadFarmInfo();
    loadProducts();

});


// =======================
// UPDATE INFO GRID
// =======================
function updateInfoGrid(products) {

    const productCount = document.querySelector(".info-card:nth-child(2) h4");
    const rating = document.querySelector(".info-card:nth-child(3) h4");
    const followers = document.querySelector(".info-card:nth-child(4) h4");

    if (productCount) productCount.innerText = products.length;
    if (rating) rating.innerText = "4.8 ⭐";
    if (followers) followers.innerText = "120";
}


// =======================
// FETCH DATA
// =======================
function loadProducts() {

    fetch(url + "?action=products")
        .then(res => res.json())
        .then(data => {

            console.log("RAW DATA:", data);

            const products = data.data; // ✔ ambil array sebenar

            // FILTER BY FARM ID
            // allProducts = products.filter(p => p.farmId === selectedFarm);
            allProducts = selectedFarm
             ? products.filter(p => p.farmId === selectedFarm)
             : products;

            console.log("FILTERED:", allProducts);

            // UPDATE INFO GRID
            updateInfoGrid(allProducts);

            currentPage = 1;

            renderProducts();
            renderPagination();
        })
        .catch(err => {
            console.error("Fetch error:", err);
        });
}


function loadFarmInfo() {
    fetch(url + "?action=marketplace")
        .then(res => res.json())
        .then(data => {
            const farms = data.data || [];

            const farm = farms.find(f =>
                String(f.farmId).trim() === String(selectedFarm).trim()
            );

            if (!farm) {
                console.log("Farm not found");
                return;
            }

            document.getElementById("farmTitle").innerText = farm.name || selectedFarm;
            document.querySelector(".farm-location").innerText =
                farm.location || "-";

            document.querySelector(".farm-desc").innerText =
                farm.description || "No description available.";

            const farmLogo = document.querySelector(".farm-logo img");
            if (farmLogo) {
                farmLogo.src = farm.image || "../../../assets/images/farm-logo.png";
            }
        })
        .catch(err => console.error("Farm info error:", err));
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

        card.innerHTML = `
            <img src="${p.image || '../../../assets/images/placeholder.png'}" class="product-img">
            <h3>${p.productName}</h3>
            <p>RM ${parseFloat(p.price).toFixed(2)} / ${p.unit || "kg"}</p>
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
                <img src="${product.image}" class="detail-img">
            </div>

            <div class="detail-info">
            
            <span class="close-btn" onclick="closeDetail()">✖</span>
            
            <h1>${product.productName}</h1>
                

                <p><b>Category:</b> ${product.category}</p>
                <p><b>Quantity:</b> ${product.quantity}</p>
                <p><b>Price:</b> RM ${parseFloat(product.price).toFixed(2)} / ${product.unit || "kg"}</p>
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