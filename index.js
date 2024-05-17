const fs = require('fs')

const dbFile = "db.json";

function init () {
    const fileExist = fs.existsSync(dbFile);

    if(!fileExist) {
        fs.writeFileSync(dbFile, JSON.stringify({ koders: [] }));
    }
}

function getKoders () {
    const content = fs.readFileSync(dbFile,"utf-8");
    return JSON.parse(content).koders
}

function updateKoders (koders) {
    const updateKoders = { koders : koders }
    const updateKodersAsString = JSON.stringify(updateKoders)
    fs.writeFileSync(dbFile, updateKodersAsString)
}

function add (koder) {
    const koders = getKoders()
    koders.push(koder)
    updateKoders(koders)
}

function deleteKoder (koderIndex) {
    const koders = getKoders()
    koders.splice(koderIndex, 1)
    updateKoders(koders)
}

function seeKoders () {
    const koders = getKoders()

    if(!koders.length){
        console.log('[Vacio]')
        process.exit()
    }

    koders.forEach((koder, index) => {
        console.log(`${index} - ${koder}`)
    });
}

function resetKoders() {
    updateKoders([])
}

function printHelp() {
    console.log(`
Usage: node index.js <command> [args]

Commands:
  seeKoders            Display all koders
  add <name>           Add a new koder
  deleteKoder <index>  Delete a koder by index
  resetKoders          Remove all koders
`);
}

function mainProgram() {
    const command = process.argv[2]
    const arg = process.argv[3]

    init()

    if (!command) {
        printHelp();
        process.exit(0);
    }

    switch (command) {
        case "seeKoders":
          seeKoders();
          break;
    
        case "add":
          if (!arg) {
            console.error("Error add");
            process.exit(1);
          }
          add(arg);
          seeKoders();
          console.log("Koder added");
          break;
    
        case "deleteKoder":
          if (!arg) {
            console.error("missing koder index");
            process.exit(1);
          }
    
          const idx = parseInt(arg);
          if (isNaN(idx)) {
            console.error("Invalid index");
            process.exit(1);
          }
    
          const koders = getKoders();
    
          if (idx < 0 || idx >= koders.length) {
            console.error("Invalid index");
            process.exit(1);
          }
    
          deleteKoder(idx);
          seeKoders();
          console.log("Koder remove!");
          break;
    
        case "resetKoders":
          resetKoders();
          console.log("Vacio");
          break;
    
        default:
          console.error("Invalid command: ", command);
          printHelp();
          process.exit(1);
          break;
      }
} 

mainProgram()