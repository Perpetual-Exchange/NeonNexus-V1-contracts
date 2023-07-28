const { contractAt } = require("../../shared/helpers");

async function getContracts() {
  const vaultPriceFeed = await contractAt(
    "VaultPriceFeed",
    "0xb0dD9Dda2433AAd61c693A5a86F50899c705aA0c"
  );

  const glp = await contractAt(
    "GLP",
    "0xc6Bc996320c16cB59f73410ab42eE1C589A0F70A"
  );

  const vault = await contractAt(
    "Vault",
    "0xf0A79aC35A3fd299438D60b6Cb31A8A774AC395f"
  );

  const glpManager = await contractAt(
    "GlpManager",
    "0xCBC62aF283bfFB69246Af143Ec349261Bc403eC6"
  );

  const gmx = await contractAt(
    "GMX",
    "0xB9b84f0Fd7FB846933c5BcEFAFba483fE1b6cD1E"
  );

  const usdg = await contractAt(
    "USDG",
    "0x25bb9a16f2b3CeA632Ad6bBf383000A5988d86f4"
  );

  const router = await contractAt(
    "Router",
    "0xb4CA1B277D45ecD03eD8BeBFB3157a23da3b0e34"
  );

  const vaultErrorController = await contractAt(
    "VaultErrorController",
    "0xe17a85FD46Ea342ece5CF131863A6DA89A7f1b4c"
  );

  const vaultUtils = await contractAt(
    "VaultUtils",
    "0xfa400dcdD8A77f7A1117840263A6fb30222a6eC0"
  );

  const referralStorage = await contractAt(
    "ReferralStorage",
    "0x0f75eA8D6DCF062Ac3bcA5aB241644f8f72F5Da8"
  );

  const positionUtils = await contractAt(
    "PositionUtils",
    "0x32059e10b885a0D3d0131D42c5bebf0FCBfB9A46"
  );

  const positionRouter = await contractAt(
    "PositionRouter",
    "0x5623BdC1E5E2c9B385b1994643fB0b74d994489e",
    null,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  const positionManager = await contractAt(
    "PositionManager",
    "0x2BdD74C94b2552e7dD89Acd035d23c8B0227efF6",
    null,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  const timelock = await contractAt(
    "Timelock",
    "0xDfDd9C4532A6A42469088652D302F558F4B48e83"
  );

  const shortsTracker = await contractAt(
    "ShortsTracker",
    "0x9374747A89f67C61d623426af44ce516cEAfD640"
  );

  const secondaryPriceFeed = await contractAt(
    "FastPriceFeed",
    "0x93B90565ffbB0B95d21AA40E1B41f33485277aDb"
  );

  const tokenManager = await contractAt(
    "TokenManager",
    "0x9a2Ca11fAe50c8C31d74abF9736Ba6F2DEd1b304"
  );

  const fastPriceEvents = await contractAt(
    "FastPriceEvents",
    "0x9b8854a9184f75d2F2c862d21E09FcCbd9131931"
  );

  const priceFeedTimelock = await contractAt(
    "PriceFeedTimelock",
    "0xf09c61193A448C0874D1bC7856f23B3E1be00C1a"
  );
  const shortsTrackerTimelock = await contractAt(
    "ShortsTrackerTimelock",
    "0xDfDd9C4532A6A42469088652D302F558F4B48e83"
  );

  return {
    vaultPriceFeed,
    glp,
    glpManager,
    vault,
    gmx,
    usdg,
    router,
    vaultErrorController,
    vaultUtils,
    referralStorage,
    positionRouter,
    positionManager,
    timelock,
    shortsTracker,
    secondaryPriceFeed,
    tokenManager,
    fastPriceEvents,
    priceFeedTimelock,
    shortsTrackerTimelock,
  };
}

module.exports = {
  getContracts,
};
