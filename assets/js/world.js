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
const toggleBtn = document.getElementById("toggleView");
const entityCount = document.getElementById("entityCount");

function render(data) {

  container.innerHTML = "";

  if (entityCount) {
    entityCount.textContent = `${data.length} Characters`;
  }

  data.forEach(entity => {

    const card = document.createElement("div");
    card.className = "card";

    let imageHTML = "";

    if (imagesVisible) {
      imageHTML = `
        <div class="image-wrapper">
          <img src="${entity.image}" alt="${entity.name}">
        </div>
      `;
    }

    card.innerHTML = `
      ${imageHTML}
      <div class="card-title">${entity.name}</div>
    `;

    container.appendChild(card);
  });
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
function initializeControls() {

  if (filterSelect) {
    filterSelect.addEventListener("change", function () {
      applySort(this.value);
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {

      imagesVisible = !imagesVisible;

      this.textContent = imagesVisible
        ? "Hide Images"
        : "Show Images";

      render(allEntities);
    });
  }
}