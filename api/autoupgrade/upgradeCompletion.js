/*
 * @Author: LAPTOP-P7G9LM4M\wumen 332982129@qq.com
 * @Date: 2023-08-12 20:18:15
 * @LastEditors: LAPTOP-P7G9LM4M\wumen 332982129@qq.com
 * @LastEditTime: 2023-08-13 19:36:53
 * @FilePath: \chaofun-frontc:\Users\wumen\Documents\msdocs-nodejs-mongodb-azure-sample-app\api\autoupgrade\upgradeCompletion.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const {
  azure_chat_deployment_name,
  azure_chatapi,
} = require("../../chatgpt/index");
const { roleMap, roleDescriptionMap } = require("../../utils/constants");
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
  const filePathTree = await getFiles(path.resolve("./project"));
  const dfs = async (pathTree) => {
    for (let item of pathTree) {
      if (item && item.key && item.isLeaf) {
        try {
          const content = fs.readFileSync(item.key);
          const res = await getChatCompletions(content.toString());
          const modifiedFileContent = res.choices[0].message.content;
          fs.writeFileSync(item.key, modifiedFileContent);
        } catch (err) {
          console.log(err);
        }
      } else {
        if (item.children && item.children.length !== 0) {
          dfs(item.children);
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
