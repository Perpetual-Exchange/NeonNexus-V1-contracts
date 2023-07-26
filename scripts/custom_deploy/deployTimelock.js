const { deployTimelock } = require("./deploys");
const { expandDecimals } = require("../../test/shared/utilities");

async function main() {
  const buffer = 24 * 60 * 60;
  const maxTokenSupply = expandDecimals("13250000", 18);
  const admin = "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471";
  const tokenManager = {
    address: "0x9a2Ca11fAe50c8C31d74abF9736Ba6F2DEd1b304",
  };
  const mintReceiver = {
    address: "0x9a2Ca11fAe50c8C31d74abF9736Ba6F2DEd1b304",
  };
  const glpManager = {
    address: "0xCBC62aF283bfFB69246Af143Ec349261Bc403eC6",
  };
  const rewardRouter = {
    address: "0x8c63b343580Dc693271Cf9609D6655b6B1B499b7",
  };
  await deployTimelock(
    admin, // admin
    buffer, // buffer
    tokenManager.address, // tokenManager
    mintReceiver.address, // mintReceiver
    glpManager.address, // glpManager
    rewardRouter.address, // rewardRouter
    maxTokenSupply, // maxTokenSupply
    10, // marginFeeBasisPoints 0.1%
    500 // maxMarginFeeBasisPoints 5%
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
