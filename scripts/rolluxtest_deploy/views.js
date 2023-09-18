const {
  signers,
  providers,
  getFrameSigner,
  deployContract,
  contractAt,
  sendTxn,
  readTmpAddresses,
  writeTmpAddresses,
  sleep,
} = require("../shared/helpers");
const { AVAX_TESTNET_URL,
        AVAX_TESTNET_DEPLOY_KEY,
        OPSIDE_TESTNET_URL,
        OPSIDE_TESTNET_DEPLOY_KEY,
        ROLLUX_TESTNET_URL,
        ROLLUX_TESTNET_DEPLOY_KEY} = require("../../env.json");
const { VAULT_ADDR,
  REFERRALSTORAGE_ADDR,
  SHORTSTRACKER_ADDR,
  SHORTSTRACKERTIMELOCK_ADDR,
  POSITIONUTILS_ADDR,
} = require("../conf/contract.json");
const {expandDecimals} = require("../../test/shared/utilities");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];

async function getInfoTokens(vault, reader, tokens, tokenArr) {
  const vaultTokenInfo = await reader.getVaultTokenInfo(
    vault.address,
    tokens.nativeToken.address,
    expandDecimals(1, 18),
    tokenArr.map(t => t.address)
  )
  console.log("tokenArr.length", tokenArr.length)
  console.log("vaultTokenInfo.length", vaultTokenInfo.length)
  console.log("vaultTokenInfo", vaultTokenInfo)
  const infoTokens = {}
  const vaultPropsLength = 10

  for (let i = 0; i < tokenArr.length; i++) {
    const token = JSON.parse(JSON.stringify(tokenArr[i]))

    console.log("vaultTokenInfo", i * vaultPropsLength)
    token.poolAmount = vaultTokenInfo[i * vaultPropsLength]
    token.reservedAmount = vaultTokenInfo[i * vaultPropsLength + 1]
    token.usdgAmount = vaultTokenInfo[i * vaultPropsLength + 2]
    token.redemptionAmount = vaultTokenInfo[i * vaultPropsLength + 3]
    token.weight = vaultTokenInfo[i * vaultPropsLength + 4]
    token.minPrice = vaultTokenInfo[i * vaultPropsLength + 5]
    token.maxPrice = vaultTokenInfo[i * vaultPropsLength + 6]
    token.guaranteedUsd = vaultTokenInfo[i * vaultPropsLength + 7]
    token.maxPrimaryPrice = vaultTokenInfo[i * vaultPropsLength + 8]
    token.minPrimaryPrice = vaultTokenInfo[i * vaultPropsLength + 9]
    console.log("token", token)

    infoTokens[token.address] = token
  }

  return infoTokens
}

async function getOpTestValues() {
  const provider = providers.opsidetest;

  return { provider }
}

async function getRoTestValues() {

  const signer = signers.rolluxtest;
  const provider = providers.rolluxtest;
  const { btc, eth, sys, dai, usdt } = tokens;
  const tokenArr = [btc, eth, sys];
  const tokenAllArr = [btc, eth, sys, dai, usdt];
  const vault = await contractAt("Vault", "0xffe4E159fd0f96b01463b297a5bcA784000C50C9", signer)
  const reader = await contractAt("Reader", "0xA6f0764aA7B401DE2e2DDb8B0fCc51EaaE679D70", signer)

  return { signer, provider, vault, reader, tokenArr, tokenAllArr }
}

async function getValues() {
  if (network === "opsidetest") {
    return getOpTestValues()
  }

  if (network === "rolluxtest") {
    return getRoTestValues()
  }
}

