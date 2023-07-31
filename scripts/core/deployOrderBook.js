const {
  deployContract,
  contractAt,
  sendTxn,
  writeTmpAddresses,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

async function main() {
  const { nativeToken } = tokens;

  const orderBook = await deployContract("OrderBook", []);

  // Arbitrum mainnet addresses
  await sendTxn(
    orderBook.initialize(
      "0xf6447de9988F36C0E74fb3991E1d001DB7A1bec8", // router
      "0x7531626E87BdA9B8511bea536136e5349EDacE89", // vault
      nativeToken.address, // weth
      "0x8D0851FA4c49336BDD2606C6C7B3783755ea8827", // usdg
      "10000000000000000", // 0.01 AVAX
      expandDecimals(10, 30) // min purchase token amount usd
    ),
    "orderBook.initialize"
  );

  writeTmpAddresses({
    orderBook: orderBook.address,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
