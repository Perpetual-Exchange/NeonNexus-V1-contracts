const {
  deployContract,
  contractAt,
  writeTmpAddresses,
} = require("../../shared/helpers");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("../../core/tokens")[network];

const {
  deployGMX,
  deployVault,
  deployGLP,
  deployUSDG,
  deployRouter,
  deployShortsTracker,
  deployPositionRouter,
  deployOrderBook,
  deployPositionUtils,
  deployPositionManager,
  deployOrderBookReader,
  deployReader,
  deployRewardTracker,
  deployGlpManager,
  deployStakedGlp,
  deployRewardRouterV2,
} = require("./deploys");

async function main() {
  const { nativeToken, eth } = tokens;
  const gmx = await deployGMX();
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
  const sbfGMXRewardTracker = await deployRewardTracker(
    "Stackd + Bonus + Fee GMX",
    "sbfGMX"
  );
  const fsGLPRewardTracker = await deployRewardTracker(
    "Fee Staked GLP",
    "fsGLP"
  );
  const fGLPRewardTracker = await deployRewardTracker("Fee GLP", "fGLP");
  const glpManager = await deployGlpManager(
    vault,
    usdg,
    glp,
    shortsTracker,
    15 * 60
  );
  const stakedGlp = await deployStakedGlp(
    glp,
    glpManager,
    fsGLPRewardTracker,
    fGLPRewardTracker
  );
  const rewardRouterV2 = await deployRewardRouterV2();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
