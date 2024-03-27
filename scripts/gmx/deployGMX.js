const {
  sendTxn,
  deployContract,
  contractAt,
  writeTmpAddresses,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");

async function main() {

  await deployContract("GMX", []);

  // const minter = { address: "0xAcdC274B853e01e9666E03c662d30A83B8F73080" };
  //
  // const gmx = await contractAt(
  //   "GMX",
  //   "0x2CbF0056E15f4Fe2e04691D280D89bA645D6D364"
  // );
  //
  // await sendTxn(
  //   gmx.setMinter(minter.address, true),
  //   "gmx.setMinter(minter, true)"
  // );
  //
  // senders = [
  //   "0xAcdC274B853e01e9666E03c662d30A83B8F73080", // paul
  //   "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471", // xiaowu
  //   "0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d", // jiagang
  //   "0x34d0B59D2E1262FD04445F7768F649fF6DC431a7", // shixiong
  //   "0xc7816AB57762479dCF33185bad7A1cFCb68a7997", // kering
  // ];
  // const amount = expandDecimals("10000", 18);
  // for (let sender of senders) {
  //   await sendTxn(gmx.mint(sender, amount), "gmx.mint(sender, true)");
  // }



  // EsGMX
  //   const esGmx = await contractAt(
  //     "EsGMX",
  //     "0xf7B8fFCFd556c2BBbb36535e97d24610a9fE79E1"
  //   );
  //   //   await deployContract("GMX", [])
  //   //   const minter = { address: "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471" };

  //   await sendTxn(
  //     esGmx.setMinter(minter.address, true),
  //     "gmx.setMinter(minter, true)"
  //   );

  //   senders = [
  //     "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471", // xiaowu
  //     "0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d", // jiagang
  //     "0x34d0B59D2E1262FD04445F7768F649fF6DC431a7", // shixiong
  //     "0xc7816AB57762479dCF33185bad7A1cFCb68a7997", // kering
  //   ];
  //   const amount = expandDecimals("10000", 18);
  //   for (let sender of senders) {
  //     await sendTxn(esGmx.mint(sender, amount), "gmx.mint(sender, true)");
  //   }

  //   const reader = await contractAt(
  //     "Reader",
  //     "0x7C4c161a923dF21b1dd1d62b8620Ea24d6E928c4"
  //   );
  //   const pr = await contractAt(
  //     "PositionRouter",
  //     "0xFb0342D3cf1Ba81fc336195c4Ed6626eAb8e402B",
  //     null,
  //     {
  //       libraries: {
  //         PositionUtils: "0x811B1AE2A6addF28e39cD189a56F2413a7c69f5E",
  //       },
  //     }
  //   );
  //   const key = await pr.getRequestKey(
  //     "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471",
  //     1
  //   );
  //   const data = await pr.increasePositionRequests(
  //     "0x524f666cf739da9f19964f0ad12dd2a0ffa9bc3316055018167e691bedcb7ad5"
  //   );
  //   console.log("data:", data);
  //   const positions = await reader.getPositions(
  //     "0x7531626E87BdA9B8511bea536136e5349EDacE89",
  //     "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471",
  //     ["0xd41D4FeF58b8c008F6e4d9614f2Fa9ed2Aec8aAb"],
  //     ["0xd41D4FeF58b8c008F6e4d9614f2Fa9ed2Aec8aAb"],
  //     [true]
  //   );
  //   //   console.log("positions:", positions);
  //   for (let position of positions) {
  //     console.log("position:", position);
  //   }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
