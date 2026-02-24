const container = document.getElementById("gridContainer");
const searchInput = document.getElementById("searchInput");
const dropdown = document.getElementById("searchDropdown");

let universesData = [];

fetch("data/universes.json")
  .then(res => res.json())
  .then(data => {
    universesData = data;
    displayUniverses(universesData);
  });

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

// 🔥 LIVE SEARCH WITH DROPDOWN
searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase();
  dropdown.innerHTML = "";

  if (value.length < 2) {
    dropdown.style.display = "none";
    displayUniverses(universesData);
    return;
  }

  const filtered = universesData.filter(item =>
    item.name.toLowerCase().includes(value)
  );

  displayUniverses(filtered);

  if (filtered.length > 0) {
    dropdown.style.display = "block";

    filtered.forEach(item => {
      const div = document.createElement("div");
      div.className = "search-item";
      div.textContent = item.name;

      div.addEventListener("click", () => {
        searchInput.value = item.name;
        dropdown.style.display = "none";
        displayUniverses([item]);
      });

      dropdown.appendChild(div);
    });
  } else {
    dropdown.style.display = "none";
  }
});

// Hide dropdown when clicking outside
document.addEventListener("click", function (e) {
  if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});