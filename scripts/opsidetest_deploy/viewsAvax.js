const {
  getFrameSigner,
  deployContract,
  contractAt,
  sendTxn,
  readTmpAddresses,
  writeTmpAddresses,
  sleep,
} = require("../shared/helpers");
const { AVAX_URL,
        AVAX_DEPLOY_KEY,
        AVAX_TESTNET_URL,
        AVAX_TESTNET_DEPLOY_KEY,
        OPSIDE_TESTNET_URL,
        OPSIDE_TESTNET_DEPLOY_KEY} = require("../../env.json");
const { VAULT_ADDR,
  REFERRALSTORAGE_ADDR,
  SHORTSTRACKER_ADDR,
  SHORTSTRACKERTIMELOCK_ADDR,
  POSITIONUTILS_ADDR,
} = require("../conf/contract.json");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("../core/tokens")[network];

async function main() {

  const signer = await getFrameSigner();
  console.log("signer.address:", await signer.address);
  console.log("chainId:", await signer.getChainId());

  const vault = await contractAt("Vault", "0x9ab2De34A33fB459b538c43f251eB825645e8595", signer);
  console.log("vault.gov:", await vault.gov());
  console.log("vault.gov:", await vault.gov());
  const iVault = await ethers.getContractAt("IVault", vault.address);
  console.log("wavax.maxUsdg:", (await iVault.maxUsdgAmounts("0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7")).toString());
  console.log("wavax.usdgAmount:", (await iVault.usdgAmounts("0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7")).toString());
  console.log("wavax.minProfitBasisPoints:", (await iVault.minProfitBasisPoints("0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7")).toString());
  console.log("wavax.bufferAmounts:", (await iVault.bufferAmounts("0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7")).toString());

  console.log("usdc.maxUsdg:", (await iVault.maxUsdgAmounts("0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e")).toString());
  console.log("usdc.usdgAmount:", (await iVault.usdgAmounts("0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e")).toString());
  console.log("usdc.minProfitBasisPoints:", (await iVault.minProfitBasisPoints("0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e")).toString());
  console.log("usdc.bufferAmounts:", (await iVault.bufferAmounts("0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e")).toString());



  // // 111 await vault.setGov(timelock.address);

  // const timelock = await contractAt("Timelock", "0x2E05D1391Bb165fD46756f6756f396D804840f4a", signer);
  // console.log("timelock.address:", await timelock.address);
  // console.log("timelock.admin:", await timelock.admin());
  // console.log("timelock.tokenManager:", await timelock.tokenManager());
  // console.log("timelock.mintReceiver:", await timelock.mintReceiver());
  // console.log("timelock.glpManager:", await timelock.glpManager());
  // console.log("timelock.rewardRouter:", await timelock.rewardRouter());
  //
  // const vault = await contractAt("Vault", "0x357fa1565B94D9F7C770D30c95a405F805d95fEA", signer);
  // console.log("vault.gov:", await vault.gov());
  // // 111 await vault.setGov(timelock.address);

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
  //   "0xE3aac6676E18f5229Cbd6cb3A6B809112C2B1932"
  // );
  // const positionRouter = await contractAt(
  //   "PositionRouter",
  //   "0x6A84F186A77F22B701Cb1CbA18da8b29E813A303",
  //   signer,
  //   {
  //     libraries: {
  //       PositionUtils: positionUtils.address,
  //     },
  //   }
  // );
  // // console.log("positionRouter.referralStorage:", await positionRouter.referralStorage())
  //
  // console.log("postionRouter.address:", await positionRouter.address);
  // console.log("postionRouter.admin:", await positionRouter.admin());
  // console.log("postionRouter.vault:", await positionRouter.vault());
  // let shortsTrackerAddress = await positionRouter.shortsTracker();
  // console.log("postionRouter.shortsTracker:", shortsTrackerAddress);
  // console.log("postionRouter.router:", await positionRouter.router());
  // console.log("postionRouter.weth:", await positionRouter.weth());
  // let minExecutionFee = await positionRouter.minExecutionFee();
  // console.log("positionRouter.minExecutionFee:", minExecutionFee.toString());
  // await positionRouter.setMinExecutionFee("10000000000000000");  //0.01eth
  // await positionRouter.setMinExecutionFee("6000000000000000");  //0.006eth


  // const shortsTracker = await contractAt("ShortsTracker",   shortsTrackerAddress, signer);
  // console.log("shortsTracker.gov:", await shortsTracker.gov());
  // console.log("shortsTracker.isHandler(positionRouter):", await shortsTracker.isHandler(positionRouter.address));
  // console.log("shortsTracker.isHandler(positionUtils):", await shortsTracker.isHandler(positionUtils.address));
  // // 222 await shortsTracker.setHandler(positionUtils.address, true);
  // // 222 await shortsTracker.setHandler(positionRouter.address, true);
  //
  // const orderBook = await contractAt("OrderBook", "0xB3Cbdd85837B046f06Cc644c644255A840e63c42", signer);
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
  // const router = await contractAt("Router", "0x1099861d064d6C093C9D2F73602d7DAd12155073", signer);
  // console.log("router.gov:", await router.gov());
  // console.log("router.weth:", await router.weth());
  // console.log("router.usdg:", await router.usdg());
  // console.log("router.vault:", await router.vault());
  // console.log("router.plugins(orderBook):", await router.plugins(orderBook.address));
  // // 333 await router.addPlugin(orderBook.address);

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
