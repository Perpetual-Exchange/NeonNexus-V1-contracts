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

async function getRoTestValues(signer) {

  const { btc, eth, sys, dai } = tokens
  const tokenArr = [btc, eth, sys, dai]

  const vault = await contractAt("Vault", "0xffe4E159fd0f96b01463b297a5bcA784000C50C9", signer)
  const vaultTimelock = await contractAt("Timelock", "0xAfc3Cc911c900e1FB682aabe3f899b81BCCAD419", signer)

  return { vault, vaultTimelock, tokenArr }
}

async function getValues(signer) {
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

  if (network === "rolluxtest") {
    return getRoTestValues(signer)
  }
}

async function main() {
  const signer = await getFrameSigner()

  const { vault, vaultTimelock, tokenArr } = await getValues(signer)
  const iVault = await ethers.getContractAt("IVault", vault.address);

  const vaultGov = await vault.gov()

  console.log("signer.address:", await signer.address)
  console.log("vault:", await vault.address)
  console.log("vault.gov:", await vault.gov())
  console.log("vaultTimelock", await vaultTimelock.address)
  // console.log("vaultTimelock.buffer:", (await vaultTimelock.buffer()).toString())

  // const vaultMethod = "signalVaultSetTokenConfig"
  // const vaultMethod = "vaultSetTokenConfig"
  // const vaultMethod = "signalSetGov"
  const vaultMethod = "setGov"

  // set vault gov signer
  // await sendTxn(vaultTimelock[vaultMethod](
  //   vault.address,
  //   signer.address
  // ), `vaultTimelock.${vaultMethod}(${vault.address}, ${signer.address})`)

  // // vault clear tokenConfig
  // await sendTxn(vault.clearTokenConfig("0x9D973BAc12BB62A55be0F9f7Ad201eEA4f9B8428"),
  //   `vault.clearTokenConfig(0x9D973BAc12BB62A55be0F9f7Ad201eEA4f9B8428)`)

  // // vault set gov Timelock
  // await sendTxn(vault.setGov(vaultTimelock.address),
  //   `vault.setGov(${vaultTimelock.address})`)
  // console.log("vaultTimelock.address:", await vaultTimelock.address)

  for (const token of tokenArr) {
    // await sendTxn(vaultTimelock[vaultMethod](
    //   vault.address,
    //   token.address, // _token
    //   token.decimals, // _tokenDecimals
    //   token.tokenWeight, // _tokenWeight
    //   token.minProfitBps, // _minProfitBps
    //   expandDecimals(token.maxUsdgAmount, 18), // _maxUsdgAmount
    //   token.isStable, // _isStable
    //   token.isShortable // _isShortable
    // ), `vault.${vaultMethod}(${token.name}) ${token.address}`)

    console.log(token.address, await vault.whitelistedTokens(token.address));
    console.log("vault.priceFeed:", await vault.priceFeed());

    await sendTxn(
      vaultTimelock.setTokenConfig(
        vault.address,  // _vault
        token.address, // _token
        token.tokenWeight, // _tokenWeight
        token.minProfitBps, // _minProfitBps
        expandDecimals(token.maxUsdgAmount, 18), // _maxUsdgAmount
        expandDecimals(token.bufferAmount, token.decimals), // _bufferAmount
        await iVault.usdgAmounts(token.address),
        {
          gasLimit: "12626360",
        }
      ), `vault.setTokenConfig(${token.name}) ${token.address}`
    );

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
