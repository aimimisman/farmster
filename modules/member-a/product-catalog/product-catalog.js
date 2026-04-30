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

    const farmTitle = document.getElementById("farmTitle");

    if (farmTitle) {
        farmTitle.innerText = selectedFarm || "Farm";
    }

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
            <img src="${p.image}" class="product-img">
            <h3>${p.productName}</h3>
            <p>${p.price}</p>
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

                <h1>${product.productName}</h1>

                <p><b>Category:</b> ${product.category}</p>
                <p><b>Quantity:</b> ${product.quantity}</p>
                <p><b>Price:</b> ${product.price}</p>
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
            top: detail.offsetTop,
            behavior: "smooth"
        });
    }, 50);
}


// =======================
// NAVIGATION
// =======================
function goToMarketPrice(product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    localStorage.setItem("openPage", "comparison");
    // window.location.href = "/modules/member-a/market-price/market-price.html";
    window.location.href = "https://aimimisman.github.io/farmster/modules/member-a/market-price/market-price.html";
}

function goToChat(farmId) {
    localStorage.setItem("selectedFarm", farmId);
    window.location.href = "../chat/chat.html";
}