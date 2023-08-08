const { contractAt, sendTxn } = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");

async function main() {
  const router = await contractAt(
    "Router",
    "0xf6447de9988F36C0E74fb3991E1d001DB7A1bec8"
  );

  await sendTxn(
    router.addPlugin("0x759CEae223ddb16eE8494D7b4030650a0D40c360"),
    "router.addPlugin"
  );
  //   await sendTxn(
  //     router.approvePlugin("", "0x759CEae223ddb16eE8494D7b4030650a0D40c360"),
  //     "router.approvePlugin"
  //   );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
