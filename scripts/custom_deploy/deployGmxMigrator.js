const { deployGmxMigrator, deployGmxIou } = require("./deploys");

async function main() {
  const gmxMigrator = await deployGmxMigrator(2);
  await deployGmxIou(gmxMigrator, "GMT GMX (IOU)", "GMT:GMX");
  await deployGmxIou(gmxMigrator, "xGMT GMX (IOU)", "xGMT:GMX");
  await deployGmxIou(gmxMigrator, "GMT-USDG GMX (IOU)", "GMT-USDG:GMX");
  await deployGmxIou(gmxMigrator, "xGMT-USDG GMX (IOU)", "xGMT-USDG:GMX");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
