const { contractAt, sendTxn, getFrameSigner} = require("../shared/helpers");
const { bigNumberify, expandDecimals } = require("../../test/shared/utilities");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

const shouldSendTxn = true;

const {
  ARBITRUM_URL,
  ARBITRUM_CAP_KEEPER_KEY,
  AVAX_URL,
  AVAX_CAP_KEEPER_KEY,
  SEPOLIA_URL,
  SEPOLIA_DEPLOY_KEY,
  OPSIDE_TESTNET_URL,
  OPSIDE_TESTNET_DEPLOY_KEY,
  ROLLUX_TESTNET_URL,
  ROLLUX_TESTNET_DEPLOY_KEY,
} = require("../../env.json");

async function getArbValues() {
  const provider = new ethers.providers.JsonRpcProvider(ARBITRUM_URL);
  const wallet = new ethers.Wallet(ARBITRUM_CAP_KEEPER_KEY).connect(provider);

  const positionContracts = [
    "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868", // PositionRouter
    "0x75E42e6f01baf1D6022bEa862A28774a9f8a4A0C", // PositionManager
  ];

  const { btc, eth, link, uni } = tokens;
  const tokenArr = [btc, eth, link, uni];

  const vaultAddress = "0x489ee077994B6658eAfA855C308275EAd8097C4A";

  return { wallet, positionContracts, tokenArr, vaultAddress };
}

async function getAvaxValues() {
  const provider = new ethers.providers.JsonRpcProvider(AVAX_URL);
  const wallet = new ethers.Wallet(AVAX_CAP_KEEPER_KEY).connect(provider);

  const positionContracts = [
    "0xffF6D276Bc37c61A23f06410Dce4A400f66420f8", // PositionRouter
    "0xA21B83E579f4315951bA658654c371520BDcB866", // PositionManager
  ];

  const { avax, eth, btc, btcb } = tokens;
  const tokenArr = [avax, eth, btc, btcb];

  const vaultAddress = "0x9ab2De34A33fB459b538c43f251eB825645e8595";

  return { wallet, positionContracts, tokenArr, vaultAddress };
}

async function getSepoliaValues() {
  const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_URL);
  const wallet = new ethers.Wallet(SEPOLIA_DEPLOY_KEY).connect(provider);

  const positionContracts = [
    "0xFb0342D3cf1Ba81fc336195c4Ed6626eAb8e402B", // PositionRouter
    "0xf29BdD72076C28455273858df0DeA616A7bA7AD7", // PositionManager
  ];

  const { btc, eth, link } = tokens;
  const tokenArr = [btc, eth, link];

  const vaultAddress = "0x7531626E87BdA9B8511bea536136e5349EDacE89";

  return { wallet, positionContracts, tokenArr, vaultAddress };
}

async function getOpTestValues() {
  const provider = new ethers.providers.JsonRpcProvider(OPSIDE_TESTNET_URL);
  const wallet = new ethers.Wallet(OPSIDE_TESTNET_DEPLOY_KEY).connect(provider);

  const positionContracts = [
    "0x6A84F186A77F22B701Cb1CbA18da8b29E813A303", // PositionRouter
    "0x622e004355Fbe4B097c1BAeD27bbE3812A110c0F", // PositionManager
  ];

  const { btc, eth } = tokens;
  const tokenArr = [btc, eth];

  const vaultAddress = "0x357fa1565B94D9F7C770D30c95a405F805d95fEA";

  const positionUtilsOptions = {
    libraries: {
      PositionUtils: "0xE3aac6676E18f5229Cbd6cb3A6B809112C2B1932",
    },
  };

  return { wallet, positionContracts, tokenArr, vaultAddress, positionUtilsOptions };
}

async function getRoTestValues() {
  const provider = new ethers.providers.JsonRpcProvider(ROLLUX_TESTNET_URL);
  const wallet = new ethers.Wallet(ROLLUX_TESTNET_DEPLOY_KEY).connect(provider);

  const positionContracts = [
    "0xdc78654EaABb0729873a8B48D553cA398670FdDe", // PositionRouter
    "0x4B83201fc16a479e83043f42c20b5749752873D6", // PositionManager
  ];

  const { btc, eth, sys } = tokens;
  const tokenArr = [btc, eth, sys];

  const vaultAddress = "0xffe4E159fd0f96b01463b297a5bcA784000C50C9";

  const positionUtilsOptions = {
    libraries: {
      PositionUtils: "0xd530E3C4BEEf0cAcE2ec3ede72DC8b351537606A",
    },
  };

  return { wallet, positionContracts, tokenArr, vaultAddress, positionUtilsOptions };
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

  if (network === "rolluxtest") {
    return getRoTestValues();
  }
}

async function main() {
  const signer = getFrameSigner();

  const { wallet, positionContracts, tokenArr, vaultAddress, positionUtilsOptions } =
    await getValues();

  const vault = await contractAt("Vault", vaultAddress);

  const positionContract = await contractAt(
    "PositionManager",
    positionContracts[0],
    undefined,
    positionUtilsOptions
  );
  for (const token of tokenArr) {
    const [currentLongCap, currentShortCap, currentLongSize, currentShortSize] =
      await Promise.all([
        positionContract.maxGlobalLongSizes(token.address),
        positionContract.maxGlobalShortSizes(token.address),
        vault.guaranteedUsd(token.address),
        vault.globalShortSizes(token.address),
      ]);
    console.log(
      "%s longs $%sm / $%sm -> $%sm, shorts $%sm / $%sm -> $%sm",
      token.name.toUpperCase(),
      (currentLongSize.toString() / 1e36).toFixed(2),
      (currentLongCap.toString() / 1e36).toFixed(2),
      (token.maxGlobalLongSize.toString() / 1e6 || 0).toFixed(2),
      (currentShortSize.toString() / 1e36).toFixed(2),
      (currentShortCap.toString() / 1e36).toFixed(2),
      (token.maxGlobalShortSize.toString() / 1e6 || 0).toFixed(2)
    );
  }

  if (!shouldSendTxn) {
    return;
  }

  const tokenAddresses = tokenArr.map((t) => t.address);
  const longSizes = tokenArr.map((token) => {
    if (!token.maxGlobalLongSize) {
      return bigNumberify(0);
    }

    return expandDecimals(token.maxGlobalLongSize, 30);
  });

  const shortSizes = tokenArr.map((token) => {
    if (!token.maxGlobalShortSize) {
      return bigNumberify(0);
    }

    return expandDecimals(token.maxGlobalShortSize, 30);
  });

  for (let i = 0; i < positionContracts.length; i++) {
    const positionContract = await contractAt(
      "PositionManager",
      positionContracts[i],
      wallet,
      positionUtilsOptions
    );
    await sendTxn(
      positionContract.setMaxGlobalSizes(tokenAddresses, longSizes, shortSizes),
      "positionContract.setMaxGlobalSizes"
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
