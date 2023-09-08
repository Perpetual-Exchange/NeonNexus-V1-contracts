const { getFrameSigner, deployContract, contractAt, sendTxn, readTmpAddresses, callWithRetries } = require("../shared/helpers")
const { bigNumberify, expandDecimals } = require("../../test/shared/utilities")

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function getArbValues() {
  const vault = await contractAt("Vault", "0x489ee077994B6658eAfA855C308275EAd8097C4A")
  const vaultPriceFeed = await contractAt("VaultPriceFeed", await vault.priceFeed())
  // const vaultPriceFeed = await contractAt("VaultPriceFeed", "0xfe661cbf27Da0656B7A1151a761ff194849C387A")

  const { btc, eth, usdce, usdc, link, uni, usdt, mim, frax, dai } = tokens
  const fastPriceTokens = [btc, eth, link, uni]

  return { vaultPriceFeed, fastPriceTokens }
}

async function getAvaxValues() {
  const vault = await contractAt("Vault", "0x9ab2De34A33fB459b538c43f251eB825645e8595")
  const vaultPriceFeed = await contractAt("VaultPriceFeed", await vault.priceFeed())
  // const vaultPriceFeed = await contractAt("VaultPriceFeed", "0x205646B93B9D8070e15bc113449586875Ed7288E")

  const { avax, btc, btcb, eth, mim, usdce, usdc } = tokens
  const fastPriceTokens = [avax, btc, btcb, eth]

  return { vaultPriceFeed, fastPriceTokens }
}

async function getOpTestValues() {
  const vault = await contractAt("Vault", "0x357fa1565B94D9F7C770D30c95a405F805d95fEA")
  const vaultPriceFeed = await contractAt("VaultPriceFeed", await vault.priceFeed())

  const { btc, eth, usdt, usdc } = tokens;
  const tokenArr = [btc, eth, usdt, usdc];
  const fastPriceTokens = [btc, eth];

  return { vaultPriceFeed, tokenArr, fastPriceTokens }
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }

  if (network === "avax") {
    return getAvaxValues()
  }

  if (network === "opsidetest") {
    return getOpTestValues()
  }
}

async function main() {
  const signer = await getFrameSigner();

  const { vaultPriceFeed, tokenArr, fastPriceTokens } = await getValues()
  const secondaryPriceFeed = await contractAt("FastPriceFeed", await vaultPriceFeed.secondaryPriceFeed())
  const priceFeedTimelock = await contractAt("PriceFeedTimelock", "0xDDF9C4BEE4C531Cd75bC36bb0DCd0e2Ef9Cc1dD9", signer)

  // await sendTxn(
  //   priceFeedTimelock.signalSetGov(vaultPriceFeed.address, priceFeedTimelock.admin(),
  //     {
  //       gasLimit: "12626360",
  //     }),
  //   "priceFeedTimelock.signalSetGov"
  // );
  // await sendTxn(
  //   priceFeedTimelock.setGov(vaultPriceFeed.address, priceFeedTimelock.admin(),
  //     {
  //       gasLimit: "12626360",
  //     }),
  //   "priceFeedTimelock.setGov"
  // );

  // console.log("priceFeedTimelock.admin:", await priceFeedTimelock.admin());
  console.log("vaultPriceFeed.gov:", await vaultPriceFeed.gov());
  console.log("vaultPriceFeed.address:", await vaultPriceFeed.address);
  console.log("secondaryPriceFeed.address:", await secondaryPriceFeed.address);
  console.log("secondaryPriceFeed.gov:", await secondaryPriceFeed.gov());

  for (const token of tokenArr) {
    // await sendTxn(
    //   priceFeedTimelock.signalPriceFeedSetTokenConfig(
    //     vaultPriceFeed.address, // vaultPriceFeed
    //     token.address, // _token
    //     token.priceFeed, // _priceFeed
    //     token.priceDecimals, // _priceDecimals
    //     token.isStrictStable, // _isStrictStable
    //     {
    //       gasLimit: "12626360",
    //     }
    //   ),
    //   `priceFeedTimelock.signalPriceFeedSetTokenConfig(${token.name}) ${token.address} ${token.priceFeed}`
    // );

    // await sendTxn(
    //   priceFeedTimelock.priceFeedSetTokenConfig(
    //     vaultPriceFeed.address, // vaultPriceFeed
    //     token.address, // _token
    //     token.priceFeed, // _priceFeed
    //     token.priceDecimals, // _priceDecimals
    //     token.isStrictStable, // _isStrictStable
    //     {
    //       gasLimit: "12626360",
    //     }
    //   ),
    //   `priceFeedTimelock.priceFeedSetTokenConfig(${token.name}) ${token.address} ${token.priceFeed}`
    // );
  }
  // vaultPriceFeed.setTokenConfig(
  //   token.address, // _token
  //   token.priceFeed, // _priceFeed
  //   token.priceDecimals, // _priceDecimals
  //   token.isStrictStable, // _isStrictStable
  //   {
  //     gasLimit: "12626360",
  //   }
  // ),

}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
