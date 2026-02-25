const params = new URLSearchParams(window.location.search);
const universeId = params.get("universe");

const container = document.getElementById("universeContainer");
const breadcrumbs = document.getElementById("breadcrumbs");

if (breadcrumbs && universeId) {
  breadcrumbs.innerHTML = `
    <a href="home.html">Home</a> > ${universeId}
  `;
}

if (container && universeId) {

  fetch("data/worlds.json")
    .then(res => res.json())
    .then(data => {

      const filtered = data.filter(w =>
        w.universe.toLowerCase() === universeId.toLowerCase()
      );

      container.innerHTML = "";

      filtered.forEach(world => {

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <div class="image-wrapper">
            <img src="${world.image}">
          </div>
          <div class="card-title">${world.name}</div>
        `;

        card.addEventListener("click", () => {
          window.location.href = `world.html?world=${world.id}`;
        });

        container.appendChild(card);
      });

    })
    .catch(error => {
      console.log("Error loading worlds:", error);
    });

}

if (filter) {
  filter.addEventListener("change", function () {

    let sorted = [...worldsData];

    if (this.value === "az")
      sorted.sort((a,b)=>a.name.localeCompare(b.name));

    if (this.value === "za")
      sorted.sort((a,b)=>b.name.localeCompare(a.name));

    render(sorted);
  });
}