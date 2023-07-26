const { sendTxn } = require("../shared/helpers");

async function initializeVault() {
  return await deployContract("GMX", []);
}
