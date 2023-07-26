const {
  deployContract,
  contractAt,
  writeTmpAddresses,
} = require("../shared/helpers");

async function deployGMX() {
  return await deployContract("GMX", []);
}

async function deployVault() {
  return await deployContract("Vault", []);
}

async function deployGLP() {
  return await deployContract("GLP", []);
}

async function deployUSDG(vault) {
  return await deployContract("USDG", [vault.address]);
}

async function deployRouter(vault, usdg, nativeToken) {
  return await deployContract("Router", [
    vault.address,
    usdg.address,
    nativeToken.address,
  ]);
}

async function deployShortsTracker(vault) {
  return await deployContract("ShortsTracker", [vault.address]);
}

async function deployPositionUtils() {
  return await deployContract("PositionUtils", []);
}

async function deployPositionRouter(
  vault,
  router,
  token,
  shortsTracker,
  depositFee,
  minExecutionFee,
  positionUtils
) {
  return await deployContract(
    "PositionRouter",
    [
      vault.address,
      router.address,
      token.address,
      shortsTracker.address,
      depositFee,
      minExecutionFee,
    ],
    "PositionRouter",
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );
}

async function deployOrderBook() {
  return await deployContract("OrderBook", []);
}

async function deployPositionManager(
  vault,
  router,
  shortsTracker,
  weth,
  depositFee,
  orderBook,
  positionUtils
) {
  return await deployContract(
    "PositionManager",
    [
      vault.address,
      router.address,
      shortsTracker.address,
      weth.address,
      depositFee,
      orderBook.address,
    ],
    "PositionManager",
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );
}

async function deployOrderBookReader() {
  return await deployContract("OrderBookReader", []);
}

async function deployReader() {
  return await deployContract("Reader", []);
}

async function deployRewardTracker(name, symbol) {
  return await deployContract("RewardTracker", [name, symbol]);
}

async function deployGlpManager(
  vault,
  usdg,
  glp,
  shortsTracker,
  cooldownDuration
) {
  return await deployContract("GlpManager", [
    vault.address,
    usdg.address,
    glp.address,
    shortsTracker.address,
    cooldownDuration,
  ]);
}

async function deployStakedGlp(
  glp,
  glpManager,
  stakedGlpTracker,
  feeGlpTracker
) {
  return await deployContract("StakedGlp", [
    glp.address,
    glpManager.address,
    stakedGlpTracker.address,
    feeGlpTracker.address,
  ]);
}

async function deployRewardRouterV2() {
  return await deployContract("RewardRouterV2", []);
}

async function deployEsGMX() {
  return await deployContract("EsGMX", []);
}

async function deployMintableBaseToken(name, symbol, totalSupply) {
  return await deployContract("MintableBaseToken", [name, symbol, totalSupply]);
}

async function deployVaultReader() {
  return await deployContract("VaultReader", [], "VaultReader");
}

async function deployRewardDistributor(token, tracker) {
  return await deployContract("RewardDistributor", [
    token.address,
    tracker.address,
  ]);
}

async function deployVester(
  name,
  symbol,
  vestingDuration,
  esToken,
  pairToken,
  claimableToken,
  rewardTracker
) {
  return await deployContract("Vester", [
    name,
    symbol,
    vestingDuration,
    esToken,
    pairToken,
    claimableToken,
    rewardTracker,
  ]);
}

async function deployTimelock(
  admin,
  buffer,
  tokenManager,
  mintReceiver,
  glpManager,
  rewardRouter,
  maxTokenSupply,
  marginFeeBasisPoints,
  maxMarginFeeBasisPoints
) {
  return await deployContract(
    "Timelock",
    [
      admin,
      buffer,
      tokenManager,
      mintReceiver,
      glpManager,
      rewardRouter,
      maxTokenSupply,
      marginFeeBasisPoints,
      maxMarginFeeBasisPoints,
    ],
    "Timelock"
  );
}

async function deployReferralStorage() {
  return await deployContract("ReferralStorage", []);
}

async function deployReferralReader() {
  return await deployContract("ReferralReader", [], "ReferralReader");
}

async function deployTokenManager(minAuthorizations) {
  return await deployContract(
    "TokenManager",
    [minAuthorizations],
    "TokenManager"
  );
}

// 应该是其他项目 GameBit
async function deployTreasury() {
  return await deployContract("Treasury", []);
}

async function deployGMT(totalSupply) {
  return await deployContract("GMT", [totalSupply]);
}

async function deployGmxMigrator(minAuthorizations) {
  return await deployContract("GmxMigrator", [minAuthorizations]);
}

async function deployGmxIou(gmxMigrator, name, label) {
  return await deployContract("GmxIou", [gmxMigrator.address, name, label]);
}

module.exports = {
  deployGMX,
  deployVault,
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

  deployTreasury,
  deployGMT,
  deployGmxMigrator,
  deployGmxIou,
};
