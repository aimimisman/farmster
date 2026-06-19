console.log("PRICE COMPARISON JS LOADED");

// =======================
// CONFIG
// =======================
const url = "https://script.google.com/macros/s/AKfycbxQGdtvTVude_65_W2zb_HNSVyieVngi3dt5n4bYbjmoLUrHGGUlRIMzhTPGEVM7YyRvg/exec";

let marketChart = null;
let allProducts = [];
let allFarms = [];
let allMarketPrices = [];
let showAllMarketRows = false;
let latestMarketData = [];
let latestProductData = [];
let currentTrendProductId = null;
let currentTrendHistory = [];
let selectedProducerKey = "";


// =======================
// HELPER
// =======================
function getDataArray(response) {
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.data)) return response.data;
    if (response && response.data && Array.isArray(response.data.data)) return response.data.data;
    return [];
}

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
    console.log("JS LOADED");

    const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
    const openPage = localStorage.getItem("openPage");

    loadMarketOverview();

    if (selectedProduct) {
        showPage("comparison");
    } else if (openPage === "comparison") {
        showPage("comparison");
        localStorage.removeItem("openPage");
    } else {
        showPage("marketplace");
    }

    loadComparisonData(selectedProduct);

    document.body.style.opacity="0";

setTimeout(()=>{

document.body.style.transition=
".4s";

document.body.style.opacity="1";

},100);

});


function loadComparisonData(selectedProduct) {
    Promise.all([
        fetch(url + "?action=products").then(res => res.json()),
        fetch(url + "?action=marketplace").then(res => res.json()),
        fetch(url + "?action=marketprice").then(res => res.json())
    ])
    .then(([productsRes, farmsRes, marketRes]) => {
        allProducts = getDataArray(productsRes);
        allFarms = getDataArray(farmsRes);
        allMarketPrices = getDataArray(marketRes);

        populateCompareDropdown();

        if (selectedProduct) {
            updateComparisonBySelectedProducer(selectedProduct);
        

        } else if (allProducts.length > 0) {
            updateComparison(allProducts[0].productId);
        }
    })
    .catch(err => console.error("Comparison data error:", err));
}

function populateCompareDropdown() {
    const dropdown = document.getElementById("compareProductDropdown");
    if (!dropdown) return;

    dropdown.innerHTML = `<option value="">Select product</option>`;

    const seen = new Set();

    allProducts.forEach(product => {
        const id = String(product.productId || "").trim();
        if (!id || seen.has(id)) return;

        seen.add(id);

        dropdown.innerHTML += `
            <option value="${id}">
                ${product.productName}
            </option>
        `;
    });

    dropdown.onchange = function () {
        if (!this.value) return;

        updateComparison(this.value);
        showPage("comparison");
    };
}

function toggleSidebar() {
    document.querySelector(".sidebar")
        .classList.toggle("show");

    document.querySelector(".overlay")
        .classList.toggle("show");
}

function updateComparison(productId) {
    const product = allProducts.find(p =>
        String(p.productId || "").trim().toLowerCase() ===
        String(productId || "").trim().toLowerCase()
    );

    if (!product) return;

    localStorage.setItem("selectedProduct", JSON.stringify(product));
    renderSelectedProduct(product);

    const market = allMarketPrices.find(m =>
        String(m.productId || "").trim().toLowerCase() ===
        String(product.productId || "").trim().toLowerCase()
    );

    if (market) {
        calculateComparison(product, market);
    }

    renderProducerListFromData(product);
    loadTrendChart(product.productId);
}

