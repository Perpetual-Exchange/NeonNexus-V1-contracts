const { deployPriceFeedTimelock } = require("./deploys");

async function main() {
  const admin = "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471";
  const buffer = 24 * 60 * 60;

  const tokenManager = {
    address: "0x9a2Ca11fAe50c8C31d74abF9736Ba6F2DEd1b304",
  };

  await deployPriceFeedTimelock(admin, buffer, tokenManager);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
