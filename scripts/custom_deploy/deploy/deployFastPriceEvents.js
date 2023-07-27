const { deployFastPriceEvents } = require("./deploys");

async function main() {
  await deployFastPriceEvents();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
