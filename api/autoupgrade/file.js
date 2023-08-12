const fs = require("fs-extra");
const path = require("path");
const projectPath = path.resolve("./project");
const git = require("simple-git");
const gitRepoPath = path.resolve("./project");
const Diff2html = require("diff2html");
const gitHandler = git(gitRepoPath);

const ignoreList = [
  "node_modules",
  "dist",
  ".vscode",
  ".angular",
  ".git",
  "cypress",
  "package-lock.json",
  ".gitignore",
  ".editorconfig",
  "cypress.config.ts",
  "README.md",
  ".scss",
  ".html",
  ".ico",
  
];

const getFiles = (filePath) => {
  const fileList = fs.readdirSync(filePath).map((item, index) => {
    if (ignoreList.indexOf(item) !== -1) return;
    const itemFilePath = path.join(filePath, item);
    if (fs.lstatSync(itemFilePath).isDirectory()) {
      return {
        title: item,
        children: getFiles(itemFilePath),
        key: itemFilePath,
      };
    }
    return { title: item, isLeaf: true, key: itemFilePath };
  });
  return fileList;
};
const getFileList = (req, res) => {
  const fullFileList = getFiles(projectPath);
  res.json({
    success: true,
    res: fullFileList,
  });
};

const getFileContent = (req, res) => {
  const { path } = req.query;
  let fileContent = "";
  try {
    if (path) {
      fileContent = fs.readFileSync(path[0]).toString();
      res.json({
        success: true,
        res: fileContent,
      });
    }
  } catch (err) {
    res.json({
      success: false,
      res: err,
    });
  }
};

const getDiffHtmlString = async (req, res) => {
  const { path } = req.query;
  const diff = await gitHandler.diff(
    path ? ["main", "test1", path] : ["main", "test1"]
  );
  const diffJson = Diff2html.parse(diff);
  const diffHtml = Diff2html.html(diffJson, {
    drawFileList: true,
    outputFormat: "side-by-side",
    drawFileList: false,
  });
  res.json({
    success: true,
    res: diffHtml,
    diff,
  });
};

module.exports = { getFiles, getFileList, getFileContent, getDiffHtmlString };
