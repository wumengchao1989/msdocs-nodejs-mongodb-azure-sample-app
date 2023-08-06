const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const triggerBuild = (req, res) => {
  const id = "00000001";
  const logPath = path.resolve(`./build_logs/log-${id}`);
  const buildLogStream = fs.createWriteStream(logPath);
  const stream = exec("cd project && npm install && npm run build");
  stream.stdout.on("open", () => {
    console.log("open");
  });
  stream.stdout.on("data", (data) => {
    buildLogStream.write(data);
  });
  stream.stdout.on("close", () => {
    buildLogStream.write("$$$$$$end$$$$$$");
    buildLogStream.close();
  });
  res.json({
    success: true,
    res: {
      id,
    },
  });
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
