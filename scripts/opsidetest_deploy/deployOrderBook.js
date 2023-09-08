const {
  deployContract,
  contractAt,
  sendTxn,
  writeTmpAddresses, getFrameSigner,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

async function main() {
  const { nativeToken } = tokens;
  const signer = await getFrameSigner();

  const orderBook = await deployContract("OrderBook", []);
  // addresses
  await sendTxn(
    orderBook.initialize(
      "0x1099861d064d6C093C9D2F73602d7DAd12155073", // router
      "0x357fa1565B94D9F7C770D30c95a405F805d95fEA", // vault
      nativeToken.address, // weth
      "0xEDD8b1e92c6584AFc0A4509f1122244195e0157B", // usdg
      "10000000000000000", // 0.01 AVAX
      expandDecimals(10, 30) // min purchase token amount usd
    ),
    "orderBook.initialize"
  );

  const router = await contractAt("Router", "0x1099861d064d6C093C9D2F73602d7DAd12155073", signer);
  await router.addPlugin(orderBook.address);

  // writeTmpAddresses({
  //   orderBook: orderBook.address,
  // });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
