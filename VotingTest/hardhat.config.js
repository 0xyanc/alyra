require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy");
require("hardhat-gas-reporter")
require("solidity-coverage")

const PK = process.env.PK || "";
const ETHERSCAN = process.env.ETHERSCAN || "";
const GOERLI_RPC = process.env.GOERLI_RPC || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    goerli: {
      url: GOERLI_RPC,
      accounts: [`0x${PK}`],
      chainId: 5,
      blockConfirmations: 6
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17"
      }
    ]
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    }
  },
  gasReporter: {
    enabled: true
  }
};
