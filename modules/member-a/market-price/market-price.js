console.log("PRICE COMPARISON JS LOADED");

// =======================
// CONFIG
// =======================
const url = "https://script.google.com/macros/s/AKfycbxbGh0dJIUUQPPyr3g_nD3SZEaqBSfJevDyIOgcr2rRVygpq5y6T3Amni995cqh_dbzeA/exec";

let marketChart = null;
let allProducts = [];
let allFarms = [];
let allMarketPrices = [];

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {

    console.log("JS LOADED");

    const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
    const openPage = localStorage.getItem("openPage");

    loadMarketOverview();

    // 🔥 KEY FIX
    if (selectedProduct) {
        showPage("comparison");
    } else if (openPage === "comparison") {
        showPage("comparison");
        localStorage.removeItem("openPage");
    } else {
        showPage("marketplace");
    }

    loadComparisonData(selectedProduct);
});

function loadComparisonData(selectedProduct) {

    Promise.all([
        fetch(url + "?action=products").then(res => res.json()),
        fetch(url + "?action=marketplace").then(res => res.json()),
        fetch(url + "?action=marketprice").then(res => res.json())
    ])
    .then(([productsRes, farmsRes, marketRes]) => {

        allProducts = productsRes.data || [];
        allFarms = farmsRes.data || [];
        allMarketPrices = marketRes.data || [];

        populateProductDropdown(selectedProduct);

        if (selectedProduct) {
            updateComparison(selectedProduct.productId);
        } else if (allProducts.length > 0) {
            updateComparison(allProducts[0].productId);
        }
    })
    .catch(err => console.error("Comparison data error:", err));
}

function populateProductDropdown(selectedProduct) {
    const select = document.getElementById("productSelect");
    if (!select) return;

    select.innerHTML = "";

    const uniqueProducts = [];
    const seen = new Set();

    allProducts.forEach(p => {
        if (!seen.has(p.productId)) {
            seen.add(p.productId);
            uniqueProducts.push(p);
        }
    });

    uniqueProducts.forEach(p => {
        const option = document.createElement("option");
        option.value = p.productId;
        option.textContent = p.productName;
        select.appendChild(option);
    });

    if (selectedProduct) {
        select.value = selectedProduct.productId;
    }

    select.onchange = () => {
        updateComparison(select.value);
    };
}

function updateComparison(productId) {
    const product = allProducts.find(p =>
        String(p.productId).trim() === String(productId).trim()
    );

    if (!product) return;

    localStorage.setItem("selectedProduct", JSON.stringify(product));

    renderSelectedProduct(product);

    const market = allMarketPrices.find(m =>
        String(m.productId).trim() === String(product.productId).trim()
    );

    if (market) {
        calculateComparison(product, market);
    }

    renderProducerListFromData(product);
}


// =======================
// RENDER SELECTED PRODUCT
// =======================
function renderSelectedProduct(p) {
    document.getElementById("selectedImage").src =
        p.image || "https://via.placeholder.com/300x200?text=No+Image";

    const productSelect = document.getElementById("productSelect");
    if (productSelect) {
        productSelect.value = p.productId;
    }

    document.getElementById("selectedUnit").textContent =
        "Unit: " + (p.unit || "kg");
}


// =======================
// FETCH MARKET DATA FOR COMPARISON
// =======================
function fetchMarketData(product) {

    fetch(url + "?action=marketprice")
        .then(res => res.json())
        .then(res => {

            const list = res.data || [];

            const match = list.find(item =>
                String(item.productId).trim() === String(product.productId).trim()
            );

            if (!match) {
                console.log("No market price found");
                return;
            }

            calculateComparison(product, match);
        })
        .catch(err => console.error("API error:", err));
}


// =======================
// COMPARE LOGIC
// =======================
function calculateComparison(product, market) {
    const farmPrice = parseFloat(product.price) || 0;
    const marketAvg = parseFloat(market.avgPrice) || 0;
    const diff = farmPrice - marketAvg;
    const absDiff = Math.abs(diff);
    const unit = product.unit || "kg";

    document.getElementById("avgProducer").textContent =
        "RM" + farmPrice.toFixed(2);

    document.getElementById("avgMarket").textContent =
        "RM" + marketAvg.toFixed(2);

    document.getElementById("producerUnit").textContent =
        "(" + unit + ")";

    document.getElementById("marketUnit").textContent =
        "(" + unit + ")";

    document.getElementById("avgDiff").textContent =
        "RM" + absDiff.toFixed(2);

    const statusBadge = document.getElementById("statusBadge");
    const savingText = document.getElementById("savingText");

    if (diff < 0) {
        const percent = marketAvg ? ((absDiff / marketAvg) * 100).toFixed(2) : "0.00";
        statusBadge.textContent = "Cheaper than market";
        savingText.textContent = "You're saving " + percent + "% compared to the market price.";
    } else if (diff > 0) {
        const percent = marketAvg ? ((absDiff / marketAvg) * 100).toFixed(2) : "0.00";
        statusBadge.textContent = "Higher than market";
        savingText.textContent = "This price is " + percent + "% higher than the market price.";
    } else {
        statusBadge.textContent = "Same as market";
        savingText.textContent = "This price is the same as the market price.";
    }
}

