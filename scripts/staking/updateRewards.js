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
}

async function main() {
  const vGMX = await contractAt(
    "Vester",
    "0xCD3e0EB7e5e8A896fE584d5b8dB3E7F1Ed7c3D4C"
  );
  const vGLP = await contractAt(
    "Vester",
    "0x6bdD661C46a710a1ad8624b8faD99B71D08d884e"
  );
  const GMX = await contractAt(
    "Token",
    "0x2CbF0056E15f4Fe2e04691D280D89bA645D6D364"
  );
  const convertedTransferAmount = expandDecimals(3000, 18);
  // ms await sendTxn(
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
