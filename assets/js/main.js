fetch("data/universes.json")
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("gridContainer");

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
  })
  .catch(error => console.error("Error loading JSON:", error));