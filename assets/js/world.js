const params = new URLSearchParams(window.location.search);
const universeId = params.get("universe");

const container = document.getElementById("worldContainer");
const breadcrumbs = document.getElementById("breadcrumbs");

let worldsData = [];

/* LOAD WORLDS */
fetch("data/worlds.json")
  .then(res => res.json())
  .then(data => {

    worldsData = data.filter(world => world.universe === universeId);

    renderWorlds(worldsData);
    renderBreadcrumbs();
  });

function renderWorlds(data) {

  if (!container) return;

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

function renderBreadcrumbs() {

  if (!breadcrumbs) return;

  breadcrumbs.innerHTML = `
    <a href="home.html">Home</a>
    <span>></span>
    ${universeId}
  `;
}