async function main() {

  const { signer, provider, vault, reader, tokenArr, tokenAllArr  } = await getValues();

  console.log("signer.address:", await signer.address);
  console.log("chainId:", await signer.getChainId());

  console.log("\n--------------------vaultTokenInfo", provider.network);
  const infoTokens = await getInfoTokens(vault, reader, tokens, tokenAllArr);
  console.log("--------------------vaultTokenInfo\n");


  // console.log("\n--------------------oracle pricefeed", provider.network);
  // const prices = [];
  // for (let i in tokenArr) {
  //   const tokenItem = tokenArr[i];
  //   const priceFeed = await contractAt("PriceFeed", tokenItem.priceFeed);
  //   const price = await priceFeed.latestAnswer();
  //   prices[i] = price.div(10 ** 5).toString();
  //   console.log(tokenItem.name, "oracle.latest:",price.toString(), "dividedPrice:", prices[i]);
  // }
  // console.log("--------------------oracle pricefeed\n");

  // console.log("\n--------------------account balance", provider.network);
  // let accountArr = [
  //   { name: "priceUpdater", address: "0x5b796B035ad1C73565c93ea63d62aEDB9347F382"},
  //   { name: "executor", address: "0xcd7716aAFC70A83EcD19B80C61a3149f08442Cb8"},
  //   { name: "orderKeeper", address: "0x84073D58c53E8d90065a1ea570B4f6E6Ee63DA5d"},
  //   { name: "liquidator", address: "0x6A6D608a0dE1742Be622Fee4f9189243c0d68153"}
  // ];
  // for (const account of accountArr) {
  //   let balance = await provider.getBalance(account.address);
  //   let etherBalance = ethers.utils.formatEther(balance);
  //   console.log(`${account.name}(${account.address}).balance:`, etherBalance);
  // }
  // console.log("--------------------account balance\n");

  // const timelock = await contractAt("Timelock", "0xAfc3Cc911c900e1FB682aabe3f899b81BCCAD419", signer);
  // console.log("timelock.address:", await timelock.address);
  // console.log("timelock.admin:", await timelock.admin());
  // console.log("timelock.tokenManager:", await timelock.tokenManager());
  // console.log("timelock.mintReceiver:", await timelock.mintReceiver());
  // console.log("timelock.glpManager:", await timelock.glpManager());
  // console.log("timelock.rewardRouter:", await timelock.rewardRouter());
  // const vault = await contractAt("Vault", "0xffe4E159fd0f96b01463b297a5bcA784000C50C9", signer);
  // console.log("vault.gov:", await vault.gov());
  // 111 await vault.setGov(timelock.address);

  // let router = await vault.router();
  // console.log("router:", router);
  //
  // const odx = await contractAt(
  //   "GMX",
  //   "0x7A9a466DE08747bC8Ad79aBA6D8dCE9D64E5C767"
  // );
  // console.log("odx.name:", await odx.name());
  // console.log("odx.address:", await odx.adress);
  //
  // const olp = await contractAt(
  //   "GLP",
  //   "0xa4213F4606bc3E8358748c3BdecC2F0d27364F47"
  // );
  // console.log("olp.name:", await olp.name())
  // console.log("olp.address:", await olp.address)


  // const positionUtils = await contractAt(
  //   "PositionUtils",
  //   "0xd530E3C4BEEf0cAcE2ec3ede72DC8b351537606A"
  // );
  // const positionRouter = await contractAt(
  //   "PositionRouter",
  //   "0xdc78654EaABb0729873a8B48D553cA398670FdDe",
  //   signer,
  //   {
  //     libraries: {
  //       PositionUtils: positionUtils.address,
  //     },
  //   }
  // );
  // console.log("positionRouter.referralStorage:", await positionRouter.referralStorage())
  //
  // const iVault = await ethers.getContractAt("IVault", vault.address);
  // console.log("btc.maxUsdg:", (await iVault.maxUsdgAmounts("0xAAb8FCD8DD22a5de73550F8e67fF9Ca970d1257E")).toString());
  // console.log("btc.usdgAmount:", (await iVault.usdgAmounts("0xAAb8FCD8DD22a5de73550F8e67fF9Ca970d1257E")).toString());
  // console.log("btc.minProfitBasisPoints:", (await iVault.minProfitBasisPoints("0xAAb8FCD8DD22a5de73550F8e67fF9Ca970d1257E")).toString());
  // console.log("btc.bufferAmounts:", (await iVault.bufferAmounts("0xAAb8FCD8DD22a5de73550F8e67fF9Ca970d1257E")).toString());

  // console.log("postionRouter.address:", await positionRouter.address);
  // console.log("postionRouter.admin:", await positionRouter.admin());
  // console.log("postionRouter.vault:", await positionRouter.vault());
  // console.log("postionRouter.shortsTracker:", shortsTrackerAddress);
  // console.log("postionRouter.router:", await positionRouter.router());
  // console.log("postionRouter.weth:", await positionRouter.weth());
  // let minExecutionFee = await positionRouter.minExecutionFee();
  // console.log("positionRouter.minExecutionFee:", minExecutionFee.toString());
  // // await positionRouter.setMinExecutionFee("10000000000000000");  //0.01eth
  // // await positionRouter.setMinExecutionFee("6000000000000000");  //0.006eth

  // let shortsTrackerAddress = await positionRouter.shortsTracker();
  // const shortsTracker = await contractAt("ShortsTracker",   shortsTrackerAddress, signer);
  // console.log("shortsTracker.gov:", await shortsTracker.gov());
  // console.log("shortsTracker.isHandler(positionRouter):", await shortsTracker.isHandler(positionRouter.address));
  // console.log("shortsTracker.isHandler(positionUtils):", await shortsTracker.isHandler(positionUtils.address));
  // 222 await shortsTracker.setHandler(positionUtils.address, true);
  // 222 await shortsTracker.setHandler(positionRouter.address, true);
  //
  // const orderBook = await contractAt("OrderBook", "0xaF6bD805616B65cA819b3068cdb715dE611f4eED", signer);
  // console.log("orderBook.gov:", await orderBook.gov());
  // console.log("orderBook.weth:", await orderBook.weth());
  // console.log("orderBook.usdg:", await orderBook.usdg());
  // console.log("orderBook.router:", await orderBook.router());
  // console.log("orderBook.vault:", await orderBook.vault());
  // let minExecutionFee = await orderBook.minExecutionFee();
  // console.log("orderBook.minExecutionFee:", minExecutionFee.toString());
  // let minPurchaseTokenAmountUsd = await orderBook.minPurchaseTokenAmountUsd();
  // console.log("orderBook.minPurchaseTokenAmountUsd:", minPurchaseTokenAmountUsd.toString());
  // console.log("orderBook.isInitialized:", await orderBook.isInitialized());
  //
  // const router = await contractAt("Router", "0x16aB9C1825b86e8B8cE3a3F1d7d863A982d95CB3", signer);
  // console.log("router.gov:", await router.gov());
  // console.log("router.weth:", await router.weth());
  // console.log("router.usdg:", await router.usdg());
  // console.log("router.vault:", await router.vault());
  // console.log("router.plugins(orderBook):", await router.plugins(orderBook.address));
  // 333 await router.addPlugin(orderBook.address);

  // // const btcPriceFeed = await contractAt("IAggregatorV3Interface", "0x15EAE259a17292355E93Ea5893f6d2cb10Da5a80", capKeeperWallet);
  // const btcPriceFeed = await ethers.getContractAt("IAggregatorV3Interface", "0x0BD585f5A4DDb2f2c457eB7Cc6bfA6627e529cf0");
  // const ethPriceFeed = await ethers.getContractAt("IAggregatorV3Interface", "0xF293e585EB02f80E6Cfacc5c6F252543d7d8bDa1");
  // const usdtPriceFeed = await ethers.getContractAt("IAggregatorV3Interface", "0x379Cb51948b8415E3CD7b5eB331C0E7F4a3febCe");
  // const usdcPriceFeed = await ethers.getContractAt("IAggregatorV3Interface", "0x054B70Ba3511ad0A423Fc0EBdC6EDc065A573195");
  //
  // while (true) {
  //   console.log("time:", new Date(Date.parse(new Date().toString())));
  //   let btcPrice = await btcPriceFeed.latestRoundData();
  //   console.log("btcPrice:", btcPrice[1].toString());
  //   let ethPrice = await ethPriceFeed.latestRoundData();
  //   console.log("ethPrice:", ethPrice[1].toString());
  //   let usdtPrice = await usdtPriceFeed.latestRoundData();
  //   console.log("usdtPrice:", usdtPrice[1].toString());
  //   let usdcPrice = await usdcPriceFeed.latestRoundData();
  //   console.log("usdcPrice:", usdcPrice[1].toString());
  //
  //   await sleep(300000);
  // }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
