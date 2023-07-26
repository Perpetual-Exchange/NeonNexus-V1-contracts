const { deployReferralReader } = require("./deploys");

async function main() {
  await deployReferralReader();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
