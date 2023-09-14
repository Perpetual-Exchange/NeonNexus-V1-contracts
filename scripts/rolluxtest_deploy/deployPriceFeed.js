const {
  getFrameSigner,
  deployContract,
  contractAt,
  sendTxn,
  readTmpAddresses,
  writeTmpAddresses,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");
const { toUsd } = require("../../test/shared/units");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

const {
  ARBITRUM_URL,
  ARBITRUM_CAP_KEEPER_KEY,
  AVAX_URL,
  AVAX_CAP_KEEPER_KEY,
  SEPOLIA_URL,
  SEPOLIA_DEPLOY_KEY,
  AVAX_TESTNET_URL,
  AVAX_TESTNET_DEPLOY_KEY,
  OPSIDE_TESTNET_URL,
  OPSIDE_TESTNET_DEPLOY_KEY,
} = require("../../env.json");

async function getArbValues(signer) {
  const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_URL);
  const capKeeperWallet = new ethers.Wallet(ARBITRUM_CAP_KEEPER_KEY).connect(
    provider
  );

  const { btc, eth, usdce, usdc, link, uni, usdt, mim, frax, dai } = tokens;
  const tokenArr = [btc, eth, usdce, usdc, link, uni, usdt, mim, frax, dai];
  const fastPriceTokens = [btc, eth, link, uni];

  const priceFeedTimelock = {
    address: "0x7b1FFdDEEc3C4797079C7ed91057e399e9D43a8B",
  };

  const updater1 = { address: "0x18eAc44875EC92Ed80EeFAa7fa7Ac957b312D366" };
  const updater2 = { address: "0x2eD9829CFF68c7Bb40812f70c4Fc06A4938845de" };
  const keeper1 = { address: "0xbEe27BD52dB995D3c74Dc11FF32D93a1Aad747f7" };
  const keeper2 = { address: "0x94577665926885f47ddC1Feb322bc51470daA8E8" };
  const updaters = [
    updater1.address,
    updater2.address,
    keeper1.address,
    keeper2.address,
  ];

  const tokenManager = {
    address: "0x2c247a44928d66041D9F7B11A69d7a84d25207ba",
  };

  const positionRouter1 = await contractAt(
    "PositionRouter",
    "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868",
    capKeeperWallet
  );
  const positionRouter2 = await contractAt(
    "PositionRouter",
    "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868",
    capKeeperWallet
  );

  const fastPriceEvents = await contractAt(
    "FastPriceEvents",
    "0x4530b7DE1958270A2376be192a24175D795e1b07",
    signer
  );
  // const fastPriceEvents = await deployContract("FastPriceEvents", [])

  const chainlinkFlags = {
    address: "0x3C14e07Edd0dC67442FA96f1Ec6999c57E810a83",
  };

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter1,
    positionRouter2,
    chainlinkFlags,
    tokenArr,
    updaters,
    priceFeedTimelock,
  };
}

async function getAvaxValues(signer) {
  const provider = new ethers.providers.JsonRpcProvider(AVAX_URL);
  const capKeeperWallet = new ethers.Wallet(AVAX_CAP_KEEPER_KEY).connect(
    provider
  );

  const { avax, btc, btcb, eth, mim, usdce, usdc } = tokens;
  const tokenArr = [avax, btc, btcb, eth, mim, usdce, usdc];
  const fastPriceTokens = [avax, btc, btcb, eth];

  const priceFeedTimelock = {
    address: "0xCa8b5F2fF7B8d452bE8972B44Dc026Be96b97228",
  };

  const updater1 = { address: "0x2b249Bec7c3A142431b67e63A1dF86F974FAF3aa" };
  const updater2 = { address: "0x63ff41E44d68216e716d236E2ECdd5272611D835" };
  const keeper1 = { address: "0x5e0338CE6597FCB9404d69F4286194A60aD442b7" };
  const keeper2 = { address: "0x8CD98FF48831aa8864314ae8f41337FaE9941C8D" };
  const updaters = [
    updater1.address,
    updater2.address,
    keeper1.address,
    keeper2.address,
  ];

  const tokenManager = {
    address: "0x9bf98C09590CeE2Ec5F6256449754f1ba77d5aE5",
  };

  const positionUtils = await contractAt(
    "PositionUtils",
    "0x811B1AE2A6addF28e39cD189a56F2413a7c69f5E"
  );

  const positionRouter1 = await contractAt(
    "PositionRouter",
    "0xffF6D276Bc37c61A23f06410Dce4A400f66420f8",
    capKeeperWallet,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );
  const positionRouter2 = await contractAt(
    "PositionRouter",
    "0xffF6D276Bc37c61A23f06410Dce4A400f66420f8",
    capKeeperWallet,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  const fastPriceEvents = await deployContract("FastPriceEvents", []);

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter1,
    positionRouter2,
    tokenArr,
    updaters,
    priceFeedTimelock,
  };
}

