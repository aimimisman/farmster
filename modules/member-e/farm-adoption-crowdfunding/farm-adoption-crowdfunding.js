const STRIPE_RM5_LINK = "https://buy.stripe.com/aFafZidk1ax37dh0Opgw00l";
const FIXED_CONTRIBUTION_AMOUNT = 5;

const projects = [
  {
    id: "tomato-greenhouse",
    title: "Adopt a Tomato Greenhouse",
    grower: "Green Valley Farm",
    location: "Cameron Highlands",
    category: "Vegetables",
    status: "Active",
    impact: "Food Security",
    raised: 6450,
    goal: 10000,
    days: 12,
    supporters: 86,
    farmers: 2,
    output: "800kg vegetables",
    description:
      "Green Valley Farm is building a small greenhouse to grow pesticide-reduced tomatoes for nearby communities. The funding will help cover greenhouse materials, seedlings, irrigation setup, soil improvement, and basic farm labor.",
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=900&q=80",
    funds: [
      ["Seeds and seedlings", 1500],
      ["Greenhouse materials", 3500],
      ["Irrigation setup", 2000],
      ["Soil and fertilizer", 1200],
      ["Labor and maintenance", 1800]
    ],
    timeline: [
      ["Project approved", "Grower identity and project plan verified.", true],
      ["Funding started", "Supporters can fund the project through RM5 contributions.", true],
      ["Materials purchased", "Greenhouse frame, seedlings, and irrigation parts.", false],
      ["Planting begins", "Grower shares photos and progress notes.", false],
      ["Harvest report", "Final report with impact and production numbers.", false]
    ]
  },
  {
    id: "rice-seed-fund",
    title: "Community Rice Seed Fund",
    grower: "Sawah Makmur Cooperative",
    location: "Kedah",
    category: "Rice",
    status: "Almost Funded",
    impact: "Community",
    raised: 11200,
    goal: 12500,
    days: 5,
    supporters: 143,
    farmers: 6,
    output: "1,200kg rice",
    description:
      "Sawah Makmur Cooperative is raising funds to purchase rice seeds and basic field supplies for smallholder farmers before the next planting cycle.",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80",
    funds: [
      ["Rice seeds", 4200],
      ["Field preparation", 2800],
      ["Water channel maintenance", 2500],
      ["Farmer tools", 1600],
      ["Logistics", 1400]
    ],
    timeline: [
      ["Project approved", "Cooperative documents and project plan verified.", true],
      ["Funding started", "Supporters can fund the project through RM5 contributions.", true],
      ["Seed purchase", "Seeds are purchased before planting season.", false],
      ["Planting begins", "Farmers begin sowing and field preparation.", false],
      ["Harvest update", "Final report shared with supporters.", false]
    ]
  },
  {
    id: "organic-chili-expansion",
    title: "Organic Chili Farm Expansion",
    grower: "Bukit Fresh Growers",
    location: "Perak",
    category: "Organic",
    status: "New",
    impact: "Farmer Income",
    raised: 2300,
    goal: 9000,
    days: 24,
    supporters: 31,
    farmers: 3,
    output: "500kg chili",
    description:
      "Bukit Fresh Growers wants to expand its organic chili plot with better soil preparation, seedlings, and pest-control materials.",
    image: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&w=900&q=80",
    funds: [
      ["Organic seedlings", 1800],
      ["Soil improvement", 2200],
      ["Natural pest control", 1500],
      ["Farm tools", 1300],
      ["Maintenance", 2200]
    ],
    timeline: [
      ["Project approved", "Grower profile and project plan reviewed.", true],
      ["Funding started", "Supporters can fund the project through RM5 contributions.", true],
      ["Soil preparation", "Farm beds are prepared for planting.", false],
      ["Seedlings planted", "Chili seedlings are transferred to the plot.", false],
      ["First harvest update", "Grower shares yield and impact report.", false]
    ]
  },
  {
    id: "banana-orchard-recovery",
    title: "Banana Orchard Recovery",
    grower: "Tropical Roots Farm",
    location: "Johor",
    category: "Fruits",
    status: "Active",
    impact: "Sustainability",
    raised: 7200,
    goal: 15000,
    days: 18,
    supporters: 77,
    farmers: 4,
    output: "2 acres restored",
    description:
      "Tropical Roots Farm is recovering a banana orchard by improving soil health, replacing damaged plants, and restoring irrigation.",
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80",
    funds: [
      ["Banana seedlings", 3500],
      ["Soil recovery", 3000],
      ["Irrigation repair", 4200],
      ["Farm labor", 2800],
      ["Transport", 1500]
    ],
    timeline: [
      ["Project approved", "Farm recovery plan verified.", true],
      ["Funding started", "Supporters can fund the project through RM5 contributions.", true],
      ["Land recovery", "Soil and damaged areas are restored.", false],
      ["Replanting begins", "New banana plants are planted.", false],
      ["Recovery report", "Grower shares orchard recovery results.", false]
    ]
  },
  {
    id: "chicken-coop-upgrade",
    title: "Village Chicken Coop Upgrade",
    grower: "Kampung Protein Project",
    location: "Selangor",
    category: "Livestock",
    status: "Active",
    impact: "Food Security",
    raised: 5200,
    goal: 8000,
    days: 15,
    supporters: 58,
    farmers: 5,
    output: "300 eggs weekly",
    description:
      "Kampung Protein Project is upgrading a village chicken coop to improve egg production, animal safety, and local protein supply.",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=80",
    funds: [
      ["Coop materials", 2600],
      ["Feed supply", 1900],
      ["Water system", 1200],
      ["Health and safety items", 1100],
      ["Maintenance", 1200]
    ],
    timeline: [
      ["Project approved", "Coop upgrade plan reviewed.", true],
      ["Funding started", "Supporters can fund the project through RM5 contributions.", true],
      ["Materials purchased", "Coop materials and supplies are bought.", false],
      ["Upgrade work begins", "Growers improve the coop structure.", false],
      ["Production update", "Egg output and project impact are reported.", false]
    ]
  },
  {
    id: "hydroponic-lettuce-kit",
    title: "Hydroponic Lettuce Starter Kit",
    grower: "Urban Leaf Collective",
    location: "Kuala Lumpur",
    category: "Vegetables",
    status: "New",
    impact: "Sustainability",
    raised: 1800,
    goal: 7000,
    days: 28,
    supporters: 22,
    farmers: 2,
    output: "1,000 lettuce heads",
    description:
      "Urban Leaf Collective is building a small hydroponic lettuce system to produce fresh greens in the city with limited land use.",
    image: "https://images.unsplash.com/photo-1553755230-bd41cbbd1448?auto=format&fit=crop&w=900&q=80",
    funds: [
      ["Hydroponic frame", 2500],
      ["Nutrient solution", 1200],
      ["Seedlings", 900],
      ["Water pump system", 1500],
      ["Training and setup", 900]
    ],
    timeline: [
      ["Project approved", "Urban farming setup reviewed.", true],
      ["Funding started", "Supporters can fund the project through RM5 contributions.", true],
      ["System setup", "Hydroponic structure and pump are installed.", false],
      ["Planting begins", "Lettuce seedlings are added.", false],
      ["Harvest update", "Supporters receive production results.", false]
    ]
  }
];

