const {
  getFrameSigner,
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


async function getAvaxTestValues() {
  const vault = await contractAt(
    "Vault",
    "0xAC6E2Ac93E2a1CFFadE96607fe2376F5f5952EDC"
  );

  const updater = "0x2071045Bd93F01a36cF00eCc4ade032d17C8F7D8";

  return {
    vault,
    updater,
  };
}

async function getOpTestValues() {
  const vault = await contractAt(
    "Vault",
    "0x357fa1565B94D9F7C770D30c95a405F805d95fEA"
  );

  const updater = "0x2071045Bd93F01a36cF00eCc4ade032d17C8F7D8";

  return {
    vault,
    updater,
  };
}

async function getValues() {
  if (network === "avaxtest") {
    return getAvaxTestValues();
  }

  if (network === "opsidetest") {
    return getOpTestValues();
  }
}

async function main() {
  const signer = await getFrameSigner();

  const { vault, updater } = await getValues();

  const vaultPriceFeed = await contractAt(
    "VaultPriceFeed",
    vault.priceFeed()
  );

  const secondaryPriceFeed = await contractAt(
    "FastPriceFeed",
    vaultPriceFeed.secondaryPriceFeed()
  );

  console.log("vault.address:", await vault.address);
  console.log("vault.priceFeed:", await vault.priceFeed());
  console.log("vaultPriceFeed.secondaryPriceFeed:", await vaultPriceFeed.secondaryPriceFeed());
  console.log("secondaryPriceFeed.gov:", await secondaryPriceFeed.gov());

  console.log("updater:", updater);
  console.log("query secondaryPriceFeed.isUpdater:", await secondaryPriceFeed.isUpdater(updater));
  // await sendTxn(
  //   secondaryPriceFeed.setUpdater(updater, true),
  //   "secondaryPriceFeed.setUpdater"
  // );

  // avaxtest FastPriceFeed.gov is priceFeddTimelock
  const priceFeedTimelock = await contractAt(
    "PriceFeedTimelock",
    await secondaryPriceFeed.gov()
  );
  // await sendTxn(
  //   priceFeedTimelock.signalSetPriceFeedUpdater(secondaryPriceFeed.address, updater, true),
  //   "priceFeedTimelock.signalSetPriceFeedUpdater"
  // );
  await sendTxn(
    priceFeedTimelock.setPriceFeedUpdater(secondaryPriceFeed.address, updater, true, {
      gasLimit: "3000000",
    }),
    "priceFeedTimelock.setPriceFeedUpdater"
  );

  console.log("post secondaryPriceFeed.isUpdater:", await secondaryPriceFeed.isUpdater(updater));

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
