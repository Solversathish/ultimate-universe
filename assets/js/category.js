document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("categoryContainer");
  const breadcrumbs = document.getElementById("breadcrumbs");
  const countElement = document.getElementById("categoryCount");
  const alphabetBar = document.getElementById("alphabetBar");
  const toggleBtn = document.getElementById("toggleImages");
  const sortSelect = document.getElementById("filterSelect");

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || params.get("parent");

  if (!id) return;

  let data = [];
  let currentUniverse = null;
  let currentWorld = null;

  try {

    // ================= LOAD UNIVERSES =================
    const universes = await fetch("data/universes.json")
      .then(res => res.json());

    currentUniverse = universes.find(u => u.id === id);

    // ================= IF ID IS UNIVERSE =================
    if (currentUniverse) {

      const worlds = await fetch(`data/${id}/worlds.json`)
        .then(res => res.json());

      data = worlds;

      if (breadcrumbs) {
        breadcrumbs.innerHTML =
          `<a href="home.html">Home</a> > ${currentUniverse.name}`;
      }

    }

    // ================= IF ID IS WORLD =================
    else {

      for (let universe of universes) {

        const worldsPath = `data/${universe.id}/worlds.json`;

        try {

          const worlds = await fetch(worldsPath)
            .then(res => res.json());

          const foundWorld = worlds.find(w => w.id === id);

          if (foundWorld) {

            currentUniverse = universe;
            currentWorld = foundWorld;

            data = await fetch(`data/${universe.id}/${id}.json`)
              .then(res => res.json());

            if (breadcrumbs) {
              breadcrumbs.innerHTML = `
                <a href="home.html">Home</a> >
                <a href="category.html?id=${universe.id}">
                  ${universe.name}
                </a> >
                ${foundWorld.name}
              `;
            }

            break;
          }

        } catch (e) {
          continue;
        }
      }

    }

    // ================= SAFETY CHECK =================
    if (!data || data.length === 0) {
      container.innerHTML = "<p style='color:white'>No data found.</p>";
      return;
    }

    render(data);
    generateAlphabet(data);
    updateCount(data.length);

    // ================= TOGGLE =================
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        container.classList.toggle("hide-images");
        toggleBtn.textContent =
          container.classList.contains("hide-images")
            ? "Show Images"
            : "Hide Images";
      });
    }

    // ================= SORT =================
    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        let sorted = [...data];

        if (sortSelect.value === "az")
          sorted.sort((a, b) => a.name.localeCompare(b.name));

        if (sortSelect.value === "za")
          sorted.sort((a, b) => b.name.localeCompare(a.name));

        render(sorted);
      });
    }

  } catch (error) {
    console.error("Category page error:", error);
  }

});


// ================= RENDER =================
function render(items) {

  const container = document.getElementById("categoryContainer");
  container.innerHTML = "";

  items.forEach(item => {

    const card = document.createElement("div");
    card.className = "card";
    card.id = item.id;

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${item.image || item.thumbnail || ''}" alt="${item.name}">
      </div>
      <div class="card-title">${item.name}</div>
    `;

    card.addEventListener("click", () => {

      if (item.type === "entity") {
        window.location.href = `entity.html?id=${item.id}`;
      } else {
        window.location.href = `category.html?id=${item.id}`;
      }

    });

    container.appendChild(card);
  });

}


// ================= COUNT =================
function updateCount(total) {
  const countElement = document.getElementById("categoryCount");
  if (countElement) {
    countElement.textContent = `${total} Items`;
  }
}


// ================= ALPHABET =================
function generateAlphabet(items) {

  const alphabetBar = document.getElementById("alphabetBar");
  if (!alphabetBar) return;

  alphabetBar.innerHTML = "";

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  letters.forEach(letter => {

    const btn = document.createElement("button");
    btn.className = "alphabet-btn";
    btn.textContent = letter;

    btn.addEventListener("click", () => {

      const match = items.find(item =>
        item.name.toUpperCase().startsWith(letter)
      );

      if (match) {
        document.getElementById(match.id)
          ?.scrollIntoView({ behavior: "smooth" });
      }

    });

    alphabetBar.appendChild(btn);
  });

}