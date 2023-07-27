const { deployVaultErrorController } = require("./deploys");

async function main() {
  await deployVaultErrorController();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
