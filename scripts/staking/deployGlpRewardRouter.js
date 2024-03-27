const {
  deployContract,
  contractAt,
  sendTxn,
  getFrameSigner,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("../core/tokens")[network];

const { AddressZero } = ethers.constants;

async function getArbValues() {
  const { nativeToken } = tokens;
  const glp = { address: "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258" };
  const feeGlpTracker = {
    address: "0x4e971a87900b931fF39d1Aad67697F49835400b6",
  };
  const stakedGlpTracker = {
    address: "0x1aDDD80E6039594eE970E5872D247bf0414C8903",
  };
  const glpManager = { address: "0x3963FfC9dff443c2A94f21b129D429891E32ec18" };

  return { nativeToken, glp, feeGlpTracker, stakedGlpTracker, glpManager };
}

async function getAvaxValues() {
  const { nativeToken } = tokens;
  const glp = { address: "0x01234181085565ed162a948b6a5e88758CD7c7b8" };
  const feeGlpTracker = {
    address: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
  };
  const stakedGlpTracker = {
    address: "0x9e295B5B976a184B14aD8cd72413aD846C299660",
  };
  const glpManager = { address: "0xD152c7F25db7F4B95b7658323c5F33d176818EE4" };

  return { nativeToken, glp, feeGlpTracker, stakedGlpTracker, glpManager };
}

async function getSepoliaValues() {
  const { nativeToken } = tokens;
  const glp = { address: "0x5339340f11789E38F2b4a00C7f29D9c112B3333F" };

  const feeGlpTracker = await contractAt(
    "RewardTracker",
    "0xb3de11a38D238acBDB22c99b99Ceb8895FCbc981"
  );
  const stakedGlpTracker = await contractAt(
    "RewardTracker",
    "0xaF7BaE75c7D20CF53aE24bD6201ed3578C7e514b"
  );
  const glpManager = await contractAt(
    "GlpManager",
    "0x241F2d418f23d42f821cdf516F2E530cE2a57f01"
  );

  return { nativeToken, glp, feeGlpTracker, stakedGlpTracker, glpManager };
}

async function getAvaxTestValues() {
  const { nativeToken } = tokens;
  const glp = { address: "0x0F02098Bb29FAc827f2DA6b330dB9B423Bd07B84" };

  const feeGlpTracker = await contractAt(
    "RewardTracker",
    "0xf41184904bE4F79D7bF047688F42eD774EC457E7"
  );
  const stakedGlpTracker = await contractAt(
    "RewardTracker",
    "0x1dD38dee2fD5FEc859B0441Ef27e36C924085D0C"
  );
  const glpManager = await contractAt(
    "GlpManager",
    "0x459aF0e66F49302DaE40Ba548FbBb16E3263C71F"
  );

  return { nativeToken, glp, feeGlpTracker, stakedGlpTracker, glpManager };
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues();
  }

  if (network === "avax") {
    return getAvaxValues();
  }

  if (network === "sepolia") {
    return getSepoliaValues();
  }

  if (network === "avaxtest") {
    return getAvaxTestValues();
  }
}

async function main() {
  const { nativeToken, glp, feeGlpTracker, stakedGlpTracker, glpManager } =
    await getValues();

    const rewardRouter = await deployContract("RewardRouterV2", []);
  // ms const rewardRouter = await contractAt(
  //   "RewardRouterV2",
  //   "0x800db23793bBA846f378296E7b492F731D1eE464"
  // );

  //   await sendTxn(
  //     rewardRouter.initialize(
  //       nativeToken.address, // _weth
  //       AddressZero, // _gmx
  //       AddressZero, // _esGmx
  //       AddressZero, // _bnGmx
  //       glp.address, // _glp
  //       AddressZero, // _stakedGmxTracker
  //       AddressZero, // _bonusGmxTracker
  //       AddressZero, // _feeGmxTracker
  //       feeGlpTracker.address, // _feeGlpTracker
  //       stakedGlpTracker.address, // _stakedGlpTracker
  //       glpManager.address, // _glpManager
  //       AddressZero, // _gmxVester
  //       AddressZero // glpVester
  //     ),
  //     "rewardRouter.initialize"
  //   );

  // custom
  await sendTxn(
    glpManager.setHandler(rewardRouter.address, true),
    "glpManager.setHandler(rewardRouter)"
  );
  await sendTxn(
    feeGlpTracker.setHandler(rewardRouter.address, true),
    "feeGlpTracker.setHandler(rewardRouter)"
  );
  await sendTxn(
    stakedGlpTracker.setHandler(rewardRouter.address, true),
    "stakedGlpTracker.setHandler(rewardRouter)"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
