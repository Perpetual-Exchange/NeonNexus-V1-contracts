const { deployVaultReader } = require("./deploys");

async function main() {
  await deployVaultReader();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
