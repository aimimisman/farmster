// =======================
// GLOBAL STATE
// =======================
const url = "https://script.google.com/macros/s/AKfycbythF64y6uKVZxgPq7YvkmQph9Z2ty2_2doXm3DoJzHMNH49bd6ieO2XmzHHvu6A8s-1A/exec";

let farms = [];
let currentPage = 1;
const itemsPerPage = 12;

// =======================
// DOM ELEMENTS
// =======================



// =======================
// BANNER SLIDER (FIXED SAFE VERSION)
// =======================
document.addEventListener("DOMContentLoaded", function () {

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
  "Tomato is actually a fruit, not a vegetable 🍅",
  "Bananas are technically berries 🍌",
  "Strawberries have seeds on the outside 🍓",
  "Bees pollinate 1/3 of our food 🐝",
  "Healthy soil has billions of microorganisms 🧪",
  "Overwatering kills plants faster than underwatering 💧"
];

// =======================
// FUN FACT ROTATION
// =======================
function showFunFact() {
  const el = document.getElementById("funFact");
  if (!el) return;

  const randomIndex = Math.floor(Math.random() * funFacts.length);
  el.textContent = funFacts[randomIndex];
}

showFunFact();
setInterval(showFunFact, 5000);

// =======================
// FETCH DATA
// =======================
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
  })
  .catch(err => console.error(err));

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
  const text = document.getElementById("seasonGuide");

  if (!card || !text) return;

  text.innerHTML = "⏳ Loading weather...";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=Johor&units=metric&appid=cd26066e766bec7d60d9d9f1023f713e`)
.then(res => res.json())
.then(data => {

  const weather = data.weather?.[0]?.main;
  const temp = data.main?.temp; // 🔥 SUHU

  let className = "";
  let content = "";

  if (weather === "Rain") {
    className = "rainy";
    content = `<b>🌧️ Rainy(${temp}°C )<br><br></b>Reduce watering & check drainage`;
  }
  else if (weather === "Clear") {
    className = "sunny";
    content = `<b>☀️ Sunny(${temp}°C )<br><br></b>Water early morning & use mulch`;
  }
  else {
    className = "cloudy";
    content = `<b>☁️ Cloudy (${temp}°C )<br><br></b>Monitor soil moisture`;
  }

  card.className = "info " + className;
  text.innerHTML = content;

})
.catch(() => {
  text.innerHTML = "⚠️ Weather unavailable";
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