async function getSepoliaValues(signer) {
  const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_URL);
  const capKeeperWallet = new ethers.Wallet(SEPOLIA_DEPLOY_KEY).connect(
    provider
  );

  const { btc, eth, link, dai, usdc } = tokens;
  const tokenArr = [btc, eth, link, dai, usdc];
  const fastPriceTokens = [btc, eth, link];

  const priceFeedTimelock = {
    address: "0xc6893b26b1280E79Fce53cc9aE9ee776a87226C4",
  };

  const updater1 = { address: "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471" };
  const updater2 = { address: "0x083102dEc08D0a449bEd627bE204531bf34251Ae" };
  const keeper1 = { address: "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471" };
  const keeper2 = { address: "0x083102dEc08D0a449bEd627bE204531bf34251Ae" };
  const updaters = [
    updater1.address,
    updater2.address,
    keeper1.address,
    keeper2.address,
  ];

  const tokenManager = {
    address: "0x2E73eF81d7cD9305169c01BB576089948B9a0dA7",
  };

  const positionUtils = await contractAt(
    "PositionUtils",
    "0x811B1AE2A6addF28e39cD189a56F2413a7c69f5E"
  );

  const positionRouter1 = await contractAt(
    "PositionRouter",
    "0xFb0342D3cf1Ba81fc336195c4Ed6626eAb8e402B",
    capKeeperWallet,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );
  const positionRouter2 = await contractAt(
    "PositionRouter",
    "0xFb0342D3cf1Ba81fc336195c4Ed6626eAb8e402B",
    capKeeperWallet,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  const router = await contractAt(
    "Router",
    "0xf6447de9988F36C0E74fb3991E1d001DB7A1bec8"
  );

  const fastPriceEvents = await deployContract("FastPriceEvents", []);
  //   const fastPriceEvents = await contractAt(
  //     "FastPriceEvents",
  //     "0x02b7023D43bc52bFf8a0C54A9F2ecec053523Bf6",
  //     signer
  //   );

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter1,
    positionRouter2,
    tokenArr,
    updaters,
    priceFeedTimelock,
  };
}

async function getAvaxTestValues(signer) {
  const provider = new ethers.providers.JsonRpcProvider(AVAX_TESTNET_URL);
  const capKeeperWallet = new ethers.Wallet(AVAX_TESTNET_DEPLOY_KEY).connect(
    provider
  );

  const { btc, eth, avax, link, usdt } = tokens;
  const tokenArr = [btc, eth, avax, link, usdt];
  const fastPriceTokens = [btc, eth, avax, link];

  const priceFeedTimelock = {
    address: "0x39A31D579a53F75d872Ce7d5CB3E3ad41CFBdCA8",
  };

  const updater1 = { address: "0xAcdC274B853e01e9666E03c662d30A83B8F73080" };
  const updater2 = { address: "0x1FD2692bfA672bCf6Bf4634ed48D436F422d0E48" };
  const keeper1 = { address: "0xAcdC274B853e01e9666E03c662d30A83B8F73080" };
  const keeper2 = { address: "0x1FD2692bfA672bCf6Bf4634ed48D436F422d0E48" };
  const updaters = [
    updater1.address,
    updater2.address,
    keeper1.address,
    keeper2.address,
  ];

  const tokenManager = {
    address: "0x7199734D2CC6bC4eB45Ebe251539a4CEDde2d2D4",
  };

  const positionUtils = await contractAt(
    "PositionUtils",
    "0x04Eb210750C9696A040333a7FaeeE791c945249E"
  );

  const positionRouter1 = await contractAt(
    "PositionRouter",
    "0x3cFF0ef03dF66b198E99AF2bF0d04bc537F06C00",
    capKeeperWallet,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );
  const positionRouter2 = await contractAt(
    "PositionRouter",
    "0x3cFF0ef03dF66b198E99AF2bF0d04bc537F06C00",
    capKeeperWallet,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  // ms const router = await contractAt(
  //   "Router",
  //   "0xf6447de9988F36C0E74fb3991E1d001DB7A1bec8"
  // );

  // const fastPriceEvents = await deployContract("FastPriceEvents", []);
    const fastPriceEvents = await contractAt(
      "FastPriceEvents",
      "0x3529ca912271555Ef88a2E9D1Db0f6CD5D2715c7",
      signer
    );

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter1,
    positionRouter2,
    tokenArr,
    updaters,
    priceFeedTimelock,
  };
}

