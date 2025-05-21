require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports={
  solidity: {
    compilers: [
      { version: "0.8.20" },
      { version: "0.8.28" }
    ],
  },
  networks: {
    amoy: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80002
    },
  },
}