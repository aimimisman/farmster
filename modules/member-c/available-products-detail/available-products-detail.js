console.log("NEW JS LOADED VERSION 20");

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQGdtvTVude_65_W2zb_HNSVyieVngi3dt5n4bYbjmoLUrHGGUlRIMzhTPGEVM7YyRvg/exec";

let products = [];
let profiles = [];
let groupedProducts = [];


const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop";

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const productList = document.getElementById("productList");
const noResult = document.getElementById("noResult");

function normalizeObjectKeys(obj) {
  const normalized = {};

  Object.keys(obj).forEach(key => {
    normalized[String(key).trim()] = obj[key];
  });

  return normalized;
}

function getValidImage(url) {
  if (!url || String(url).trim() === "") return DEFAULT_IMAGE;

  url = String(url).trim();

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `./uploads/${url}`;
}

function safeText(value, fallback = "") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

function cleanId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function normalizeText(value) {
  return safeText(value).trim().toLowerCase();
}

async function loadProducts() {
  productList.innerHTML = `
    <div class="loading">
      <p>🌱 Loading fresh farm products...</p>
    </div>
  `;

  noResult.innerText = "";

  try {
    const productResponse = await fetch(`${APPS_SCRIPT_URL}?action=products`);
    const productResult = await productResponse.json();

    let productData =
      productResult.data ||
      productResult.result ||
      productResult.products ||
      productResult.records ||
      productResult.rows ||
      productResult;

    if (!Array.isArray(productData)) {
      productData = Object.values(productData);
    }

    productData = productData.map(item => normalizeObjectKeys(item));

    products = productData.map((item, index) => {
      const possibleImage =
        item.imageUrl ||
        item.productImage ||
        item.photo ||
        item.picture ||
        item.image;

      return {
        id: item.productId || `TEMP_${index}`,
        productId: item.productId || `TEMP_${index}`,
        name: item.productName || "No Name",
        productName: item.productName || "No Name",
        category: item.category || "Unknown",
        price: Number(item.price) || 0,
        farmId: String(item.farmId || "").trim(),
        quantity: Number(item.quantity) || 0,
        unit: item.unit || "",
        description: item.description || "",
        image: getValidImage(possibleImage),
        lastUpdated: item.lastUpdated || ""
      };
    });

    await loadProfiles();

    groupedProducts = groupProductsByName(products);

    renderProducts(groupedProducts);
    
    // DAYAH TAMBAH 
    window.productsReady = true;
    if (window.pendingProductId) {
    showDetailById(window.pendingProductId);
    window.pendingProductId = null;
    }
    // SAMPAI SINI

  } catch (error) {
    console.error("Backend error:", error);
    productList.innerHTML = "";
    noResult.innerText = "Error connecting to backend.";
  }
}

async function loadProfiles() {
  try {
    const profileResponse = await fetch(`${APPS_SCRIPT_URL}?action=profiles`);
    const profileResult = await profileResponse.json();

    let profileData =
      profileResult.data ||
      profileResult.profiles ||
      profileResult.DataProfile ||
      profileResult.records ||
      profileResult.rows ||
      profileResult.result ||
      [];

    if (!Array.isArray(profileData)) {
      profileData = Object.values(profileData);
    }

    profileData = profileData.map(item => normalizeObjectKeys(item));

    profiles = profileData.map(item => {
      return {
        farmId: String(item.farmId || "").trim(),
        farmsterName: item.farmsterName || item.name || "Unknown Farmer",
        state: item.state || "",
        district: item.district || "",
        description: item.description || "",
        email: item.email || "",
        contact: item.contact || "",
        status: item.status || "",
        certification: item.certification || "",
        profileImage: getValidImage(item.profileImage || item.image)
      };
    });

  } catch (error) {
    console.warn("Profiles data not found.", error);
    profiles = [];
  }
}

function getProfileByFarmId(farmId) {
  const targetFarmId = cleanId(farmId);

  return profiles.find(profile => {
    return cleanId(profile.farmId) === targetFarmId;
  });
}

