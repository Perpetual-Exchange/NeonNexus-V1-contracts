const {
  getFrameSigner,
  deployContract,
  contractAt,
  sendTxn,
  sleep, providers,
} = require("../shared/helpers");

const {
  getBlockTime,
  getPriceBits,
  expandDecimals,
} = require("../../test/shared/utilities");
const { toUsd } = require("../../test/shared/units");
const {AVAX_TESTNET_URL, AVAX_TESTNET_DEPLOY_KEY,
  OPSIDE_TESTNET_ORDERKEEPER_KEY,
  OPSIDE_TESTNET_PRICEUPDATER_KEY} = require("../../env.json");
// const { errors } = require("../../test/core/Vault/helpers");
// const { Signer } = require("ethers");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

// use(solidity);

async function getSepoliaValues() {
  const { btc, eth, link } = tokens;
  const tokenArr = [btc, eth, link];
  const vaultPriceFeed = await contractAt(
    "VaultPriceFeed",
    "0x57B4FA59741f3E59784ba4dc54deA5Ad610B0Dd4"
  );

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

  return { vaultPriceFeed, positionRouter, tokenArr };
}

async function getAvaxTestValues() {
  const { btc, eth, avax, link } = tokens;
  const tokenArr = [btc, eth, avax, link];
  const vaultPriceFeed = await contractAt(
    "VaultPriceFeed",
    "0x1bA33cE37C460c4437E901334c9FB736b80dDD39"
  );

  const positionUtils = await contractAt(
    "PositionUtils",
    "0x04Eb210750C9696A040333a7FaeeE791c945249E"
  );

  const positionRouter = await contractAt(
    "PositionRouter",
    "0xC940Df5Ea4f80f50Ef7eb6d484dc50Fa66FcA210",
    null,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  return { vaultPriceFeed, positionRouter, tokenArr };
}

async function getOpTestValues() {
  const { btc, eth } = tokens;
  const tokenArr = [btc, eth];
  const vaultPriceFeed = await contractAt(
    "VaultPriceFeed",
    "0x15E6E3E2b8107fddE8bb4E97982881e47890C57A"
  );

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

  const priceUpdater = "0x5b796B035ad1C73565c93ea63d62aEDB9347F382";

  return { vaultPriceFeed, positionRouter, tokenArr, priceUpdater };
}

async function getValues() {
  if (network === "sepolia") {
    return getSepoliaValues();
  }
  if (network === "avaxtest") {
    return getAvaxTestValues();
  }
  if (network === "opsidetest") {
    return getOpTestValues();
  }
}

async function main() {
  const signer = await new ethers.Wallet(OPSIDE_TESTNET_PRICEUPDATER_KEY).connect(providers.opsidetest)
  // const signer = await getFrameSigner();

  const {vaultPriceFeed, positionRouter, tokenArr, priceUpdater} = await getValues(signer);

  const vault = await contractAt(
    "Vault",
    "0x357fa1565B94D9F7C770D30c95a405F805d95fEA"
  );
  const timelock = await contractAt("Timelock", await vault.gov());
  //   const orderbook = await contractAt(
  //     "OrderBook",
  //     "0x759CEae223ddb16eE8494D7b4030650a0D40c360"
  //   );
  //   console.log("minExecutionFee", await orderbook.minExecutionFee());
  const secondaryPriceFeed = await contractAt(
    "FastPriceFeed",
    await vaultPriceFeed.secondaryPriceFeed(),
    signer
  );

  console.log("vault:", await vault.address);
  console.log("vaultPriceFeed:", await vaultPriceFeed.address);
  console.log("secondaryPriceFeed:", await secondaryPriceFeed.address);
  console.log("positionRouter:", await positionRouter.address);
  console.log("isUpdater:", await secondaryPriceFeed.isUpdater(priceUpdater));
    // await sendTxn(
    //   secondaryPriceFeed.setUpdater(priceUpdater, true,
    //     {
    //       gasLimit: "12626360",
    //     }
    //   ),
    //   "secondaryPriceFeed.setUpdater"
    // );

  let interval = 300000;

  while (true) {
    console.log("\n-------------------------", new Date());

    const prices = [];
    for (let i in tokenArr) {
      const tokenItem = tokenArr[i];
      const priceFeed = await ethers.getContractAt("IAggregatorV3Interface", tokenItem.priceFeed);
      let rets = await priceFeed.latestRoundData();
      prices[i] = rets[1].div(10 ** 5).toString();
      console.log(tokenItem.name, "oracle.latest:",rets[1].toString(), "dividedPrice:", prices[i]);
    }

    const provider = waffle.provider;
    const blockTime = await getBlockTime(provider);
    const priceBits = getPriceBits(prices);

    await sendTxn(
      secondaryPriceFeed.setPricesWithBits(
        priceBits,
        blockTime,
        {
          gasLimit: "12626360",
        }
      ),
      "secondaryPriceFeed.setPricesWithBits(priceBits, timestamp)"
    );

    console.log("-------------------------");

    await sleep(interval);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
