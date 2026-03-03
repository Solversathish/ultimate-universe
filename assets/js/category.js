document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("categoryContainer");
  const breadcrumbs = document.getElementById("breadcrumbs");
  const countElement = document.getElementById("categoryCount");
  const alphabetBar = document.getElementById("alphabetBar");
  const toggleBtn = document.getElementById("toggleImages");
  const sortSelect = document.getElementById("filterSelect");

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const universeId = params.get("universe");
  const parentId = params.get("parent");

  if (!universeId) {
    container.innerHTML = "<p style='color:white'>Universe not specified.</p>";
    return;
  }

  let database = [];

  try {
    database = await fetch(`data/${universeId}.json`)
      .then(res => {
        if (!res.ok) throw new Error("Universe file not found");
        return res.json();
      });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:white'>Data not found.</p>";
    return;
  }

  // ================= FILTER ITEMS =================
  let items;

  if (!parentId) {
    items = database.filter(item => item.parent === null);
    if (breadcrumbs) {
      breadcrumbs.innerHTML =
        `<a href="home.html">Home</a> > ${capitalize(universeId)}`;
    }
  } else {
    items = database.filter(item => item.parent === parentId);

    if (breadcrumbs) {
      breadcrumbs.innerHTML = `
        <a href="home.html">Home</a> >
        <a href="category.html?universe=${universeId}">
          ${capitalize(universeId)}
        </a> >
        ${capitalize(parentId)}
      `;
    }
  }

  if (!items || items.length === 0) {
    container.innerHTML =
      "<p style='color:white'>No items found.</p>";
    return;
  }

  render(items);
  generateAlphabet(items);
  updateCount(items.length);

  // ================= TOGGLE =================
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      container.classList.toggle("hide-images");
      toggleBtn.textContent =
        container.classList.contains("hide-images")
          ? "Show Images"
          : "Hide Images";
    });
  }

  // ================= SORT =================
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      let sorted = [...items];

      if (sortSelect.value === "az")
        sorted.sort((a, b) => a.name.localeCompare(b.name));

      if (sortSelect.value === "za")
        sorted.sort((a, b) => b.name.localeCompare(a.name));

      render(sorted);
    });
  }

});


// ================= RENDER =================
function render(items) {

  const container = document.getElementById("categoryContainer");
  container.innerHTML = "";

  const params = new URLSearchParams(window.location.search);
  const universeId = params.get("universe");

  items.forEach(item => {

    const card = document.createElement("div");
    card.className = "card";
    card.id = item.id;

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${item.image || item.thumbnail || ''}" alt="${item.name}">
      </div>
      <div class="card-title">${item.name}</div>
    `;

    card.addEventListener("click", () => {

      if (item.type === "entity") {

        window.location.href =
          `entity.html?universe=${universeId}&id=${item.id}`;

      } else {

        window.location.href =
          `category.html?universe=${universeId}&parent=${item.id}`;
      }

    });

    container.appendChild(card);
  });

}


// ================= COUNT =================
function updateCount(total) {
  const el = document.getElementById("categoryCount");
  if (el) el.textContent = `${total} Items`;
}


// ================= ALPHABET =================
function generateAlphabet(items) {

  const bar = document.getElementById("alphabetBar");
  if (!bar) return;

  bar.innerHTML = "";

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  letters.forEach(letter => {

    const btn = document.createElement("button");
    btn.className = "alphabet-btn";
    btn.textContent = letter;

    btn.addEventListener("click", () => {

      const match = items.find(item =>
        item.name.toUpperCase().startsWith(letter)
      );

      if (match) {
        document.getElementById(match.id)
          ?.scrollIntoView({ behavior: "smooth" });
      }

    });

    bar.appendChild(btn);
  });

}


// ================= HELPER =================
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}