document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("homeContainer");

  const universes = await fetch("data/universes.json")
    .then(res => res.json());

  universes.forEach(universe => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${universe.image}">
      </div>
      <div class="card-title">${universe.name}</div>
    `;

    card.addEventListener("click", () => {
      window.location.href =
        `category.html?universe=${universe.id}`;
    });

    container.appendChild(card);

  });

  
updateHomeCount(universes.length);

function updateHomeCount(total) {
  const el = document.getElementById("homeCount");
  if (el) el.textContent = `${total} items`;
}

});

let currentPage = 1;
const itemsPerPage = 60;
let allUniverses = universes;

renderPage();
createPagination();

function renderPage() {

  const container = document.getElementById("homeContainer");
  container.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const pageItems = allUniverses.slice(start, end);

  pageItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${item.image}">
      </div>
      <div class="card-title">${item.name}</div>
    `;

    card.addEventListener("click", () => {
      window.location.href =
        `category.html?universe=${item.id}`;
    });

    container.appendChild(card);
  });

}

function createPagination() {

  let pagination = document.getElementById("pagination");

  if (!pagination) {
    pagination = document.createElement("div");
    pagination.id = "pagination";
    pagination.className = "pagination";
    document.getElementById("homeContainer").after(pagination);
  }

  pagination.innerHTML = "";

  const totalPages =
    Math.ceil(allUniverses.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {

    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage)
      btn.classList.add("active-page");

    btn.addEventListener("click", () => {
      currentPage = i;
      renderPage();
      createPagination();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    pagination.appendChild(btn);
  }
}