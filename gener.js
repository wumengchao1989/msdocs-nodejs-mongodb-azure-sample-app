const fs = require("fs");
const path = require("path");
const tsFile = path.resolve("./api/angulardemo.ts");
const resFile = path.resolve("./api/result.ts");
let file = fs.readFileSync(tsFile).toString();
file = file.replace(/\\n/g, " ");
file = file.replace(/\\n/g, " ");
fs.writeFileSync(resFile, file);
