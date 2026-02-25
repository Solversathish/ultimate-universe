const params = new URLSearchParams(window.location.search);
const universeId = params.get("universe");

const container = document.getElementById("worldContainer");
const breadcrumbs = document.getElementById("breadcrumbs");
const filterSelected = document.getElementById("filterSelected");
const filterOptions = document.getElementById("filterOptions");

let worldsData = [];

/* ================= LOAD WORLDS ================= */

fetch("data/worlds.json")
  .then(res => res.json())
  .then(data => {

    worldsData = data.filter(world => world.universe === universeId);

    renderWorlds(worldsData);
    renderBreadcrumbs();
  });

/* ================= RENDER WORLDS ================= */

function renderWorlds(data) {

  container.innerHTML = "";

  data.forEach(world => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${world.image}" alt="${world.name}">
      </div>
      <div class="card-title">${world.name}</div>
    `;

    container.appendChild(card);
  });
}

/* ================= BREADCRUMBS ================= */

function renderBreadcrumbs() {

  breadcrumbs.innerHTML = `
    <a href="home.html">Home</a>
    <span>></span>
    <a href="world.html?universe=${universeId}">
      ${universeId.toUpperCase()}
    </a>
    <span>></span>
    Worlds
  `;
}

/* ================= FILTER TOGGLE ================= */

filterSelected.addEventListener("click", () => {
  filterOptions.style.display =
    filterOptions.style.display === "block" ? "none" : "block";
});

/* ================= FILTER SORTING ================= */

filterOptions.querySelectorAll("div").forEach(option => {

  option.addEventListener("click", () => {

    const type = option.dataset.sort;

    let sorted = [...worldsData];

    if (type === "az") {
      sorted.sort((a,b) => a.name.localeCompare(b.name));
    }

    if (type === "za") {
      sorted.sort((a,b) => b.name.localeCompare(a.name));
    }

    if (type === "new") {
      sorted.sort((a,b) => b.created - a.created);
    }

    if (type === "old") {
      sorted.sort((a,b) => a.created - b.created);
    }

    renderWorlds(sorted);
    filterOptions.style.display = "none";
  });

});

/* ================= CLOSE DROPDOWN OUTSIDE ================= */

document.addEventListener("click", (e) => {
  if (!e.target.closest(".filter-container")) {
    filterOptions.style.display = "none";
  }
});