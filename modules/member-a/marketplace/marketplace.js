// document.addEventListener("DOMContentLoaded", () => {
//   console.log("Marketplace module loaded");
// });

// =======================
// DATA (nanti boleh tukar API)
// =======================
const farms = [
    {
        name: "Kebun Hijau Segar",
        location: "Johor",
        desc: "Sayur organik berkualiti tinggi",
        image: "images/farm1.jpg"
    },
    {
        name: "Kebun Makmur Agro",
        location: "Kluang",
        desc: "Pengeluaran padi & sayur segar",
        image: "images/farm2.jpg"
    },
    {
        name: "Kebun Tropika Farm",
        location: "Muar",
        desc: "Buah tropika segar dari ladang",
        image: "images/farm3.jpg"
    },
    {
        name: "Kebun Organik Lestari",
        location: "Batu Pahat",
        desc: "Tanaman tanpa bahan kimia",
        image: "images/farm4.jpg"
    },
        {
        name: "Kebun Organik Lestari",
        location: "Batu Pahat",
        desc: "Tanaman tanpa bahan kimia",
        image: "images/farm4.jpg"
    },
        {
        name: "Kebun Organik Lestari",
        location: "Batu Pahat",
        desc: "Tanaman tanpa bahan kimia",
        image: "images/farm4.jpg"
    }
];

// =======================
// RENDER FUNCTION
// =======================
const container = document.getElementById("farmContainer");

farms.forEach(farm => {
    container.innerHTML += `
        <div class="card">
            <img src="${farm.image}">

            <div class="card-body">
                <h4>${farm.name}</h4>
                <p class="location">${farm.location}</p>
                <p class="desc">${farm.desc}</p>

                <button onclick="viewFarm('${farm.name}', '${farm.location}', '${farm.desc}')">
                    View Farm
                </button>
                <button onclick="goToProductCatalog('${farm.name}')">
                    View Product
                </button>
            </div>
        </div>
    `;
});

// =======================
// CLICK FUNCTION
// =======================
function viewFarm(name, location, desc) {
    alert(
        "🌱 Farm Details\n\n" +
        "Name: " + name + "\n" +
        "Location: " + location + "\n" +
        "Info: " + desc
    );
}

function goToProductCatalog(farmName) {
    // simpan data farm (optional tapi bagus)
    localStorage.setItem("selectedFarm", farmName);

    // redirect ke page product catalog
    window.location.href = "/modules/member-a/product-catalog/product-catalog.html";
}

function displayFarms() {
    const container = document.getElementById("farmContainer");
    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const paginatedItems = products.slice(start, end);

    paginatedItems.forEach(farm => {
        container.innerHTML += `
            <div class="card">
                <h4>${farm.name}</h4>

                <div class="button-group">
                    <button onclick="viewFarm('${farm.name}')">View Farm</button>
                    <button onclick="goToProductCatalog('${farm.name}')">View Product</button>
                </div>
            </div>
        `;
    });

}

setupPagination();

function setupPagination() {
    const pageContainer = document.getElementById("pagination");
    pageContainer.innerHTML = "";

    const pageCount = Math.ceil(products.length / itemsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;

        if (i === currentPage) {
            btn.classList.add("active");
        }

        btn.addEventListener("click", () => {
            currentPage = i;
            displayFarms();
        });

        pageContainer.appendChild(btn);
    }
}