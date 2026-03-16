const fs = require("fs");
const path = require("path");

const dataFolder = "./data";
const outputFile = "./data/search-data.json";

let searchData = [];

const universes = fs.readdirSync(dataFolder);

universes.forEach(universe => {

  const universePath = path.join(dataFolder, universe);

  if(!fs.statSync(universePath).isDirectory()) return;

  const files = fs.readdirSync(universePath);

  files.forEach(file => {

    if(!file.endsWith(".json")) return;

    const fileName = file.replace(".json","");
    const filePath = path.join(universePath,file);

    const items = JSON.parse(fs.readFileSync(filePath));

    items.forEach(item => {

      if(item.type === "entity"){

        searchData.push({
          name:item.name,
          id:item.id,
          type:universe,
          url:`entity.html?universe=${universe}&path=${fileName}&id=${item.id}`
        });

      }

    });

  });

});

fs.writeFileSync(outputFile,JSON.stringify(searchData,null,2));

console.log("Search database generated successfully!");