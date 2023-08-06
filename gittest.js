const git = require("simple-git");
const path = require("path");
const gitRepoPath = path.resolve("./project");
const Diff2html = require("diff2html");
const { exec } = require("child_process");
const fs = require("fs");
async function test() {
  const triggerBuild = () => {
    const logPath = path.resolve(__dirname, "./build_logs/log");
    const buildLogStream = fs.createWriteStream(logPath);
    const stream = exec("cd project && npm install && npm run build");
    stream.stdout.on("open", () => {
      console.log("open");
    });
    stream.stdout.on("data", (data) => {
      buildLogStream.write(data);
    });
    stream.stdout.on("close", () => {
      buildLogStream.close();
    });
  };
  triggerBuild();
}
test();
