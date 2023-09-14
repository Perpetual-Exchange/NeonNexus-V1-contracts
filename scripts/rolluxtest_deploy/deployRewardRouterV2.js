const {
  deployContract,
  contractAt,
  sendTxn,
  writeTmpAddresses,
} = require("../shared/helpers");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

async function main() {
  const { nativeToken } = tokens;

  const vestingDuration = 365 * 24 * 60 * 60;

  const glpManager = await contractAt(
    "GlpManager",
    "0xDC72632f1fc4159E75533B7B6c2BdA92d1644639"
  );

  const glp = await contractAt(
    "GLP",
    "0x1C1e43bE7F0f5175DF59ad922F56120545AED78C"
  );

  const gmx = await contractAt(
    "GMX",
    "0x0d0610DeD1a17AabA6528258488cd2243f94666d"
  );
  const esGmx = await contractAt(
    "EsGMX",
    "0x3eF5F4E6006E2a9C64dd74aEfC2C546CF03adAab"
  );
  const bnGmx = await deployContract("MintableBaseToken", [
    "Bonus REX",
    "bnREX",
    0,
  ]);

  await sendTxn(
    esGmx.setInPrivateTransferMode(true),
    "esGmx.setInPrivateTransferMode"
  );
  await sendTxn(
    glp.setInPrivateTransferMode(true),
    "glp.setInPrivateTransferMode"
  );

  const stakedGmxTracker = await deployContract("RewardTracker", [
    "Staked REX",
    "sREX",
  ]);
  const stakedGmxDistributor = await deployContract("RewardDistributor", [
    esGmx.address,
    stakedGmxTracker.address,
  ]);
  await sendTxn(
    stakedGmxTracker.initialize(
      [gmx.address, esGmx.address],
      stakedGmxDistributor.address
    ),
    "stakedGmxTracker.initialize"
  );
  await sendTxn(
    stakedGmxDistributor.updateLastDistributionTime(),
    "stakedGmxDistributor.updateLastDistributionTime"
  );

  const bonusGmxTracker = await deployContract("RewardTracker", [
    "Staked + Bonus REX",
    "sbREX",
  ]);
  const bonusGmxDistributor = await deployContract("BonusDistributor", [
    bnGmx.address,
    bonusGmxTracker.address,
  ]);
  await sendTxn(
    bonusGmxTracker.initialize(
      [stakedGmxTracker.address],
      bonusGmxDistributor.address
    ),
    "bonusGmxTracker.initialize"
  );
  await sendTxn(
    bonusGmxDistributor.updateLastDistributionTime(),
    "bonusGmxDistributor.updateLastDistributionTime"
  );

  const feeGmxTracker = await deployContract("RewardTracker", [
    "Staked + Bonus + Fee REX",
    "sbfREX",
  ]);
  const feeGmxDistributor = await deployContract("RewardDistributor", [
    nativeToken.address,
    feeGmxTracker.address,
  ]);
  await sendTxn(
    feeGmxTracker.initialize(
      [bonusGmxTracker.address, bnGmx.address],
      feeGmxDistributor.address
    ),
    "feeGmxTracker.initialize"
  );
  await sendTxn(
    feeGmxDistributor.updateLastDistributionTime(),
    "feeGmxDistributor.updateLastDistributionTime"
  );

  const feeGlpTracker = await deployContract("RewardTracker", [
    "Fee RLP",
    "fRLP",
  ]);
  const feeGlpDistributor = await deployContract("RewardDistributor", [
    nativeToken.address,
    feeGlpTracker.address,
  ]);
  await sendTxn(
    feeGlpTracker.initialize([glp.address], feeGlpDistributor.address),
    "feeGlpTracker.initialize"
  );
  await sendTxn(
    feeGlpDistributor.updateLastDistributionTime(),
    "feeGlpDistributor.updateLastDistributionTime"
  );

  const stakedGlpTracker = await deployContract("RewardTracker", [
    "Fee + Staked RLP",
    "fsRLP",
  ]);
  const stakedGlpDistributor = await deployContract("RewardDistributor", [
    esGmx.address,
    stakedGlpTracker.address,
  ]);
  await sendTxn(
    stakedGlpTracker.initialize(
      [feeGlpTracker.address],
      stakedGlpDistributor.address
    ),
    "stakedGlpTracker.initialize"
  );
  await sendTxn(
    stakedGlpDistributor.updateLastDistributionTime(),
    "stakedGlpDistributor.updateLastDistributionTime"
  );

  await sendTxn(
    stakedGmxTracker.setInPrivateTransferMode(true),
    "stakedGmxTracker.setInPrivateTransferMode"
  );
  await sendTxn(
    stakedGmxTracker.setInPrivateStakingMode(true),
    "stakedGmxTracker.setInPrivateStakingMode"
  );
  await sendTxn(
    bonusGmxTracker.setInPrivateTransferMode(true),
    "bonusGmxTracker.setInPrivateTransferMode"
  );
  await sendTxn(
    bonusGmxTracker.setInPrivateStakingMode(true),
    "bonusGmxTracker.setInPrivateStakingMode"
  );
  await sendTxn(
    bonusGmxTracker.setInPrivateClaimingMode(true),
    "bonusGmxTracker.setInPrivateClaimingMode"
  );
  await sendTxn(
    feeGmxTracker.setInPrivateTransferMode(true),
    "feeGmxTracker.setInPrivateTransferMode"
  );
  await sendTxn(
    feeGmxTracker.setInPrivateStakingMode(true),
    "feeGmxTracker.setInPrivateStakingMode"
  );

  await sendTxn(
    feeGlpTracker.setInPrivateTransferMode(true),
    "feeGlpTracker.setInPrivateTransferMode"
  );
  await sendTxn(
    feeGlpTracker.setInPrivateStakingMode(true),
    "feeGlpTracker.setInPrivateStakingMode"
  );
  await sendTxn(
    stakedGlpTracker.setInPrivateTransferMode(true),
    "stakedGlpTracker.setInPrivateTransferMode"
  );
  await sendTxn(
    stakedGlpTracker.setInPrivateStakingMode(true),
    "stakedGlpTracker.setInPrivateStakingMode"
  );

  const gmxVester = await deployContract("Vester", [
    "Vested REX", // _name
    "vREX", // _symbol
    vestingDuration, // _vestingDuration
    esGmx.address, // _esToken
    feeGmxTracker.address, // _pairToken
    gmx.address, // _claimableToken
    stakedGmxTracker.address, // _rewardTracker
  ]);

  const glpVester = await deployContract("Vester", [
    "Vested RLP", // _name
    "vRLP", // _symbol
    vestingDuration, // _vestingDuration
    esGmx.address, // _esToken
    stakedGlpTracker.address, // _pairToken
    gmx.address, // _claimableToken
    stakedGlpTracker.address, // _rewardTracker
  ]);

  const rewardRouter = await deployContract("RewardRouterV2", []);
  await sendTxn(
    rewardRouter.initialize(
      nativeToken.address,
      gmx.address,
      esGmx.address,
      bnGmx.address,
      glp.address,
      stakedGmxTracker.address,
      bonusGmxTracker.address,
      feeGmxTracker.address,
      feeGlpTracker.address,
      stakedGlpTracker.address,
      glpManager.address,
      gmxVester.address,
      glpVester.address
    ),
    "rewardRouter.initialize"
  );

  await sendTxn(
    glpManager.setHandler(rewardRouter.address, true),
    "glpManager.setHandler(rewardRouter)"
  );

  // allow rewardRouter to stake in stakedGmxTracker
  await sendTxn(
    stakedGmxTracker.setHandler(rewardRouter.address, true),
    "stakedGmxTracker.setHandler(rewardRouter)"
  );
  // allow bonusGmxTracker to stake stakedGmxTracker
  await sendTxn(
    stakedGmxTracker.setHandler(bonusGmxTracker.address, true),
    "stakedGmxTracker.setHandler(bonusGmxTracker)"
  );
  // allow rewardRouter to stake in bonusGmxTracker
  await sendTxn(
    bonusGmxTracker.setHandler(rewardRouter.address, true),
    "bonusGmxTracker.setHandler(rewardRouter)"
  );
  // allow bonusGmxTracker to stake feeGmxTracker
  await sendTxn(
    bonusGmxTracker.setHandler(feeGmxTracker.address, true),
    "bonusGmxTracker.setHandler(feeGmxTracker)"
  );
  await sendTxn(
    bonusGmxDistributor.setBonusMultiplier(10000),
    "bonusGmxDistributor.setBonusMultiplier"
  );
  // allow rewardRouter to stake in feeGmxTracker
  await sendTxn(
    feeGmxTracker.setHandler(rewardRouter.address, true),
    "feeGmxTracker.setHandler(rewardRouter)"
  );
  // allow stakedGmxTracker to stake esGmx
  await sendTxn(
    esGmx.setHandler(stakedGmxTracker.address, true),
    "esGmx.setHandler(stakedGmxTracker)"
  );
  // allow feeGmxTracker to stake bnGmx
  await sendTxn(
    bnGmx.setHandler(feeGmxTracker.address, true),
    "bnGmx.setHandler(feeGmxTracker"
  );
  // allow rewardRouter to burn bnGmx
  await sendTxn(
    bnGmx.setMinter(rewardRouter.address, true),
    "bnGmx.setMinter(rewardRouter"
  );

  // allow stakedGlpTracker to stake feeGlpTracker
  await sendTxn(
    feeGlpTracker.setHandler(stakedGlpTracker.address, true),
    "feeGlpTracker.setHandler(stakedGlpTracker)"
  );
  // allow feeGlpTracker to stake glp
  await sendTxn(
    glp.setHandler(feeGlpTracker.address, true),
    "glp.setHandler(feeGlpTracker)"
  );

  // allow rewardRouter to stake in feeGlpTracker
  await sendTxn(
    feeGlpTracker.setHandler(rewardRouter.address, true),
    "feeGlpTracker.setHandler(rewardRouter)"
  );
  // allow rewardRouter to stake in stakedGlpTracker
  await sendTxn(
    stakedGlpTracker.setHandler(rewardRouter.address, true),
    "stakedGlpTracker.setHandler(rewardRouter)"
  );

  await sendTxn(
    esGmx.setHandler(rewardRouter.address, true),
    "esGmx.setHandler(rewardRouter)"
  );
  await sendTxn(
    esGmx.setHandler(stakedGmxDistributor.address, true),
    "esGmx.setHandler(stakedGmxDistributor)"
  );
  await sendTxn(
    esGmx.setHandler(stakedGlpDistributor.address, true),
    "esGmx.setHandler(stakedGlpDistributor)"
  );
  await sendTxn(
    esGmx.setHandler(stakedGlpTracker.address, true),
    "esGmx.setHandler(stakedGlpTracker)"
  );
  await sendTxn(
    esGmx.setHandler(gmxVester.address, true),
    "esGmx.setHandler(gmxVester)"
  );
  await sendTxn(
    esGmx.setHandler(glpVester.address, true),
    "esGmx.setHandler(glpVester)"
  );

  await sendTxn(
    esGmx.setMinter(gmxVester.address, true),
    "esGmx.setMinter(gmxVester)"
  );
  await sendTxn(
    esGmx.setMinter(glpVester.address, true),
    "esGmx.setMinter(glpVester)"
  );

  await sendTxn(
    gmxVester.setHandler(rewardRouter.address, true),
    "gmxVester.setHandler(rewardRouter)"
  );
  await sendTxn(
    glpVester.setHandler(rewardRouter.address, true),
    "glpVester.setHandler(rewardRouter)"
  );

  await sendTxn(
    feeGmxTracker.setHandler(gmxVester.address, true),
    "feeGmxTracker.setHandler(gmxVester)"
  );
  await sendTxn(
    stakedGlpTracker.setHandler(glpVester.address, true),
    "stakedGlpTracker.setHandler(glpVester)"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
