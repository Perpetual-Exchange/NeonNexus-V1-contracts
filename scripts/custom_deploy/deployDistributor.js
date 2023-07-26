const { deployRewardDistributor } = require("./deploys");

async function main() {
  // StakedGmxDistributor
  const esGMX = {
    address: "0x42F53160a578aAA4884734D41598d644DBEc9C22",
  };
  const sGMX = {
    address: "0x320D8997A688DaC8a96703eC44cdc736D7E2B518",
  };
  await deployRewardDistributor(esGMX, sGMX);

  // StakedGlpDistributor
  const fsGLP = {
    address: "0x320D8997A688DaC8a96703eC44cdc736D7E2B518",
  };
  await deployRewardDistributor(esGMX, fsGLP);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
