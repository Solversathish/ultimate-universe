document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("entityContainer");

  const params = new URLSearchParams(window.location.search);
  const universeId = params.get("universe");
  const entityId = params.get("id");

  if (!universeId || !entityId) {
    container.innerHTML = "<p style='color:white'>Invalid entity.</p>";
    return;
  }

  let database = [];

  try {

    const response = await fetch(`data/${universeId}.json`);

    if (!response.ok) throw new Error("Universe file not found");

    database = await response.json();

  } catch (error) {

    console.error(error);
    container.innerHTML = "<p style='color:white'>Data not found.</p>";
    return;

  }

  const entity = database.find(item => item.id === entityId);

  if (!entity) {
    container.innerHTML = "<p style='color:white'>Entity not found.</p>";
    return;
  }

  renderEntity(entity);

});



/* =========================
   RENDER ENTITY PAGE
========================= */

function renderEntity(entity) {

  const container = document.getElementById("entityContainer");

  container.innerHTML = `

  <div class="entity-layout">

      <!-- LEFT IMAGE -->
      <div class="entity-image">
        <img src="${entity.heroImage || entity.thumbnail || entity.image || ''}">
      </div>

      <!-- RIGHT SIDE -->
      <div class="entity-details">

        <h1 class="entity-name">${entity.name}</h1>

        <!-- META DATA -->
        <div class="entity-meta">

          ${entity.age ? `
            <div class="meta-box">
              <span class="meta-label">Age</span>
              ${entity.age}
            </div>
          ` : ""}

          ${entity.category ? `
            <div class="meta-box">
              <span class="meta-label">Category</span>
              ${entity.category}
            </div>
          ` : ""}

          ${entity.anime ? `
            <div class="meta-box">
              <span class="meta-label">Anime</span>
              ${entity.anime}
            </div>
          ` : ""}

        </div>

        <!-- TABS -->
        <div class="entity-tabs">

          <button class="tab-btn active" data-tab="description">
            Description
          </button>

          <button class="tab-btn" data-tab="powers">
            Powers
          </button>

          <button class="tab-btn" data-tab="info">
            Info
          </button>

        </div>

        <!-- TAB CONTENT -->
        <div class="entity-content" id="tabContent">

          ${entity.description || "No description available."}

        </div>

      </div>

  </div>

  `;

  setupTabs(entity);

}



/* =========================
   TAB SWITCH SYSTEM
========================= */

function setupTabs(entity) {

  const buttons = document.querySelectorAll(".tab-btn");
  const content = document.getElementById("tabContent");

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      const tab = button.dataset.tab;

      if (tab === "description") {

        content.innerHTML =
          entity.description || "No description available.";

      }

      if (tab === "powers") {

        content.innerHTML =
          entity.powers || "No powers listed.";

      }

      if (tab === "info") {

        content.innerHTML =
          entity.extra || entity.info || "No additional info.";

      }

    });

  });

}