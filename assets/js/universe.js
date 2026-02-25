const params = new URLSearchParams(window.location.search);
const universeId = params.get("universe");

const container = document.getElementById("universeContainer");
const breadcrumbs = document.getElementById("breadcrumbs");

fetch("data/worlds.json")
  .then(res => res.json())
  .then(data => {
    const filtered = data.filter(w => w.universe === universeId);

    breadcrumbs.innerHTML = `
      <a href="home.html">Home</a> > ${universeId}
    `;

    filtered.forEach(world => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <div class="image-wrapper">
          <img src="${world.image}">
        </div>
        <div class="card-title">${world.name}</div>
      `;
      card.onclick = () => {
        window.location.href = `world.html?world=${world.id}`;
      };
      container.appendChild(card);
    });
  });