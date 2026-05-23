const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzuzeEMdC0knR4qw7-E705Varabmi6IChA62OOAyE0feiWchcrr3sknXOnmSc7KmGVjcw/exec";

const sellerDetail = document.getElementById("sellerDetail");

const params = new URLSearchParams(window.location.search);
const productId = params.get("productId");

const DEFAULT_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop";

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

    const productData = productResult.data || productResult;

    const product = productData.find(
      item => String(item.productId).trim() === String(productId).trim()
    );

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

    console.log("PROFILE RESULT:", profileResult);

    let profileData =
      profileResult.data ||
      profileResult.profiles ||
      profileResult.DataProfile ||
      profileResult.records ||
      profileResult.rows ||
      [];

    if (!Array.isArray(profileData)) {
      profileData = Object.values(profileData);
    }

    const seller = profileData.find(
      item => String(item.farmId).trim() === String(product.farmId).trim()
    );

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

          <h3>Description</h3>

          <div class="seller-info-list">
            <div class="seller-info-item full">
              <span>Farm Description</span>
              <strong>${seller.description || "-"}</strong>
            </div>
          </div>

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