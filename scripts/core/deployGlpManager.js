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
    "0xAC6E2Ac93E2a1CFFadE96607fe2376F5f5952EDC"
  );
  const usdg = await contractAt(
    "USDG",
    "0x0A2627184A1AA8153A5660159B2762bCc85FF052"
  );
  const glp = await contractAt(
    "GLP",
    "0x0F02098Bb29FAc827f2DA6b330dB9B423Bd07B84"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0xD82bcA04b31eC58C5C2C62f798aC973A95c278d2"
  );

  const glpManager = await contractAt(
    "GlpManager",
    "0x5f752c0f80725fEF5B1bC45cf0dd6670E5b542aC"
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
