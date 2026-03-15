function renderEntityNavigation(list,currentId,universe,path){

  const nav = document.getElementById("entityNavigation");
  if(!nav) return;

  const index = list.findIndex(i => i.id === currentId);

  if(index === -1) return;

  const prev = list[index-1];
  const next = list[index+1];

  let listURL;

  if(path){
    listURL = `category.html?universe=${universe}&path=${path}`;
  }else{
    listURL = `category.html?universe=${universe}`;
  }

  nav.innerHTML = `

  <div class="entity-nav">

    <div class="nav-left">
      ${prev ? `
      <button onclick="goToEntity('${prev.id}','${universe}','${path || ""}')">
      ← ${prev.name}
      </button>` : ""}
    </div>

    <div class="nav-center">
      <button onclick="window.location.href='${listURL}'">
      View Full List
      </button>
    </div>

    <div class="nav-right">
      ${next ? `
      <button onclick="goToEntity('${next.id}','${universe}','${path || ""}')">
      ${next.name} →
      </button>` : ""}
    </div>

  </div>

  `;
}

function goToEntity(id,universe,path){

  let url = `entity.html?universe=${universe}&id=${id}`;

  if(path){
    url += `&path=${path}`;
  }

  window.location.href = url;

}