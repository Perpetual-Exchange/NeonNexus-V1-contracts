const { deployContract, contractAt, sendTxn, writeTmpAddresses, callWithRetries } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

async function main() {
  const addresses = {}
  const account = { admin: "0x95E9C006F3426cA86A6BdC678de14C922B814cF4",
    tester: "0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d"}

  // const usdc = await deployContract("FaucetToken", ["USDC", "RUSDC", 6, expandDecimals(1000000000, 6)]);
  // await sendTxn(usdc.mint(account.admin, expandDecimals(100000000, 6)), `usdc.mint(${account.admin}, 100000000)`);
  // await sendTxn(usdc.mint(account.tester, expandDecimals(500000000, 6)), `usdc.mint(${account.tester}, 500000000)`);
  // addresses.USDC = usdc.address

  const psys = await deployContract("FaucetToken", ["PSYS", "RPSYS", 18, expandDecimals(10000000000, 18)]);
  await sendTxn(psys.mint(account.admin, expandDecimals(1000000000, 18)), `psys.mint(${account.admin}, 100000000)`);
  await sendTxn(psys.mint(account.tester, expandDecimals(5000000000, 18)), `psys.mint(${account.tester}, 500000000)`);
  addresses.PSYS = psys.address

  writeTmpAddresses(addresses)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
