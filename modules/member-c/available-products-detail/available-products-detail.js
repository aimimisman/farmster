console.log("NEW JS LOADED VERSION 12");

// ==========================
// BACKEND URL
// ==========================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzuzeEMdC0knR4qw7-E705Varabmi6IChA62OOAyE0feiWchcrr3sknXOnmSc7KmGVjcw/exec";

// ==========================
// STATE
// ==========================
let products = [];

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop";

// ==========================
// ELEMENTS
// ==========================
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const productList = document.getElementById("productList");
const noResult = document.getElementById("noResult");

// ==========================
// IMAGE VALIDATION
// ==========================
function getValidImage(url) {
  if (!url || String(url).trim() === "") {
    return DEFAULT_IMAGE;
  }

  url = String(url).trim();

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `./uploads/${url}`;
}

// ==========================
// LOAD PRODUCTS
// ==========================
async function loadProducts() {
  productList.innerHTML = `
    <div class="loading">
      <p>🌱 Loading fresh farm products...</p>
    </div>
  `;

  noResult.innerText = "";

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=products`);
    const result = await response.json();

    console.log("Backend result:", result);

    const data = result.data || result;

    console.log("RAW FIRST PRODUCT:", data[0]);

    products = data.map((item, index) => {
      const possibleUnit = item.unit || item.description || "";

      const possibleDescription =
        item.description &&
        item.description !== "kg" &&
        item.description !== "gram" &&
        item.description !== "pcs"
          ? item.description
          : item.image || "";

      const possibleImage =
        item.imageUrl ||
        item.productImage ||
        item.photo ||
        item.picture ||
        item.image;

      return {
        id: item.productId || `TEMP_${index}`,
        name: item.productName || "No Name",
        category: item.category || "Unknown",
        price: Number(item.price) || 0,
        farmId: item.farmId || "",
        quantity: item.quantity || 0,
        unit: possibleUnit,
        description: possibleDescription,
        image: getValidImage(possibleImage)
      };
    });

    console.log("Mapped products:", products);

    renderProducts(products);

  } catch (error) {
    console.error("Backend error:", error);

    productList.innerHTML = "";

    noResult.innerText = "Error connecting to backend.";
  }
}

// ==========================
// RENDER PRODUCTS
// ==========================
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
      <div class="product-card" onclick="showDetail(${index})">

        <div class="img-wrapper">

          <img
            src="${p.image}"
            alt="${p.name}"
            onerror="this.onerror=null; this.src='${DEFAULT_IMAGE}';"
          >

          <span class="badge">
            ${p.category}
          </span>

        </div>

        <div class="card-body">

          <h3 class="title">
            ${p.name}
          </h3>

          <p class="price">
            RM ${p.price.toFixed(2)}
          </p>

          <p class="stock">
            Available: ${p.quantity} ${p.unit || ""}
          </p>

        </div>

      </div>
    `;
  });
}
// ==========================
// FILTER PRODUCTS
// ==========================
function applyFilter() {
  const keyword = searchInput.value.toLowerCase();

  const category = categoryFilter.value;

  const price = priceFilter.value;

  const filtered = products.filter(p => {

    const matchSearch =
      p.name.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword);

    const matchCategory =
      category === "" || p.category === category;

    let matchPrice = true;

    if (price === "low") {
      matchPrice = p.price < 5;
    }

    if (price === "mid") {
      matchPrice = p.price >= 5 && p.price <= 10;
    }

    if (price === "high") {
      matchPrice = p.price > 10;
    }

    return matchSearch && matchCategory && matchPrice;
  });

  renderProducts(filtered);
}

// ==========================
// SHOW PRODUCT DETAIL
// ==========================
function showDetail(index) {

  const p = products[index];

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

      <p>${p.description}</p>

      <p><b>Product ID:</b> ${p.id}</p>

      <p><b>Farm ID:</b> ${p.farmId}</p>

      <p><b>Category:</b> ${p.category}</p>

      <p><b>Quantity:</b> ${p.quantity} ${p.unit || ""}</p>

      <p class="modal-price">
        RM ${p.price.toFixed(2)}
      </p>

      <button 
        class="view-seller-btn"
        onclick="viewSeller('${p.id}')"
      >
        View Seller
      </button>

    </div>

  </div>
`;

  modal.classList.add("show");
}

// ==========================
// VIEW SELLER
// ==========================
function viewSeller(productId) {

  console.log("Redirecting using Product ID:", productId);

  window.location.href =
    `seller-detail.html?productId=${encodeURIComponent(productId)}`;
}

// ==========================
// CLOSE MODAL
// ==========================
function closeModal() {
  document
    .getElementById("productModal")
    .classList.remove("show");
}

// ==========================
// EVENT LISTENERS
// ==========================
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

// ==========================
// INITIAL LOAD
// ==========================
loadProducts();