function getSellerLocation(profile) {
  if (!profile) return "Location not available";

  const state = safeText(profile.state).trim();
  const district = safeText(profile.district).trim();

  if (state && district) return `${state}, ${district}`;
  if (state) return state;
  if (district) return district;

  return "Location not available";
}

function groupProductsByName(productListData) {
  const groups = {};

  productListData.forEach(product => {
    const key = normalizeText(product.name);

    if (!groups[key]) {
      groups[key] = {
        id: product.id,
        productId: product.productId,
        name: product.name,
        productName: product.productName,
        category: product.category,
        description: product.description,
        image: product.image,
        unit: product.unit,
        price: product.price,
        quantity: product.quantity,
        farmId: product.farmId,
        products: [],
        sellers: []
      };
    }

    const profile = getProfileByFarmId(product.farmId);

    groups[key].products.push(product);

    groups[key].sellers.push({
      productId: product.productId,
      farmId: product.farmId,
      farmerName: profile ? profile.farmsterName : "Unknown Farmer",
      location: profile ? getSellerLocation(profile) : "Location not available",
      price: product.price,
      quantity: product.quantity,
      unit: product.unit
    });

    if (product.price < groups[key].price) {
      groups[key].price = product.price;
      groups[key].id = product.id;
      groups[key].productId = product.productId;
      groups[key].farmId = product.farmId;
      groups[key].quantity = product.quantity;
      groups[key].unit = product.unit;
      groups[key].description = product.description;
      groups[key].image = product.image;
    }
  });

  return Object.values(groups);
}

function renderProducts(data) {
  productList.innerHTML = "";
  noResult.innerText = "";

  if (!data || data.length === 0) {
    noResult.innerHTML = `
      <div class="no-data">
        <h3>No products found</h3>
        <p>Try different filters or search keyword.</p>
      </div>
    `;
    return;
  }

  data.forEach((p, index) => {
    productList.innerHTML += `
      <div class="product-card " onclick="showDetail(${index})">
        <div class="img-wrapper">
          <img
            src="${p.image}"
            alt="${p.name}"
            onerror="this.onerror=null; this.src='${DEFAULT_IMAGE}';"
          >

          <span class="badge">${p.category}</span>
        </div>

        <div class="card-body">
          <h3 class="title">${p.name}</h3>

          <p class="price">From RM ${p.price.toFixed(2)}</p>

          <p class="stock">
            Available: ${p.quantity} ${p.unit || ""}
          </p>

          <span class="seller-count">
            ${p.sellers.length} seller${p.sellers.length > 1 ? "s" : ""} available
          </span>
        </div>
      </div>
    `;
  });
}

// function getTotalQuantity(productGroup) {
//   if (!productGroup.products || productGroup.products.length === 0) {
//     return productGroup.quantity || 0;
//   }

//   return productGroup.products.reduce((total, item) => {
//     return total + (Number(item.quantity) || 0);
//   }, 0);
// }

function applyFilter() {
  const keyword = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const price = priceFilter.value;

  const filtered = groupedProducts.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(keyword) ||
      safeText(p.description).toLowerCase().includes(keyword);

    const matchCategory =
      category === "" || p.category === category;

    let matchPrice = true;

    if (price === "low") matchPrice = p.price < 5;
    if (price === "mid") matchPrice = p.price >= 5 && p.price <= 10;
    if (price === "high") matchPrice = p.price > 10;

    return matchSearch && matchCategory && matchPrice;
  });

  renderProducts(filtered);
}

function getCurrentFilteredProducts() {
  const keyword = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const price = priceFilter.value;

  return groupedProducts.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(keyword) ||
      safeText(p.description).toLowerCase().includes(keyword);

    const matchCategory =
      category === "" || p.category === category;

    let matchPrice = true;

    if (price === "low") matchPrice = p.price < 5;
    if (price === "mid") matchPrice = p.price >= 5 && p.price <= 10;
    if (price === "high") matchPrice = p.price > 10;

    return matchSearch && matchCategory && matchPrice;
  });
}

