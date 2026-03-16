const fs = require("fs");
const path = require("path");

const dataFolder = "./data";
const searchData = [];

/* ================= UNIVERSES ================= */

const universes = JSON.parse(
  fs.readFileSync(`${dataFolder}/universes.json`, "utf8")
);

universes.forEach(u => {

  searchData.push({
    name: u.name,
    id: u.id,
    universe: u.id,
    parent: "",
    type: "universe",
    url: `category.html?universe=${u.id}`
  });

});


/* ================= SCAN UNIVERSE FOLDERS ================= */

universes.forEach(u => {

  const universeFolder = `${dataFolder}/${u.id}`;

  if(!fs.existsSync(universeFolder)) return;

  const files = fs.readdirSync(universeFolder);

  files.forEach(file => {

    if(!file.endsWith(".json")) return;

    const fileName = file.replace(".json","");

    const filePath = `${universeFolder}/${file}`;

    const data = JSON.parse(
      fs.readFileSync(filePath,"utf8")
    );

    data.forEach(item => {

      /* ================= CATEGORY ================= */

      if(fileName === "categories"){

        searchData.push({
          name: item.name,
          id: item.id,
          universe: u.id,
          parent: u.name,
          type: "world",
          url: `category.html?universe=${u.id}&path=${item.id}`
        });

      }

      /* ================= NORMAL ITEMS ================= */

      else{

        const parent = fileName;

        if(item.type === "entity"){

          searchData.push({
            name: item.name,
            id: item.id,
            universe: u.id,
            path: parent,
            parent: parent.replace(/_/g," "),
            type: "entity",
            url: `entity.html?universe=${u.id}&path=${parent}&id=${item.id}`
          });

        }

        else{

          searchData.push({
            name: item.name,
            id: item.id,
            universe: u.id,
            path: parent,
            parent: parent.replace(/_/g," "),
            type: "subworld",
            url: `category.html?universe=${u.id}&path=${parent},${item.id}`
          });

        }

      }

    });

  });

});


/* ================= SAVE FILE ================= */

fs.writeFileSync(
  `${dataFolder}/search-data.json`,
  JSON.stringify(searchData,null,2)
);

console.log("Search data generated successfully.");