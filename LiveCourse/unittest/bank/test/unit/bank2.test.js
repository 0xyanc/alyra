const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { BigNumber } = require("ethers")

if (!developmentChains.includes(network.name)) {
    describe.skip
    return
}
describe("Units tests of Bank smart contract", function () {
    let accounts
    let bank
    before(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
    })

    describe("Deposit", async function () {
        beforeEach(async () => {
            await deployments.fixture(["bank"])
            bank = await ethers.getContract("Bank")
        })
    })

    describe("Withdraw", async function () {
        beforeEach(async () => {
            await deployments.fixture(["bank"])
            bank = await ethers.getContract("Bank")
            await bank.deposit({ value: 1000 });
            await bank.connect(accounts[1]).deposit({ value: 10000 });
        })
    })

})
