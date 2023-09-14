const {
  deployContract,
  contractAt,
  sendTxn,
  getFrameSigner,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");

const network = process.env.HARDHAT_NETWORK || "mainnet";

async function getArbValues() {
  const vault = await contractAt(
    "Vault",
    "0x489ee077994B6658eAfA855C308275EAd8097C4A"
  );
  const tokenManager = {
    address: "0xddDc546e07f1374A07b270b7d863371e575EA96A",
  };
  const glpManager = { address: "0x3963FfC9dff443c2A94f21b129D429891E32ec18" };
  const rewardRouter = {
    address: "0xB95DB5B167D75e6d04227CfFFA61069348d271F5",
  };

  const positionRouter = {
    address: "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868",
  };
  const positionManager = {
    address: "0x75E42e6f01baf1D6022bEa862A28774a9f8a4A0C",
  };
  const gmx = { address: "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a" };

  return {
    vault,
    tokenManager,
    glpManager,
    rewardRouter,
    positionRouter,
    positionManager,
    gmx,
  };
}

async function getAvaxValues() {
  const vault = await contractAt(
    "Vault",
    "0x9ab2De34A33fB459b538c43f251eB825645e8595"
  );
  const tokenManager = {
    address: "0x8b25Ba1cAEAFaB8e9926fabCfB6123782e3B4BC2",
  };
  const glpManager = { address: "0xD152c7F25db7F4B95b7658323c5F33d176818EE4" };
  const rewardRouter = {
    address: "0xB70B91CE0771d3f4c81D87660f71Da31d48eB3B3",
  };

  const positionRouter = {
    address: "0xffF6D276Bc37c61A23f06410Dce4A400f66420f8",
  };
  const positionManager = {
    address: "0xA21B83E579f4315951bA658654c371520BDcB866",
  };
  const gmx = { address: "0x62edc0692BD897D2295872a9FFCac5425011c661" };

  return {
    vault,
    tokenManager,
    glpManager,
    rewardRouter,
    positionRouter,
    positionManager,
    gmx,
  };
}

async function getSepoliaValues() {
  const vault = await contractAt(
    "Vault",
    "0x7531626E87BdA9B8511bea536136e5349EDacE89"
  );
  const tokenManager = {
    address: "0x2E73eF81d7cD9305169c01BB576089948B9a0dA7",
  };
  const glpManager = { address: "0x241F2d418f23d42f821cdf516F2E530cE2a57f01" };
  const rewardRouter = {
    address: "0x45ED224Ede7246b6f0104CaB9624194694e90F0B",
  };

  const positionRouter = {
    address: "0xFb0342D3cf1Ba81fc336195c4Ed6626eAb8e402B",
  };
  const positionManager = {
    address: "0xf29BdD72076C28455273858df0DeA616A7bA7AD7",
  };
  const gmx = { address: "0x0C038276cd0089e58C2fc5d7CB6e7565Ca14650a" };

  return {
    vault,
    tokenManager,
    glpManager,
    rewardRouter,
    positionRouter,
    positionManager,
    gmx,
  };
}

async function getAvaxTestValues() {
  const vault = await contractAt(
    "Vault",
    "0xAC6E2Ac93E2a1CFFadE96607fe2376F5f5952EDC"
  );
  const tokenManager = {
    address: "0x7199734D2CC6bC4eB45Ebe251539a4CEDde2d2D4",
  };
  const glpManager = { address: "0xA9b3ef6957B061086B41C36eD805Ad23Cac7b099" };
  const rewardRouter = {
    address: "0x800db23793bBA846f378296E7b492F731D1eE464",
  };

  const positionRouter = {
    address: "0xC940Df5Ea4f80f50Ef7eb6d484dc50Fa66FcA210",
  };
  const positionManager = {
    address: "0x3be98a77a22C954C2ffDf4c47daDa1ff39149889",
  };
  const gmx = { address: "0x2CbF0056E15f4Fe2e04691D280D89bA645D6D364" };

  return {
    vault,
    tokenManager,
    glpManager,
    rewardRouter,
    positionRouter,
    positionManager,
    gmx,
  };
}

async function getOpTestValues() {
  const vault = await contractAt(
    "Vault",
    "0x357fa1565B94D9F7C770D30c95a405F805d95fEA"
  );
  const tokenManager = {
    address: "0xcE21E036Dca74bbEdC0A883e3D448b45aB5a663A",
  };
  const glpManager = { address: "0x748eF6Ac94148AC23Df596Fd1a60E47D56e0C4e4" };
  const rewardRouter = {
    address: "0x731eD5C081FeBd4AB928B0c164Dac31B2d7A313F",
  };

  const positionRouter = {
    address: "0x6A84F186A77F22B701Cb1CbA18da8b29E813A303",
  };
  const positionManager = {
    address: "0x622e004355Fbe4B097c1BAeD27bbE3812A110c0F",
  };
  const gmx = { address: "0x7A9a466DE08747bC8Ad79aBA6D8dCE9D64E5C767" };

  return {
    vault,
    tokenManager,
    glpManager,
    rewardRouter,
    positionRouter,
    positionManager,
    gmx,
  };
}

async function getRoTestValues() {
  const vault = await contractAt(
    "Vault",
    "0xffe4E159fd0f96b01463b297a5bcA784000C50C9"
  );
  const tokenManager = {
    address: "0x0c6C0779DF528CFf7e15528354eF4714c7B9dF3D",
  };
  const glpManager = { address: "0xDC72632f1fc4159E75533B7B6c2BdA92d1644639" };
  const rewardRouter = {
    address: "0x2A521D2D341b59Dc89Db27D0ab6601d60aC49051",
  };

  const positionRouter = {
    address: "0xdc78654EaABb0729873a8B48D553cA398670FdDe",
  };
  const positionManager = {
    address: "0x4B83201fc16a479e83043f42c20b5749752873D6",
  };
  const gmx = { address: "0x0d0610DeD1a17AabA6528258488cd2243f94666d" };

  return {
    vault,
    tokenManager,
    glpManager,
    rewardRouter,
    positionRouter,
    positionManager,
    gmx,
  };
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues();
  }

  if (network === "avax") {
    return getAvaxValues();
  }

  if (network === "sepolia") {
    return getSepoliaValues();
  }

  if (network === "avaxtest") {
    return getAvaxTestValues();
  }

  if (network === "opsidetest") {
    return getOpTestValues();
  }

  if (network === "rolluxtest") {
    return getRoTestValues();
  }
}

