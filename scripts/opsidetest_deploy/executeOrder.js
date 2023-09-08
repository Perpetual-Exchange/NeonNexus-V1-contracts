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
const {OPSIDE_TESTNET_DEPLOY_KEY, OPSIDE_TESTNET_ORDERKEEPER_KEY} = require("../../env.json");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];
const { request, gql } = require("graphql-request");


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
  const signer = await new ethers.Wallet(OPSIDE_TESTNET_ORDERKEEPER_KEY).connect(providers.opsidetest)

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

async function getValues() {
  if (network === "avaxtest") {
    return getAvaxTestValues();
  }

  if (network === "opsidetest") {
    return getOpTestValues();
  }
}

async function main() {

  const account = "0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d";
  const orderKeeper = "0x84073D58c53E8d90065a1ea570B4f6E6Ee63DA5d";
  const feeReceiver = "0x84073D58c53E8d90065a1ea570B4f6E6Ee63DA5d";

  const { vault, updater, orderBook, orderBookReaer, positionManager } = await getValues();

  let idxIncrease = await orderBook.increaseOrdersIndex(account);
  console.log("idxIncrease:", idxIncrease.toString());
  let idxDecrease = await orderBook.decreaseOrdersIndex(account);
  console.log("idxDecrease:", idxDecrease.toString());
  let idxSwap = await orderBook.swapOrdersIndex(account);
  console.log("idxSwap:", idxSwap.toString());
  console.log("isOrderkeeper:", await positionManager.isOrderKeeper(orderKeeper));

  const document = gql`
  {
    orders(where: {status: open}) {
      account
      cancelledTimestamp
      createdTimestamp
      executedTimestamp
      id
      index
      size
      status
      type
    }
  }`

  while (true) {
    console.log("\n-------------------------", new Date());

    const data = await request('http://61.10.9.22:10367/subgraphs/name/odx/odx-zkevm-stats', document);
    console.log("data.length:", data.orders.length);

    let count = 0;
    for (let i=0;i<data.orders.length;i++) {
      let order = data.orders[i];
      console.log("idx:", i, "id:", order.id);
      if (order.type === "increase") {
        try {
          await sendTxn(
            positionManager.executeIncreaseOrder(order.account, Number(order.index), feeReceiver,{
              gasLimit: "12626360",
            }),
            "positionManager.executeIncreaseOrder"
          );
          count ++;

        } catch (e) {
          console.log("executeIncreaseOrder error:", e.toString());
        }
      } else if (order.type === "decrease") {
        try {
          await sendTxn(
            positionManager.executeDecreaseOrder(order.account, Number(order.index), feeReceiver,{
              gasLimit: "12626360",
            }),
            "positionManager.executeDecreaseOrder"
          );
          count ++;

        } catch (e) {
          console.log("executeDecreaseOrder error:", e.toString());
        }
      } else if (order.type === "swap") {
        try {
          await sendTxn(
            positionManager.executeSwapOrder(order.account, Number(order.index), feeReceiver,{
              gasLimit: "12626360",
            }),
            "positionManager.executeSwapOrder"
          );
          count ++;

        } catch (e) {
          console.log("executeSwapOrder error:", e.toString());
        }
      }
    }

    console.log();
    console.log("-------------------------", "orders total:", data.orders.length, "executed:", count);

    await sleep(10000);
  }



  // console.log("data:", data);

  // await sendTxn(
  //     positionManager.setOrderKeeper(orderKeeper, true),
  //   "positionManager.setOrderKeeper");
  //
  // await sendTxn(
  //   positionManager.setLiquidator(liquidator, true),
  //   "positionManager.setLiquidator");

  // for (let i=0;i<idxIncrease;i++) {
  //   let values2 = await orderBook.getIncreaseOrder(account, i);
  //   if (values2[0] !== 0x0) {
  //     console.log("IncreaseOrder.purchaseToken:", values2[0]);
  //     console.log("IncreaseOrder.purchaseTokenAmount:", values2[1].toString());
  //     console.log("IncreaseOrder.collateralToken:", values2[2]);
  //     console.log("IncreaseOrder.indexToken:", values2[3]);
  //     console.log("IncreaseOrder.sizeDelta:", values2[4].toString());
  //     console.log("IncreaseOrder.isLong:", values2[5].toString());
  //     console.log("IncreaseOrder.triggerPrice:", values2[6].toString());
  //     console.log("IncreaseOrder.triggerAboveThreshold:", values2[7].toString());
  //     console.log("IncreaseOrder.executionFee:", values2[8].toString());
  //
  //     try {
  //       await sendTxn(
  //         positionManager.executeIncreaseOrder(account, i, feeReceiver,{
  //           gasLimit: "12626360",
  //         }),
  //         "positionManager.executeIncreaseOrder"
  //       );
  //     } catch (e) {
  //       console.log("error:", e.toString());
  //     }
  //   }
  // }
  //
  // for (let j=0;j<idxDecrease;j++) {
  //   let values = await orderBook.getDecreaseOrder(account, j);
  //
  //   if (values[0] !== 0x0) {
  //     console.log("DecreaseOrder.collateralToken:", values[0]);
  //     console.log("DecreaseOrder.collateralDelta:", values[1].toString());
  //     console.log("DecreaseOrder.indexToken:", values[2]);
  //     console.log("DecreaseOrder.isLong:", values[4].toString());
  //     console.log("DecreaseOrder.triggerPrice:", values[5].toString());
  //
  //     try {
  //       await sendTxn(
  //         positionManager.executeDecreaseOrder(account, j, feeReceiver,{
  //           gasLimit: "12626360",
  //         }),
  //         "positionManager.executeDecreaseOrder"
  //       );
  //     } catch (e) {
  //       console.log("error:", e.toString());
  //     }
  //   }
  // }
  //
  // for (let k=0;k<idxSwap;k++) {
  //   let values3 = await orderBook.getSwapOrder(account, k);
  //
  //   if (values3[0] !== 0x0) {
  //     console.log("SwapOrder.path0:", values3[0]);
  //     console.log("SwapOrder.path1:", values3[1]);
  //     console.log("SwapOrder.path2:", values3[2]);
  //     console.log("SwapOrder.amountIn:", values3[3].toString());
  //     console.log("SwapOrder.minOut:", values3[4].toString());
  //     console.log("SwapOrder.triggerRatio:", values3[5].toString());
  //
  //     try {
  //       await sendTxn(
  //         positionManager.executeSwapOrder(account, k, feeReceiver,{
  //           gasLimit: "12626360",
  //         }),
  //         "positionManager.executeSwapOrder"
  //       );
  //     } catch (e) {
  //       console.log("error:", e.toString());
  //     }
  //   }
  // }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