function renderSelectedProduct(p) {
    document.getElementById("selectedImage").src =
        p.image || "https://via.placeholder.com/300x200?text=No+Image";

    document.getElementById("selectedProductName").textContent =
        p.productName || "-";

    const farm = allFarms.find(f =>
        String(f.farmId || "").trim().toLowerCase() ===
        String(p.farmId || "").trim().toLowerCase()
    );

    const farmName = farm ? farm.name : "Unknown Farm";

    document.getElementById("selectedFarmerName").textContent =
        "Selected Farmer: " + farmName;

    const farmerCard =
        document.getElementById("selectedFarmerCardName");

    if (farmerCard) {
        farmerCard.textContent = farmName;
    }

    document.getElementById("selectedUnit").textContent =
        "Unit: " + (p.unit || "kg");

    const dropdown = document.getElementById("compareProductDropdown");
    if (dropdown) {
        dropdown.value = p.productId;
    }
}

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
        savingText.textContent =
            "You're saving " + percent + "% compared to the market price.";
    } else if (diff > 0) {
        const percent = marketAvg ? ((absDiff / marketAvg) * 100).toFixed(2) : "0.00";
        statusBadge.textContent = "Higher than market";
        savingText.textContent =
            "This price is " + percent + "% higher than the market price.";
    } else {
        statusBadge.textContent = "Same as market";
        savingText.textContent =
            "This price is the same as the market price.";
    }
}

function renderProducerListFromData(product) {
    const filtered = allProducts.filter(p =>
        String(p.productId || "").trim().toLowerCase() ===
        String(product.productId || "").trim().toLowerCase()
    );

    const container = document.getElementById("producerList");
    if (!container) return;

    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = "<p>No producer found</p>";
        return;
    }

    selectedProducerKey =
    String(product.productId).trim() + "_" + String(product.farmId).trim();

    filtered.forEach(item => {
        const farm = allFarms.find(f =>
            String(f.farmId || "").trim().toLowerCase() ===
            String(item.farmId || "").trim().toLowerCase()
        );

        const farmName = farm ? farm.name : "Unknown Farm";

        const div = document.createElement("div");
        div.className = "producer-item";
        div.style.cursor = "pointer";

        const itemKey = String(item.productId).trim() + "_" + String(item.farmId).trim();
        
        if (itemKey === selectedProducerKey) {
            div.classList.add("selected-producer");
        }

        div.onclick = function () {
            updateComparisonBySelectedProducer(item);
        };

        div.innerHTML = `
            <div class="producer-left">
                <img src="${farm?.image || "../assets/images/placeholder.png"}">
                <div>
                    <div class="producer-name">${farmName}</div>
                    <small>${item.farmId}</small>
                </div>
            </div>

            <div class="producer-price">
                RM ${parseFloat(item.price || 0).toFixed(2)}
            </div>
        `;

        container.appendChild(div);
    });
}

function updateComparisonBySelectedProducer(product) {
    renderSelectedProduct(product);

    const market = allMarketPrices.find(m =>
        String(m.productId || "").trim().toLowerCase() ===
        String(product.productId || "").trim().toLowerCase()
    );

    if (market) {
        calculateComparison(product, market);
    }

    renderProducerListFromData(product);
    loadTrendChart(product.productId);

    localStorage.setItem("selectedProduct", JSON.stringify(product));
}

