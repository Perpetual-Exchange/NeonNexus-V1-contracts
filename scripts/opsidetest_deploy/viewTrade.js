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
const {OPSIDE_TESTNET_DEPLOY_KEY, OPSIDE_TESTNET_LIQUIDATOR_KEY} = require("../../env.json");
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

  const positionUtils = await contractAt(
    "PositionUtils",
    "0xE3aac6676E18f5229Cbd6cb3A6B809112C2B1932"
  );

  const positionManager = await contractAt(
    "PositionManager",
    "0x622e004355Fbe4B097c1BAeD27bbE3812A110c0F",
    signer,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  const positionRouter = await contractAt(
    "PositionRouter",
    "0x6A84F186A77F22B701Cb1CbA18da8b29E813A303",
    signer,
    {
      libraries: {
        PositionUtils: positionUtils.address,
      },
    }
  );

  return {
    vault,
    updater,
    orderBook,
    orderBookReaer,
    positionManager,
    positionRouter,
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
  // const account = "0xAcdC274B853e01e9666E03c662d30A83B8F73080";
  const liquidator = "0x6A6D608a0dE1742Be622Fee4f9189243c0d68153";
  const feeReceiver = "0x6A6D608a0dE1742Be622Fee4f9189243c0d68153";

  const { vault, updater, orderBook, orderBookReaer, positionManager, positionRouter } = await getValues();

  // let idxIncrease = await orderBook.increaseOrdersIndex(account);
  // console.log("idxIncrease:", idxIncrease.toString());
  // let idxDecrease = await orderBook.decreaseOrdersIndex(account);
  // console.log("idxDecrease:", idxDecrease.toString());
  // let idxSwap = await orderBook.swapOrdersIndex(account);
  // console.log("idxSwap:", idxSwap.toString());
  // console.log("isLiquidator:", await positionManager.isLiquidator(liquidator));

  const documentAllOrder = gql`
    {
      orders {
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
  const documentOpenOrder = gql`
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
    console.log("-------------------------", new Date());
    const keysIndex = await positionRouter.getRequestQueueLengths();

    console.log("increasePositionRequestKeysStart:", keysIndex[0].toString());
    console.log("increasePositionRequestKeys.length:", keysIndex[1].toString());
    console.log("decreasePositionRequestKeysStart:", keysIndex[2].toString());
    console.log("decreasePositionRequestKeys.length:", keysIndex[3].toString());

    for (let i=keysIndex[0];i<keysIndex[1];i++) {
      console.log("\n------increaseRequest.index:", i.toString(), "------");
      const key = await positionRouter.increasePositionRequestKeys(i);
      const increaseRequest = await positionRouter.increasePositionRequests(key);
      // console.log("increaseRequest:", increaseRequest);
      console.log("increaseRequest.account:", await increaseRequest.account);
      const path = await increaseRequest.path;
      for (var ii in path) {
        console.log(ii, path[ii]);
      }
      // console.log("path.length:", path);

      console.log("increaseRequest.indexToken:", await increaseRequest.indexToken);
      console.log("increaseRequest.amountIn:", (await increaseRequest.amountIn).toString());
      console.log("increaseRequest.minOut:", (await increaseRequest.minOut).toString());
      console.log("increaseRequest.sizeDelta:", (await increaseRequest.sizeDelta).toString());
      console.log("increaseRequest.isLong:", (await increaseRequest.isLong).toString());
      console.log("increaseRequest.acceptablePrice:", (await increaseRequest.acceptablePrice).toString());
      console.log("increaseRequest.executionFee:", (await increaseRequest.executionFee).toString());
      console.log("increaseRequest.blockNumber:", (await increaseRequest.blockNumber).toString());
      console.log("increaseRequest.blockTime:", (await increaseRequest.blockTime).toString());
      console.log("increaseRequest.hasCollateralInETH:", (await increaseRequest.hasCollateralInETH).toString());
      console.log("increaseRequest.callbackTarget:", await increaseRequest.callbackTarget);

      console.log("------increaseRequest.index:", i.toString(), "------\n");
    }

    for (let i=keysIndex[2];i<keysIndex[3];i++) {
      console.log("\n------decreaseRequest.index:", i.toString(), "------");
      const key = await positionRouter.decreasePositionRequestKeys(i);
      const decreaseRequest = await positionRouter.decreasePositionRequests(key);
      // console.log("decreaseRequest:", decreaseRequest);
      console.log("decreaseRequest.account:", await decreaseRequest.account);
      const path = await decreaseRequest.path;
      for (var ii in path) {
        console.log(ii, path[ii]);
      }
      // console.log("path.length:", path);

      console.log("decreaseRequest.indexToken:", await decreaseRequest.indexToken);
      console.log("decreaseRequest.collateralDelta:", (await decreaseRequest.collateralDelta).toString());
      console.log("decreaseRequest.sizeDelta:", (await decreaseRequest.sizeDelta).toString());
      console.log("decreaseRequest.isLong:", (await decreaseRequest.isLong).toString());
      console.log("decreaseRequest.receiver:", await decreaseRequest.receiver);
      console.log("decreaseRequest.acceptablePrice:", (await decreaseRequest.acceptablePrice).toString());
      console.log("decreaseRequest.minOut:", (await decreaseRequest.minOut).toString());
      console.log("decreaseRequest.executionFee:", (await decreaseRequest.executionFee).toString());
      console.log("decreaseRequest.blockNumber:", (await decreaseRequest.blockNumber).toString());
      console.log("decreaseRequest.blockTime:", (await decreaseRequest.blockTime).toString());
      console.log("decreaseRequest.withdrawETH:", (await decreaseRequest.withdrawETH).toString());
      console.log("decreaseRequest.callbackTarget:", await decreaseRequest.callbackTarget);

      console.log("------decreaseRequest.index:", i.toString(), "------\n");
    }

    const data1 = await request('http://61.10.9.22:10367/subgraphs/name/odx/odx-zkevm-stats', documentAllOrder);
    console.log("orders(all):", data1.orders.length);
    const data2 = await request('http://61.10.9.22:10367/subgraphs/name/odx/odx-zkevm-stats', documentOpenOrder);
    console.log("orders(open):", data2.orders.length);

    await sleep(5000);
  }

  // await sendTxn(
  //   positionManager.setLiquidator(liquidator, true),
  //   "positionManager.setLiquidator");

  // const document = gql`
  // {
  //     liquidatedPositions {
  //       account
  //       averagePrice
  //       borrowFee
  //       collateral
  //       collateralToken
  //       id
  //       indexToken
  //       isLong
  //       key
  //       loss
  //       markPrice
  //       size
  //       timestamp
  //       type
  //     }
  // }`
  //
  // const data = await request('http://61.10.9.22:10367/subgraphs/name/odx/odx-zkevm-stats', document);
  // console.log("data.length:", data.liquidatedPositions.length);

  // try {
  //   await sendTxn(
  //     positionManager.liquidatePosition(account, "0xAAb8FCD8DD22a5de73550F8e67fF9Ca970d1257E",
  //       "0xc7a1bAe0Db6203F3Ee3C721909B3b959a1b437Ca", true, feeReceiver,{
  //       gasLimit: "12626360",
  //     }),
  //     "positionManager.liquidatePosition"
  //   );
  // } catch (e) {
  //   console.log("liquidatePosition error:", e.toString());
  // }

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
