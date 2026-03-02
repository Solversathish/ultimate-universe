// ================= LOAD UNIVERSes =================

document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("universeContainer");

  fetch("data/universes.json")
    .then(res => res.json())
    .then(data => {

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

        card.addEventListener("click", () => {
          window.location.href = `universe.html?universe=${universe.id}`;
        });

        container.appendChild(card);
      });

    })
    .catch(err => console.log("Error loading universes:", err));

});