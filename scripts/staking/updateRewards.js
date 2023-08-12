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
}

async function main() {
  const vGMX = await contractAt(
    "Vester",
    "0xC4cE3c38a6d33173D62E69B359ae486bEFF4D10D"
  );
  const vGLP = await contractAt(
    "Vester",
    "0x0Aa11CCf9241eD22F2AF9315DFe0615a77A3178C"
  );
  const GMX = await contractAt(
    "Token",
    "0x0C038276cd0089e58C2fc5d7CB6e7565Ca14650a"
  );
  const convertedTransferAmount = expandDecimals(3000, 18);
  await sendTxn(
    GMX.transfer(vGMX.address, convertedTransferAmount, {
      gasLimit: 3000000,
    }),
    `rewardToken.transfer vGMX`
  );
  await sendTxn(
    GMX.transfer(vGLP.address, convertedTransferAmount, {
      gasLimit: 3000000,
    }),
    `rewardToken.transfer vGLP`
  );
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
