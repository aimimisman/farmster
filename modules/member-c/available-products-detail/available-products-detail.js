// ==========================
// BACKEND URL
// ==========================
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxbGh0dJIUUQPPyr3g_nD3SZEaqBSfJevDyIOgcr2rRVygpq5y6T3Amni995cqh_dbzeA/exec";

// ==========================
// STATE (DATA)
// ==========================
let products = [];

const DEFAULT_IMAGE = "https://aimimisman.github.io/farmster/assets/images/vegetables.jpg";

// ==========================
// ELEMENTS
// ==========================
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");

const productList = document.getElementById("productList");
const noResult = document.getElementById("noResult");

// ==========================
// LOAD PRODUCTS FROM BACKEND
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

    // handle kalau backend return terus array
    const data = result.data || result;

    products = data.map(item => ({
      id: item.productId,
      name: item.productName,
      category: item.category,
      price: Number(item.price),
      farmId: item.farmId,
      quantity: item.quantity,
      description: item.description,
      image: item.image && item.image.trim() !== "" ? item.image : DEFAULT_IMAGE
    }));

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

  data.forEach(p => {
    productList.innerHTML += `
      <div class="product-card" onclick="showDetail('${p.id}')">

        <div class="img-wrapper">
          <img src="${p.image}" alt="${p.name}">
          <span class="badge">${p.category}</span>
        </div>

        <div class="card-body">
          <h3 class="title">${p.name}</h3>
          <p class="price">RM ${p.price.toFixed(2)}</p>
          <p class="stock">Available: ${p.quantity}</p>
        </div>

      </div>
    `;
  });
}

// ==========================
// FILTER LOGIC
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

    if (price === "low") matchPrice = p.price < 5;
    if (price === "mid") matchPrice = p.price >= 5 && p.price <= 10;
    if (price === "high") matchPrice = p.price > 10;

    return matchSearch && matchCategory && matchPrice;
  });

  productDetail.innerHTML = "";
  renderProducts(filtered);
}

// ==========================
// SHOW PRODUCT DETAIL
// ==========================
function showDetail(id) {
  const p = products.find(product => String(product.id) === String(id));

  if (!p) {
    noResult.innerText = "Product not found.";
    return;
  }

  const modal = document.getElementById("productModal");
  const modalBody = document.getElementById("modalBody");

  modalBody.innerHTML = `
    <div class="modal-product">
      <img src="${p.image}" alt="${p.name}">

      <div class="modal-info">
        <h2>${p.name}</h2>
        <p>${p.description}</p>
        <p><b>Product ID:</b> ${p.id}</p>
        <p><b>Farm ID:</b> ${p.farmId}</p>
        <p><b>Category:</b> ${p.category}</p>
        <p><b>Quantity:</b> ${p.quantity}</p>
        <p class="modal-price">RM ${p.price.toFixed(2)}</p>
      </div>
    </div>
  `;

  modal.classList.add("show");
}

function closeModal() {
  document.getElementById("productModal").classList.remove("show");
}

// ==========================
// EVENT LISTENERS
// ==========================
searchInput.addEventListener("input", applyFilter);
categoryFilter.addEventListener("change", applyFilter);
priceFilter.addEventListener("change", applyFilter);

document.getElementById("productModal").addEventListener("click", function(e) {
  if (e.target.id === "productModal") {
    closeModal();
  }
});

// ==========================
// INITIAL LOAD
// ==========================
loadProducts();