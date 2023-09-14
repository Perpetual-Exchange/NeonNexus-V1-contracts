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
    "0x29b0919c2Ecc26149729d2661ea88D8a0D5E19e1", // sGMX
    "0x5Ee93ce52B006f415674A2F3E0d0A4913d15C2b4", // sbGMX
    "0xCE7CF6A83046c6dA53a9377333A0A152357168Da", // sbfGMX
    "0xF0Eb0dF16eA5D60916B3C17F903Ab5Ab503e0e22", // fsGLP
    "0x6F5263A938392c720dC160047297d5fF8d77A596", // fGLP
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
