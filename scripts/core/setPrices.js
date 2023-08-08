const { deployContract, contractAt, sendTxn } = require("../shared/helpers");
const { getBlockTime, expandDecimals } = require("../../test/shared/utilities");
const { toUsd } = require("../../test/shared/units");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

async function main() {
  const secondaryPriceFeed = await contractAt(
    "FastPriceFeed",
    "0x7657D54d16a2016FD3c0B6d12251Cd8b06a3FA2E"
  );
  const vaultPriceFeed = await contractAt(
    "VaultPriceFeed",
    "0x57B4FA59741f3E59784ba4dc54deA5Ad610B0Dd4"
  );

  // await sendTxn(vaultPriceFeed.setIsAmmEnabled(false), "vaultPriceFeed.setIsAmmEnabled")
  // console.log("vaultPriceFeed.isSecondaryPriceEnabled", await vaultPriceFeed.isSecondaryPriceEnabled())

  const provider = waffle.provider;

  const blockTime = await getBlockTime(provider);
  await sendTxn(
    secondaryPriceFeed.setPrices(
      [tokens.btc.address, tokens.eth.address, tokens.link.address],
      [
        expandDecimals(29171, 30),
        expandDecimals(1836, 30),
        expandDecimals(7, 30),
      ],
      blockTime,
      {
        gasPrice: "1434896730",
        gasLimit: "1262636",
      }
    ),
    "secondaryPriceFeed.setPrices"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
