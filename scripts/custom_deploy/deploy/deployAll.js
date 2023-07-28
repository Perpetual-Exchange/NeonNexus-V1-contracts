const {
  deployContract,
  contractAt,
  writeTmpAddresses,
} = require("../../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("../../core/tokens")[network];

const {
  deployGMX,
  deployVault,
  deployVaultErrorController,
  deployVaultUtils,
  deployGLP,
  deployUSDG,
  deployRouter,
  deployShortsTracker,
  deployPositionUtils,
  deployPositionRouter,
  deployOrderBook,
  deployPositionManager,
  deployOrderBookReader,
  deployReader,
  deployRewardTracker,
  deployGlpManager,
  deployStakedGlp,
  deployRewardRouterV2,
  deployEsGMX,
  deployMintableBaseToken,
  deployVaultReader,
  deployRewardDistributor,
  deployVester,
  deployReferralStorage,
  deployReferralReader,
  deployTimelock,
  deployTokenManager,
  deployFastPriceEvents,
  deployFastPriceFeed,
  deployVaultPriceFeed,
  deployPriceFeedTimelock,
} = require("./deploys");

const deployer = {
  address: "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471",
};

const priceFeedTimelockAdmin = "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471";
const priceFeedTimelockBuffer = 24 * 60 * 60;

const priceFeedTimelockTokenManager = {
  address: "0x9a2Ca11fAe50c8C31d74abF9736Ba6F2DEd1b304",
};

const timelockBuffer = 24 * 60 * 60;
const timelockMaxTokenSupply = expandDecimals("13250000", 18);
const timelockAdmin = "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471";

const vestingDuration = 365 * 24 * 60 * 60;

async function main() {
  const { nativeToken, eth } = tokens;
  const gmx = await deployGMX();
  const bnGMX = await deployMintableBaseToken("Bonus GMX", "bnGMX", 0);
  const esGMX = await deployEsGMX();
  const sGMX = await deployRewardTracker("Stackd GMX", "sGMX");
  const sbGMX = await deployRewardTracker("Staked + Bonus GMX", "sbGMX");
  const sbfGMX = await deployRewardTracker(
    "Staked + Bonus + Fee GMX",
    "sbfGMX"
  );

  const vault = await deployVault();
  const glp = await deployGLP();
  const usdg = await deployUSDG(vault);
  const router = await deployRouter(vault, usdg, nativeToken);
  const shortsTracker = await deployShortsTracker(vault);
  const positionUtils = await deployPositionUtils();
  const positionRouter = await deployPositionRouter(
    vault,
    router,
    eth,
    shortsTracker,
    30,
    2000000000,
    positionUtils
  );
  const orderBook = await deployOrderBook();
  const positionManager = await deployPositionManager(
    vault,
    router,
    shortsTracker,
    nativeToken,
    30,
    orderBook,
    positionUtils
  );
  const orderBookReader = await deployOrderBookReader();
  const reader = await deployReader();
  const fsGLP = await deployRewardTracker("Fee Staked GLP", "fsGLP");
  const fGLP = await deployRewardTracker("Fee GLP", "fGLP");
  const glpManager = await deployGlpManager(
    vault,
    usdg,
    glp,
    shortsTracker,
    15 * 60
  );
  const stakedGlp = await deployStakedGlp(glp, glpManager, fsGLP, fGLP);
  const GMXRewardRouterV2 = await deployRewardRouterV2();
  const GlpRewardRouterV2 = await deployRewardRouterV2();

  const GMXRewardDistributor = await deployRewardDistributor(esGMX, sGMX);
  const GLPRewardDistributor = await deployRewardDistributor(esGMX, fsGLP);
  const fastPriceEvents = await deployFastPriceEvents();

  const fastPriceFeed = await deployFastPriceFeed(
    5 * 60, // _priceDuration
    60 * 60, // _maxPriceUpdateDelay
    1, // _minBlockInterval
    250, // _maxDeviationBasisPoints
    fastPriceEvents, // _fastPriceEvents
    deployer // _tokenManager);
  );

  const priceFeedTimelock = await deployPriceFeedTimelock(
    priceFeedTimelockAdmin,
    priceFeedTimelockBuffer,
    priceFeedTimelockTokenManager
  );

  const referralReader = await deployReferralReader();
  const referralStorage = await deployReferralStorage();

  const tokenManager = await deployTokenManager(4);

  const mintReceiver = tokenManager;
  const timelock = await deployTimelock(
    timelockAdmin, // admin
    timelockBuffer, // buffer
    tokenManager.address, // tokenManager
    mintReceiver.address, // mintReceiver
    glpManager.address, // glpManager
    GlpRewardRouterV2.address, // rewardRouter
    timelockMaxTokenSupply, // maxTokenSupply
    10, // marginFeeBasisPoints 0.1%
    500 // maxMarginFeeBasisPoints 5%
  );

  const vaultErrorController = await deployVaultErrorController();
  const vaultPriceFeed = await deployVaultPriceFeed();

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