function scrollToMarketPrice() {

    showPage("marketplace");

    setTimeout(() => {

        const section =
        document.querySelector(".section-title");

        if(section){

            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }, 200);

}

function renderMarketTable(data, products) {
    const tbody = document.getElementById("marketTableBody");
    const viewAllBtn = document.getElementById("viewAllBtn");

    if (!tbody) return;

    latestMarketData = data;
    latestProductData = products;

    tbody.innerHTML = "";

    const displayData =
        showAllMarketRows ? data : data.slice(0, 10);

    displayData.forEach(item => {
        const product = products.find(p =>
            String(p.productId || "").trim().toLowerCase() ===
            String(item.productId || "").trim().toLowerCase()
        );

        const productName = product ? product.productName : item.productId;
        const change = parseFloat(item.changePercent) || 0;

        let changeClass = "trend-flat";
        let trendIcon = "—";
        
        if (change > 0) {
            changeClass = "change-up";
            trendIcon = "↗";
        
        }
        
        else if (change < 0) {
            changeClass = "change-down";
            trendIcon = "↘";
        
        }

        tbody.innerHTML += `
            <tr 
                onclick="
                    updateComparison('${item.productId}');
                    loadTrendChart('${item.productId}');
                    setTimeout(() => {
                        document.getElementById('priceTrendChart')
                        .scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                "
                style="cursor:pointer;"
            >
                <td>${productName}</td>
                <td>RM ${parseFloat(item.avgPrice || 0).toFixed(2)}</td>
                <td class="${changeClass}">
${change > 0 ? "+" : ""}
${change.toFixed(2)}%
</td>

<td class="${changeClass}">
${trendIcon}
</td>
            </tr>
        `;
    });

    if (viewAllBtn) {
        viewAllBtn.style.display =
            data.length > 10 ? "block" : "none";

        viewAllBtn.textContent =
            showAllMarketRows ? "Show Less" : "View All Products";
    }
}

function toggleMarketRows() {
    showAllMarketRows = !showAllMarketRows;
    renderMarketTable(latestMarketData, latestProductData);
}

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
        const marketData = getDataArray(marketRes);
        const products = getDataArray(productRes);

        if (!marketData.length) {
            console.log("No market data");
            return;
        }

        const totalProducts = marketData.length;

        const avgPrice =
            marketData.reduce((sum, item) => {
                return sum + (parseFloat(item.avgPrice) || 0);
            }, 0) / totalProducts;

        const avgChange =
            marketData.reduce((sum, item) => {
                return sum + (parseFloat(item.changePercent) || 0);
            }, 0) / totalProducts;

        document.getElementById("totalProducts").textContent =
            totalProducts;

        document.getElementById("avgPriceToday").textContent =
            "RM" + avgPrice.toFixed(2);

        document.getElementById("priceChange").textContent =
            (avgChange >= 0 ? "+" : "") + avgChange.toFixed(2) + "%";

        const priceChange =
document.getElementById(
"priceChange"
);

priceChange.className="";

if(avgChange>0){

priceChange.classList
.add("change-up");

}

else if(avgChange<0){

priceChange.classList
.add("change-down");

}

else{

priceChange.classList
.add("trend-flat");

}    

            const updatedDate =
new Date(
marketData[0].lastUpdated
);

document.getElementById(
"lastUpdated"
)

.textContent =

"Updated: " +

updatedDate.toLocaleString(
"en-MY",
{
day:"2-digit",
month:"short",
year:"numeric",
hour:"2-digit",
minute:"2-digit"
}
);

        renderMarketTable(marketData, products);

        updateMarketAnalysis(marketData,products);
    })
    .catch(err => console.error("Market overview error:", err));
}

function loadTrendChart(productId) {
    currentTrendProductId = productId;

    const product = allProducts.find(
        p => String(p.productId).trim() === String(productId).trim()
    );

    document.getElementById("trendProductName").textContent =
        product ? product.productName : "Unknown Product";

    fetch(url + "?action=markethistory&productId=" + productId)
        .then(res => res.json())
        .then(res => {
            currentTrendHistory = res.data?.data || res.data || [];
            applyTrendRangeFilter();
        })
        .catch(err => console.error("Trend chart error:", err));
}

function renderTrendChart(history) {
    const labels = history.map(item =>
        new Date(item.date).toLocaleDateString()
    );

    const prices = history.map(item =>
        parseFloat(item.avgPrice) || 0
    );

    const canvas = document.getElementById("priceTrendChart");
    if (!canvas) return;

    if (marketChart) {
        marketChart.destroy();
    }

    marketChart = new Chart(canvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Average Market Price",
                data: prices,
                borderWidth: 2,
                tension: 0.35,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });
}

function applyTrendRangeFilter() {
    const range = document.getElementById("trendRange").value;

    if (!currentTrendHistory.length) return;

    if (range === "all") {
        renderTrendChart(currentTrendHistory);
        return;
    }

    if (range === "custom") {
        applyTrendDateFilter();
        return;
    }

    const days = parseInt(range);
    const sortedHistory = [...currentTrendHistory].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    const filtered = sortedHistory.slice(-days);

    renderTrendChart(filtered);
}

function applyTrendDateFilter() {
    document.getElementById("trendRange").value = "custom";
    const fromDate = document.getElementById("trendFromDate").value;
    const toDate = document.getElementById("trendToDate").value;

    if (!currentTrendHistory.length) return;

    let filtered = currentTrendHistory;

    if (fromDate) {
        filtered = filtered.filter(item =>
            new Date(item.date) >= new Date(fromDate)
        );
    }

    if (toDate) {
        filtered = filtered.filter(item =>
            new Date(item.date) <= new Date(toDate)
        );
    }

    renderTrendChart(filtered);
}

