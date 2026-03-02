document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const searchBox = document.querySelector(".search-box");

  if (!searchInput || !searchResults || !searchBox) return;

  // 🔥 Load search data once
  fetch("data/search-data.json")
    .then(res => res.json())
    .then(data => {

      // ===== SEARCH INPUT =====
      searchInput.addEventListener("input", () => {

        const value = searchInput.value.toLowerCase().trim();
        searchResults.innerHTML = "";

        if (!value) {
          searchResults.style.display = "none";
          return;
        }

        const filtered = data.filter(item =>
          item.name.toLowerCase().includes(value) ||
          (item.tags && item.tags.join(" ").toLowerCase().includes(value))
        );

        filtered.slice(0, 10).forEach(item => {

          const div = document.createElement("div");
          div.className = "search-item";

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

        searchResults.style.display =
          filtered.length > 0 ? "block" : "none";
      });

    })
    .catch(err => console.error("Search load error:", err));


  // ===== CLICK OUTSIDE CLOSE =====
  document.addEventListener("click", (event) => {
    if (!searchBox.contains(event.target)) {
      searchResults.style.display = "none";
    }
  });

});