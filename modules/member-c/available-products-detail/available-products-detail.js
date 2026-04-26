// ==========================
// STATE (DATA)
// ==========================
const products = [
  {
    id: 1,
    name: "Fresh Apple",
    category: "Fruit",
    price: 4,
    image: "/assets/images/apple.jpg",
    description: "Fresh red apples from farm"
  },
  {
    id: 2,
    name: "Organic Carrot",
    category: "Vegetable",
    price: 6,
    image: "/assets/images/carrot.jpg",
    description: "Healthy organic carrots"
  },
  {
    id: 3,
    name: "Chicken",
    category: "Meat",
    price: 12,
    image: "/assets/images/chicken.jpg",
    description: "Fresh chicken meat"
  },
  {
    id: 4,
    name: "Banana",
    category: "Fruit",
    price: 3,
    image: "/assets/images/banana.jpg",
    description: "Sweet bananas"
  }
];

// ==========================
// ELEMENTS
// ==========================
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");

const productList = document.getElementById("productList");
const productDetail = document.getElementById("productDetail");
const noResult = document.getElementById("noResult");

// ==========================
// RENDER PRODUCTS
// ==========================
function renderProducts(data) {
  productList.innerHTML = "";
  noResult.innerText = "";

  if (data.length === 0) {
    noResult.innerText = "No products found 😢";
    return;
  }

  data.forEach(p => {
    productList.innerHTML += `
    <div class="product-card" onclick="showDetail(${p.id})">

        <div class="img-wrapper">
        <img src="${p.image}" alt="${p.name}">
        <span class="badge">${p.category}</span>
        </div>

        <div class="card-body">
        <h3 class="title">${p.name}</h3>
        <p class="price">RM ${p.price}</p>
        </div>

    </div>
    `;
  });
}

// ==========================
// FILTER LOGIC (SMART)
// ==========================
function applyFilter() {
  const keyword = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const price = priceFilter.value;

  let filtered = products.filter(p => {

    // search (case insensitive)
    let matchSearch = p.name.toLowerCase().includes(keyword);

    // category filter
    let matchCategory = category === "" || p.category === category;

    // price filter
    let matchPrice = true;
    if (price === "low") matchPrice = p.price < 5;
    if (price === "mid") matchPrice = p.price >= 5 && p.price <= 10;
    if (price === "high") matchPrice = p.price > 10;

    return matchSearch && matchCategory && matchPrice;
  });

  renderProducts(filtered);
}

// ==========================
// SHOW PRODUCT DETAIL
// ==========================
function showDetail(id) {
  const p = products.find(product => product.id === id);

  productDetail.innerHTML = `
    <div class="detail-card">
      <img src="${p.image}" alt="${p.name}">

      <div class="detail-content">
        <h2>${p.name}</h2>
        <p>${p.description}</p>
        <p><b>Category:</b> ${p.category}</p>
        <p class="detail-price">RM ${p.price}</p>
      </div>
    </div>
  `;

  productDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ==========================
// EVENT LISTENERS
// ==========================
searchInput.addEventListener("input", applyFilter);
categoryFilter.addEventListener("change", applyFilter);
priceFilter.addEventListener("change", applyFilter);

// ==========================
// INITIAL LOAD
// ==========================
renderProducts(products);