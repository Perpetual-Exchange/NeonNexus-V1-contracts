const {
  getFrameSigner,
  contractAt,
  sendTxn,
  updateTokensPerInterval,
} = require("../shared/helpers");
const { expandDecimals } = require("../../test/shared/utilities");

const network = process.env.HARDHAT_NETWORK || "mainnet";

const {
  getArbValues,
  getAvaxValues,
  getSepoliaValues,
  getAvaxTestValues,
  getOpTestValues,
  updateRewards,
} = require("./rewards");

function getValues(signer) {
  if (network === "arbitrum") {
    return getArbValues(signer);
  }

  if (network === "avax") {
    return getAvaxValues(signer);
  }

  if (network === "sepolia") {
    return getSepoliaValues(signer);
  }

  if (network === "avaxtest") {
    return getAvaxTestValues(signer);
  }

  if (network === "opsidetest") {
    return getOpTestValues(signer);
  }
}

async function main() {
  // const vGMX = await contractAt(
  //   "Vester",
  //   "0x70c2B4aD576041c98400281DFfb8A360Ce4839a9"
  // );
  // const vGLP = await contractAt(
  //   "Vester",
  //   "0x7Db896240b54867106520A772c7717502D17903B"
  // );
  // const GMX = await contractAt(
  //   "Token",
  //   "0x7A9a466DE08747bC8Ad79aBA6D8dCE9D64E5C767"
  // );

  // const convertedTransferAmount = expandDecimals(3000, 18);
  // await sendTxn(
  //   GMX.transfer(vGMX.address, convertedTransferAmount, {
  //     gasLimit: 3000000,
  //   }),
  //   `rewardToken.transfer vGMX`
  // );
  // await sendTxn(
  //   GMX.transfer(vGLP.address, convertedTransferAmount, {
  //     gasLimit: 3000000,
  //   }),
  //   `rewardToken.transfer vGLP`
  // );


  //   const token = await contractAt(
  //     "Token",
  //     "0x7E160F7a1f90E3BfB380eA6Fba9cbD860d7Cd0D1"
  //   );
  //   console.log(
  //     await token.balanceOf("0xc71aABBC653C7Bd01B68C35B8f78F82A21014471")
  //   );
  //   return;

  const signer = await getFrameSigner();
  const values = await getValues(signer);
  await updateRewards({ signer, values });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
