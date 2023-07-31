const {
  deployContract,
  contractAt,
  sendTxn,
  getFrameSigner,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");

const network = process.env.HARDHAT_NETWORK || "mainnet";

async function getArbValues() {
  const tokenManager = {
    address: "0xddDc546e07f1374A07b270b7d863371e575EA96A",
  };

  return { tokenManager };
}

async function getAvaxValues() {
  const tokenManager = {
    address: "0x8b25Ba1cAEAFaB8e9926fabCfB6123782e3B4BC2",
  };

  return { tokenManager };
}

async function getSepoliaValues() {
  const tokenManager = {
    address: "0x2E73eF81d7cD9305169c01BB576089948B9a0dA7",
  };

  return { tokenManager };
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
}

async function main() {
  const signer = await getFrameSigner();

  const admin = "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471";
  const buffer = 24 * 60 * 60;

  const { tokenManager } = await getValues();

  const timelock = await deployContract(
    "PriceFeedTimelock",
    [admin, buffer, tokenManager.address],
    "Timelock"
  );

  const deployedTimelock = await contractAt(
    "PriceFeedTimelock",
    timelock.address,
    signer
  );

  //   const signers = [
  //     "0x82429089e7c86B7047b793A9E7E7311C93d2b7a6", // coinflipcanada
  //     "0xD7941C4Ca57a511F21853Bbc7FBF8149d5eCb398", // G
  //     "0xfb481D70f8d987c1AE3ADc90B7046e39eb6Ad64B", // kr
  //     "0x99Aa3D1b3259039E8cB4f0B33d0Cfd736e1Bf49E", // quat
  //     "0x6091646D0354b03DD1e9697D33A7341d8C93a6F5", // xhiroz
  //   ];
  const signers = [
    "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471", // xiaowu1
    "0x083102dEc08D0a449bEd627bE204531bf34251Ae", // xiaowu2
    "0xc7816AB57762479dCF33185bad7A1cFCb68a7997",
    "0x34d0B59D2E1262FD04445F7768F649fF6DC431a7",
    "0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d",
  ];

  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i];
    await sendTxn(
      deployedTimelock.setContractHandler(signer, true),
      `deployedTimelock.setContractHandler(${signer})`
    );
  }

  const keepers = [
    "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471", // Xiaowu
  ];

  for (let i = 0; i < keepers.length; i++) {
    const keeper = keepers[i];
    await sendTxn(
      deployedTimelock.setKeeper(keeper, true),
      `deployedTimelock.setKeeper(${keeper})`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
