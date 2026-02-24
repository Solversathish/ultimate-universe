const container = document.getElementById("gridContainer");
const searchInput = document.getElementById("searchInput");

let universesData = [];

// Load JSON
fetch("data/universes.json")
  .then(response => response.json())
  .then(data => {
    universesData = data;
    displayUniverses(universesData);
  })
  .catch(error => console.error("Error loading JSON:", error));

// Display function
function displayUniverses(data) {
  container.innerHTML = "";

  data.forEach(universe => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${universe.image}" alt="${universe.name}">
      </div>
      <div class="card-title">${universe.name}</div>
    `;

    container.appendChild(card);
  });
}

// Search filter
searchInput.addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();

  const filtered = universesData.filter(universe =>
    universe.name.toLowerCase().includes(searchValue)
  );

  displayUniverses(filtered);
});