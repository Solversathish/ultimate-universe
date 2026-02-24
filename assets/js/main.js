// 🔥 LIVE SEARCH WITH DROPDOWN
let searchData = [];

fetch("data/search-data.json")
  .then(res => res.json())
  .then(data => {
    searchData = data;
  });

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase().trim();

  if (value === "") {
    searchResults.style.display = "none";
    return;
  }

  const filtered = searchData.filter(item =>
    item.name.toLowerCase().includes(value) ||
    item.tags.some(tag => tag.toLowerCase().includes(value))
  );

  displayResults(filtered);
});

function displayResults(results) {
  searchResults.innerHTML = "";

  if (results.length === 0) {
    searchResults.style.display = "none";
    return;
  }

  results.slice(0, 6).forEach(item => {
    const div = document.createElement("div");
    div.classList.add("search-item");

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <div>${item.name}</div>
        <div class="search-type">${item.type}</div>
      </div>
    `;

    div.addEventListener("click", () => {
      window.location.href = item.url;
    });

    searchResults.appendChild(div);
  });

  searchResults.style.display = "block";
}

document.addEventListener("click", function(e) {
  if (!e.target.closest(".search-box")) {
    searchResults.style.display = "none";
  }
});