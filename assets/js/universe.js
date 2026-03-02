// ===============================
// UNIVERSE PAGE SCRIPT (CLEAN)
// ===============================

document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("universeContainer");
  const alphabetBar = document.getElementById("alphabetBar");
  const breadcrumbs = document.getElementById("breadcrumbs");
  const countElement = document.getElementById("universeCount");
  const toggleBtn = document.getElementById("toggleImages");
  const sortSelect = document.getElementById("filterSelect");

  const params = new URLSearchParams(window.location.search);
  const universeId = params.get("universe");

  if (!universeId) return;

  try {

    // ✅ Load worlds from folder-based structure
    const worlds = await fetch(`data/${universeId}/worlds.json`)
      .then(res => res.json());

    renderWorlds(worlds);
    generateAlphabet(worlds);
    updateCount(worlds.length);

    // ===== Breadcrumbs =====
    if (breadcrumbs) {
      breadcrumbs.innerHTML = `
        <a href="home.html">Home</a> &gt; ${universeId}
      `;
    }

    // ===== Toggle Images =====
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        container.classList.toggle("hide-images");

        toggleBtn.textContent =
          container.classList.contains("hide-images")
            ? "Show Images"
            : "Hide Images";
      });
    }

    // ===== Sort =====
    if (sortSelect) {
      sortSelect.addEventListener("change", () => {

        let sorted = [...worlds];

        if (sortSelect.value === "az") {
          sorted.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (sortSelect.value === "za") {
          sorted.sort((a, b) => b.name.localeCompare(a.name));
        }

        renderWorlds(sorted);

      });
    }

  } catch (error) {
    console.error("Universe page error:", error);
  }

});


// ===============================
// RENDER WORLDS
// ===============================

function renderWorlds(worlds) {

  const container = document.getElementById("universeContainer");
  container.innerHTML = "";

  worlds.forEach(world => {

    const card = document.createElement("div");
    card.className = "card";
    card.id = world.id;

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${world.image}" loading="lazy" alt="${world.name}">
      </div>
      <div class="card-title">${world.name}</div>
    `;

    card.addEventListener("click", () => {
      window.location.href =
        `world.html?universe=${new URLSearchParams(window.location.search).get("universe")}&world=${world.id}`;
    });

    container.appendChild(card);
  });

}


// ===============================
// ALPHABET GENERATOR
// ===============================

function generateAlphabet(items) {

  const alphabetBar = document.getElementById("alphabetBar");
  if (!alphabetBar) return;

  alphabetBar.innerHTML = "";

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  letters.forEach(letter => {

    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.className = "alphabet-btn";

    btn.addEventListener("click", () => {

      const target = items.find(item =>
        item.name.toUpperCase().startsWith(letter)
      );

      if (target) {
        const element = document.getElementById(target.id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }

    });

    alphabetBar.appendChild(btn);
  });

}


// ===============================
// UPDATE COUNT
// ===============================

function updateCount(total) {

  const countElement = document.getElementById("universeCount");
  if (countElement) {
    countElement.textContent = `${total} Items`;
  }

}