const hre = require("hardhat");

async function main() {
  const Hello = await hre.ethers.getContractFactory("Hello");
  const hello = await Hello.deploy("Alyra");

  await hello.deployed();

  console.log(`Contract deployed at address ${hello.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
