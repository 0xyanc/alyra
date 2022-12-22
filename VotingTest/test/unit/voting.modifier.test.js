const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

if (!developmentChains.includes(network.name)) {
    describe.skip
    return
}
describe("Unit tests of modifiers in Voting smart contract", function () {
    let accounts
    let voting
    before(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        deployerAddress = await deployer.getAddress()
        voter = accounts[1]
        voterAddress = await voter.getAddress()
    })

    describe("onlyOwner", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
        })

        it("should revert if the sender tries to add voter while not being the admin", async function () {
            await expect(voting.connect(voter).addVoter(voterAddress))
                .to.be.revertedWith("Ownable: caller is not the owner")
        })
        it("should revert if the sender tries to start Proposal Registration while not being the admin", async function () {
            await expect(voting.connect(voter).startProposalsRegistering())
                .to.be.revertedWith("Ownable: caller is not the owner")
        })
        it("should revert if the sender tries to end Proposal Registration while not being the admin", async function () {
            await expect(voting.connect(voter).endProposalsRegistering())
                .to.be.revertedWith("Ownable: caller is not the owner")
        })
        it("should revert if the sender tries to start voting session while not being the admin", async function () {
            await expect(voting.connect(voter).startVotingSession())
                .to.be.revertedWith("Ownable: caller is not the owner")
        })
        it("should revert if the sender tries to end voting session while not being the admin", async function () {
            await expect(voting.connect(voter).endVotingSession())
                .to.be.revertedWith("Ownable: caller is not the owner")
        })
        it("should revert if the sender tries to tally the votes while not being the admin", async function () {
            await expect(voting.connect(voter).tallyVotes())
                .to.be.revertedWith("Ownable: caller is not the owner")
        })
    })

    describe("onlyVoter", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
        })
        it("should revert if the sender tries to add a proposal while not being a voter", async function () {
            await expect(voting.addProposal("desc"))
                .to.be.revertedWith("You're not a voter")
        })
        it("should revert if the sender tries to vote while not being a voter", async function () {
            await expect(voting.setVote(1))
                .to.be.revertedWith("You're not a voter")
        })
        it("should revert if the sender tries to get a voter while not being a voter", async function () {
            await expect(voting.getVoter(await deployer.getAddress()))
                .to.be.revertedWith("You're not a voter")
        })
        it("should revert if the sender tries to get a proposal while not being a voter", async function () {
            await expect(voting.getOneProposal(0))
                .to.be.revertedWith("You're not a voter")
        })
    })
})