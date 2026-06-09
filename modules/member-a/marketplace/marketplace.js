// =======================
// GLOBAL STATE
// =======================
const url = "https://script.google.com/macros/s/AKfycbythF64y6uKVZxgPq7YvkmQph9Z2ty2_2doXm3DoJzHMNH49bd6ieO2XmzHHvu6A8s-1A/exec";
const productUrl ="https://script.google.com/macros/s/AKfycbzuzeEMdC0knR4qw7-E705Varabmi6IChA62OOAyE0feiWchcrr3sknXOnmSc7KmGVjcw/exec";
let farms = [];
let currentPage = 1;
const itemsPerPage = 12;

const loading = document.getElementById("loading");
const farmContainer = document.getElementById("farmContainer");

function showLoading() {
    loading.style.display = "block";
    farmContainer.style.display = "none";
}

function hideLoading() {
    loading.style.display = "none";
    farmContainer.style.display = "grid";
}

// =======================
// DOM ELEMENTS
// =======================



// =======================
// BANNER SLIDER (FIXED SAFE VERSION)
// =======================
document.addEventListener("DOMContentLoaded", function () {

  loadAvailableProductsPreview();
  
  let currentBanner = 0;

    const slides = document.querySelectorAll(".banner-slide");

    function showBanner(index) {
        slides.forEach((s, i) => {
            s.classList.remove("active");
            if (i === index) {
                s.classList.add("active");
            }
        });
    }

    function nextBanner() {
        currentBanner++;

        if (currentBanner >= slides.length) {
            currentBanner = 0;
        }

        showBanner(currentBanner);
    }

    if (slides.length > 0) {
        showBanner(0);
        setInterval(nextBanner, 4000);
    }
});

// =======================
// DATA
// =======================
const gardeningTips = [
  "💧 Water plants early morning or late evening.",
  "🌿 Use compost to improve soil fertility.",
  "☀️ Most vegetables need sunlight.",
  "🐛 Use neem spray for pests.",
  "🌱 Rotate crops regularly."
];

const funFacts = [
{
    text: "Tomato is actually a fruit, not a vegetable",
    icon: "🍅"
},
{
    text: "Bananas are technically berries",
    icon: "🍌"
},
{
    text: "Strawberries have seeds on the outside",
    icon: "🍓"
},
{
    text: "Bees pollinate 1/3 of our food",
    icon: "🐝"
},
{
    text: "Healthy soil has billions of microorganisms",
    icon: "🧪"
},
{
    text: "Overwatering kills plants faster than underwatering",
    icon: "💧"
}
];

// =======================
// FUN FACT ROTATION
// =======================
function showFunFact() {

  const el = document.getElementById("funFact");

  if (!el) return;

  const randomIndex = Math.floor(Math.random() * funFacts.length);

  const fact = funFacts[randomIndex];

  el.innerHTML = `
      <div class="fact-text">${fact.text}</div>
      <div class="fact-icon">${fact.icon}</div>
  `;
}

showFunFact();
setInterval(showFunFact, 5000);

// =======================
// FETCH DATA
// =======================

showLoading();

fetch(url + "?action=marketplace")
  .then(res => res.json())
  .then(response => {

    if (response.status === "success") {
      farms = response.data;
    } else {
      farms = [];
    }

    renderFarms();
    renderPagination();

    hideLoading();
  })
  .catch(err => {
    console.error(err);
    hideLoading();
  });

// =======================
// AVAILABLE PRODUK
// =======================

 async function loadAvailableProductsPreview() {

    const container =
    document.getElementById("availableProductsPreview");

    if (!container) return;

    try {

        const response =
        await fetch(productUrl + "?action=products");

        const result =
        await response.json();

        let products =
            result.data ||
            result.result ||
            result.products ||
            result.records ||
            result.rows ||
            result;

        if (!Array.isArray(products)) {
            products = Object.values(products);
        }

        const uniqueProducts = [];

        products.forEach(product => {

            const exists = uniqueProducts.find(
                p => p.productName === product.productName
            );

            if (!exists) {
                uniqueProducts.push(product);
            }

        });

        container.innerHTML = "";

        uniqueProducts.slice(0, 6).forEach(product => {

            const image =
                product.imageUrl ||
                product.productImage ||
                product.image ||
                "../../../assets/images/placeholder.png";

            container.innerHTML += `
                <div class="product-preview-card"
                     onclick="goAvailableProducts()">

                    <img src="${image}"
                         alt="${product.productName}">

                    <div class="product-preview-content">
                        <h4>${product.productName}</h4>
                        <p>${product.category}</p>
                    </div>

                </div>
            `;
        });

        container.innerHTML += `
    <div class="view-more-card"
         onclick="goAvailableProducts()">

        <div class="view-more-content">

            <div class="view-icon">
                →
            </div>

            <h3>View More</h3>

            <p>Browse all products</p>

        </div>

    </div>
`;

    }
    catch(error) {

        console.error(error);

    }
} 

