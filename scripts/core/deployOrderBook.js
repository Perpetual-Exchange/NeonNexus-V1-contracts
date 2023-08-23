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
      "0xa1792e2e73e3A890068D8094923fE8399D46d169", // router
      "0xAC6E2Ac93E2a1CFFadE96607fe2376F5f5952EDC", // vault
      nativeToken.address, // weth
      "0x0A2627184A1AA8153A5660159B2762bCc85FF052", // usdg
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
