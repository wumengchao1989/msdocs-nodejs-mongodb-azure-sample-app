const simpleGit = require("simple-git");
const path = require("path");
const gitRepoPath = path.resolve("./project");
const Diff2html = require("diff2html");
const { exec } = require("child_process");
const fs = require("fs");
const gitClient = simpleGit(gitRepoPath);
async function test() {
  await gitClient.checkout("test1");
  console.log("checkout test1");
  await gitClient.add("./*");
  console.log("checkout test1");
  console.log("add");
  await gitClient.commit("add: init cypress");
  console.log("commit finished");
}
test();
