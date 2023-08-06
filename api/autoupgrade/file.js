/*
 * @Author: LAPTOP-P7G9LM4M\wumen 332982129@qq.com
 * @Date: 2023-07-30 16:02:43
 * @LastEditors: LAPTOP-P7G9LM4M\wumen 332982129@qq.com
 * @LastEditTime: 2023-08-06 20:29:39
 * @FilePath: \chaofun-frontc:\Users\wumen\Documents\msdocs-nodejs-mongodb-azure-sample-app\api\autoupgrade\file.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fs = require("fs-extra");
const path = require("path");
const projectPath = path.resolve("./project");
const git = require("simple-git");
const gitRepoPath = path.resolve("./project");
const Diff2html = require("diff2html");
const gitHandler = git(gitRepoPath);

const ignoreList = ["node_modules", "dist", ".vscode", ".angular", ".git"];

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
    console.log(err);
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

module.exports = { getFileList, getFileContent, getDiffHtmlString };
