const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("--------------------------------------")
    let args = ["Alyra"]
    const Hello = await deploy("Hello", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    //Verify the smart contract 
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_KEY) {
        log("Verifying...")
        await verify(Hello.address, args)
    }
}

module.exports.tags = ["all", "main"]
