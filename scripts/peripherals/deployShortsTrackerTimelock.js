const {
  deployContract,
  contractAt,
  sendTxn,
  getFrameSigner,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");
const { toUsd } = require("../../test/shared/units");
const { getArgumentForSignature } = require("typechain");

const network = process.env.HARDHAT_NETWORK || "mainnet";

async function getAvaxValues() {
  return {
    handlers: [
      "0x02270A816FCca45cE078C8b3De0346Eebc90B227", // X Shorts Tracker Keeper
    ],
  };
}

async function getArbValues() {
  return {
    handlers: [
      "0x75f6250b9CeED446b2F25385832dF08DB45a90b0", // X Shorts Tracker Keeper
    ],
  };
}

async function getSepoliaValues() {
  return {
    handlers: [
      "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471", // Xiaowu Shorts Tracker Keeper
    ],
  };
}

async function getAvaxTestValues() {
  return {
    handlers: [
      "0xAcdC274B853e01e9666E03c662d30A83B8F73080", // Shorts Tracker Keeper
    ],
  };
}

async function getValues() {
  if (network === "localhost") {
    return await getLocalhostValues();
  }

  if (network === "avax") {
    return await getAvaxValues();
  }

  if (network === "arbitrum") {
    return await getArbValues();
  }

  if (network === "sepolia") {
    return await getSepoliaValues();
  }

  if (network === "avaxtest") {
    return await getAvaxTestValues();
  }

  throw new Error("No values for network " + network);
}

async function main() {
  const signer = await getFrameSigner();

  const admin = "0xAcdC274B853e01e9666E03c662d30A83B8F73080";
  const { handlers } = await getValues();

  const buffer = 60; // 60 seconds
  const updateDelay = 300; // 300 seconds, 5 minutes
  const maxAveragePriceChange = 20; // 0.2%
  let shortsTrackerTimelock = await deployContract("ShortsTrackerTimelock", [
    admin,
    buffer,
    updateDelay,
    maxAveragePriceChange,
  ]);

  // signer is admin
  shortsTrackerTimelock = await contractAt(
    "ShortsTrackerTimelock",
    shortsTrackerTimelock.address
    // signer
  );

  console.log("Setting handlers");
  for (const handler of handlers) {
    await sendTxn(
      shortsTrackerTimelock.setContractHandler(handler, true),
      `shortsTrackerTimelock.setContractHandler ${handler}`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
