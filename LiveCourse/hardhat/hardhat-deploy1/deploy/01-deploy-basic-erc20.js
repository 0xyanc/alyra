const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("--------------------------------------")
    let args = [] 
    const AlyraIsERC20 = await deploy("AlyraIsERC20", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    //Verify the smart contract 
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN) {
        log("Verifying...")
        await verify(AlyraIsERC20.address, args)
    }
}

module.exports.tags = ["all", "erc20", "main"]
