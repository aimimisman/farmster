console.log("JS FILE LOADED");

// =======================
// GET FARM FROM MARKETPLACE
// =======================
const selectedFarm = localStorage.getItem("selectedFarm");

// tunggu DOM siap dulu (IMPORTANT)
document.addEventListener("DOMContentLoaded", () => {

    // show farm name
    const farmTitle = document.getElementById("farmTitle");
    if (farmTitle) {
        farmTitle.innerText = "Farm: " + selectedFarm;
    }

    // =======================
    // dummy product data
    // =======================
    const products = [
        { name: "Tomato", price: "RM 5/kg", farm: "Kebun Hijau Segar", image: "../../../assets/images/tomato.jpg",category: "Vegetable",quantity: "20 kg",
        description: "Fresh organic tomatoes harvested daily."},
        { name: "Cucumber", price: "RM 4/kg", farm: "Kebun Hijau Segar",image: "../../../assets/images/timun.jpg", category: "Vegetable",quantity: "20 kg",
        description: "Fresh organic tomatoes harvested daily." },
        { name: "Sawi", price: "RM 12/kg", farm: "Kebun Hijau Segar",image: "../../../assets/images/sawi.jpg", category: "Vegetable",quantity: "20 kg",
        description: "Fresh organic tomatoes harvested daily."  },
        { name: "Okra", price: "RM 6/kg", farm: "Kebun Hijau Segar",image: "../../../assets/images/okra.jpg", category: "Vegetable",quantity: "20 kg",
        description: "Fresh organic tomatoes harvested daily." },
        { name: "Limau Kasturi", price: "RM 12/kg", farm: "Kebun Hijau Segar",image: "../../../assets/images/limaukasturi.jpg", category: "Vegetable",quantity: "20 kg",
        description: "Fresh organic tomatoes harvested daily." },
        { name: "Banana", price: "RM 6/kg", farm: "Kebun Hijau Segar",image: "../../../assets/images/pisangnipah.jpg" , category: "Vegetable",quantity: "20 kg",
        description: "Fresh organic tomatoes harvested daily." },
        { name: "Kangkung", price: "RM 12/kg", farm: "Kebun Hijau Segar",image: "../../../assets/images/kangkung.jpg" , category: "Vegetable",quantity: "20 kg",
        description: "Fresh organic tomatoes harvested daily." },
        { name: "Egg Plant", price: "RM 6/kg", farm: "Kebun Hijau Segar",image: "../../../assets/images/terung.jpg" , category: "Vegetable",quantity: "20 kg",
        description: "Fresh organic tomatoes harvested daily." },
    ];

    const filtered = products.filter(p => p.farm === selectedFarm);

    const container = document.getElementById("productContainer");

    filtered.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${p.image}" class="product-img">
            <h3>${p.name}</h3>
            <p>${p.price}</p>
            <button class="detailBtn">View Detail</button>
        `;

        card.querySelector(".detailBtn").addEventListener("click", function () {
            viewProductDetail(p);
        });

        container.appendChild(card);
    });
});

// =======================
// VIEW DETAIL
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

            <h2>${product.name}</h2>

            <p><b>Category:</b> ${product.category}</p>
            <p><b>Quantity:</b> ${product.quantity}</p>
            <p><b>Price:</b> ${product.price}</p>

            <p class="desc">${product.description}</p>
        </div>
    </div>

    
    <div class="producer-section">
        <div class="producer-info">
            <h3>About Producer</h3>
            <p><b>Farm:</b> ${product.farm}</p>
            <p>Local farmer producing fresh organic produce 🌱</p>
        </div>

        <div class="action-buttons">

            <button class="compare-btn"
                onclick='goToMarketPrice(${JSON.stringify(product)})'>
                📊 Compare Price
            </button>

            <button class="chat-btn"
                onclick="goToChat('${product.farm}')">
                💬 Chat Seller
            </button>

        </div>
    </div>
`;


   


    // 🔥 IMPORTANT FIX
    setTimeout(() => {
        detail.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
}

// // =======================
// // CLOSE DETAIL
// // =======================
// function closeDetail() {
//     document.getElementById("productDetail").classList.add("hidden");
// }

function goToMarketPrice(product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.href = "../market-price/market-price.html";
}

function goToChat(farmName) {
    localStorage.setItem("selectedFarm", farmName);
    window.location.href = "../chat/chat.html";
}