// =======================
// SKROLL PRODUK
// =======================

function scrollProducts(amount) {

    document
        .getElementById("availableProductsPreview")
        .scrollBy({
            left: amount,
            behavior: "smooth"
        });
}

// =======================
// RENDER FARMS
// =======================
function renderFarms() {

  const container = document.getElementById("farmContainer");

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginatedItems = farms.slice(start, end);

  let html = "";

  paginatedItems.forEach(farm => {

    const cert = (farm.certification || "Unverified").toLowerCase();
    let certClass = "badge-cert-default";

    if (cert === "organic") certClass = "badge-cert-organic";
    else if (cert === "pesticide-free") certClass = "badge-cert-pesticide";
    else if (cert === "conventional") certClass = "badge-cert-conventional";
    else if (cert.includes("mygap")) certClass = "badge-cert-mygap";

    html += `
      <div class="card">

        <div class="image-wrapper">
          <div class="badge cert ${certClass}">
            🌿 ${farm.certification || "Unverified"}
          </div>

          <img src="${farm.image || '../../../assets/images/placeholder.png'}">
        </div>

        <div class="card-body">
          <h4>${farm.name}</h4>
          <p><i class="fa-solid fa-location-dot"></i> ${farm.location}</p>

          <p class="product-count">
            <i class="fa-solid fa-box"></i> ${farm.productCount || 0} Products
          </p>

          <button onclick="goToProductCatalog('${farm.farmId}', '${farm.name}')">
            View Product
          </button>
        </div>

      </div>
    `;
  });

  container.innerHTML = html;
}

// =======================
// PAGINATION
// =======================
function renderPagination() {

  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  const pageCount = Math.ceil(farms.length / itemsPerPage);

  const prev = document.createElement("button");
  prev.innerText = "Prev";
  prev.disabled = currentPage === 1;

  prev.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderFarms();
      renderPagination();
    }
  };

  pagination.appendChild(prev);

  for (let i = 1; i <= pageCount; i++) {

    const btn = document.createElement("button");
    btn.innerText = i;

    if (i === currentPage) btn.classList.add("active");

    btn.onclick = () => {
      currentPage = i;
      renderFarms();
      renderPagination();
    };

    pagination.appendChild(btn);
  }

  const next = document.createElement("button");
  next.innerText = "Next";
  next.disabled = currentPage === pageCount;

  next.onclick = () => {
    if (currentPage < pageCount) {
      currentPage++;
      renderFarms();
      renderPagination();
    }
  };

  pagination.appendChild(next);
}

// =======================
// TIP ROTATION
// =======================
let tipIndex = 0;

function renderTip() {
  const el = document.getElementById("tipBox");
  if (!el) return;
  el.textContent = gardeningTips[tipIndex];
}

function nextTip() {
  tipIndex = (tipIndex + 1) % gardeningTips.length;
  renderTip();
}

function prevTip() {
  tipIndex = (tipIndex - 1 + gardeningTips.length) % gardeningTips.length;
  renderTip();
}

renderTip();

