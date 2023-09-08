const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const {
  azure_chat_deployment_name,
  azure_chatapi,
} = require("../../chatgpt/index");
const id = "00000001";

const logPath = path.resolve(`./build_logs/log-${id}`);
const errLogPath = path.resolve(`./build_logs/log-err-${id}`);
const buildLogStream = fs.createWriteStream(logPath);
const errLogStream = fs.createWriteStream(errLogPath);
const { roleMap, roleDescriptionMap } = require("../../utils/constants");

const triggerBuild = (req, res) => {
  const stream = exec(
    "cd project && npm install --legacy-peer-deps && npm run build"
  );
  stream.stderr.on("data", (data) => {
    errLogStream.write(data);
  });
  stream.stdout.on("data", (data) => {
    buildLogStream.write(data);
  });
  stream.stdout.on("close", () => {
    buildLogStream.write("$$$$$$end$$$$$$");
    buildLogStream.close();
    recover();
  });
  stream.stderr.on("close", () => {
    errLogStream.close();
  });
  res.json({
    success: true,
    res: {
      id,
    },
  });
};
async function errorAnalyzior(filecontent) {
  const roleDescription = roleDescriptionMap["4"];
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
const recover = async () => {
  const errorString = fs.readFileSync(errLogPath).toString();
  const completion = await errorAnalyzior(errorString);
};

const getBuildLogs = (req, res) => {
  const { id } = req.query;
  const logPath = path.resolve(`./build_logs/log-${id}`);
  const fileContent = fs.readFileSync(logPath);
  res.json({
    success: true,
    res: { buildLogs: fileContent.toString() },
  });
};

module.exports = { triggerBuild, getBuildLogs };
