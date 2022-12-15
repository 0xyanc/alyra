const { network, ethers } = require("hardhat")

module.exports = async({ getNamedAccounts }) => {

    const { deployer } = await getNamedAccounts()

    const Hello = await ethers.getContract("Hello")
    let name = await Hello.getName()
    console.log(`*** Name is ${name} ***`)
    const mintTx = await Hello.setName("Jean")
    await mintTx.wait(1)
    name = await Hello.getName()
    console.log(`*** Name is now ${name} ***`)
}

module.exports.tags = ["all", "name", "mint"]