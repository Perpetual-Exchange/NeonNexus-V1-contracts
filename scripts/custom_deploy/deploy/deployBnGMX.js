const { deployMintableBaseToken } = require("./deploys");

async function main() {
  await deployMintableBaseToken("Bonus GMX", "bnGMX", 0);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
