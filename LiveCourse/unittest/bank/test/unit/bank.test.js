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

    describe("Deployment", async function () {
        it("should deploy the smart contract", async function () {
            await deployments.fixture(["bank"])
            bank = await ethers.getContract("Bank")
        })
    })

    describe("Initial getBalanceAndLastPayment", async function () {
        it("should get the initial balance of the sender", async function () {
            const account = await bank.getBalanceAndLastPayment()
            assert.equal(account.balance.toString(), "0");
            assert.equal(account.lastPayment.toString(), "0");
        })
    })

    describe("Deposit", async function () {
        it("should revert if 0 ether is sent", async function () {
            await expect(bank.deposit()).to.be.revertedWith("Not enough deposit")
        })
        it("should increase the balance of the sender and set the lastPayment timestamp", async function () {
            await bank.deposit({ value: 1000 });
            const account = await bank.getBalanceAndLastPayment()
            assert.equal(account.balance.toString(), "1000")
            assert(account.lastPayment.toString().length === 10)
        })
        it("should emit the EtherDeposited event", async function () {
            expect(await bank.deposit({ value: 1000 })).to.emit(bank, "EtherDeposited");
        })
    })

    describe("Withdraw", async function () {
        it("should revert if balance is 0 for the address", async function () {
            await expect(bank.connect(accounts[1]).withdraw(1)).to.be.revertedWith("Not enough ether in your balance.")
        })
        it("should revert if not enough ether in the balance", async function () {
            await expect(bank.withdraw(9999999)).to.be.revertedWith("Not enough ether in your balance.")
        })
        it("should update the balance of the sender", async function () {
            const balanceOfDeployer = await deployer.getBalance()

            // get the tx gas cost
            const transactionResponse = await bank.withdraw(900)
            const transactionReceipt = await transactionResponse.wait()
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const bn900 = BigNumber.from("900")
            const newBalanceOfDeployer = await deployer.getBalance()
            const result = balanceOfDeployer.add(bn900).sub(gasCost)
            assert.equal(result.toString(), newBalanceOfDeployer.toString())

            // test account balance using chai-matcher -> don't need to calculate gas gost
            await expect(bank.withdraw(100)).to.changeEtherBalance(deployer, 100)

            const account = await bank.getBalanceAndLastPayment()
            assert.equal(account.balance.toString(), "1000")
            assert(account.lastPayment.toString().length === 10)
        })
        it("should emit the EtherWithdrawn event", async function () {
            expect(await bank.withdraw(1)).to.emit(bank, "EtherWithdrawn")
        })
    })
})
