require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy");

const PK = process.env.PK || "";
const ALCHEMY_MUMBAI = process.env.ALCHEMY_MUMBAI || "";
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || "";
const POLYGONSCAN_KEY= process.env.POLYGONSCAN_KEY || "";
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
      goerli: ETHERSCAN_KEY,
      polygonMumbai: POLYGONSCAN_KEY
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    }
  }
};
