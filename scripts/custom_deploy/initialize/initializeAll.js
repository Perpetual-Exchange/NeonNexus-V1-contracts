const { contractAt, sendTxn } = require("../../shared/helpers");
const { getContracts } = require("./contracts");
const { expandDecimals } = require("../../../test/shared/utilities");
const { toUsd } = require("../../../test/shared/units");
const { errors } = require("../../../test/core/Vault/helpers");
const tokens = require("../../core/tokens")[network];

async function main() {
  const {
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
  } = await getContracts();
  // initialize VaultPriceFeed
  //   await sendTxn(
  //     vaultPriceFeed.setMaxStrictPriceDeviation(expandDecimals(1, 28)),
  //     "vaultPriceFeed.setMaxStrictPriceDeviation"
  //   ); // 0.05 USD
  //   await sendTxn(
  //     vaultPriceFeed.setPriceSampleSpace(1),
  //     "vaultPriceFeed.setPriceSampleSpace"
  //   );
  //   await sendTxn(
  //     vaultPriceFeed.setIsAmmEnabled(false),
  //     "vaultPriceFeed.setIsAmmEnabled"
  //   );
  await sendTxn(
    vaultPriceFeed.setSecondaryPriceFeed(secondaryPriceFeed.address),
    "vaultPriceFeed.setSecondaryPriceFeed"
  );
  const chainlinkFlags = {
    address: "0x0000000000000000000000000000000000000000",
  };
  if (chainlinkFlags) {
    await sendTxn(
      vaultPriceFeed.setChainlinkFlags(chainlinkFlags.address),
      "vaultPriceFeed.setChainlinkFlags"
    );
  }

  const { btc, eth, link, dai, usdc } = tokens;
  const tokenArr = [btc, eth, link, dai, usdc];
  const fastPriceTokens = [btc, eth, link];

  const updater1 = { address: "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471" };
  const updater2 = { address: "0xA4091e09eB027F1e5D397659bfC7D73CdDdCa276" };
  const keeper1 = { address: "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471" };
  const keeper2 = { address: "0xA4091e09eB027F1e5D397659bfC7D73CdDdCa276" };
  const updaters = [
    updater1.address,
    updater2.address,
    keeper1.address,
    keeper2.address,
  ];

  for (const [i, tokenItem] of tokenArr.entries()) {
    if (tokenItem.spreadBasisPoints === undefined) {
      continue;
    }
    await sendTxn(
      vaultPriceFeed.setSpreadBasisPoints(
        tokenItem.address, // _token
        tokenItem.spreadBasisPoints // _spreadBasisPoints
      ),
      `vaultPriceFeed.setSpreadBasisPoints(${tokenItem.name}) ${tokenItem.spreadBasisPoints}`
    );
  }

  for (const token of tokenArr) {
    await sendTxn(
      vaultPriceFeed.setTokenConfig(
        token.address, // _token
        token.priceFeed, // _priceFeed
        token.priceDecimals, // _priceDecimals
        token.isStrictStable // _isStrictStable
      ),
      `vaultPriceFeed.setTokenConfig(${token.name}) ${token.address} ${token.priceFeed}`
    );
  }

  const signers = ["0xc71aABBC653C7Bd01B68C35B8f78F82A21014471"];
  await sendTxn(
    secondaryPriceFeed.initialize(1, signers, updaters),
    "secondaryPriceFeed.initialize"
  );
  await sendTxn(
    secondaryPriceFeed.setTokens(
      fastPriceTokens.map((t) => t.address),
      fastPriceTokens.map((t) => t.fastPricePrecision)
    ),
    "secondaryPriceFeed.setTokens"
  );
  await sendTxn(
    secondaryPriceFeed.setVaultPriceFeed(vaultPriceFeed.address),
    "secondaryPriceFeed.setVaultPriceFeed"
  );
  await sendTxn(
    secondaryPriceFeed.setMaxTimeDeviation(60 * 60),
    "secondaryPriceFeed.setMaxTimeDeviation"
  );
  await sendTxn(
    secondaryPriceFeed.setSpreadBasisPointsIfInactive(50),
    "secondaryPriceFeed.setSpreadBasisPointsIfInactive"
  );
  await sendTxn(
    secondaryPriceFeed.setSpreadBasisPointsIfChainError(500),
    "secondaryPriceFeed.setSpreadBasisPointsIfChainError"
  );
  await sendTxn(
    secondaryPriceFeed.setMaxCumulativeDeltaDiffs(
      fastPriceTokens.map((t) => t.address),
      fastPriceTokens.map((t) => t.maxCumulativeDeltaDiff)
    ),
    "secondaryPriceFeed.setMaxCumulativeDeltaDiffs"
  );
  await sendTxn(
    secondaryPriceFeed.setPriceDataInterval(1 * 60),
    "secondaryPriceFeed.setPriceDataInterval"
  );

  await sendTxn(
    positionRouter1.setPositionKeeper(secondaryPriceFeed.address, true),
    "positionRouter.setPositionKeeper(secondaryPriceFeed)"
  );
  await sendTxn(
    positionRouter2.setPositionKeeper(secondaryPriceFeed.address, true),
    "positionRouter.setPositionKeeper(secondaryPriceFeed)"
  );
  await sendTxn(
    fastPriceEvents.setIsPriceFeed(secondaryPriceFeed.address, true),
    "fastPriceEvents.setIsPriceFeed"
  );

  await sendTxn(
    vaultPriceFeed.setGov(priceFeedTimelock.address),
    "vaultPriceFeed.setGov"
  );
  await sendTxn(
    secondaryPriceFeed.setGov(priceFeedTimelock.address),
    "secondaryPriceFeed.setGov"
  );
  await sendTxn(
    secondaryPriceFeed.setTokenManager(tokenManager.address),
    "secondaryPriceFeed.setTokenManager"
  );

  // initialize GLP
  //   await sendTxn(
  //     glp.setInPrivateTransferMode(true),
  //     "glp.setInPrivateTransferMode"
  //   );

  // initialize GLPManager
  //   await sendTxn(
  //     glpManager.setInPrivateMode(true),
  //     "glpManager.setInPrivateMode"
  //   );

  // initialize GLP
  //   await sendTxn(glp.setMinter(glpManager.address, true), "glp.setMinter");

  // initialize USDG
  //   await sendTxn(usdg.addVault(glpManager.address), "usdg.addVault(glpManager)");

  // initialize Vault
  //   await sendTxn(
  //     vault.initialize(
  //       router.address, // router
  //       usdg.address, // usdg
  //       vaultPriceFeed.address, // priceFeed
  //       toUsd(2), // liquidationFeeUsd
  //       100, // fundingRateFactor
  //       100 // stableFundingRateFactor
  //     ),
  //     "vault.initialize"
  //   );

  //   await sendTxn(
  //     vault.setFundingRate(60 * 60, 100, 100),
  //     "vault.setFundingRate"
  //   );

  //   await sendTxn(vault.setInManagerMode(true), "vault.setInManagerMode");
  //   await sendTxn(vault.setManager(glpManager.address, true), "vault.setManager");
  //   await sendTxn(vault.setGov(timelock.address), "vault.setGov");

  //   await sendTxn(
  //     vault.setFees(
  //       10, // _taxBasisPoints
  //       5, // _stableTaxBasisPoints
  //       20, // _mintBurnFeeBasisPoints
  //       20, // _swapFeeBasisPoints
  //       1, // _stableSwapFeeBasisPoints
  //       10, // _marginFeeBasisPoints
  //       toUsd(2), // _liquidationFeeUsd
  //       24 * 60 * 60, // _minProfitTime
  //       true // _hasDynamicFees
  //     ),
  //     "vault.setFees"
  //   );

  //   await sendTxn(
  //     vault.setErrorController(vaultErrorController.address),
  //     "vault.setErrorController"
  //   );

  // initialize VaultErrorController
  //   await sendTxn(
  //     vaultErrorController.setErrors(vault.address, errors),
  //     "vaultErrorController.setErrors"
  //   );

  // initialize VaultUtils
  //   await sendTxn(vault.setVaultUtils(vaultUtils.address), "vault.setVaultUtils");

  // initialize ReferralStorage
  //   await sendTxn(
  //     referralStorage.setHandler(positionRouter.address, true),
  //     "referralStorage.setHandler(positionRouter)"
  //   );

  // initialize PositionManager
  // positionManager only reads from referralStorage so it does not need to be set as a handler of referralStorage
  //   const orderKeepers = [
  //     { address: "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471" },
  //     { address: "0xA4091e09eB027F1e5D397659bfC7D73CdDdCa276" },
  //   ];
  //   const liquidators = [
  //     { address: "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471" },
  //   ];
  //   const partnerContracts = [];

  //   if (
  //     (await positionManager.referralStorage()).toLowerCase() !=
  //     referralStorage.address.toLowerCase()
  //   ) {
  //     await sendTxn(
  //       positionManager.setReferralStorage(referralStorage.address),
  //       "positionManager.setReferralStorage"
  //     );
  //   }
  //   if (await positionManager.shouldValidateIncreaseOrder()) {
  //     await sendTxn(
  //       positionManager.setShouldValidateIncreaseOrder(false),
  //       "positionManager.setShouldValidateIncreaseOrder(false)"
  //     );
  //   }

  //   for (let i = 0; i < orderKeepers.length; i++) {
  //     const orderKeeper = orderKeepers[i];
  //     if (!(await positionManager.isOrderKeeper(orderKeeper.address))) {
  //       await sendTxn(
  //         positionManager.setOrderKeeper(orderKeeper.address, true),
  //         "positionManager.setOrderKeeper(orderKeeper)"
  //       );
  //     }
  //   }

  //   for (let i = 0; i < liquidators.length; i++) {
  //     const liquidator = liquidators[i];
  //     if (!(await positionManager.isLiquidator(liquidator.address))) {
  //       await sendTxn(
  //         positionManager.setLiquidator(liquidator.address, true),
  //         "positionManager.setLiquidator(liquidator)"
  //       );
  //     }
  //   }

  //   if (!(await timelock.isHandler(positionManager.address))) {
  //     await sendTxn(
  //       timelock.setContractHandler(positionManager.address, true),
  //       "timelock.setContractHandler(positionManager)"
  //     );
  //   }

  //   if (!(await vault.isLiquidator(positionManager.address))) {
  //     await sendTxn(
  //       timelock.setLiquidator(vault.address, positionManager.address, true),
  //       "timelock.setLiquidator(vault, positionManager, true)"
  //     );
  //   }
  //   if (!(await shortsTracker.isHandler(positionManager.address))) {
  //     await sendTxn(
  //       shortsTracker.setHandler(positionManager.address, true),
  //       "shortsTracker.setContractHandler(positionManager.address, true)"
  //     );
  //   }
  //   if (!(await router.plugins(positionManager.address))) {
  //     await sendTxn(
  //       router.addPlugin(positionManager.address),
  //       "router.addPlugin(positionManager)"
  //     );
  //   }

  //   for (let i = 0; i < partnerContracts.length; i++) {
  //     const partnerContract = partnerContracts[i];
  //     if (!(await positionManager.isPartner(partnerContract))) {
  //       await sendTxn(
  //         positionManager.setPartner(partnerContract, true),
  //         "positionManager.setPartner(partnerContract)"
  //       );
  //     }
  //   }

  //   if ((await positionManager.gov()) != (await vault.gov())) {
  //     await sendTxn(
  //       positionManager.setGov(await vault.gov()),
  //       "positionManager.setGov"
  //     );
  //   }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
