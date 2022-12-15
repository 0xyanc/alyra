const { network, ethers, getNamedAccounts } = require("hardhat")

async function changeName() {
    const { deployer } = await getNamedAccounts()
    const Hello = await ethers.getContract("Hello")
    let name = await Hello.getName()
    console.log(`*** Name is ${name} ***`)
    const mintTx = await Hello.setName("Paul")
    await mintTx.wait(1)
    name = await Hello.getName()
    console.log(`*** Name is now ${name} ***`)
}

changeName()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })