const { deployReferralStorage } = require("./deploys");

async function main() {
  await deployReferralStorage();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
