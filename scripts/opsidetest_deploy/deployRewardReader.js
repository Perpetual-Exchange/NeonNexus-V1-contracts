const {
  deployContract,
  contractAt,
  writeTmpAddresses,
} = require("../shared/helpers");

async function main() {

  // // first run
  const rewardReader = await deployContract("RewardReader", [], "RewardReader")

  // next run the following
  // getStakingInfo
  const account = "0x1FD2692bfA672bCf6Bf4634ed48D436F422d0E48";
  // const rewardReader = await contractAt(
  //   "RewardReader",
  //   "0x8F4e75dfc9387311Cc1e6b69C2919049b2a5D0C0"
  // );

  const rewardTrackers = [
    "0x758f9118c91d14B13121e822D0BAe31200F50E7F", // sGMX
    "0x47A7c1F00080a4236Fc9bC0848e3303D2CDB938C", // sbGMX
    "0xbfb1756788c5A85155af774a4Da65CD1DF146D7D", // sbfGMX
    "0xD70430d7E3E019f54E6112C0539B546022386BF7", // fsGLP
    "0x479f1068d35a5b8bf3287170959f9C2de1d59604", // fGLP
  ];

  const stakingInfos = await rewardReader.getStakingInfo(
    account,
    rewardTrackers
  );

  const propsLength = 5;
  for (let i in rewardTrackers) {
    const tracker = await contractAt("RewardTracker", rewardTrackers[i]);
    console.log("---------------------------------");
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
