console.log("Market Price Loaded");

const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));

if (!selectedProduct) {
    document.getElementById("priceContainer").innerHTML = `
        <div class="card">
            <h3>No product selected ❌</h3>
        </div>
    `;
    throw new Error("No selected product in localStorage");
}

const marketData = {
    "Tomato": 6.50,
    "Cucumber": 5.00,
    "Sawi": 10.00,
    "Okra": 7.00,
    "Banana": 5.50,
    "Egg Plant": 6.00,
    "Kangkung": 4.50
};

const marketPrice = marketData[selectedProduct.name] || 0;
const producerPrice = parseFloat(selectedProduct.price.replace("RM ", ""));
const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));

showMarketComparison(selectedProduct.name);

const diff = producerPrice - marketPrice;

let status = "";

if (diff < 0) status = "🔥 Below Market (Cheap)";
else if (diff > 0) status = "⚠️ Above Market (Expensive)";
else status = "⚖️ Same as Market";

document.getElementById("priceContainer").innerHTML = `
    <div class="card">

        <h2>${selectedProduct.name}</h2>

        <p><b>Category:</b> ${selectedProduct.category}</p>

        <p><b>Producer Price:</b> ${selectedProduct.price}</p>
        <p><b>Market Price:</b> RM ${marketPrice.toFixed(2)}</p>

        <p><b>Difference:</b> RM ${diff.toFixed(2)}</p>

        <h3>${status}</h3>

    </div>
`;

function showMarketComparison(productName) {

    const marketList = products.filter(p => p.name === productName);

    const container = document.getElementById("priceContainer");

    container.innerHTML = `
        <div class="card">
            <h2>${productName} Market Comparison</h2>

            ${marketList.map(p => `
                <div class="compare-row">
                    <p><b>${p.farm}</b></p>
                    <p>${p.price}</p>
                </div>
                <hr>
            `).join("")}

        </div>
    `;
}