const {
  deployContract,
  contractAt,
  writeTmpAddresses,
  sendTxn,
} = require("../shared/helpers");

async function main() {
  const tokenManager = await deployContract(
    "TokenManager",
    [4],
    "TokenManager"
  );

  //   const signers = [
  //     "0x45e48668F090a3eD1C7961421c60Df4E66f693BD", // Dovey
  //     "0xD7941C4Ca57a511F21853Bbc7FBF8149d5eCb398", // G
  //     "0x881690382102106b00a99E3dB86056D0fC71eee6", // Han Wen
  //     "0x2e5d207a4c0f7e7c52f6622dcc6eb44bc0fe1a13", // Krunal Amin
  //     "0x6091646D0354b03DD1e9697D33A7341d8C93a6F5", // xhiroz
  //     "0xd6D5a4070C7CFE0b42bE83934Cc21104AbeF1AD5" // Bybit Security Team
  //   ]
  const signers = [
    "0xAcdC274B853e01e9666E03c662d30A83B8F73080", // paul
    "0xc71aABBC653C7Bd01B68C35B8f78F82A21014471", // xiaowu
    "0xc7816AB57762479dCF33185bad7A1cFCb68a7997",
    "0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d",
  ];

  await sendTxn(tokenManager.initialize(signers), "tokenManager.initialize");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
