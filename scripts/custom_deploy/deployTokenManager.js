const { deployTokenManager } = require("./deploys");

async function main() {
  await deployTokenManager(4);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