function resetTrendDateFilter() {
    
    document.getElementById("trendFromDate").value = "";
    document.getElementById("trendToDate").value = "";
    document.getElementById("trendRange").value = "7";

    applyTrendRangeFilter();
}

function updateMarketAnalysis(marketData,products){
    const highest =[...marketData].sort((a,b)=>parseFloat(b.avgPrice)-parseFloat(a.avgPrice))[0];
    const lowest =[...marketData].sort((a,b)=>parseFloat(a.avgPrice)-parseFloat(b.avgPrice))[0];
    const increase =[...marketData].sort((a,b)=>parseFloat(b.changePercent)-parseFloat(a.changePercent))[0];
    const decrease =[...marketData]

.sort(

(a,b)=>

parseFloat(
a.changePercent
)

-

parseFloat(
b.changePercent
)

)[0];


function getName(id){

const p=
products.find(

x=>

String(
x.productId
)

===

String(id)

);

return p
? p.productName
: id;

}


document.getElementById(
"highestProduct"
)

.textContent=

getName(
highest.productId
);

document.getElementById(
"highestPrice"
)

.textContent=

"RM"+highest.avgPrice;



document.getElementById(
"lowestProduct"
)

.textContent=

getName(
lowest.productId
);

document.getElementById(
"lowestPrice"
)

.textContent=

"RM"+lowest.avgPrice;



if (
    parseFloat(increase.changePercent) <= 0
) {

    document.getElementById("increaseProduct").textContent =
        "Stable";

    document.getElementById("increaseValue").textContent =
        "0.00%";

} else {

    document.getElementById("increaseProduct").textContent =
        getName(increase.productId);

    document.getElementById("increaseValue").textContent =
        "+" + parseFloat(increase.changePercent).toFixed(2) + "%";

}


document.getElementById(
"decreaseProduct"
)

.textContent=

getName(
decrease.productId
);

document.getElementById(
"decreaseValue"
)

.textContent=

decrease.changePercent
+"%";

// ===== Most Increased colour =====

const increaseEl =
document.getElementById(
"increaseValue"
);

increaseEl.className="";

if(
parseFloat(
increase.changePercent
)>0
){

increaseEl.classList
.add("change-up");

}
else{

increaseEl.classList
.add("trend-flat");

}


// ===== Most Decreased colour =====

const decreaseEl =
document.getElementById(
"decreaseValue"
);

decreaseEl.className="";

if(
parseFloat(
decrease.changePercent
)<0
){

decreaseEl.classList
.add("change-down");

}
else{

decreaseEl.classList
.add("trend-flat");

}

}

function exportMarketReport() {
    if (!latestMarketData.length) {
        alert("No market data available to export.");
        return;
    }

    let csv = "Product Name,Average Price,Change Percent,Trend,Last Updated\n";

    latestMarketData.forEach(item => {
        const product = latestProductData.find(p =>
            String(p.productId || "").trim().toLowerCase() ===
            String(item.productId || "").trim().toLowerCase()
        );

        const productName = product ? product.productName : item.productId;
        const change = parseFloat(item.changePercent) || 0;

        let trend = "Stable";
        if (change > 0) trend = "Increased";
        if (change < 0) trend = "Decreased";

        csv += `"${productName}","${item.avgPrice}","${change.toFixed(2)}%","${trend}","${item.lastUpdated || "-"}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "market-analysis-report.csv";
    link.click();

    URL.revokeObjectURL(link.href);
}

function goHome() {
    const BASE_URL =
        window.location.hostname.includes("github.io")
        ? "https://aimimisman.github.io/farmster"
        : "";

    window.location.href = BASE_URL + "/index.html";
}

function goMarketplace() {
    const BASE_URL =
        window.location.hostname.includes("github.io")
        ? "https://aimimisman.github.io/farmster"
        : "";

    window.location.href =
        BASE_URL + "/modules/member-a/marketplace/marketplace.html";
}