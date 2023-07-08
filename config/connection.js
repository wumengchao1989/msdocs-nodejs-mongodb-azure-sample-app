require("dotenv").config();
console.log(process.env.NODE_ENV)

async function getConnectionInfo() {
  console.log(process.env);
  console.log('markname',process.env.markname)
  return {
    DATABASE_URL: process.env.AZURE_COSMOS_CONNECTIONSTRING,
    DATABASE_NAME: process.env.DATABASE_NAME,
  };
}

module.exports = {
  getConnectionInfo,
};
