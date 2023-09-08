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

async function getArbValues() {
  const positionRouter = await contractAt(
    "PositionRouter",
    "0x3D6bA331e3D9702C5e8A8d254e5d8a285F223aba"
  );
  const positionManager = await contractAt(
    "PositionManager",
    "0x87a4088Bd721F83b6c2E5102e2FA47022Cb1c831"
  );

  return { positionRouter, positionManager };
}

async function getAvaxValues() {
  const positionRouter = await contractAt(
    "PositionRouter",
    "0x195256074192170d1530527abC9943759c7167d8"
  );
  const positionManager = await contractAt(
    "PositionManager",
    "0xF2ec2e52c3b5F8b8bd5A3f93945d05628A233216"
  );

  return { positionRouter, positionManager };
}

async function getSepoliaValues() {
  const positionUtils = await contractAt(
    "PositionUtils",
    "0x811B1AE2A6addF28e39cD189a56F2413a7c69f5E"
  );
  const positionRouter = await contractAt(
    "PositionRouter",
    "0xFb0342D3cf1Ba81fc336195c4Ed6626eAb8e402B",
    null,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );
  const positionManager = await contractAt(
    "PositionManager",
    "0xf29BdD72076C28455273858df0DeA616A7bA7AD7",
    null,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  return { positionRouter, positionManager };
}

async function getOpTestValues() {
  const positionUtils = await contractAt(
    "PositionUtils",
    "0xE3aac6676E18f5229Cbd6cb3A6B809112C2B1932"
  );
  const positionRouter = await contractAt(
    "PositionRouter",
    "0x6A84F186A77F22B701Cb1CbA18da8b29E813A303",
    null,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );
  const positionManager = await contractAt(
    "PositionManager",
    "0x622e004355Fbe4B097c1BAeD27bbE3812A110c0F",
    null,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  return { positionRouter, positionManager };
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

  if (network === "opsidetest") {
    return getOpTestValues();
  }
}

async function main() {
  const { positionRouter, positionManager } = await getValues();

  // ms the third step run the following one line
  // const referralStorage = await deployContract("ReferralStorage", []);

  // ms the eighth step run the following lines
    const referralStorage = await contractAt(
      "ReferralStorage",
      await positionRouter.referralStorage()
    );

  await sendTxn(
    referralStorage.setHandler(positionRouter.address, true),
    "referralStorage.setHandler(positionRouter)"
  );

  await sendTxn(
    positionRouter.setReferralStorage(referralStorage.address),
    "positionRouter.setReferralStorage"
  );
  await sendTxn(
    positionManager.setReferralStorage(referralStorage.address),
    "positionManager.setReferralStorage"
  );

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
