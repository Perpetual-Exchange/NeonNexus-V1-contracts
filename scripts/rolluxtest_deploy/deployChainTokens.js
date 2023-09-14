const { deployContract, sendTxn, writeTmpAddresses, callWithRetries } = require("../shared/helpers")
const { expandDecimals } = require("../../test/shared/utilities")

async function main() {
  const addresses = {}
  const account = { admin: "0xAcdC274B853e01e9666E03c662d30A83B8F73080",
                    tester: "0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d"}

  const btc = await deployContract("FaucetToken", ["Bitcoin", "RBTC", 18, expandDecimals(10000, 18)]);
  await sendTxn(btc.mint(account.admin, expandDecimals(10000, 18)), `btc.mint(${account.admin}, 10000)`);
  await sendTxn(btc.mint(account.tester, expandDecimals(50000, 18)), `btc.mint(${account.tester}, 50000)`);
  addresses.BTC = btc.address

  // const eth = await deployContract("FaucetToken", ["Wrapped Ether", "RWETH", 18, expandDecimals(1000000, 18)]);
  // await sendTxn(eth.mint(account.admin, expandDecimals(100000, 18)), `eth.mint(${account.admin}, 100000)`);
  // await sendTxn(eth.mint(account.tester, expandDecimals(500000, 18)), `eth.mint(${account.tester}, 500000)`);
  // addresses.ETH = eth.address

  const wtsys = await deployContract("WETH", ["Wrapped TSYS", "WTSYS", 18]);
  addresses.SYS = wtsys.address

  const dai = await deployContract("FaucetToken", ["DAI", "RDAI", 18, expandDecimals(1000000, 18)]);
  await sendTxn(dai.mint(account.admin, expandDecimals(100000, 18)), `dai.mint(${account.admin}, 100000)`);
  await sendTxn(dai.mint(account.tester, expandDecimals(500000, 18)), `dai.mint(${account.tester}, 500000)`);
  addresses.DAI = dai.address

  const usdt = await deployContract("FaucetToken", ["Tether", "RUSDT", 6, expandDecimals(1000000, 6)]);
  await sendTxn(usdt.mint(account.admin, expandDecimals(1000000, 6)), `usdt.mint(${account.admin}, 1000000)`);
  await sendTxn(usdt.mint(account.tester, expandDecimals(5000000, 6)), `usdt.mint(${account.tester}, 5000000)`);
  addresses.USDT = usdt.address

  writeTmpAddresses(addresses)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