// =======================
// WEATHER GUIDE
// =======================
function showSeasonGuide() {

  const card = document.querySelector("#seasonCard");

  const bigTemp = document.getElementById("weatherBigTemp");
  const status = document.getElementById("weatherStatus");
  const guide = document.getElementById("weatherGuide");
  const tempTop = document.getElementById("weatherTemp");
  const icon = document.getElementById("weatherIcon");

  if (!card) return;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=Johor&units=metric&appid=cd26066e766bec7d60d9d9f1023f713e`)
  .then(res => res.json())
  .then(data => {

    const weather = data.weather?.[0]?.main;
    const temp = data.main?.temp;

    bigTemp.textContent = Math.round(temp);
    tempTop.textContent = `${Math.round(temp)}°`;
    status.textContent = weather;

    if (weather === "Rain") {

      icon.innerHTML = "🌧️";
      guide.textContent = "Reduce watering & improve drainage";

      card.style.background =
      "linear-gradient(180deg, #4b79a1, #283e51)";
    }
    else if (weather === "Clear") {

      icon.innerHTML = "☀️";
      guide.textContent = "Water crops early morning";

      card.style.background =
      "linear-gradient(180deg, #f6d365, #fda085)";
    }
    else {

      icon.innerHTML = "☁️";
      guide.textContent = "Monitor soil moisture regularly";

      card.style.background =
      "linear-gradient(180deg, #757f9a, #d7dde8)";
    }

  })
  .catch(() => {

    bigTemp.textContent = "--";
    status.textContent = "Unavailable";
    guide.textContent = "Weather unavailable";
    icon.innerHTML = "⚠️";
  });
}

showSeasonGuide();

// =======================
// SEARCH (REALTIME)
// =======================
const searchInput = document.getElementById("searchInput");
const suggestionBox = document.getElementById("suggestionBox");

searchInput.addEventListener("input", function () {
    const keyword = this.value.trim().toLowerCase();

    handleSearch(this.value);
    showSuggestions(keyword);
});

function handleSearch(query) {
    const keyword = query.trim().toLowerCase();

    if (keyword === "") {
        currentPage = 1;
        renderFarms();
        setupPagination();
        return;
    }

    const filtered = farms.filter(farm =>
        farm.name.toLowerCase().includes(keyword) ||
        farm.location.toLowerCase().includes(keyword) ||
        farm.description.toLowerCase().includes(keyword)
    );

    renderFilteredFarms(filtered, keyword);
}


// =======================
// HIGHLIGHT
// =======================
function highlightText(text, keyword) {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(regex, `<mark>$1</mark>`);
}


// =======================
// RENDER FILTERED
// =======================
function renderFilteredFarms(list, keyword) {
    const container = document.getElementById("farmContainer");
    const pageContainer = document.getElementById("setupPagination");

    if (pageContainer) pageContainer.innerHTML = "";

    if (list.length === 0) {
        container.innerHTML = `<p class="no-result">No result found</p>`;
        return;
    }

    let html = "";

    list.forEach(farm => {
        html += `
            <div class="card">
                <img src="${farm.image || '../../../assets/images/placeholder.png'}">

                <div class="card-body">
                    <h4>${highlightText(farm.name, keyword)}</h4>
                    <p>${highlightText(farm.location, keyword)}</p>
                    <p>${highlightText(farm.description, keyword)}</p>

                    <button onclick="goToProductCatalog('${farm.farmId}')">
                        View Product
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}


// =======================
// SUGGESTION DROPDOWN
// =======================
function showSuggestions(keyword) {
    suggestionBox.innerHTML = "";

    if (keyword === "") {
        suggestionBox.style.display = "none";
        return;
    }

    const suggestions = farms
        .filter(farm => farm.name.toLowerCase().includes(keyword))
        .slice(0, 5);

    if (suggestions.length === 0) {
        suggestionBox.style.display = "none";
        return;
    }

    suggestions.forEach(farm => {
        const item = document.createElement("div");
        item.className = "suggestion-item";
        item.textContent = farm.name;

        item.onclick = () => {
            searchInput.value = farm.name;
            suggestionBox.style.display = "none";
            handleSearch(farm.name);
        };

        suggestionBox.appendChild(item);
    });

    suggestionBox.style.display = "block";
}


// =======================
// NAVIGATION (UNCHANGED)
// =======================
function goToProductCatalog(farmId, farmName) {
  localStorage.setItem("selectedFarm", farmId);
  localStorage.setItem("selectedFarmName", farmName);

  const BASE_URL = window.location.hostname.includes("github.io")
    ? "https://aimimisman.github.io/farmster"
    : "";

  window.location.href = BASE_URL + "/modules/member-a/product-catalog/product-catalog.html";
}

function goHome() {
  const BASE_URL = window.location.hostname.includes("github.io")
    ? "https://aimimisman.github.io/farmster"
    : "";

  window.location.href = BASE_URL + "/index.html";
}

function goMarketPrice() {
  const BASE_URL = window.location.hostname.includes("github.io")
    ? "https://aimimisman.github.io/farmster"
    : "";

  window.location.href = BASE_URL + "/modules/member-a/market-price/market-price.html";
}

function goAvailableProducts() {

    const BASE_URL =
    window.location.hostname.includes("github.io")
    ? "https://aimimisman.github.io/farmster"
    : "";

    window.location.href =
    BASE_URL +
    "/modules/member-c/available-products-detail/available-products-detail.html";
}

function openAvailableProduct(productId) {

  localStorage.setItem("openProductModal", productId);

  const BASE_URL =
    window.location.hostname.includes("github.io")
      ? "https://aimimisman.github.io/farmster"
      : "";

  window.location.href =
    BASE_URL +
    "/modules/member-c/available-products-detail/available-products-detail.html";
}

function goLogin(){
  const BASE_URL = window.location.hostname.includes("github.io")
    ? "https://aimimisman.github.io/farmster"
    : "";

  window.location.href = BASE_URL + "/modules/member-b/farmer-profile/login.html";
}