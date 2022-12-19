require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy");
require("hardhat-gas-reporter")
require("solidity-coverage")

const PK = process.env.PK || "";
const ALCHEMY_MUMBAI = process.env.ALCHEMY_MUMBAI || "";
const ETHERSCAN = process.env.ETHERSCAN || "";
const POLYGONSCAN = process.env.POLYGONSCAN || "";
const ALCHEMY_GOERLI = process.env.ALCHEMY_GOERLI || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    goerli: {
      url: ALCHEMY_GOERLI,
      accounts: [`0x${PK}`],
      chainId: 5,
      blockConfirmations: 6
    },
    polygonMumbai: {
      url: ALCHEMY_MUMBAI,
      accounts: [`0x${PK}`],
      chainId: 80001
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
      goerli: ETHERSCAN,
      polygonMumbai: POLYGONSCAN
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