// =======================
// PRODUCER LIST
// =======================
function renderProducerListFromData(product) {
    const filtered = allProducts.filter(p =>
        String(p.productId).trim() === String(product.productId).trim()
    );

    const container = document.getElementById("producerList");
    if (!container) return;

    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = "<p>No producer found</p>";
        return;
    }

    filtered.forEach(item => {
        const farm = allFarms.find(f =>
            String(f.farmId).trim() === String(item.farmId).trim()
        );

        const farmName = farm ? farm.name : "Unknown Farm";

        const div = document.createElement("div");
        div.className = "producer-item";

        div.innerHTML = `
            <div class="producer-left">
                <img src="${farm?.image || '../assets/images/placeholder.png'}">

                <div>
                    <div class="producer-name">${farmName}</div>
                    <small>${item.farmId}</small>
                </div>
            </div>

            <div class="producer-price">
                RM ${parseFloat(item.price).toFixed(2)}
            </div>
        `;

        container.appendChild(div);
    });
}


function renderMarketTable(data, products) {

    const tbody = document.getElementById("marketTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(item => {

        const product = products.find(p =>
            String(p.productId).trim() === String(item.productId).trim()
        );

        const productName = product ? product.productName : item.productId;
        const change = parseFloat(item.changePercent) || 0;

        let changeClass = "trend-flat";
        let trendIcon = "—";

        if (change > 0) {
            changeClass = "change-up";
            trendIcon = "↗";
        } else if (change < 0) {
            changeClass = "change-down";
            trendIcon = "↘";
        }

        tbody.innerHTML += `
            <tr>
                <td>${productName}</td>
                <td>RM ${parseFloat(item.avgPrice).toFixed(2)}</td>
                <td class="${changeClass}">
                    ${change >= 0 ? "+" : ""}${change.toFixed(2)}%
                </td>
                <td class="${changeClass}">${trendIcon}</td>
            </tr>
        `;
    });
}


// =======================
// TREND CHART
// =======================
function populateTrendDropdown(marketData, products) {

    const select = document.getElementById("trendProductSelect");
    if (!select) return;

    select.innerHTML = "";

    marketData.forEach(item => {

        const product = products.find(p =>
            String(p.productId).trim() === String(item.productId).trim()
        );

        const option = document.createElement("option");
        option.value = item.productId;
        option.textContent = product ? product.productName : item.productId;

        select.appendChild(option);
    });

    select.onchange = updateTrendChart;

    updateTrendChart();
}


function updateTrendChart() {

    const select = document.getElementById("trendProductSelect");
    const canvas = document.getElementById("priceTrendChart");

    if (!select || !canvas || !select.value) return;

    const productId = select.value;

    fetch(url + "?action=markethistory&productId=" + productId)
        .then(res => res.json())
        .then(res => {

            console.log("HISTORY DATA:", res);

            const history = res.data || [];

            if (!history.length) {
                console.log("No history data found");
                return;
            }

            const labels = history.map(item => item.date);
            const prices = history.map(item => parseFloat(item.price));

            if (marketChart) {
                marketChart.destroy();
            }

            marketChart = new Chart(canvas, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        data: prices,
                        borderColor: "#2e7d32",
                        backgroundColor: "rgba(46, 125, 50, 0.12)",
                        borderWidth: 2,
                        fill: true,
                        tension: 0.35,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        })
        .catch(err => console.error("Trend chart error:", err));
}


// =======================
// PAGE SWITCH
// =======================
function showPage(pageId) {

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    const page = document.getElementById(pageId);
    if (page) page.classList.add("active");

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (pageId === "marketplace") {
        document.querySelectorAll(".nav-btn")[0].classList.add("active");
    } else {
        document.querySelectorAll(".nav-btn")[1].classList.add("active");
    }
}

function loadMarketOverview() {

    Promise.all([
        fetch(url + "?action=marketprice").then(res => res.json()),
        fetch(url + "?action=products").then(res => res.json())
    ])
    .then(([marketRes, productRes]) => {

        const marketData = marketRes.data || [];
        const products = productRes.data || [];

        if (!marketData.length) {
            console.log("No market data");
            return;
        }

        // ====== OVERVIEW CARDS ======
        const totalProducts = marketData.length;

        const avgPrice = marketData.reduce((sum, item) => {
            return sum + (parseFloat(item.avgPrice) || 0);
        }, 0) / totalProducts;

        const avgChange = marketData.reduce((sum, item) => {
            return sum + (parseFloat(item.changePercent) || 0);
        }, 0) / totalProducts;

        document.getElementById("totalProducts").textContent = totalProducts;
        document.getElementById("avgPriceToday").textContent = "RM" + avgPrice.toFixed(2);
        document.getElementById("priceChange").textContent =
            (avgChange >= 0 ? "+" : "") + avgChange.toFixed(2) + "%";

        document.getElementById("lastUpdated").textContent =
            "Updated: " + (marketData[0].lastUpdated || "-");

        // ====== TABLE ======
        renderMarketTable(marketData, products);

    })
    .catch(err => console.error("Market overview error:", err));
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