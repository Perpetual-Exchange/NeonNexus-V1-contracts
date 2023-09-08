const {
  getFrameSigner,
  deployContract,
  contractAt,
  sendTxn,
  readTmpAddresses,
  writeTmpAddresses,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");
const { toUsd } = require("../../test/shared/units");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

const {
  SEPOLIA_URL,
  SEPOLIA_DEPLOY_KEY,
  AVAX_TESTNET_URL,
  AVAX_TESTNET_DEPLOY_KEY,
  OPSIDE_TESTNET_URL,
  OPSIDE_TESTNET_DEPLOY_KEY,
} = require("../../env.json");

async function getSepoliaValues(signer) {
  const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_URL);
  const capKeeperWallet = new ethers.Wallet(SEPOLIA_DEPLOY_KEY).connect(
    provider
  );

  const vault = await contractAt(
    "Vault",
    "0x7531626E87BdA9B8511bea536136e5349EDacE89"
  );
  const timelock = await contractAt("Timelock", await vault.gov(), signer);
  const router = await contractAt("Router", await vault.router(), signer);
  const weth = await contractAt("WETH", tokens.nativeToken.address);
  const referralStorage = await contractAt(
    "ReferralStorage",
    "0x9813eEC5CfBdC1F8E6c73492c8De1c0FDBa09CDB"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0x3bB314A3106A324342EB6c8F62AF94c8231736CE",
    signer
  );
  const shortsTrackerTimelock = await contractAt(
    "ShortsTrackerTimelock",
    "0x366d70975342A24e14580610e89b8C4716280773",
    signer
  );
  const depositFee = "30"; // 0.3%
  const minExecutionFee = "20000000000000000"; // 0.02 AVAX

  return {
    capKeeperWallet,
    vault,
    timelock,
    router,
    weth,
    referralStorage,
    shortsTracker,
    shortsTrackerTimelock,
    depositFee,
    minExecutionFee,
  };
}

async function getAvaxTestValues(signer) {
  const provider = new ethers.providers.JsonRpcProvider(AVAX_TESTNET_URL);
  const capKeeperWallet = new ethers.Wallet(AVAX_TESTNET_DEPLOY_KEY).connect(
    provider
  );

  const vault = await contractAt(
    "Vault",
    "0xAC6E2Ac93E2a1CFFadE96607fe2376F5f5952EDC"
  );
  const timelock = await contractAt("Timelock", await vault.gov(), signer);
  const router = await contractAt("Router", await vault.router(), signer);
  const weth = await contractAt("WETH", tokens.nativeToken.address);
  const referralStorage = await contractAt(
    "ReferralStorage",
    "0x9bF8DF43A0bE38Df9a8Ef47285d8Bc71D0530b33"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0xB5350F5F6514103Bc0A6CFECE2d644042437C769",
    signer
  );
  const shortsTrackerTimelock = await contractAt(
    "ShortsTrackerTimelock",
    "0x979046707118B879Fb7Cd1d38412e4702406FD7A",
    signer
  );
  const depositFee = "30"; // 0.3%
  const minExecutionFee = "20000000000000000"; // 0.02 AVAX

  return {
    capKeeperWallet,
    vault,
    timelock,
    router,
    weth,
    referralStorage,
    shortsTracker,
    shortsTrackerTimelock,
    depositFee,
    minExecutionFee,
  };
}

