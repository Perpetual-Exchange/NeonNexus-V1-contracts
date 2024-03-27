const {
  getFrameSigner,
  contractAt,
  sendTxn,
  updateTokensPerInterval,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");

const network = process.env.HARDHAT_NETWORK || "mainnet";

async function getArbValues(signer) {
  const rewardToken = await contractAt(
    "Token",
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    signer
  );
  const tokenDecimals = 18;

  const rewardTrackerArr = [
    {
      name: "feeGmxTracker",
      address: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
      // transferAmount: expandDecimals("333", 18)
    },
    {
      name: "feeGlpTracker",
      address: "0x4e971a87900b931fF39d1Aad67697F49835400b6",
      // transferAmount: expandDecimals("744", 18)
    },
  ];

  return { rewardToken, tokenDecimals, rewardTrackerArr };
}

async function getAvaxValues(signer) {
  const rewardToken = await contractAt(
    "Token",
    "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    signer
  );
  const tokenDecimals = 18;

  const rewardTrackerArr = [
    {
      name: "feeGmxTracker",
      address: "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
      // transferAmount: expandDecimals("2479", 18)
    },
    {
      name: "feeGlpTracker",
      address: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
      // transferAmount: expandDecimals("9606", 18)
    },
  ];

  return { rewardToken, tokenDecimals, rewardTrackerArr };
}

async function getSepoliaValues(signer) {
  const rewardToken = await contractAt(
    "Token",
    "0x7E160F7a1f90E3BfB380eA6Fba9cbD860d7Cd0D1",
    signer
  );
  const tokenDecimals = 18;

  const rewardTrackerArr = [
    {
      name: "feeGmxTracker",
      address: "0x00E07C7055F1D370C1241495a9fC010B07F47497",
      //   transferAmount: expandDecimals("2479", 18),
      transferAmount: expandDecimals(2, 17),
    },
    {
      name: "feeGlpTracker",
      address: "0xb3de11a38D238acBDB22c99b99Ceb8895FCbc981",
      // transferAmount: expandDecimals("9606", 18),
      transferAmount: expandDecimals(2, 17),
    },
  ];

  return { rewardToken, tokenDecimals, rewardTrackerArr };
}

async function getAvaxTestValues(signer) {
  const rewardToken = await contractAt(
    "Token",
    "0x2E11Aad6Ffa2E7f4F3b75187BFDa0A3633b3711d",
    signer
  );
  const tokenDecimals = 18;

  const rewardTrackerArr = [
    {
      name: "feeGmxTracker",
      address: "0xCF0b26553158e212C81532C69383eE15F5463b66",
      //   transferAmount: expandDecimals("2479", 18),
      transferAmount: expandDecimals(2, 17),
    },
    {
      name: "feeGlpTracker",
      address: "0xf41184904bE4F79D7bF047688F42eD774EC457E7",
      // transferAmount: expandDecimals("9606", 18),
      transferAmount: expandDecimals(2, 17),
    },
  ];

  return { rewardToken, tokenDecimals, rewardTrackerArr };
}

async function updateRewards({ signer, values, intervalUpdater }) {
  const { rewardToken, tokenDecimals, rewardTrackerArr } = values;

  for (let i = 0; i < rewardTrackerArr.length; i++) {
    const rewardTrackerItem = rewardTrackerArr[i];
    const { transferAmount } = rewardTrackerItem;
    const rewardTracker = await contractAt(
      "RewardTracker",
      rewardTrackerItem.address,
      signer
    );
    const rewardDistributorAddress = await rewardTracker.distributor();
    const rewardDistributor = await contractAt(
      "RewardDistributor",
      rewardDistributorAddress,
      intervalUpdater
    );
    const convertedTransferAmount = transferAmount;
    const rewardsPerInterval = convertedTransferAmount.div(7 * 24 * 60 * 60);
    console.log("rewardDistributorAddress", rewardDistributorAddress);
    console.log("transferAmount", transferAmount.toString());
    console.log("convertedTransferAmount", convertedTransferAmount.toString());
    console.log("rewardsPerInterval", rewardsPerInterval.toString());

    // await sendTxn(
    //   rewardToken.mint(rewardDistributorAddress, convertedTransferAmount, {
    //     gasLimit: 3000000,
    //   }),
    //   `rewardToken.transfer ${i}`
    // );
    await sendTxn(
      rewardToken.transfer(rewardDistributorAddress, convertedTransferAmount, {
        gasLimit: 3000000,
      }),
      `rewardToken.transfer ${i}`
    );
    await updateTokensPerInterval(
      rewardDistributor,
      rewardsPerInterval,
      "rewardDistributor"
    );
  }
}

module.exports = {
  getArbValues,
  getAvaxValues,
  getSepoliaValues,
  getAvaxTestValues,
  updateRewards,
};
