document.addEventListener("DOMContentLoaded", async () => {

  const container = document.getElementById("entityContainer");
  const galleryContainer = document.getElementById("galleryContainer");

  const params = new URLSearchParams(window.location.search);
  const universe = params.get("universe");
  const entityId = params.get("id");
  let path = params.get("path");

  if(!universe || !entityId){
    container.innerHTML="Invalid entity";
    return;
  }

  let entity = null;

  try{

    /* ================= UNIVERSE ENTITY ================= */

    const universeData = await fetch("data/universe_entities.json")
    .then(res=>res.json());

    if(universeData[universe] && entityId === universe){
      entity = universeData[universe];
    }

    /* ================= WORLD ENTITY ================= */

    if(!entity){

      const worldData = await fetch("data/world_entities.json")
      .then(res=>res.json());

      if(worldData[entityId]){
        entity = worldData[entityId];
      }

    }

    /* ================= SUBWORLD ENTITY ================= */

    if(!entity){

      const subworldData = await fetch("data/subworld_entities.json")
      .then(res=>res.json());

      if(subworldData[entityId]){
        entity = subworldData[entityId];

        if(!path && entity.path){
          path = entity.path;
        }
      }

    }

    /* ================= NORMAL ENTITY ================= */

    if(!entity){

      if(universe === "fruits"){

        const fruits = await fetch(`data/fruits/fruits.json`)
        .then(res=>res.json());

        entity = fruits.find(f=>f.id === entityId);

      }else{

        const categories = await fetch(`data/${universe}/categories.json`)
        .then(res=>res.json());

        for(const cat of categories){

          try{

            const level1 = await fetch(`data/${universe}/${cat.id}.json`)
            .then(res=>res.json());

            entity = level1.find(i=>i.id === entityId);

            if(entity) break;

          }catch{}

        }

      }

    }

  }catch(err){
    console.error(err);
  }

  if(!entity){
    container.innerHTML="Entity not found";
    return;
  }

  createBreadcrumbs(universe,entity,path);
  renderEntity(entity,universe,path);
  renderGallery(entity);

  buildNavigation(entityId);

});



/* ================= BREADCRUMBS ================= */

function createBreadcrumbs(universe, entity, forcedPath){

  const breadcrumbs = document.getElementById("breadcrumbs");

  const params = new URLSearchParams(window.location.search);
  const path = forcedPath || params.get("path");
  const entityId = params.get("id");

  let html = `<a href="home.html">Home</a> > `;

  if(entityId === universe){
    html += `<span>${formatName(universe)}</span>`;
  }else{
    html += `<a href="category.html?universe=${universe}">
    ${formatName(universe)}
    </a>`;
  }

  if(path){

    const levels = path.split(",");
    let accumulated = "";

    levels.forEach((level,index)=>{

      accumulated = levels.slice(0,index+1).join(",");

      html += ` > <a href="category.html?universe=${universe}&path=${accumulated}">
      ${formatName(level)}
      </a>`;

    });

  }

  if(entityId !== universe){
    html += ` > <span>${entity.name}</span>`;
  }

  breadcrumbs.innerHTML = html;

}



/* ================= ENTITY PAGE ================= */

function renderEntity(entity,universe,path){

  const container=document.getElementById("entityContainer");

  let viewListBtn = "";

  if(entity.type !== "entity"){

    let listURL="";

    if(entity.id === universe){
      listURL = `category.html?universe=${universe}`;
    }
    else if(path){
      listURL = `category.html?universe=${universe}&path=${path}`;
    }
    else{
      listURL = `category.html?universe=${universe}&path=${entity.id}`;
    }

    viewListBtn = `
    <div class="view-list-wrapper">
      <button class="view-list-btn"
      onclick="window.location.href='${listURL}'">
      View Full List of ${entity.name}
      </button>
    </div>
    `;
  }

  container.innerHTML=`

  <div class="entity-main">

    <div class="entity-hero">
      <img src="${getCDNImage(entity.id,"hero",universe,path)}" loading="lazy">
    </div>

    <div class="entity-details">

      <h1 class="entity-name">${entity.name}</h1>

      ${generateInfoTable(entity.info)}

      ${generateTabs(entity)}

    </div>

  </div>

  ${viewListBtn}

  <div id="entityNavigation"></div>

  <button id="scrollTopBtn">↑</button>

  `;

}



