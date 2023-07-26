const { deployRewardRouterV2 } = require("./deploys");

async function main() {
  await deployRewardRouterV2();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
