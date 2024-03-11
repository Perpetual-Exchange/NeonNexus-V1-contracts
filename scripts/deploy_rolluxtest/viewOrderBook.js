const {
  signers,
  providers,
  getFrameSigner,
  deployContract,
  contractAt,
  sendTxn,
  readTmpAddresses,
  writeTmpAddresses,
  sleep,
} = require("../shared/helpers");
const { AVAX_TESTNET_URL,
        AVAX_TESTNET_DEPLOY_KEY,
        OPSIDE_TESTNET_URL,
        OPSIDE_TESTNET_DEPLOY_KEY,
        ROLLUX_TESTNET_URL,
        ROLLUX_TESTNET_DEPLOY_KEY} = require("../../env.json");

const {expandDecimals} = require("../../test/shared/utilities");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

async function getRoTestValues() {

  const signer = signers.rolluxtest;
  const provider = providers.rolluxtest;
  const { btc, eth, sys, usdt } = tokens;
  const tokenArr = [btc, eth, sys];
  const tokenAllArr = [btc, eth, sys, usdt];
  const glpManager = await contractAt("GlpManager", "0xDC72632f1fc4159E75533B7B6c2BdA92d1644639", signer)
  const vault = await contractAt("Vault", "0xffe4E159fd0f96b01463b297a5bcA784000C50C9", signer)
  const reader = await contractAt("Reader", "0xA6f0764aA7B401DE2e2DDb8B0fCc51EaaE679D70", signer)
  const vaultReader = await contractAt("VaultReader", "0x3D739D5cd112A49b99ea709574fEF5E794bd6Fc5", signer)
  const rewardRouterV2 = await contractAt("RewardRouterV2", "0xf4b46686d4d2995D010a937FD6135763E03A7448", signer)
  const orderBook = await contractAt("OrderBook", "0xaF6bD805616B65cA819b3068cdb715dE611f4eED", signer)
  const orderBookReader = await contractAt("OrderBook", "0xeEaB8fB727d7d889d700bC07fF18F3Ef88fdC34a", signer)

  return { signer, provider, glpManager, vault, reader, vaultReader, rewardRouterV2, orderBook, orderBookReader, tokenArr, tokenAllArr }
}

async function getValues() {
  if (network === "rolluxtest") {
    return getRoTestValues()
  }
}

async function main() {

  const { signer, provider, glpManager, vault, reader, vaultReader, rewardRouterV2, orderBook, orderBookReader, tokenArr, tokenAllArr  } = await getValues();

  console.log("signer.address:", await signer.address);
  console.log("chainId:", await signer.getChainId());

  const account = "0x626aba32e69Df9a2d4A4Db1ad7E9C74c513326Ca";
  console.log("orderBook.swapOrdersIndex:", await orderBook.swapOrdersIndex(account));
  console.log("orderBook.increaseOrdersIndex:", await orderBook.increaseOrdersIndex(account));
  console.log("orderBook.decreaseOrdersIndex:", await orderBook.decreaseOrdersIndex(account));
  console.log("orderBookReader.getDecreaseOrders:", await orderBookReader.getDecreaseOrders(orderBook.address, account, []));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
