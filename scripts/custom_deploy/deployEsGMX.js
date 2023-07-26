const { deployEsGMX } = require("./deploys");

async function main() {
  await deployEsGMX();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