async function getOpTestValues(signer) {
  const provider = new ethers.providers.JsonRpcProvider(OPSIDE_TESTNET_URL);
  const capKeeperWallet = new ethers.Wallet(OPSIDE_TESTNET_DEPLOY_KEY).connect(
    provider
  );

  const vault = await contractAt(
    "Vault",
    "0x357fa1565B94D9F7C770D30c95a405F805d95fEA"
  );
  const timelock = await contractAt("Timelock", await vault.gov(), signer);
  const router = await contractAt("Router", await vault.router(), signer);
  const weth = await contractAt("WETH", tokens.nativeToken.address);
  const referralStorage = await contractAt(
    "ReferralStorage",
    "0x9bF8DF43A0bE38Df9a8Ef47285d8Bc71D0530b33"
  );
  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0xB5350F5F6514103Bc0A6CFECE2d644042437C769",
    signer
  );
  const shortsTrackerTimelock = await contractAt(
    "ShortsTrackerTimelock",
    "0x979046707118B879Fb7Cd1d38412e4702406FD7A",
    signer
  );
  const depositFee = "30"; // 0.3%
  const minExecutionFee = "20000000000000000"; // 0.02 AVAX

  return {
    capKeeperWallet,
    vault,
    timelock,
    router,
    weth,
    referralStorage,
    shortsTracker,
    shortsTrackerTimelock,
    depositFee,
    minExecutionFee,
  };
}

async function getValues(signer) {
  if (network === "sepolia") {
    return getSepoliaValues(signer);
  }

  if (network === "avaxtest") {
    return getAvaxTestValues(signer);
  }

  if (network === "opsidetest") {
    return await getOpTestValues();
  }
}

async function main() {
  const signer = await getFrameSigner();

  const {
    capKeeperWallet,
    vault,
    timelock,
    router,
    weth,
    shortsTracker,
    shortsTrackerTimelock,
    depositFee,
    minExecutionFee,
    referralStorage,
  } = await getValues(signer);

  const positionUtils = await deployContract("PositionUtils", []);
  // const positionUtils = await contractAt(
  //   "PositionUtils",
  //   "0xE3aac6676E18f5229Cbd6cb3A6B809112C2B1932",
  //   signer
  // );

  const positionRouterArgs = [
    vault.address,
    router.address,
    weth.address,
    shortsTracker.address,
    depositFee,
    minExecutionFee,
  ];
  const positionRouter = await deployContract(
    "PositionRouter",
    positionRouterArgs,
    "PositionRouter",
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );
  // const positionRouter = await contractAt(
  //   "PositionRouter",
  //   "0x6A84F186A77F22B701Cb1CbA18da8b29E813A303",
  //   signer,
  //   {
  //     libraries: {
  //       PositionUtils: positionUtils.address,
  //     },
  //   }
  // );

  await sendTxn(
    positionRouter.setReferralStorage(referralStorage.address),
    "positionRouter.setReferralStorage"
  );

  await sendTxn(
    referralStorage.setHandler(positionRouter.address, true),
    "referralStorage.setHandler(positionRouter)"
  );

  // ms no Timelock const referralStorageGov = await contractAt(
  //   "Timelock",
  //   await referralStorage.gov(),
  //   signer
  // );
  // ms await sendTxn(
  //   referralStorageGov.signalSetHandler(
  //     referralStorage.address,
  //     positionRouter.address,
  //     true
  //   ),
  //   "referralStorage.signalSetHandler(positionRouter)"
  // );

  // await sendTxn(
  //   shortsTrackerTimelock.signalSetHandler(positionRouter.address, true),
  //   "shortsTrackerTimelock.signalSetHandler(positionRouter)"
  // );

  await sendTxn(router.addPlugin(positionRouter.address), "router.addPlugin");

  await sendTxn(
    positionRouter.setDelayValues(0, 180, 30 * 60),
    "positionRouter.setDelayValues"
  );

  // ms no timelock await sendTxn(
  //   timelock.setContractHandler(positionRouter.address, true),
  //   "timelock.setContractHandler(positionRouter)"
  // );

  await sendTxn(
    positionRouter.setGov(await vault.gov()),
    "positionRouter.setGov"
  );

  await sendTxn(
    positionRouter.setAdmin(capKeeperWallet.address),
    "positionRouter.setAdmin"
  );

  await sendTxn(router.addPlugin(positionRouter.address), "router.addPlugin");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
