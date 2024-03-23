const {
  getFrameSigner,
  deployContract,
  contractAt,
  sendTxn,
  writeTmpAddresses,
  callWithRetries,
  providers,
  sleep,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");
const { toUsd } = require("../../test/shared/units");
const {address} = require("hardhat/internal/core/config/config-validation");
const {OPSIDE_TESTNET_DEPLOY_KEY, ROLLUX_TESTNET_LIQUIDATOR_KEY} = require("../../env.json");
const {gql, request} = require("graphql-request");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];


async function getAvaxTestValues() {
  const vault = await contractAt(
    "Vault",
    "0xAC6E2Ac93E2a1CFFadE96607fe2376F5f5952EDC"
  );

  const updater = "0x2071045Bd93F01a36cF00eCc4ade032d17C8F7D8";

  return {
    vault,
    updater,
  };
}

async function getOpTestValues() {
  // const signer = await getFrameSigner();
  const signer = await new ethers.Wallet(OPSIDE_TESTNET_LIQUIDATOR_KEY).connect(providers.opsidetest)

  const vault = await contractAt(
    "Vault",
    "0x357fa1565B94D9F7C770D30c95a405F805d95fEA"
  );

  const updater = "0x2071045Bd93F01a36cF00eCc4ade032d17C8F7D8";

  const orderBook = await contractAt(
    "OrderBook",
    "0xB3Cbdd85837B046f06Cc644c644255A840e63c42"
  );

  const orderBookReaer = await contractAt(
    "OrderBookReader",
    "0x40539eB21d1e9E22d41d7E947336F268B63C6952"
  );

  const positionManager = await contractAt(
    "PositionManager",
    "0x622e004355Fbe4B097c1BAeD27bbE3812A110c0F",
    signer,
    {
      libraries: {
        PositionUtils: "0xE3aac6676E18f5229Cbd6cb3A6B809112C2B1932",
      },
    }
  );

  return {
    vault,
    updater,
    orderBook,
    orderBookReaer,
    positionManager,
  };
}

async function getRoTestValues() {
  // const signer = await getFrameSigner();
  const signer = await new ethers.Wallet(ROLLUX_TESTNET_LIQUIDATOR_KEY).connect(providers.rolluxtest)

  const vault = await contractAt(
    "Vault",
    "0xffe4E159fd0f96b01463b297a5bcA784000C50C9"
  );

  const orderBook = await contractAt(
    "OrderBook",
    "0xaF6bD805616B65cA819b3068cdb715dE611f4eED"
  );

  const orderBookReaer = await contractAt(
    "OrderBookReader",
    "0xeEaB8fB727d7d889d700bC07fF18F3Ef88fdC34a"
  );

  const positionManager = await contractAt(
    "PositionManager",
    "0x4B83201fc16a479e83043f42c20b5749752873D6",
    signer,
    {
      libraries: {
        PositionUtils: "0xd530E3C4BEEf0cAcE2ec3ede72DC8b351537606A",
      },
    }
  );

  return {
    vault,
    orderBook,
    orderBookReaer,
    positionManager,
  };
}

async function getValues() {
  if (network === "avaxtest") {
    return getAvaxTestValues();
  }

  if (network === "opsidetest") {
    return getOpTestValues();
  }

  if (network === "rolluxtest") {
    return getRoTestValues();
  }
}

async function main() {

  // const account = "0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d";
  const account = "0xAcdC274B853e01e9666E03c662d30A83B8F73080";
  const liquidator = "0xa941c62EC351878186f06C5578f6161F36bB88fe";
  const feeReceiver = "0xa941c62EC351878186f06C5578f6161F36bB88fe";

  const { vault, orderBook, orderBookReaer, positionManager } = await getValues();

  let idxIncrease = await orderBook.increaseOrdersIndex(account);
  console.log("idxIncrease:", idxIncrease.toString());
  let idxDecrease = await orderBook.decreaseOrdersIndex(account);
  console.log("idxDecrease:", idxDecrease.toString());
  let idxSwap = await orderBook.swapOrdersIndex(account);
  console.log("idxSwap:", idxSwap.toString());
  console.log("isLiquidator:", await positionManager.isLiquidator(liquidator));

  // await sendTxn(
  //   positionManager.setLiquidator(liquidator, true),
  //   "positionManager.setLiquidator");

  const interval = 1800000;
  const document = gql`
    {
        activePositions {
          id
        }
        actions (where:{action_in:["IncreasePosition-Long", "IncreasePosition-Short"]}){
          from
          params
        }
    }`

  while (true) {
    console.log("\n-------------------------", new Date());

    const data = await request('https://graph.neonnexus.io/subgraphs/name/nexus/nexus-rt-stats', document);
    console.log("data.length:", data.activePositions.length);

    let positions = {aaa: ["a","b","c", true]};
    console.log("data.actions.length:", data.actions.length);
    for (let j=0;j<data.actions.length;j++) {
      let action = data.actions[j];
      console.log("index:", j, "account:", action.from);
      let obj = JSON.parse(action.params);
      console.log("index:", j, "collateralToken:", obj.collateralToken);

      if (obj.key in positions) {
      } else {
        positions[obj.key] = [action.from, obj.collateralToken, obj.indexToken, obj.isLong]
      }
    }

    let count = 0;
    for (let i=0;i<data.activePositions.length;i++) {
      let activePosition = data.activePositions[i];
      console.log("index:", i, "key:", activePosition.id);
      if (activePosition.id in positions) {
        let position = positions[activePosition.id];
        try {
          await sendTxn(
            positionManager.liquidatePosition(position[0], position[1], position[2], position[3], feeReceiver,{
                gasLimit: "12626360",
              }),
            "positionManager.liquidatePosition"
          );
          count ++;

        } catch (e) {
          console.log("liquidatePosition error:", e.toString());
        }
      }
    }

    console.log("------------------------- activePositions:", data.activePositions.length, "executed:", count);
    await sleep(interval);
  }

  // for (let i=0;i<data.liquidatedPositions.length;i++) {
  //   let position = data.liquidatedPositions[i];
  //   console.log("idx:", i, "id:", position.id);
  //   // if (order.type === "increase") {
  //   //   try {
  //   //     await sendTxn(
  //   //       positionManager.executeIncreaseOrder(order.account, Number(order.index), feeReceiver,{
  //   //         gasLimit: "12626360",
  //   //       }),
  //   //       "positionManager.executeIncreaseOrder"
  //   //     );
  //   //   } catch (e) {
  //   //     console.log("executeIncreaseOrder error:", e.toString());
  //   //   }
  //   // } else if (order.type === "decrease") {
  //   //   try {
  //   //     await sendTxn(
  //   //       positionManager.executeDecreaseOrder(order.account, Number(order.index), feeReceiver,{
  //   //         gasLimit: "12626360",
  //   //       }),
  //   //       "positionManager.executeDecreaseOrder"
  //   //     );
  //   //   } catch (e) {
  //   //     console.log("executeDecreaseOrder error:", e.toString());
  //   //   }
  //   // } else if (order.type === "swap") {
  //   //   try {
  //   //     await sendTxn(
  //   //       positionManager.executeSwapOrder(order.account, Number(order.index), feeReceiver,{
  //   //         gasLimit: "12626360",
  //   //       }),
  //   //       "positionManager.executeSwapOrder"
  //   //     );
  //   //   } catch (e) {
  //   //     console.log("executeSwapOrder error:", e.toString());
  //   //   }
  //   // }
  // }



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
