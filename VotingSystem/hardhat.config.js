require("@nomicfoundation/hardhat-toolbox");
require("hardhat-docgen")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.17"
      }
    ]
  },
  docgen: {
    path: './docs',
    clear: true,
  }
};
