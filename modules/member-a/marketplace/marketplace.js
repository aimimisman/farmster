// =======================
// GLOBAL STATE
// =======================
const url = "https://script.google.com/macros/s/AKfycbxbGh0dJIUUQPPyr3g_nD3SZEaqBSfJevDyIOgcr2rRVygpq5y6T3Amni995cqh_dbzeA/exec";
let farms = [];
let currentPage = 1;
const itemsPerPage = 16;

// =======================
// FETCH DATA
// =======================
fetch(url + "?action=marketplace")
  .then(res => res.json())
  .then(response => {
      console.log("DATA:", response);

      if (response.status === "success") {
          farms = response.data;
      } else {
          console.error("API Error:", response.message);
          farms = [];
      }

      renderFarms();
      setupPagination();
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
        html += `
            <div class="card">
                <img src="${farm.image || '../../../assets/images/placeholder.png'}">

                <div class="card-body">
                    <h4>${farm.name}</h4>
                    <p>${farm.location}</p>
                    <p>${farm.description}</p>

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
function setupPagination() {
    const pageContainer = document.getElementById("setupPagination");
    pageContainer.innerHTML = "";

    const pageCount = Math.ceil(farms.length / itemsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;

        if (i === currentPage) {
            btn.classList.add("active");
        }

        btn.onclick = () => {
            currentPage = i;
            renderFarms();
            setupPagination();
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        pageContainer.appendChild(btn);
    }
}


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
// NAVIGATION
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


