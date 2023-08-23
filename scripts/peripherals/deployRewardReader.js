const {
  deployContract,
  contractAt,
  writeTmpAddresses,
} = require("../shared/helpers");

async function main() {

  // // first run
  // await deployContract("RewardReader", [], "RewardReader")

  // next run the following
  // getStakingInfo
  const account = "0x1FD2692bfA672bCf6Bf4634ed48D436F422d0E48";
  const rewardReader = await contractAt(
    "RewardReader",
    "0x8F4e75dfc9387311Cc1e6b69C2919049b2a5D0C0"
  );

  const rewardTrackers = [
    "0x897629A9F629C6629285AE864eB755be80dc200E", // sGMX
    "0x2f9555566f4d007E20462Fe54e1E38b0129A27f6", // sbGMX
    "0xCF0b26553158e212C81532C69383eE15F5463b66", // sbfGMX
    "0x1dD38dee2fD5FEc859B0441Ef27e36C924085D0C", // fsGLP
    "0xf41184904bE4F79D7bF047688F42eD774EC457E7", // fGLP
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
