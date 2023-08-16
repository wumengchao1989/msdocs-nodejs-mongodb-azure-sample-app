const {
  azure_chat_deployment_name,
  azure_chatapi,
} = require("../../chatgpt/index");
const { roleMap, roleDescriptionMap } = require("../../utils/constants");
const path = require("path");
const { getFiles } = require("./file");
const fs = require("fs");
const { keyv } = require("../../utils/keyv_cache");
const dayjs = require("dayjs");

async function getChatCompletions(filecontent) {
  const roleDescription = roleDescriptionMap["3"];
  const conversionInfo = [
    { role: roleMap.system, content: roleDescription },
    { role: roleMap.user, content: filecontent },
  ];
  const completion = await azure_chatapi.getChatCompletions(
    azure_chat_deployment_name,
    conversionInfo
  );
  return completion;
}

async function getUpdateProgress(req, res) {
  const updatedFileList = [];
  for await (const [key, value] of keyv.iterator()) {
    const fileInfo = { key, value };
    if (key !== "currentHandling") updatedFileList.push(fileInfo);
  }
  res.json({
    success: true,
    res: {
      updatedFileList,
    },
  });
}
async function triggerUpgrade(req, res) {
  const filePathTree = await getFiles(path.resolve("./project"));
  await keyv.clear();
  const dfs = async (pathTree) => {
    for await (const item of pathTree) {
      if (item && item.key && item.isLeaf) {
        try {
          await keyv.set("currentHandling", item.key);
          const content = fs.readFileSync(item.key);
          console.log("completion start", item.key);
          const res = await getChatCompletions(content.toString());
          console.log("completion end", item.key);
          const modifiedFileContent = res.choices[0].message.content;
          fs.writeFileSync(item.key, modifiedFileContent);
          await keyv.set("currentHandling", "");
          await keyv.set(item.key, dayjs().format("YYYY-MM-DD HH:mm:ss"));
        } catch (err) {
          console.log(err);
        }
      } else {
        if (item.children && item.children.length !== 0) {
          await dfs(item.children);
        }
      }
    }
  };
  dfs(filePathTree);

  try {
    res.json({
      success: true,
      res: filePathTree,
    });
  } catch (err) {
    res.json({
      success: false,
      res: err,
    });
  }
}

module.exports = { triggerUpgrade, getUpdateProgress };
