const { deployVaultPriceFeed } = require("./deploys");

async function main() {
  await deployVaultPriceFeed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
