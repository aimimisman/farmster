const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzuzeEMdC0knR4qw7-E705Varabmi6IChA62OOAyE0feiWchcrr3sknXOnmSc7KmGVjcw/exec";

const sellerDetail = document.getElementById("sellerDetail");

const params = new URLSearchParams(window.location.search);
const productId = params.get("productId");
const farmId = params.get("farmId");

const DEFAULT_PROFILE_IMAGE =
  "https://media.istockphoto.com/id/2149922267/vector/user-icon.jpg?s=612x612&w=0&k=20&c=i6jYPfB1pWjK8pll6YRxAK9fgBmf65-w5wbKH9R1dyQ=";

function normalizeObjectKeys(obj) {
  const normalized = {};

  Object.keys(obj).forEach(key => {
    normalized[String(key).trim()] = obj[key];
  });

  return normalized;
}

function getValidImage(url) {
  if (!url || String(url).trim() === "") {
    return DEFAULT_PROFILE_IMAGE;
  }

  url = String(url).trim();

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `./uploads/${url}`;
}

async function loadSellerDetail() {
  if (!productId) {
    sellerDetail.innerHTML = `
      <div class="status-box">
        Product ID not found.
      </div>
    `;
    return;
  }

  try {
    sellerDetail.innerHTML = `
      <div class="status-box">
        Loading seller details...
      </div>
    `;

    const productResponse = await fetch(`${APPS_SCRIPT_URL}?action=products`);
    const productResult = await productResponse.json();

    let productData = productResult.data || productResult.result || productResult.products || productResult;

    if (!Array.isArray(productData)) {
      productData = Object.values(productData);
    }

    productData = productData.map(item => normalizeObjectKeys(item));

    const product = productData.find(item => {
      const sameProduct =
        String(item.productId || "").trim() === String(productId || "").trim();

      const sameFarm =
        !farmId ||
        String(item.farmId || "").trim() === String(farmId || "").trim();

      return sameProduct && sameFarm;
    });

    if (!product) {
      sellerDetail.innerHTML = `
        <div class="status-box">
          Product not found.
        </div>
      `;
      return;
    }

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

    const seller = profileData.find(
      item => String(item.farmId || "").trim() === String(product.farmId || "").trim()
    );

    console.log("URL PRODUCT ID:", productId);
    console.log("URL FARM ID:", farmId);
    console.log("PRODUCT:", product);
    console.log("SELLER:", seller);

    if (!seller) {
      sellerDetail.innerHTML = `
        <div class="status-box">
          Seller profile not found for Farm ID: ${product.farmId || "-"}
        </div>
      `;
      return;
    }

    const profileImage = getValidImage(seller.profileImage);

    sellerDetail.innerHTML = `
      <div class="seller-layout">

        <div class="seller-image-box">
          <img
            src="${profileImage}"
            alt="${seller.farmsterName || "Seller Profile"}"
            onerror="this.onerror=null; this.src='${DEFAULT_PROFILE_IMAGE}';"
          >

          <span class="seller-badge">
            ${seller.status || "Farm Seller"}
          </span>
        </div>

        <div class="seller-content">
          <h2>${seller.farmsterName || "-"}</h2>

          <p class="seller-price">
            ${seller.state || "-"}, ${seller.district || "-"}
          </p>

          <div class="seller-info-list">
            <div class="seller-info-item full">
              <span>Farm Description</span>
              <strong>${seller.description || "-"}</strong>
            </div>
          </div>

          <div class="info-grid">

            <div class="info-card">
              <span>Email</span>
              <strong>${seller.email || "-"}</strong>
            </div>

            <div class="info-card">
              <span>Contact</span>
              <strong>${seller.contact || "-"}</strong>
            </div>

            <div class="info-card">
              <span>Status</span>
              <strong>${seller.status || "-"}</strong>
            </div>

            <div class="info-card">
              <span>Certification</span>
              <strong>${seller.certification || "-"}</strong>
            </div>

            <div class="info-card">
              <span>State</span>
              <strong>${seller.state || "-"}</strong>
            </div>

            <div class="info-card">
              <span>District</span>
              <strong>${seller.district || "-"}</strong>
            </div>

          </div>

          <hr>
        </div>

      </div>
    `;

  } catch (error) {
    console.error("Seller detail error:", error);

    sellerDetail.innerHTML = `
      <div class="status-box">
        Error loading seller details.
      </div>
    `;
  }
}

function goBack() {
  window.history.back();
}

loadSellerDetail();