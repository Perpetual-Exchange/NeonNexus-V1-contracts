const {
  deployContract,
  contractAt,
  sendTxn,
  writeTmpAddresses,
  callWithRetries,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");
const { toUsd } = require("../../test/shared/units");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

async function main() {
  const { nativeToken } = tokens;

  const vault = await contractAt(
    "Vault",
    "0xffe4E159fd0f96b01463b297a5bcA784000C50C9"
  );
  const usdg = await contractAt(
    "USDG",
    "0x17de690b6116DD04f68eA8b095f861FA9fACD86D"
  );
  const glp = await contractAt(
    "GLP",
    "0x1C1e43bE7F0f5175DF59ad922F56120545AED78C"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0xdE72707F7DC1E49168BC6b0B722dc559C77033CE"
  );

  const glpManager = await contractAt(
    "GlpManager",
    "0xDC72632f1fc4159E75533B7B6c2BdA92d1644639"
  );
  //   const glpManager = await deployContract("GlpManager", [
  //     vault.address,
  //     usdg.address,
  //     glp.address,
  //     shortsTracker.address,
  //     15 * 60,
  //   ]);

  await sendTxn(
    glpManager.setInPrivateMode(true),
    "glpManager.setInPrivateMode"
  );

  //   await sendTxn(glp.setMinter(glpManager.address, true), "glp.setMinter");
  //   await sendTxn(usdg.addVault(glpManager.address), "usdg.addVault");
  //   await sendTxn(vault.setManager(glpManager.address, true), "vault.setManager");

  writeTmpAddresses({
    glpManager: glpManager.address,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
