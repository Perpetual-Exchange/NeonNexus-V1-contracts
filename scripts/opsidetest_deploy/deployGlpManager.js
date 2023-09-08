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
    "0x357fa1565B94D9F7C770D30c95a405F805d95fEA"
  );
  const usdg = await contractAt(
    "USDG",
    "0xEDD8b1e92c6584AFc0A4509f1122244195e0157B"
  );
  const glp = await contractAt(
    "OLP",
    "0xa4213F4606bc3E8358748c3BdecC2F0d27364F47"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0xB5350F5F6514103Bc0A6CFECE2d644042437C769"
  );

  const glpManager = await contractAt(
    "GlpManager",
    "0x748eF6Ac94148AC23Df596Fd1a60E47D56e0C4e4"
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
