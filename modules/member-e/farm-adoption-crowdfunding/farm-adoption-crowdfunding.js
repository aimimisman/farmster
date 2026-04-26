const projects = [
      {
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
        image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=900&q=80"
      },
      {
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
        image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=80"
      },
      {
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
        image: "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&w=900&q=80"
      },
      {
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
        image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80"
      },
      {
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
        image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=80"
      },
      {
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
        image: "https://images.unsplash.com/photo-1553755230-bd41cbbd1448?auto=format&fit=crop&w=900&q=80"
      }
    ];

    const projectGrid = document.getElementById("projectGrid");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const impactFilter = document.getElementById("impactFilter");
    const sortFilter = document.getElementById("sortFilter");
    const customAmount = document.getElementById("customAmount");
    const impactPreview = document.getElementById("impactPreview");
    const modal = document.getElementById("contributionModal");
    const modalAmount = document.getElementById("modalAmount");
    const toast = document.getElementById("toast");
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");

    let selectedPackage = {
      name: "Seed Supporter",
      amount: 25
    };

    function formatRM(value) {
      return "RM " + Number(value).toLocaleString("en-MY");
    }

    function getPercent(project) {
      return Math.min(Math.round((project.raised / project.goal) * 100), 100);
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
        if (sort === "goal") return (b.goal - b.raised) - (a.goal - a.raised);
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
                <button class="btn btn-primary" onclick="openProject('${project.title}')">View Details</button>
                <button class="btn btn-ghost" onclick="quickAdopt('${project.title}', ${project.raised}, ${project.goal})">Adopt</button>
              </div>
            </div>
          </article>
        `;
      }).join("");
    }

    function updateImpact(amount) {
      const value = Number(amount) || selectedPackage.amount || 25;
      let plants = Math.max(10, Math.round(value * 0.4));
      let harvest = Math.max(8, Math.round(value * 0.8));

      impactPreview.innerHTML = `
        <h4>Your RM ${value.toLocaleString("en-MY")} impact</h4>
        <ul>
          <li>Helps prepare about ${plants} tomato plants</li>
          <li>Contributes to around ${harvest}kg expected harvest</li>
          <li>Supports grower materials and farm maintenance</li>
        </ul>
      `;
    }

    function selectPackage(card) {
      document.querySelectorAll(".package-card").forEach(item => item.classList.remove("active"));
      card.classList.add("active");

      selectedPackage = {
        amount: Number(card.dataset.amount),
        name: card.dataset.name
      };

      customAmount.value = "";
      updateImpact(selectedPackage.amount);
    }

    function openContribution() {
      const amount = Number(customAmount.value) || selectedPackage.amount || 25;
      modalAmount.value = amount;
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    }

    function closeContribution() {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    }

    function confirmContribution() {
      const amount = Number(modalAmount.value);

      if (!amount || amount < 1) {
        showToast("Please enter a valid contribution amount");
        return;
      }

      closeContribution();
      showToast(`Thank you! Your RM ${amount.toLocaleString("en-MY")} adoption was recorded.`);
    }

    function openProject(title) {
      showToast(`Opening details for ${title}`);
      scrollToSection("project-detail");
    }

    function quickAdopt(title, raised, goal) {
      showToast(`Selected ${title}`);
      openContribution();
    }

    function shareProject() {
      const text = "Support this farm project: Adopt a Tomato Greenhouse Project";

      if (navigator.share) {
        navigator.share({
          title: "FarmFund Adopt",
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
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      navLinks.classList.remove("show");
    }

    searchInput.addEventListener("input", renderProjects);
    categoryFilter.addEventListener("change", renderProjects);
    statusFilter.addEventListener("change", renderProjects);
    impactFilter.addEventListener("change", renderProjects);
    sortFilter.addEventListener("change", renderProjects);

    document.querySelectorAll(".package-card").forEach(card => {
      card.addEventListener("click", () => selectPackage(card));
    });

    customAmount.addEventListener("input", () => {
      const value = Number(customAmount.value);
      document.querySelectorAll(".package-card").forEach(item => item.classList.remove("active"));
      updateImpact(value || selectedPackage.amount);
    });

    modal.addEventListener("click", event => {
      if (event.target === modal) closeContribution();
    });

    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => navLinks.classList.remove("show"));
    });

    renderProjects();
    updateImpact(25);