const projectGrid = document.getElementById("projectGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const statusFilter = document.getElementById("statusFilter");
const impactFilter = document.getElementById("impactFilter");
const sortFilter = document.getElementById("sortFilter");
const toast = document.getElementById("toast");
const mobileToggle = document.getElementById("mobileToggle");
const navLinks = document.getElementById("navLinks");

let selectedProject = projects[0];

function formatRM(value) {
  return "RM " + Number(value).toLocaleString("en-MY");
}

function getPercent(project) {
  return Math.min(Math.round((project.raised / project.goal) * 100), 100);
}

function showView(viewId) {
  document.querySelectorAll(".app-view").forEach(view => {
    view.classList.remove("active-view");
  });

  const targetView = document.getElementById(viewId);

  if (targetView) {
    targetView.classList.add("active-view");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navLinks?.classList.remove("show");
}

function renderProjects() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const status = statusFilter.value;
  const impact = impactFilter.value;
  const sort = sortFilter.value;

  let filtered = projects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm) ||
      project.grower.toLowerCase().includes(searchTerm) ||
      project.location.toLowerCase().includes(searchTerm);

    const matchesCategory = category === "all" || project.category === category;
    const matchesStatus = status === "all" || project.status === status;
    const matchesImpact = impact === "all" || project.impact === impact;

    return matchesSearch && matchesCategory && matchesStatus && matchesImpact;
  });

  filtered.sort((a, b) => {
    if (sort === "funded") return getPercent(b) - getPercent(a);
    if (sort === "newest") return b.days - a.days;
    if (sort === "goal") return (a.goal - a.raised) - (b.goal - b.raised);
    return a.days - b.days;
  });

  if (!filtered.length) {
    projectGrid.innerHTML = `
      <div class="empty-state">
        <h3>No matching projects found</h3>
        <p>Try changing the search term or filters.</p>
      </div>
    `;
    return;
  }

  projectGrid.innerHTML = filtered.map(project => {
    const percent = getPercent(project);

    return `
      <article class="project-card">
        <div class="project-image" style="background-image: url('${project.image}')">
          <div class="image-tags">
            <span class="tag white">${project.category}</span>
            <span class="tag orange">${project.status}</span>
          </div>
        </div>

        <div class="project-body">
          <div>
            <h3 class="project-title">${project.title}</h3>
            <p class="meta">${project.grower} · ${project.location}</p>
          </div>

          <div class="progress-wrap">
            <div class="progress-top">
              <span>${formatRM(project.raised)} raised</span>
              <span>${percent}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="--progress: ${percent}%"></div>
            </div>
            <p class="meta">${formatRM(project.goal)} goal · ${project.days} days left · ${project.supporters} supporters</p>
          </div>

          <div class="impact-mini">
            <div><svg class="icon"><use href="#icon-farmer"></use></svg> ${project.farmers} farmers supported</div>
            <div><svg class="icon"><use href="#icon-basket"></use></svg> ${project.output}</div>
          </div>

          <div class="card-actions">
            <button class="btn btn-primary" onclick="openProjectDetail('${project.id}')">View Details</button>
            <button class="btn btn-ghost" onclick="openProjectDetail('${project.id}')">Fund RM5</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function openProjectDetail(projectId) {
  const project = projects.find(item => item.id === projectId);

  if (!project) {
    showToast("Project not found");
    return;
  }

  selectedProject = project;
  renderProjectDetail(project);
  showView("view-project-detail");
}

function renderProjectDetail(project) {
  const percent = getPercent(project);

  document.getElementById("detailImage").style.backgroundImage = `
    linear-gradient(180deg, rgba(24, 60, 47, 0.05), rgba(24, 60, 47, 0.34)),
    url("${project.image}")
  `;

  document.getElementById("detailCategory").textContent = project.category;
  document.getElementById("detailImpact").textContent = project.impact;
  document.getElementById("detailStatus").textContent = project.status;

  document.getElementById("detailTitle").textContent = project.title;
  document.getElementById("detailGrower").textContent = `${project.grower} · ${project.location}`;
  document.getElementById("detailDescription").textContent = project.description;

  document.getElementById("detailRaised").textContent = `${formatRM(project.raised)} raised`;
  document.getElementById("detailPercent").textContent = `${percent}%`;
  document.getElementById("detailProgressFill").style.setProperty("--progress", `${percent}%`);
  document.getElementById("detailGoalMeta").textContent =
    `Goal: ${formatRM(project.goal)} · ${project.days} days left · ${project.supporters} supporters`;

  document.getElementById("detailFarmers").textContent = project.farmers;
  document.getElementById("detailOutput").textContent = project.output;
  document.getElementById("detailLocation").textContent = project.location;

  document.getElementById("fundingList").innerHTML = project.funds.map(([label, amount]) => `
    <div class="funding-row">
      <span>${label}</span>
      <strong>${formatRM(amount)}</strong>
    </div>
  `).join("");

  document.getElementById("timelineList").innerHTML = project.timeline.map((item, index) => {
    const [title, description, done] = item;

    return `
      <div class="timeline-item ${done ? "done" : ""}">
        <div class="timeline-dot">${done ? "✓" : index + 1}</div>
        <div>
          <strong>${title}</strong>
          <p class="meta">${description}</p>
        </div>
      </div>
    `;
  }).join("");
}

function goToStripePayment() {
  if (!STRIPE_RM5_LINK || STRIPE_RM5_LINK === "YOUR_STRIPE_RM5_PAYMENT_LINK_HERE") {
    showToast("Add your Stripe RM5 payment link first");
    return;
  }

  window.location.href = STRIPE_RM5_LINK;
}

function shareProject() {
  const text = `Support this farm project: ${selectedProject.title}`;

  if (navigator.share) {
    navigator.share({
      title: selectedProject.title,
      text,
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(window.location.href);
    showToast("Project link copied");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function scrollToSection(id) {
  showView("view-home");

  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);

  navLinks?.classList.remove("show");
}

searchInput.addEventListener("input", renderProjects);
categoryFilter.addEventListener("change", renderProjects);
statusFilter.addEventListener("change", renderProjects);
impactFilter.addEventListener("change", renderProjects);
sortFilter.addEventListener("change", renderProjects);

mobileToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("show"));
});

renderProjects();
renderProjectDetail(selectedProject);