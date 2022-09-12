require("@nomicfoundation/hardhat-toolbox");


require("dotenv").config({ path: ".env" });

const INFURA_API_KEY_URL = process.env.INFURA_API_KEY_URL;

const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: INFURA_API_KEY_URL,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },
};