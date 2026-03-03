document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("categoryContainer");
  const breadcrumbs = document.getElementById("breadcrumbs");
  const countElement = document.getElementById("categoryCount");
  const alphabetBar = document.getElementById("alphabetBar");
  const toggleBtn = document.getElementById("toggleImages");
  const sortSelect = document.getElementById("filterSelect");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  let data = [];

  try {

    // STEP 1: Check if it is universe
    const universes = await fetch("data/universes.json").then(res => res.json());
    const universeMatch = universes.find(u => u.id === id);

    if (universeMatch) {
      data = await fetch(`data/${id}/worlds.json`).then(res => res.json());
      breadcrumbs.innerHTML = `<a href="home.html">Home</a> > ${universeMatch.name}`;
    }

    else {

      // STEP 2: Check inside each universe
      for (let universe of universes) {

        // Check worlds.json
        const worldsPath = `data/${universe.id}/worlds.json`;

        try {
          const worlds = await fetch(worldsPath).then(res => res.json());
          const worldMatch = worlds.find(w => w.id === id);

          if (worldMatch) {
            data = await fetch(`data/${universe.id}/${id}.json`).then(res => res.json());

            breadcrumbs.innerHTML = `
              <a href="home.html">Home</a> >
              <a href="category.html?id=${universe.id}">${universe.name}</a> >
              ${worldMatch.name}
            `;
            break;
          }
        } catch {}

      }

    }

    render(data);
    generateAlphabet(data);
    updateCount(data.length);

    // Toggle
    toggleBtn.addEventListener("click", () => {
      container.classList.toggle("hide-images");
      toggleBtn.textContent =
        container.classList.contains("hide-images")
          ? "Show Images"
          : "Hide Images";
    });

    // Sort
    sortSelect.addEventListener("change", () => {
      let sorted = [...data];

      if (sortSelect.value === "az")
        sorted.sort((a, b) => a.name.localeCompare(b.name));

      if (sortSelect.value === "za")
        sorted.sort((a, b) => b.name.localeCompare(a.name));

      render(sorted);
    });

  } catch (error) {
    console.error("Category error:", error);
  }

});

function render(items) {

  const container = document.getElementById("categoryContainer");
  container.innerHTML = "";

  items.forEach(item => {

    const card = document.createElement("div");
    card.className = "card";
    card.id = item.id;

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${item.image || item.thumbnail}">
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

function updateCount(total) {
  document.getElementById("categoryCount").textContent =
    `${total} Items`;
}

function generateAlphabet(items) {

  const alphabetBar = document.getElementById("alphabetBar");
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