async function main() {
  const signer = await getFrameSigner();

  const admin = signer.address;
  // const buffer = 24 * 60 * 60;
  const buffer = 10;
  const maxTokenSupply = expandDecimals("13250000", 18);

  const {
    vault,
    tokenManager,
    glpManager,
    rewardRouter,
    positionRouter,
    positionManager,
    gmx,
  } = await getValues();
  const mintReceiver = tokenManager;

  const deployedTimelock = await deployContract(
    "Timelock",
    [
      admin, // admin
      buffer, // buffer
      tokenManager.address, // tokenManager
      mintReceiver.address, // mintReceiver
      glpManager.address, // glpManager
      rewardRouter.address, // rewardRouter
      maxTokenSupply, // maxTokenSupply
      10, // marginFeeBasisPoints 0.1%
      500, // maxMarginFeeBasisPoints 5%
    ],
    "Timelock"
  );

  // const deployedTimelock = await contractAt(
  //   "Timelock",
  //   timelock.address,
  //   signer
  // );

  await sendTxn(
    deployedTimelock.setShouldToggleIsLeverageEnabled(true),
    "deployedTimelock.setShouldToggleIsLeverageEnabled(true)"
  );
  await sendTxn(
    deployedTimelock.setContractHandler(positionRouter.address, true),
    "deployedTimelock.setContractHandler(positionRouter)"
  );
  await sendTxn(
    deployedTimelock.setContractHandler(positionManager.address, true),
    "deployedTimelock.setContractHandler(positionManager)"
  );

  // // update gov of vault
  // const vaultGov = await contractAt("Timelock", await vault.gov(), signer)

  // await sendTxn(vaultGov.signalSetGov(vault.address, deployedTimelock.address), "vaultGov.signalSetGov")
  await sendTxn(
    deployedTimelock.signalSetGov(vault.address, deployedTimelock.address),
    "deployedTimelock.signalSetGov(vault)"
  );

  //   const handlers = [
  //     "0x82429089e7c86B7047b793A9E7E7311C93d2b7a6", // coinflipcanada
  //     "0xD7941C4Ca57a511F21853Bbc7FBF8149d5eCb398", // G
  //     "0xfb481D70f8d987c1AE3ADc90B7046e39eb6Ad64B", // kr
  //     "0x99Aa3D1b3259039E8cB4f0B33d0Cfd736e1Bf49E", // quat
  //     "0x6091646D0354b03DD1e9697D33A7341d8C93a6F5" // xhiroz
  //   ]
  const handlers = [
    signer.address, // deployer
    "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471", // xiaowu
    // "0xc7816AB57762479dCF33185bad7A1cFCb68a7997",
    // "0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d",
  ];

  for (let i = 0; i < handlers.length; i++) {
    const handler = handlers[i];
    await sendTxn(
      deployedTimelock.setContractHandler(handler, true),
      `deployedTimelock.setContractHandler(${handler})`
    );
  }

  const keepers = [
    "0x6660c89BD48a39B2c2F00FC1E2e172c10960a301", //REXt_admin
  ];

  for (let i = 0; i < keepers.length; i++) {
    const keeper = keepers[i];
    await sendTxn(
      deployedTimelock.setKeeper(keeper, true),
      `deployedTimelock.setKeeper(${keeper})`
    );
  }

  await sendTxn(
    deployedTimelock.signalApprove(gmx.address, admin, "1000000000000000000"),
    "deployedTimelock.signalApprove"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
