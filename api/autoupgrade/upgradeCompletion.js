const {
  azure_chat_deployment_name,
  azure_chatapi,
} = require("../../chatgpt/index");
const chatGroups = require("../../models/chatGroups.js");
const {
  roleMap,
  assistantLabel,
  userLabel,
  roleDescriptionMap,
} = require("../../utils/constants");
const path = require("path");
const { getFiles } = require("./file");
const fs = require("fs");

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
async function triggerUpgrade(req, res) {
  const filePathTree = getFiles(path.resolve("./project"));
  const dfs = async (pathTree) => {
    for (let item of pathTree) {
      if (item && item.key && item.isLeaf) {
        try {
          const content = fs.readFileSync(item.key);
          const res = await getChatCompletions(content.toString());
          const modifiedFileContent = res.choices[0].message.content;
          console.log(modifiedFileContent);
          fs.writeFileSync(item.key, modifiedFileContent);
        } catch (err) {
          console.log(err);
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

module.exports = { triggerUpgrade };
