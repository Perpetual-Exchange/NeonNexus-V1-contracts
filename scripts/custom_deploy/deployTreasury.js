const { deployTreasury } = require("./deploys");

async function main() {
  await deployTreasury();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
