const { deployVester } = require("./deploys");

async function main() {
  const vestingDuration = 365 * 24 * 60 * 60;

  const gmx = {
    address: "0xB9b84f0Fd7FB846933c5BcEFAFba483fE1b6cD1E",
  };
  const esGMX = {
    address: "0x42F53160a578aAA4884734D41598d644DBEc9C22",
  };
  // sbfGMX
  const sbfGMX = {
    address: "0xac5D28fcC5d0E155A2C88CE816B70718699a0d39",
  };
  // sGMX
  const sGMX = {
    address: "0x320D8997A688DaC8a96703eC44cdc736D7E2B518",
  };

  const fsGLP = {
    address: "0xB0658bcE7C4dF938050D749D3363A43C6Bf501bE",
  };

  const gmxVester = await deployVester(
    "Vested GMX", // _name
    "vGMX", // _symbol
    vestingDuration, // _vestingDuration
    esGMX.address, // _esToken
    sbfGMX.address, // _pairToken
    gmx.address, // _claimableToken
    sGMX.address // _rewardTracker
  );

  const glpVester = await deployVester(
    "Vested GLP", // _name
    "vGLP", // _symbol
    vestingDuration, // _vestingDuration
    esGMX.address, // _esToken
    fsGLP.address, // _pairToken
    gmx.address, // _claimableToken
    fsGLP.address // _rewardTracker
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
