const { getFrameSigner, deployContract, contractAt, sendTxn, readTmpAddresses, callWithRetries } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")
const { toChainlinkPrice } = require("../../test/shared/chainlink")
const {OPSIDE_TESTNET_URL, OPSIDE_TESTNET_DEPLOY_KEY} = require("../../env.json");

const network = (process.env.HARDHAT_NETWORK || 'mainnet');
const tokens = require('./tokens')[network];

async function getArbValues() {
  const vault = await contractAt("Vault", "0x489ee077994B6658eAfA855C308275EAd8097C4A")

  const { usdc } = tokens
  const tokenArr = [usdc]

  return { vault, tokenArr }
}

async function getAvaxValues() {
  const vault = await contractAt("Vault", "0x9ab2De34A33fB459b538c43f251eB825645e8595")

  const { btcb } = tokens
  const tokenArr = [btcb]

  return { vault, tokenArr }
}

async function getAvaxTestValues() {
  const vault = await contractAt("Vault", "0xAC6E2Ac93E2a1CFFadE96607fe2376F5f5952EDC")

  const { btc, eth, avax, link, usdt } = tokens
  const tokenArr = [btc, eth, avax, link, usdt]

  return { vault, tokenArr }
}

async function getOpTestValues() {
  const vault = await contractAt("Vault", "0x357fa1565B94D9F7C770D30c95a405F805d95fEA")
  const { btc, eth, usdt, usdc } = tokens
  const tokenArr = [btc, eth, usdt, usdc]

  return { vault, tokenArr }
}

async function getValues() {
  if (network === "arbitrum") {
    return getArbValues()
  }

  if (network === "avax") {
    return getAvaxValues()
  }

  if (network === "avaxtest") {
    return getAvaxTestValues()
  }

  if (network === "opsidetest") {
    return getOpTestValues()
  }
}

async function main() {
  const signer = await getFrameSigner()

  const { vault, tokenArr } = await getValues()

  const vaultGov = await vault.gov()

  const vaultTimelock = await contractAt("Timelock", vaultGov, signer)
  const vaultMethod = "signalVaultSetTokenConfig"
  // const vaultMethod = "vaultSetTokenConfig"

  console.log("vault:", await vault.address)
  console.log("vault.gov:", await vault.gov())
  console.log("vaultTimelock", await vaultTimelock.address)
  console.log("vaultMethod", vaultMethod)
  console.log("vaultTimelock.buffer:", (await vaultTimelock.buffer()).toString())

  for (const token of tokenArr) {
    await sendTxn(vaultTimelock[vaultMethod](
      vault.address,
      token.address, // _token
      token.decimals, // _tokenDecimals
      token.tokenWeight, // _tokenWeight
      token.minProfitBps, // _minProfitBps
      expandDecimals(token.maxUsdgAmount, 18), // _maxUsdgAmount
      token.isStable, // _isStable
      token.isShortable // _isShortable
    ), `vault.${vaultMethod}(${token.name}) ${token.address}`)

    console.log(token.address, await vault.whitelistedTokens(token.address));
    console.log("vault.priceFeed:", await vault.priceFeed());

    // await sendTxn(
    //   vault.setTokenConfig(
    //     token.address, // _token
    //     token.decimals, // _tokenDecimals
    //     token.tokenWeight, // _tokenWeight
    //     token.minProfitBps, // _minProfitBps
    //     expandDecimals(token.maxUsdgAmount, 18), // _maxUsdgAmount
    //     token.isStable, // _isStable
    //     token.isShortable, // _isShortable
    //     {
    //       gasLimit: "12626360",
    //     }
    //   ), `vault.setTokenConfig(${token.name}) ${token.address}`
    // );

  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
