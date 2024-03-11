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
  const rewardRouterV2 = await contractAt("RewardRouterV2", "0xB82A7f047585F7b2de48464B19a11B8E9519917D", signer)

  return { signer, provider, glpManager, vault, reader, vaultReader, rewardRouterV2, tokenArr, tokenAllArr }
}

async function getValues() {
  if (network === "rolluxtest") {
    return getRoTestValues()
  }
}

async function main() {

  const { signer, provider, glpManager, vault, reader, vaultReader, rewardRouterV2, tokenArr, tokenAllArr  } = await getValues();

  console.log("signer.address:", await signer.address);
  console.log("chainId:", await signer.getChainId());

  console.log("glpManager.address:", await glpManager.address);
  console.log("glpManager.getAums():", await glpManager.getAums());

  console.log("rewardRouterV2.maxBoostBasisPoints:", await rewardRouterV2.maxBoostBasisPoints());

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
