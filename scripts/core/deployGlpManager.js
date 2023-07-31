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
    "0x7531626E87BdA9B8511bea536136e5349EDacE89"
  );
  const usdg = await contractAt(
    "USDG",
    "0x8D0851FA4c49336BDD2606C6C7B3783755ea8827"
  );
  const glp = await contractAt(
    "GLP",
    "0x5339340f11789E38F2b4a00C7f29D9c112B3333F"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0x3bB314A3106A324342EB6c8F62AF94c8231736CE"
  );

  const glpManager = await deployContract("GlpManager", [
    vault.address,
    usdg.address,
    glp.address,
    shortsTracker.address,
    15 * 60,
  ]);

  await sendTxn(
    glpManager.setInPrivateMode(true),
    "glpManager.setInPrivateMode"
  );

  await sendTxn(glp.setMinter(glpManager.address, true), "glp.setMinter");
  await sendTxn(usdg.addVault(glpManager.address), "usdg.addVault");
  await sendTxn(vault.setManager(glpManager.address, true), "vault.setManager");

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
