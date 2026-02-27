const urlParams = new URLSearchParams(window.location.search);
const universeId = urlParams.get("universe");

const container = document.getElementById("universeContainer");
const breadcrumbs = document.getElementById("breadcrumbs");
const filterSelect = document.getElementById("filterSelect");
const toggleBtn = document.getElementById("toggleView");
const worldCount = document.getElementById("worldCount");
const alphabetBar = document.getElementById("alphabetBar");
const btn = document.createElement("button");
btn.textContent = letter;
btn.classList.add("alphabet-btn");

let allWorlds = [];
let imagesVisible = true;

/* ===========================
   LOAD DATA
=========================== */

fetch("data/worlds.json")
  .then(res => res.json())
  .then(worlds => {

    allWorlds = worlds.filter(w => w.universe === universeId);

    render(allWorlds);
    generateAlphabet(allWorlds);
    setupControls();

    breadcrumbs.innerHTML = `
      <a href="home.html">Home</a> > ${universeId}
    `;

  })
  .catch(err => console.error("Universe load error:", err));

/* ===========================
   RENDER FUNCTION
=========================== */

function render(data) {

  container.innerHTML = "";

  worldCount.textContent = `${data.length} Items`;

  data.forEach(world => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      ${imagesVisible ? `
        <div class="image-wrapper">
          <img src="${world.image}">
        </div>
      ` : ""}

      <div class="card-title">${world.name}</div>
    `;

    card.onclick = () => {
      window.location.href = `world.html?world=${world.id}`;
    };

    container.appendChild(card);
  });
}

/* ===========================
   SORT + TOGGLE
=========================== */

function setupControls() {

  if (filterSelect) {
    filterSelect.addEventListener("change", function () {

      let sorted = [...allWorlds];

      if (this.value === "az") {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      }

      if (this.value === "za") {
        sorted.sort((a, b) => b.name.localeCompare(a.name));
      }

      render(sorted);
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {

      imagesVisible = !imagesVisible;

      this.textContent = imagesVisible
        ? "Hide Images"
        : "Show Images";

      render(allWorlds);
    });
  }
}

/* ===========================
   ALPHABET BAR
=========================== */

function generateAlphabet(data) {

  alphabetBar.innerHTML = "";

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  letters.forEach(letter => {

    const btn = document.createElement("button");
    btn.textContent = letter;

    btn.onclick = () => {
      const filtered = allWorlds.filter(item =>
        item.name.toUpperCase().startsWith(letter)
      );

      render(filtered);
    };

    alphabetBar.appendChild(btn);
  });
}