async function getOpTestValues(signer) {
  const provider = new ethers.providers.JsonRpcProvider(OPSIDE_TESTNET_URL);
  const capKeeperWallet = new ethers.Wallet(OPSIDE_TESTNET_DEPLOY_KEY).connect(
    provider
  );

  const { btc, eth, usdt, usdc } = tokens;
  const tokenArr = [btc, eth, usdt, usdc];
  const fastPriceTokens = [btc, eth];

  const priceFeedTimelock = {
    address: "0xDDF9C4BEE4C531Cd75bC36bb0DCd0e2Ef9Cc1dD9",
  };

  const updater1 = { address: "0xAcdC274B853e01e9666E03c662d30A83B8F73080" };
  const updater2 = { address: "0x1FD2692bfA672bCf6Bf4634ed48D436F422d0E48" };
  const keeper1 = { address: "0xAcdC274B853e01e9666E03c662d30A83B8F73080" };
  const keeper2 = { address: "0x1FD2692bfA672bCf6Bf4634ed48D436F422d0E48" };
  const updaters = [
    updater1.address,
    updater2.address,
    keeper1.address,
    keeper2.address,
  ];

  const tokenManager = {
    address: "0xcE21E036Dca74bbEdC0A883e3D448b45aB5a663A",
  };

  const positionUtils = await contractAt(
    "PositionUtils",
    "0xE3aac6676E18f5229Cbd6cb3A6B809112C2B1932"
  );

  const positionRouter1 = await contractAt(
    "PositionRouter",
    "0x6A84F186A77F22B701Cb1CbA18da8b29E813A303",
    capKeeperWallet,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );
  const positionRouter2 = await contractAt(
    "PositionRouter",
    "0x6A84F186A77F22B701Cb1CbA18da8b29E813A303",
    capKeeperWallet,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  // ms const router = await contractAt(
  //   "Router",
  //   "0xf6447de9988F36C0E74fb3991E1d001DB7A1bec8"
  // );

  // const fastPriceEvents = await deployContract("FastPriceEvents", []);
  const fastPriceEvents = await contractAt(
    "FastPriceEvents",
    "0xf784ac4eDfD844AF252cF5F6CA86A8E1AF02c9b7",
    signer
  );

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter1,
    positionRouter2,
    tokenArr,
    updaters,
    priceFeedTimelock,
  };
}

