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

async function getRoTestValues() {
  const vault = await contractAt(
    "Vault",
    "0xffe4E159fd0f96b01463b297a5bcA784000C50C9"
  );

  const priceSender1 = "0x78605FfFe64716173c9db5D882dE2d81715182d9";

  return {
    vault,
    priceSender1,
  };
}

async function getValues() {
  if (network === "avaxtest") {
    return getAvaxTestValues();
  }

  if (network === "opsidetest") {
    return getOpTestValues();
  }

  if (network === "rolluxtest") {
    return getRoTestValues();
  }
}

async function main() {
  const signer = await getFrameSigner();

  const { vault, priceSender1 } = await getValues();

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

  console.log("priceSender1:", priceSender1);
  console.log("query secondaryPriceFeed.isUpdater:", await secondaryPriceFeed.isUpdater(priceSender1));

  // FastPriceFeed.gov is deployer
  // await sendTxn(
  //   secondaryPriceFeed.setUpdater(priceSender1, true),
  //   "secondaryPriceFeed.setUpdater"
  // );

  // FastPriceFeed.gov is priceFeddTimelock
  const priceFeedTimelock = await contractAt(
    "PriceFeedTimelock",
    await secondaryPriceFeed.gov()
  );
  // await sendTxn(
  //   priceFeedTimelock.signalSetPriceFeedUpdater(secondaryPriceFeed.address, priceSender1, true),
  //   `priceFeedTimelock.signalSetPriceFeedUpdater(${priceSender1})`
  // );

  await sendTxn(
    priceFeedTimelock.setPriceFeedUpdater(secondaryPriceFeed.address, priceSender1, true, {
      gasLimit: "3000000",
    }),
    `priceFeedTimelock.setPriceFeedUpdater(${priceSender1})`
  );

  console.log("post secondaryPriceFeed.isUpdater:", await secondaryPriceFeed.isUpdater(priceSender1));

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
