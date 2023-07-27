const { deployRewardTracker } = require("./deploys");

async function main() {
  await deployRewardTracker("Stackd GMX", "sGMX");
  await deployRewardTracker("Staked + Bonus GMX", "sbGMX");
  await deployRewardTracker("Staked + Bonus + Fee GMX", "sbfGMX");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
