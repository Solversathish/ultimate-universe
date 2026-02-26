const params = new URLSearchParams(window.location.search);
const worldId = params.get("world");

const container = document.getElementById("worldContainer");
const breadcrumbs = document.getElementById("breadcrumbs");

let entitiesData = [];
let worldsData = [];

Promise.all([
  fetch("data/entities.json").then(res => res.json()),
  fetch("data/worlds.json").then(res => res.json())
]).then(([entities, worlds]) => {

  entitiesData = entities;
  worldsData = worlds;

  const currentWorld = worldsData.find(w => w.id === worldId);

  if (!currentWorld) return;

  // 🔥 Breadcrumb logic
  if (breadcrumbs) {
    breadcrumbs.innerHTML = `
      <a href="home.html">Home</a> > 
      <a href="universe.html?universe=${currentWorld.universe}">
        ${currentWorld.universe}
      </a> > 
      ${currentWorld.name}
    `;
  }

  const filtered = entitiesData.filter(e => e.world === worldId);

  render(filtered);

});

function render(data) {

  container.innerHTML = "";

  data.forEach(entity => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${entity.image}">
      </div>
      <div class="card-title">${entity.name}</div>
    `;

    container.appendChild(card);

  });
}