async function getRoTestValues(signer) {
  // const provider = new ethers.providers.JsonRpcProvider(OPSIDE_TESTNET_URL);
  // const capKeeperWallet = new ethers.Wallet(OPSIDE_TESTNET_DEPLOY_KEY).connect(
  //   provider
  // );

  const { btc, eth, sys, dai, usdt } = tokens;
  const tokenArr = [btc, eth, sys, dai, usdt];
  const fastPriceTokens = [btc, eth, sys];

  const priceFeedTimelock = {
    address: "0xF2aF2fBDEd47be4eb2E1F9858347B39A7e38c409",
  };

  const updater1 = { address: signer.address };
  const updater2 = { address: "0x6660c89BD48a39B2c2F00FC1E2e172c10960a301" };   //REXt_admin
  const keeper1 = { address: signer.address };
  const keeper2 = { address: "0x6660c89BD48a39B2c2F00FC1E2e172c10960a301" };   //REXt_admin
  const updaters = [
    updater1.address,
    updater2.address,
    keeper1.address,
    keeper2.address,
  ];

  const tokenManager = {
    address: "0x0c6C0779DF528CFf7e15528354eF4714c7B9dF3D",
  };

  const positionUtils = await contractAt(
    "PositionUtils",
    "0xd530E3C4BEEf0cAcE2ec3ede72DC8b351537606A"
  );

  const positionRouter1 = await contractAt(
    "PositionRouter",
    "0xdc78654EaABb0729873a8B48D553cA398670FdDe",
    signer,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );
  const positionRouter2 = await contractAt(
    "PositionRouter",
    "0xdc78654EaABb0729873a8B48D553cA398670FdDe",
    signer,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  // ms const router = await contractAt(
  //   "Router",
  //   "0xf6447de9988F36C0E74fb3991E1d001DB7A1bec8"
  // );

  const fastPriceEvents = await deployContract("FastPriceEvents", []);
  // const fastPriceEvents = await contractAt(
  //   "FastPriceEvents",
  //   "0xf784ac4eDfD844AF252cF5F6CA86A8E1AF02c9b7",
  //   signer
  // );

  return {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter1,
    positionRouter2,
    tokenArr,
    updaters,
    priceFeedTimelock,
  };
}

async function getValues(signer) {
  if (network === "arbitrum") {
    return getArbValues(signer);
  }

  if (network === "avax") {
    return getAvaxValues(signer);
  }
  if (network === "sepolia") {
    return getSepoliaValues(signer);
  }
  if (network === "avaxtest") {
    return getAvaxTestValues(signer);
  }
  if (network === "opsidetest") {
    return getOpTestValues(signer);
  }
  if (network === "rolluxtest") {
    return getRoTestValues(signer);
  }
}

async function main() {
  // const provider = new ethers.providers.JsonRpcProvider(OPSIDE_TESTNET_URL);
  // const updaterWallet = new ethers.Wallet(OPSIDE_TESTNET_DEPLOY_KEY).connect(
  //   provider
  // );

  const signer = await getFrameSigner();
  const deployer = { address: signer.address };

  const {
    fastPriceTokens,
    fastPriceEvents,
    tokenManager,
    positionRouter1,
    positionRouter2,
    chainlinkFlags,
    tokenArr,
    updaters,
    priceFeedTimelock,
  } = await getValues(signer);

  //   const signers = [
  //     "0x82429089e7c86B7047b793A9E7E7311C93d2b7a6", // coinflipcanada
  //     "0x1D6d107F5960A66f293Ac07EDd08c1ffE79B548a", // G Account 1
  //     "0xD7941C4Ca57a511F21853Bbc7FBF8149d5eCb398", // G Account 2
  //     "0xfb481D70f8d987c1AE3ADc90B7046e39eb6Ad64B", // kr
  //     "0x99Aa3D1b3259039E8cB4f0B33d0Cfd736e1Bf49E", // quat
  //     "0x6091646D0354b03DD1e9697D33A7341d8C93a6F5", // xhiroz
  //     "0x45e48668F090a3eD1C7961421c60Df4E66f693BD", // Dovey
  //     "0x881690382102106b00a99E3dB86056D0fC71eee6", // Han Wen
  //     "0x2e5d207a4c0f7e7c52f6622dcc6eb44bc0fe1a13", // Krunal Amin
  //   ];
  const signers = [
    deployer.address, // deployer
    "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471", // xiaowu2
    // "0xc7816AB57762479dCF33185bad7A1cFCb68a7997",
    // "0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d",
  ];
  if (fastPriceTokens.find((t) => !t.fastPricePrecision)) {
    throw new Error("Invalid price precision");
  }

  if (fastPriceTokens.find((t) => !t.maxCumulativeDeltaDiff)) {
    throw new Error("Invalid price maxCumulativeDeltaDiff");
  }

  const secondaryPriceFeed = await deployContract("FastPriceFeed", [
    5 * 60, // _priceDuration
    60 * 60, // _maxPriceUpdateDelay
    1, // _minBlockInterval
    250, // _maxDeviationBasisPoints
    fastPriceEvents.address, // _fastPriceEvents
    deployer.address, // _tokenManager
  ]);
  // const secondaryPriceFeed = await contractAt(
  //   "FastPriceFeed",
  //   "0x8b3E1fc197ED431482e78D8552aC0bbF5b0c9A20",
  //   signer
  // );

  // ms use before const vaultPriceFeed = await deployContract("VaultPriceFeed", []);
  const vaultPriceFeed = await contractAt(
    "VaultPriceFeed",
    "0xc7270a07c1C6D36A938D03348c3AC1e083492ee4",
    signer
  );

  //   await sendTxn(
  //     vaultPriceFeed.setMaxStrictPriceDeviation(expandDecimals(1, 28)),
  //     "vaultPriceFeed.setMaxStrictPriceDeviation"
  //   ); // 0.01 USD
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

  if (chainlinkFlags) {
    await sendTxn(
      vaultPriceFeed.setChainlinkFlags(chainlinkFlags.address),
      "vaultPriceFeed.setChainlinkFlags"
    );
  }

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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
