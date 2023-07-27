const { deployVaultUtils } = require("./deploys");

async function main() {
  const vault = {
    address: "0xf0A79aC35A3fd299438D60b6Cb31A8A774AC395f",
  };
  await deployVaultUtils(vault);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
