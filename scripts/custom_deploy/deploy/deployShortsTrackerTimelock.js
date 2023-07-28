const { deployShortsTrackerTimelock } = require("./deploys");

async function main() {
  const admin = "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471";

  const buffer = 60; // 60 seconds
  const updateDelay = 300; // 300 seconds, 5 minutes
  const maxAveragePriceChange = 20; // 0.2%
  let shortsTrackerTimelock = await deployShortsTrackerTimelock(
    admin,
    buffer,
    updateDelay,
    maxAveragePriceChange
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
