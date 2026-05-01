
// =======================
// GLOBAL STATE
// =======================
const url = "https://script.google.com/macros/s/AKfycbxbGh0dJIUUQPPyr3g_nD3SZEaqBSfJevDyIOgcr2rRVygpq5y6T3Amni995cqh_dbzeA/exec";
let farms = [];
let currentPage = 1;
const itemsPerPage = 20;

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
// RENDER FARMS (WITH PAGINATION)
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
                <img src="${farm.image}" loading="lazy">

                <div class="card-body">
                    <h4>${farm.name}</h4>
                    <p>${farm.location}</p>
                    <p>${farm.description}</p>

                    <div class="button-group">

                        <button onclick="goToProductCatalog('${farm.farmId}')">
                            View Product
                        </button>
                    </div>
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
// CLICK FUNCTIONS
// =======================
function viewFarm(name, location, desc) {
    alert(
        "🌱 Farm Details\n\n" +
        "Name: " + name + "\n" +
        "Location: " + location + "\n" +
        "Info: " + desc
    );
}

function goToProductCatalog(farmId) {
    localStorage.setItem("selectedFarm", farmId);

    const BASE_URL = window.location.hostname.includes("github.io")
        ? "https://aimimisman.github.io/farmster"
        : "";

    window.location.href = BASE_URL + "/modules/member-a/product-catalog/product-catalog.html";
}

