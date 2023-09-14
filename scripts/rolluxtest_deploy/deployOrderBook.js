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
      "0x16aB9C1825b86e8B8cE3a3F1d7d863A982d95CB3", // router
      "0xffe4E159fd0f96b01463b297a5bcA784000C50C9", // vault
      nativeToken.address, // wsys
      "0x17de690b6116DD04f68eA8b095f861FA9fACD86D", // usdg
      "10000000000000000", // 0.01 AVAX
      expandDecimals(10, 30) // min purchase token amount usd
    ),
    "orderBook.initialize"
  );

  const router = await contractAt("Router", "0x16aB9C1825b86e8B8cE3a3F1d7d863A982d95CB3", signer);
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
