const fs = require("fs");
const path = require("path");
const packageJSONPath = path.resolve("./project/package.json");
const packageOutputPath = path.resolve("./package-version.json");
const content = fs.readFileSync(packageJSONPath);
const { execSync } = require("child_process");

let packageJSON = JSON.parse(content);
let packageList = [
  ...Object.keys(packageJSON.dependencies),
  ...Object.keys(packageJSON.devDependencies),
];
let packagesVersionsJson = {};
for (let i = 0; i < packageList.length; i++) {
  let outputStrArray = JSON.stringify(
    JSON.parse(
      execSync(`npm view ${packageList[i]} versions`)
        .toString()
        .replace(new RegExp(/'/g), '"')
    ).slice(-10)
  );
  packagesVersionsJson[packageList[i]] = outputStrArray;
}
fs.writeFileSync(packageOutputPath, JSON.stringify(packagesVersionsJson));
