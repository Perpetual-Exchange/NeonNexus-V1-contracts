const {
  getFrameSigner,
  deployContract,
  contractAt,
  sendTxn,
  sleep,
} = require("../shared/helpers");

const {
  getBlockTime,
  getPriceBits,
  expandDecimals,
} = require("../../test/shared/utilities");
const { toUsd } = require("../../test/shared/units");
const {AVAX_TESTNET_URL, AVAX_TESTNET_DEPLOY_KEY} = require("../../env.json");
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

async function getValues() {
  if (network === "sepolia") {
    return getSepoliaValues();
  }
  if (network === "avaxtest") {
    return getAvaxTestValues();
  }
}

async function main() {
  // const provider = new ethers.providers.JsonRpcProvider(AVAX_TESTNET_URL);
  // const updaterWallet = new ethers.Wallet(AVAX_TESTNET_DEPLOY_KEY).connect(
  //   provider
  // );

  const signer = await getFrameSigner();

  const { vaultPriceFeed, positionRouter, tokenArr } = await getValues(signer);

  const vault = await contractAt(
    "Vault",
    "0xAC6E2Ac93E2a1CFFadE96607fe2376F5f5952EDC"
  );
  const timelock = await contractAt("Timelock", await vault.gov());
  //   const orderbook = await contractAt(
  //     "OrderBook",
  //     "0x759CEae223ddb16eE8494D7b4030650a0D40c360"
  //   );
  //   console.log("minExecutionFee", await orderbook.minExecutionFee());
  const secondaryPriceFeed = await contractAt(
    "FastPriceFeed",
    await vaultPriceFeed.secondaryPriceFeed()
  );
  //   console.log(
  //     "getPriceData",
  //     await secondaryPriceFeed.getPriceData(
  //       "0xdd9D0b2e8eE0552ee93AAEd6af62D386bF19b70E"
  //     )
  //   );
  //   console.log(
  //     "fastPrice",
  //     await secondaryPriceFeed.prices(
  //       "0xdd9D0b2e8eE0552ee93AAEd6af62D386bF19b70E"
  //     )
  //   );
  //   console.log(
  //     "guaranteedUsd",
  //     await vault.guaranteedUsd("0x7E160F7a1f90E3BfB380eA6Fba9cbD860d7Cd0D1")
  //   );
  //   console.log(
  //     "getMaxPrice",
  //     await vault.getMaxPrice("0x7E160F7a1f90E3BfB380eA6Fba9cbD860d7Cd0D1")
  //   );

  console.log("vault:", vault.address);
  console.log("vaultPriceFeed:", vaultPriceFeed.address);
  console.log("secondaryPriceFeed:", secondaryPriceFeed.address);
  console.log("positionRouter:", positionRouter.address);

  while (true) {
    const keysIndex = await positionRouter.getRequestQueueLengths();
    console.log("increasePositionRequestKeysStart:", keysIndex[0].toString());
    console.log("increasePositionRequestKeys.length:", keysIndex[1].toString());
    console.log("decreasePositionRequestKeysStart:", keysIndex[2].toString());
    console.log("decreasePositionRequestKeys.length:", keysIndex[3].toString());
      // for (let i of keysIndex) {
      //   console.log("keysIndex:", i.toString());
      // }
    //   const key1 = await positionRouter.getRequestKey(signer.address, 17);
    //   const key = await positionRouter.increasePositionRequestKeys(23);
    //   console.log("getRequestKey", key1);
    //   console.log(
    //     "increasePositionRequests",
    //     await positionRouter.increasePositionRequests(key)
    //   );

    //   await sendTxn(
    //     positionRouter.setPositionKeeper(signer.address, true),
    //     "positionRouter.executeDecreasePositions(key, executionFeeReceiver)"
    //   );
    //   console.log(
    //     "isPositionKeeper",
    //     await positionRouter.isPositionKeeper(secondaryPriceFeed.address)
    //   );

    //   const key = await positionRouter.decreasePositionRequestKeys(5);
    //   const key = await positionRouter.increasePositionRequestKeys(35);
    //   console.log("increasePositionRequestKeys", key);
    //   console.log(
    //     "increasePositionRequests",
    //     await positionRouter.increasePositionRequests(key)
    //   );
    //   console.log("minTimeDelayPublic", await positionRouter.minTimeDelayPublic());
    //   console.log(
    //     "minBlockDelayKeeper",
    //     await positionRouter.minBlockDelayKeeper()
    //   );
    //   console.log(
    //     "getMaxPrice",
    //     await vault.getMaxPrice("0x7E160F7a1f90E3BfB380eA6Fba9cbD860d7Cd0D1")
    //   );
    //   return;
    //   await sendTxn(
    //     positionRouter.executeIncreasePosition(key, signer.address, {
    //       gasPrice: "1434896730",
    //       gasLimit: "1262636",
    //     }),
    //     "positionRouter.executeIncreasePosition(key, executionFeeReceiver)",
    //     signer
    //   );
    //   return;
    //   await sendTxn(
    //     await positionRouter.executeIncreasePositions(
    //       keysIndex[1].toString(),
    //       signer.address
    //     ),
    //     "positionRouter.executeIncreasePosition(key, executionFeeReceiver)",
    //     signer
    //   );
    //   //   return;
    //   await sendTxn(
    //     await positionRouter.executeDecreasePositions(
    //       keysIndex[3].toString(),
    //       signer.address
    //     ),
    //     "positionRouter.executeDecreasePositions(key, executionFeeReceiver)",
    //     signer
    //   );
    //   return;
    // await sendTxn(
    //   await positionRouter.executeDecreasePosition(key, signer.address, {
    //     gasPrice: "1434896730",
    //     gasLimit: "1262636",
    //   }),
    //   "positionRouter.executeDecreasePositions(key, executionFeeReceiver)",
    //   signer
    // );
    // return;
    //   const router = await contractAt(
    //     "Router",
    //     "0xf6447de9988F36C0E74fb3991E1d001DB7A1bec8"
    //   );
    //   //   approvedPlugins
    //   console.log(await router.plugins(positionRouter.address));
    //   console.log(
    //     await router.approvedPlugins(signer.address, positionRouter.address)
    //   );
    //   console.log("admin", await positionRouter.admin());
    //   await sendTxn(
    //     positionRouter.setPositionKeeper
    //     secondaryPriceFeed.setPricesWithBitsAndExecute(
    //       positionRouter.address,
    //       priceBits,
    //       blockTime,
    //       endIndexForIncreasePositions,
    //       endIndexForDecreasePositions,
    //       maxIncreasePositions,
    //       maxDecreasePositions
    //     ),
    //     "secondaryPriceFeed.setPricesWithBitsAndExecute(positionRouter, priceBits, timestamp, endIndexForIncreasePositions, endIndexForDecreasePositions, maxIncreasePositions, maxDecreasePositions)"
    //   );
    //   console.log("maxTimeDelay", await positionRouter.maxTimeDelay());
    //   console.log("isLeverageEnabled", await positionRouter.isLeverageEnabled());
    //   console.log(
    //     "isPositionKeeper",
    //     await positionRouter.isPositionKeeper(secondaryPriceFeed.address)
    //   );
    //   console.log(
    //     "minBlockDelayKeeper",
    //     await positionRouter.minBlockDelayKeeper()
    //   );
    //   console.log(
    //     "maxGlobalLongSizes",
    //     await positionRouter.maxGlobalLongSizes(
    //       "0x7E160F7a1f90E3BfB380eA6Fba9cbD860d7Cd0D1"
    //     )
    //   );
    //   const vault = await contractAt(
    //     "Vault",
    //     "0x7531626E87BdA9B8511bea536136e5349EDacE89"
    //   );
    //   const timelock = await contractAt("Timelock", await vault.gov());
    //   console.log(
    //     "guaranteedUsd",
    //     await vault.guaranteedUsd("0x7E160F7a1f90E3BfB380eA6Fba9cbD860d7Cd0D1")
    //   );
    //   console.log(
    //     "getMaxPrice",
    //     await vault.getMaxPrice("0x7E160F7a1f90E3BfB380eA6Fba9cbD860d7Cd0D1")
    //   );

    //   console.log("vault isLeverageEnabled", await vault.isLeverageEnabled());
    //   //   console.log("vault maxGasPrice", await vault.maxGasPrice());
    //   console.log("vault vaultUtils", await vault.vaultUtils());
    //   console.log("vault fundingInterval", await vault.fundingInterval());
    //   console.log(
    //     "vault lastFundingTimes",
    //     await vault.lastFundingTimes("0x7E160F7a1f90E3BfB380eA6Fba9cbD860d7Cd0D1")
    //   );

    //   const shortsTracker = await contractAt(
    //     "ShortsTracker",
    //     "0x3bB314A3106A324342EB6c8F62AF94c8231736CE"
    //   );
    //   console.log(
    //     "shortsTracker",
    //     await shortsTracker.isHandler("0xFb0342D3cf1Ba81fc336195c4Ed6626eAb8e402B")
    //   );
    //   console.log(
    //     "timelock",
    //     await timelock.isHandler("0xFb0342D3cf1Ba81fc336195c4Ed6626eAb8e402B")
    //   );
    //   await sendTxn(
    //     timelock.setContractHandler(positionRouter.address, true),
    //     "timelock.setContractHandler(PositionRouter, true)"
    //   );
    //   await sendTxn(
    //     timelock.setContractHandler(
    //       "0x811B1AE2A6addF28e39cD189a56F2413a7c69f5E",
    //       true
    //     ),
    //     "timelock.setContractHandler(PositionRouter, true)"
    //   );
    //   console.log("shortsTracker timelock", await shortsTracker.gov());
    //   await sendTxn(
    //     shortsTracker.setHandler(positionRouter.address, true),
    //     "shortsTracker.setContractHandler(positionUtils, true)"
    //   );
    //   console.log("shortsTracker", await positionRouter.shortsTracker());

    //   await sendTxn(
    //     vault.setGov("0x5144CF1f6C14D0ec2099cE740bB45DD2286F172A"),
    //     "vault.setGov(timelock)"
    //   );

    //   const maxGasPrice = "20000000000"; // 20 gwei
    //   await sendTxn(
    //     timelock.setMaxGasPrice(vault.address, maxGasPrice),
    //     "timelock.setMaxGasPrice(vault.address, maxGasPrice)"
    //   );
    //   console.log("vault gov", await vault.gov());
    //   tokens
    // 0: BTC
    // 1: ETH
    // 2: LINK
    const prices = [];
    for (let i in tokenArr) {
      const tokenItem = tokenArr[i];
      const priceFeed = await contractAt("PriceFeed", tokenItem.priceFeed);
      const price = await priceFeed.latestAnswer();
      prices[i] = price.div(10 ** 5).toString();
      console.log(tokenItem.name, "oracle.latest:",price.toString(), "dividedPrice:", prices[i]);

      // prices2[i] = price.div(10 ** 2).toString();
    }
    //   console.log(prices);
    //   return;

    const provider = waffle.provider;
    const blockTime = await getBlockTime(provider);
    // console.log("blockTime:", blockTime);
    const priceBits = getPriceBits(prices);
    // console.log("priceBits:", priceBits);
    //   const priceBits2 = getPriceBits(prices2);
    //   const priceBits = "485430951856681143989754809661621";
    //   console.log(priceBits);
    //   console.log(priceBits2);
    //   return;
    //   return;
    const endIndexForIncreasePositions = keysIndex[1].toString();
    const endIndexForDecreasePositions = keysIndex[3].toString();
    const maxIncreasePositions = endIndexForIncreasePositions;
    const maxDecreasePositions = endIndexForDecreasePositions;
    //   const tokens = await secondaryPriceFeed.tokens(4);
    console.log("priceBits:",priceBits,"blockTime:", blockTime, "endIndexForIncreasePositions:", endIndexForIncreasePositions, "endIndexForDecreasePositions:",
      endIndexForDecreasePositions, "maxIncreasePositions:", maxIncreasePositions, "maxDecreasePositions:", maxDecreasePositions);

    await sendTxn(
      secondaryPriceFeed.setPricesWithBitsAndExecute(
        positionRouter.address,
        priceBits,
        blockTime,
        endIndexForIncreasePositions,
        endIndexForDecreasePositions,
        maxIncreasePositions,
        maxDecreasePositions,
        {
          gasPrice: "25000000000",
          gasLimit: "12626360",
        }
      ),
      "secondaryPriceFeed.setPricesWithBitsAndExecute(positionRouter, priceBits, timestamp, endIndexForIncreasePositions, endIndexForDecreasePositions, maxIncreasePositions, maxDecreasePositions)",
      signer
    );

    // let sender = await vault.gov();
    // // await positionRouter.setPositionKeeper(secondaryPriceFeed.address, true);
    //
    // // await positionRouter.executeIncreasePositions(endIndexForIncreasePositions, sender, {
    // //         gasPrice: "25000000000",
    // //         gasLimit: "12626360",
    // //       });
    //
    // console.log(await positionRouter.isPositionKeeper(secondaryPriceFeed.address));
    // console.log(await positionRouter.isPositionKeeper(sender));

    await sleep(24000);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
