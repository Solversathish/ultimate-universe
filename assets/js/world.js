const params = new URLSearchParams(window.location.search);
const worldId = params.get("world");

const container = document.getElementById("worldContainer");
const breadcrumbs = document.getElementById("breadcrumbs");

fetch("data/entities.json")
  .then(res => res.json())
  .then(data => {
    const filtered = data.filter(e => e.world === worldId);

    breadcrumbs.innerHTML = `
      <a href="home.html">Home</a> > ${worldId}
    `;

    filtered.forEach(entity => {
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
  });