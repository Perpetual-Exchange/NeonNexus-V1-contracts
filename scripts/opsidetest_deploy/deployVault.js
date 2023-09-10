const { deployContract, contractAt, sendTxn } = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");
const { toUsd } = require("../../test/shared/units");
const { errors } = require("../../test/core/Vault/helpers");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("../core/tokens")[network];

async function main() {
  const { nativeToken } = tokens;

  const vault = await deployContract("Vault", []);
  // const vault = await contractAt("Vault", "0x489ee077994B6658eAfA855C308275EAd8097C4A")
  const usdg = await deployContract("USDG", [vault.address]);
  // const usdg = await contractAt("USDG", "0x45096e7aA921f27590f8F19e457794EB09678141")
  const router = await deployContract("Router", [
    vault.address,
    usdg.address,
    nativeToken.address,
  ]);

  const vaultPriceFeed = await deployContract("VaultPriceFeed", []);

  await sendTxn(
    vaultPriceFeed.setMaxStrictPriceDeviation(expandDecimals(1, 28)),
    "vaultPriceFeed.setMaxStrictPriceDeviation"
  ); // 0.05 USD
  await sendTxn(
    vaultPriceFeed.setPriceSampleSpace(1),
    "vaultPriceFeed.setPriceSampleSpace"
  );
  await sendTxn(
    vaultPriceFeed.setIsAmmEnabled(false),
    "vaultPriceFeed.setIsAmmEnabled"
  );

  const glp = await deployContract("OLP", []);
  await sendTxn(
    glp.setInPrivateTransferMode(true),
    "glp.setInPrivateTransferMode"
  );
  // const glp = await contractAt("GLP", "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258")

  const shortsTracker = await deployContract("ShortsTracker", [vault.address]);
  await shortsTracker.setIsGlobalShortDataReady(true);

  const glpManager = await deployContract("GlpManager", [
    vault.address,
    usdg.address,
    glp.address,
    shortsTracker.address,
    15 * 60,
  ]);
  await sendTxn(
    glpManager.setInPrivateMode(true),
    "glpManager.setInPrivateMode"
  );

  await sendTxn(glp.setMinter(glpManager.address, true), "glp.setMinter");
  await sendTxn(usdg.addVault(glpManager.address), "usdg.addVault(glpManager)");

  await sendTxn(
    vault.initialize(
      router.address, // router
      usdg.address, // usdg
      vaultPriceFeed.address, // priceFeed
      toUsd(2), // liquidationFeeUsd
      100, // fundingRateFactor
      100 // stableFundingRateFactor
    ),
    "vault.initialize"
  );

  await sendTxn(
    vault.setFundingRate(60 * 60, 100, 100),
    "vault.setFundingRate"
  );

  await sendTxn(vault.setInManagerMode(true), "vault.setInManagerMode");
  await sendTxn(vault.setManager(glpManager.address, true), "vault.setManager");

  await sendTxn(
    vault.setFees(
      10, // _taxBasisPoints
      5, // _stableTaxBasisPoints
      20, // _mintBurnFeeBasisPoints
      20, // _swapFeeBasisPoints
      1, // _stableSwapFeeBasisPoints
      10, // _marginFeeBasisPoints
      toUsd(2), // _liquidationFeeUsd
      24 * 60 * 60, // _minProfitTime
      true // _hasDynamicFees
    ),
    "vault.setFees"
  );

  const vaultErrorController = await deployContract("VaultErrorController", []);
  await sendTxn(
    vault.setErrorController(vaultErrorController.address),
    "vault.setErrorController"
  );
  await sendTxn(
    vaultErrorController.setErrors(vault.address, errors),
    "vaultErrorController.setErrors"
  );

  const vaultUtils = await deployContract("VaultUtils", [vault.address]);
  await sendTxn(vault.setVaultUtils(vaultUtils.address), "vault.setVaultUtils");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });