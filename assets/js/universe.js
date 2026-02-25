const params = new URLSearchParams(window.location.search);
const universeId = params.get("universe");

const container = document.getElementById("universeContainer");
const breadcrumbs = document.getElementById("breadcrumbs");

let worldsData = [];

fetch("data/worlds.json")
  .then(res => res.json())
  .then(data => {
    worldsData = data.filter(w => w.universe === universeId);
    render(worldsData);
  });

function render(data) {
  container.innerHTML = "";
  data.forEach(world => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${world.image}">
      </div>
      <div class="card-title">${world.name}</div>
    `;
    container.appendChild(card);
  });
}

const filter = document.getElementById("filterSelect");

if (filter) {
  filter.addEventListener("change", function () {

    let sorted = [...worldsData];

    if (this.value === "az")
      sorted.sort((a,b)=>a.name.localeCompare(b.name));

    if (this.value === "za")
      sorted.sort((a,b)=>b.name.localeCompare(a.name));

    if (this.value === "new")
      sorted.sort((a,b)=>b.created - a.created);

    if (this.value === "old")
      sorted.sort((a,b)=>a.created - b.created);

    render(sorted);
  });
}