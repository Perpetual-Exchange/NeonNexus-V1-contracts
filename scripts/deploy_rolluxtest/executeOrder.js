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
const {OPSIDE_TESTNET_DEPLOY_KEY, ROLLUX_TESTNET_ORDERKEEPER_KEY} = require("../../env.json");

const network = process.env.HARDHAT_NETWORK || "mainnet";
const tokens = require("./tokens")[network];
const { request, gql } = require("graphql-request");

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

async function getRoTestValues() {
  // const signer = await getFrameSigner();
  const signer = await new ethers.Wallet(ROLLUX_TESTNET_ORDERKEEPER_KEY).connect(providers.rolluxtest)
  console.log("signer.address:", signer.address);

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
  if (network === "opsidetest") {
    return getOpTestValues();
  }

  if (network === "rolluxtest") {
    return getRoTestValues();
  }
}

async function main() {

  const account = "0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d";
  const orderKeeper = "0x9D2436cD7fba667aFD9370F34C21A468a5fc80fF";
  const feeReceiver = "0x9D2436cD7fba667aFD9370F34C21A468a5fc80fF";

  const { vault, orderBook, orderBookReaer, positionManager } = await getValues();

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

  let count = 0;
  var failedOrders = new Map();
  while (true) {
    const data = await request('https://graph.neonnexus.io/subgraphs/name/nexus/nexus-rt-stats', document);
    console.log("orders.length:", data.orders.length);

    for (let i=0;i<data.orders.length;i++) {
      let order = data.orders[i];
      console.log("\n\n-------------------------", new Date(), "total:", data.orders.length, "idx:", i, "id:", order.id);
      if (failedOrders.has(order.id)) {
        console.log("failed order id:", order.id);
        continue;
      }

      console.log(order);
      if (order.type === "increase") {
        let increaseOrder = await orderBook.getIncreaseOrder(order.account, order.index);
        try {
          let ret = await orderBook.validatePositionOrderPrice(increaseOrder.triggerAboveThreshold,
            increaseOrder.triggerPrice,
            increaseOrder.indexToken,
            increaseOrder.isLong,
            true);

          console.log("execute IncreaseOrder:", increaseOrder);
          try {
            await sendTxn(
              positionManager.executeIncreaseOrder(order.account, Number(order.index), feeReceiver,{
                gasLimit: "12626360",
              }),
              "positionManager.executeIncreaseOrder"
            );
            count ++;
          } catch (e) {
            console.log("executeIncreaseOrder error id:", order.id);
            failedOrders.set(order.id, true);
          }
        } catch (e) {
          console.log("executeIncreaseOrder not match id:", order.id);
        }

      } else if (order.type === "decrease") {
        let decreaseOrder = await orderBook.getDecreaseOrder(order.account, order.index);
        try {
          let ret = await orderBook.validatePositionOrderPrice(decreaseOrder.triggerAboveThreshold,
            decreaseOrder.triggerPrice,
            decreaseOrder.indexToken,
            !decreaseOrder.isLong,
            true);

          console.log("execute decreaseOrder:", decreaseOrder);
          try {
            await sendTxn(
              positionManager.executeDecreaseOrder(order.account, Number(order.index), feeReceiver,{
                gasLimit: "12626360",
              }),
              "positionManager.executeDecreaseOrder"
            );
            count ++;
          } catch (e) {
            console.log("executeDecreaseOrder error id:", order.id);
            failedOrders.set(order.id, true);
          }
        } catch (e) {
          console.log("executeDecreaseOrder not match id:", order.id);
        }

      } else if (order.type === "swap") {
        let swapOrder = await orderBook.getSwapOrder(order.account, order.index);
        let path = [ swapOrder.path0, swapOrder.path1 ];
        let isExecuted = await orderBook.validateSwapOrderPriceWithTriggerAboveThreshold(path, swapOrder.triggerRatio);
        if (isExecuted) {
          console.log("execute swapOrder:", swapOrder);
          try {
            await sendTxn(
              positionManager.executeSwapOrder(order.account, Number(order.index), feeReceiver, {
                gasLimit: "12626360",
              }),
              "positionManager.executeSwapOrder"
            );
            count++;
          } catch (e) {
            console.log("executeSwapOrder error id:", order.id);
            failedOrders.set(order.id, true);
          }
        }
      }
    }
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
