const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const id = "00000001";

const logPath = path.resolve(`./build_logs/log-${id}`);
const errLogPath = path.resolve(`./build_logs/log-err-${id}`);
const buildLogStream = fs.createWriteStream(logPath);
const errLogStream = fs.createWriteStream(errLogPath);
const { keyv } = require("../../utils/keyv_cache");
const { phaseMap } = require("../../utils/constants");

const triggerInstall = (req, res) => {
  const stream = exec("cd project && npm install --legacy-peer-deps");
  stream.stderr.on("data", (data) => {
    errLogStream.write(data);
  });
  stream.stdout.on("data", (data) => {
    buildLogStream.write(data);
  });
  stream.stdout.on("close", async () => {
    buildLogStream.write("$$$$$$end$$$$$$");
    buildLogStream.close();
    await keyv.set("progressPhase", phaseMap["build"]);
  });
  stream.stderr.on("close", async () => {
    errLogStream.close();
    await keyv.set("progressPhase", phaseMap["build"]);
  });

  res.json({
    success: true,
    res: {
      id,
    },
  });
};

const getInstallLogs = (req, res) => {
  const logPath = path.resolve(`./build_logs/install-log-${id}`);
  const fileContent = fs.readFileSync(logPath);
  res.json({
    success: true,
    res: { buildLogs: fileContent.toString() },
  });
};

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
  stream.stdout.on("close", async () => {
    buildLogStream.write("$$$$$$end$$$$$$");
    buildLogStream.close();
    await keyv.set("progressPhase", phaseMap["test"]);
  });
  stream.stderr.on("close", async () => {
    errLogStream.close();
    await keyv.set("progressPhase", phaseMap["test"]);
  });
  res.json({
    success: true,
    res: {
      id,
    },
  });
};

const getBuildLogs = (req, res) => {
  const logPath = path.resolve(`./build_logs/log-${id}`);
  const fileContent = fs.readFileSync(logPath);
  res.json({
    success: true,
    res: { buildLogs: fileContent.toString() },
  });
};

const get_progress_phase = async (req, res) => {
  const phase = await keyv.get("progressPhase");
  res.json({
    success: true,
    result: {
      phase,
    },
  });
};

module.exports = {
  triggerBuild,
  getBuildLogs,
  getInstallLogs,
  triggerInstall,
  get_progress_phase,
};
