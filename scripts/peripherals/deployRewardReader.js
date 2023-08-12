const {
  deployContract,
  contractAt,
  writeTmpAddresses,
} = require("../shared/helpers");

async function main() {
  //   await deployContract("RewardReader", [], "RewardReader")

  // getStakingInfo
  const account = "0x083102dEc08D0a449bEd627bE204531bf34251Ae";
  const rewardReader = await contractAt(
    "RewardReader",
    "0x3767e236D07969bAc6eF8EbFA46EB5dD8b4F3E69"
  );

  const rewardTrackers = [
    "0xfc05ab07893c88c2f19c94b664CC74884d4A6A33", // sGMX
    "0x35194cA778B4a2360770025bb3c52826523B25FE", // sbGMX
    "0x00E07C7055F1D370C1241495a9fC010B07F47497", // sbfGMX
    "0xaF7BaE75c7D20CF53aE24bD6201ed3578C7e514b", // fsGLP
    "0xb3de11a38D238acBDB22c99b99Ceb8895FCbc981", // fGLP
  ];

  const stakingInfos = await rewardReader.getStakingInfo(
    account,
    rewardTrackers
  );

  const propsLength = 5;
  for (let i in rewardTrackers) {
    const tracker = await contractAt("RewardTracker", rewardTrackers[i]);
    console.log("=================================");
    console.log(rewardTrackers[i]);

    console.log(
      "tracker.claimableReward: ",
      (await tracker.claimableReward(account)).toString()
    );

    console.log(
      "tracker.stakedAmounts: ",
      (await tracker.stakedAmounts(account)).toString()
    );
    console.log(
      "tracker.cumulativeRewardPerToken: ",
      (await tracker.cumulativeRewardPerToken()).toString()
    );
    console.log(
      "tracker.previousCumulatedRewardPerToken: ",
      (await tracker.previousCumulatedRewardPerToken(account)).toString()
    );
    const distributorAddr = await tracker.distributor();
    console.log("distributorAddr", distributorAddr);

    const distributor = await contractAt("RewardDistributor", distributorAddr);
    const pendingRewards = await distributor.pendingRewards();
    console.log("distributor.pendingRewards: ", pendingRewards.toString());
    const lastDistributionTime = await distributor.lastDistributionTime();
    console.log(
      "distributor.lastDistributionTime: ",
      lastDistributionTime.toString()
    );

    console.log(
      "0==>rewardTracker.claimable: ",
      stakingInfos[i * propsLength].toString()
    );

    console.log(
      "1==>rewardTracker.tokensPerInterval: ",
      stakingInfos[i * propsLength + 1].toString()
    );
    console.log(
      "2==>rewardTracker.averageStakedAmounts: ",
      stakingInfos[i * propsLength + 2].toString()
    );
    console.log(
      "3==>rewardTracker.cumulativeRewards: ",
      stakingInfos[i * propsLength + 3].toString()
    );
    console.log(
      "4==>rewardTracker.totalSupply: ",
      stakingInfos[i * propsLength + 4].toString()
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
