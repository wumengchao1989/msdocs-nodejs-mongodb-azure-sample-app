require("dotenv").config();
const mongoose = require("mongoose");
const { getSecret } = require("./keyvault");

async function putKeyVaultSecretInEnvVar() {
  const secretName = process.env.KEY_VAULT_SECRET_NAME_DATABASE_URL;
  const keyVaultName = process.env.KEY_VAULT_NAME;

  console.log(secretName);
  console.log(keyVaultName);

  if (!secretName || !keyVaultName)
    throw Error("getSecret: Required params missing");

  connectionString = await getSecret(secretName, keyVaultName);
  process.env.DATABASE_URL = connectionString;
}

async function getConnectionInfo() {
  return {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
  };
}

module.exports = {
  getConnectionInfo,
};
