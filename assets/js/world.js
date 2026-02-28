const params = new URLSearchParams(window.location.search);
const worldId = params.get("world");

const breadcrumbs = document.getElementById("breadcrumbs");

Promise.all([
  fetch("data/entities.json").then(res => res.json()),
  fetch("data/worlds.json").then(res => res.json())
])
.then(([entities, worlds]) => {

  const currentWorld = worlds.find(w => w.id === worldId);

  if (!currentWorld) return;

  // ✅ Breadcrumbs
  if (breadcrumbs) {
    breadcrumbs.innerHTML = `
      <a href="home.html">Home</a> > 
      <a href="universe.html?universe=${currentWorld.universe}">
        ${currentWorld.universe}
      </a> > 
      ${currentWorld.name}
    `;
  }

  allEntities = entities.filter(e => e.world === worldId);

render(allEntities);

initializeControls();
  // ✅ Load Entities
  const filtered = entities.filter(e => e.world === worldId);

  render(filtered);

})
.catch(error => {
  console.log("Error loading world page:", error);
});

function render(data) {

  if (!container) return;

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

const alphabetBar = document.getElementById("alphabetBar");

if (alphabetBar) {

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  letters.forEach(letter => {

    const btn = document.createElement("button");
    btn.className = "alphabet-btn";
    btn.textContent = letter;

    btn.addEventListener("click", () => {
      scrollToLetter(letter);
    });

    alphabetBar.appendChild(btn);

  });
}

function scrollToLetter(letter) {

  const cards = document.querySelectorAll(".card");

  for (let card of cards) {

    const title = card.querySelector(".card-title").textContent;

    if (title.toUpperCase().startsWith(letter)) {

      card.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      break;
    }
  }
}

let allEntities = [];
let imagesVisible = true;

const container = document.getElementById("worldContainer");
const filterSelect = document.getElementById("filterSelect");
const toggleBtn = document.getElementById("toggleImages");
const entityCount = document.getElementById("entityCount");

const worldContainer = document.getElementById("worldContainer");
const worldCount = document.getElementById("worldCount");

function renderWorlds(data) {
  worldContainer.innerHTML = "";

  data.forEach(world => {
    worldContainer.innerHTML += `
      <div class="card">
        <div class="image-wrapper">
          <img src="${world.image}" />
        </div>
        <div class="card-title">${world.name}</div>
      </div>
    `;
  });

  worldCount.textContent = `${data.length} Items`;
}

function applySort(value) {

  let sorted = [...allEntities];

  if (value === "az") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (value === "za") {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  }

  render(sorted);
}

/* 🔥 AFTER DATA LOAD */
const grid = document.getElementById("worldContainer");

toggleBtn.addEventListener("click", () => {
  grid.classList.toggle("hide-images");

  if (grid.classList.contains("hide-images")) {
    toggleBtn.textContent = "Show Images";
  } else {
    toggleBtn.textContent = "Hide Images";
  }
});