function showDetail(index) {
  const currentList = getCurrentFilteredProducts();
  const p = currentList[index];

  if (!p) {
    noResult.innerText = "Product not found.";
    return;
  }

  const modal = document.getElementById("productModal");
  const modalBody = document.getElementById("modalBody");

  modalBody.innerHTML = `
    <div class="modal-product">
      <img
        src="${p.image}"
        alt="${p.name}"
        onerror="this.onerror=null; this.src='${DEFAULT_IMAGE}';"
      >

      <div class="modal-info">

        <h2>${p.name}</h2>

        <p>${p.description || "No description available."}</p>

        <p><b>Total Sellers (Refer to Compare Seller Table Below for Details):</b> ${p.sellers.length}</p>

        <p><b>Product ID:</b> ${p.productId}</p>
        <p><b>Farm ID:</b> ${p.farmId}</p>
        <p><b>Category:</b> ${p.category}</p>
        <p><b>Total Quantity:</b> ${p.quantity} ${p.unit || ""}</p>
        

        <p class="modal-price">
          From RM ${p.price.toFixed(2)}
        </p>

        <button 
          class="view-seller-btn"
          onclick="viewSeller('${p.productId}', '${p.farmId}')"
        >
          View Seller
        </button>
      </div>
    </div>

    ${renderSellerComparison(p)}
  `;

  modal.classList.add("show");
}

function renderSellerComparison(productGroup) {
  if (!productGroup.sellers || productGroup.sellers.length === 0) {
    return `
      <div class="compare-section">
        <h3>Compare Sellers</h3>
        <div class="no-seller">
          No seller information available for this product.
        </div>
      </div>
    `;
  }

  const sortedSellers = [...productGroup.sellers].sort((a, b) => a.price - b.price);
  const bestPrice = sortedSellers[0].price;

  const sellerRows = sortedSellers.map(seller => {
    const isBestPrice = seller.price === bestPrice;

    return `
      <tr>
        <td>${seller.farmId}</td>
        <td>${seller.farmerName}</td>
        <td class="${isBestPrice ? "best-price" : ""}">
          RM ${Number(seller.price).toFixed(2)}
          ${isBestPrice ? `<span class="best-price-badge">Best Price</span>` : ""}
        </td>
        <td>${seller.location}</td>
        <td>
          <button
            class="table-view-seller-btn"
            onclick="event.stopPropagation(); viewSeller('${seller.productId}', '${seller.farmId}')"
          >
            View Seller
          </button>
        </td>
      </tr>
    `;
  }).join("");

  return `
    <div class="compare-section">
      <h3>Compare Sellers</h3>
      <p>
        Compare sellers that offer the same product based on farm ID, farmer name, price, and location.
      </p>

      <div class="compare-table-wrapper">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Farm ID</th>
              <th>Farmer Name</th>
              <th>Price</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${sellerRows}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function viewSeller(productId, farmId = "") {
  console.log("Redirecting to seller-detail:", {
    productId,
    farmId
  });

  window.location.href =
    `seller-detail.html?productId=${encodeURIComponent(productId)}&farmId=${encodeURIComponent(farmId)}`;
}

function closeModal() {
  document
    .getElementById("productModal")
    .classList.remove("show");
}

searchInput.addEventListener("input", applyFilter);
categoryFilter.addEventListener("change", applyFilter);
priceFilter.addEventListener("change", applyFilter);

document
  .getElementById("productModal")
  .addEventListener("click", function(e) {
    if (e.target.id === "productModal") {
      closeModal();
    }
  });

loadProducts();

 // SORRY AISYAH DAYAH TAMBAH NI YE
document.addEventListener("DOMContentLoaded", () => {
  const productId = localStorage.getItem("openProductModal");

  if (!productId) return;

  // simpan sementara
  window.pendingProductId = productId;

  localStorage.removeItem("openProductModal");
});

