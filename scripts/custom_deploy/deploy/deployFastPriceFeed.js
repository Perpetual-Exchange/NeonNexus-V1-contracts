const { deployFastPriceFeed } = require("./deploys");

async function main() {
  const fastPriceEvents = {
    address: "0x9b8854a9184f75d2F2c862d21E09FcCbd9131931",
  };
  const deployer = {
    address: "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471",
  };
  await deployFastPriceFeed(
    5 * 60, // _priceDuration
    60 * 60, // _maxPriceUpdateDelay
    1, // _minBlockInterval
    250, // _maxDeviationBasisPoints
    fastPriceEvents, // _fastPriceEvents
    deployer // _tokenManager);
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