/* ================= TABS ================= */

function generateTabs(entity){

  if(!entity.tabs) return "";

  return `

  <div class="tabs">

    <button onclick="showTab('tab1')">${entity.tabs.tab1.title}</button>
    <button onclick="showTab('tab2')">${entity.tabs.tab2.title}</button>
    <button onclick="showTab('tab3')">${entity.tabs.tab3.title}</button>

  </div>

  <div id="tab1" class="tab-content">${entity.tabs.tab1.content}</div>
  <div id="tab2" class="tab-content" style="display:none">${entity.tabs.tab2.content}</div>
  <div id="tab3" class="tab-content" style="display:none">${entity.tabs.tab3.content}</div>

  `;
}

function showTab(tab){

  document.querySelectorAll(".tab-content")
  .forEach(t=>t.style.display="none");

  document.getElementById(tab).style.display="block";

}



/* ================= PREVIOUS NEXT ================= */

async function buildNavigation(entityId){

  const params = new URLSearchParams(window.location.search);

  const universe = params.get("universe");
  const path = params.get("path");

  let db = [];
  let level = "";

  try{

    if(entityId === universe){

      db = await fetch("data/universes.json")
      .then(r=>r.json());

      level = "universe";

    }

    else if(!path){

      db = await fetch(`data/${universe}/categories.json`)
      .then(r=>r.json());

      level = "world";

    }

    else{

      const levels = path.split(",");
      const last = levels[levels.length-1];

      db = await fetch(`data/${universe}/${last}.json`)
      .then(r=>r.json());

      level = "entity";

    }

  }catch{
    return;
  }

  const index = db.findIndex(i => i.id === entityId);

  if(index === -1) return;

  const prev = db[index-1];
  const next = db[index+1];

  const nav = document.getElementById("entityNavigation");

  function buildURL(item){

    if(level === "universe"){
      return `entity.html?universe=${item.id}&id=${item.id}`;
    }

    if(level === "world"){
      return `entity.html?universe=${universe}&id=${item.id}`;
    }

    return `entity.html?universe=${universe}&path=${path}&id=${item.id}`;
  }

  nav.innerHTML = `
  <div class="entity-navigation">

    ${prev ? `
    <button onclick="window.location.href='${buildURL(prev)}'">
    ← ${prev.name}
    </button>` : `<div></div>`}

    ${next ? `
    <button onclick="window.location.href='${buildURL(next)}'">
    ${next.name} →
    </button>` : `<div></div>`}

  </div>
  `;

}



/* ================= INFO TABLE ================= */

function generateInfoTable(info){

  if(!info) return "";

  let html=`<div class="info-table">`;

  Object.entries(info).forEach(([k,v])=>{

    html+=`
    <div class="info-row">
      <div class="info-key">${k}</div>
      <div class="info-value">${v}</div>
    </div>`;

  });

  html+=`</div>`;
  return html;

}



/* ================= GALLERY ================= */

function renderGallery(entity){

  const galleryContainer=document.getElementById("galleryContainer");

  if(!entity.gallery_count) return;

  let images="";

  for(let i=1;i<=entity.gallery_count;i++){
    images += `<img src="${getCDNImage(entity.id,"gallery")}g${i}.png" loading="lazy">`;
  }

  galleryContainer.innerHTML=`

  <div class="gallery-container">

  <h2>Gallery</h2>

  <div class="gallery-grid">

  ${images}

  </div>

  </div>

  `;
}



/* ================= SCROLL TOP ================= */

document.addEventListener("click",function(e){

  if(e.target.id==="scrollTopBtn"){
    window.scrollTo({top:0,behavior:"smooth"});
  }

});



/* ================= HELPERS ================= */

function formatName(str){

  return str
  .replace(/_/g," ")
  .replace(/\b\w/g,c=>c.toUpperCase())
  .replace("Countries","")
  .trim();

}