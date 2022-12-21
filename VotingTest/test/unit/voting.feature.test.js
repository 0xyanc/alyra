const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

if (!developmentChains.includes(network.name)) {
    describe.skip
    return
}
describe("Unit tests of Voting smart contract", function () {
    let accounts
    let voting
    before(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        deployerAddress = await deployer.getAddress()
        voter = accounts[1]
        voterAddress = await voter.getAddress()
    })

    describe("addVoter", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
        })
        it("should add the address to the whitelisted voters and emit the event VoterRegistered(address)", async function () {
            const voterAdded = await voting.addVoter(voterAddress)
            newVoter = await voting.connect(voter).getVoter(voterAddress)
            assert(newVoter.isRegistered === true)
            expect(voterAdded).to.emit("VoterRegistered").withArgs(voterAddress)
        })
        it("should revert if the address is already whitelisted", async function () {
            await voting.addVoter(voterAddress)
            await expect(voting.addVoter(voterAddress))
                .to.be.revertedWith("Already registered")
        })
    })
    describe("addProposal", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
            await voting.addVoter(voterAddress)
            await voting.startProposalsRegistering()
        })
        it("should revert if the proposal is empty", async function () {
            await expect(voting.connect(voter).addProposal(""))
                .to.be.revertedWith("Vous ne pouvez pas ne rien proposer")
        })
        it("should add the proposal to the list and emit the event ProposalRegistered(uint)", async function () {
            // check proposal one does not exist
            await expect(voting.connect(voter).getOneProposal(1)).to.be.reverted;

            const addProp = await voting.connect(voter).addProposal("proposal1")

            // verify added proposal
            const prop = await voting.connect(voter).getOneProposal(1)
            assert(prop.description === "proposal1")
            expect(addProp).to.emit("ProposalRegistered").withArgs(1)
        })
    })

    describe("setVote", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
            await voting.addVoter(voterAddress)
            await voting.startProposalsRegistering()
            await voting.connect(voter).addProposal("prop1")
            await voting.endProposalsRegistering()
            await voting.startVotingSession()
        })
        it("should revert if the proposal does not exist", async function () {
            await expect(voting.connect(voter).setVote(999))
                .to.be.revertedWith("Proposal not found")
        })
        it("should revert if the voter has already voted", async function () {
            await voting.connect(voter).setVote(1)
            await expect(voting.connect(voter).setVote(1))
                .to.be.revertedWith("You have already voted")
        })
        it("should update vote count and the voters info and emit the event Voted(address, uint)", async function () {
            // check initial values
            let proposal = await voting.connect(voter).getOneProposal(1)
            assert.equal(proposal.voteCount, 0)

            let registeredVoter = await voting.connect(voter).getVoter(voterAddress)
            assert.equal(registeredVoter.hasVoted, false)
            assert.equal(registeredVoter.votedProposalId, 0)

            const tx = await voting.connect(voter).setVote(1)

            // verify that the values have changed
            registeredVoter = await voting.connect(voter).getVoter(voterAddress)
            assert.equal(registeredVoter.hasVoted, true)
            assert.equal(registeredVoter.votedProposalId, 1)

            proposal = await voting.connect(voter).getOneProposal(1)
            assert.equal(proposal.voteCount, 1)

            expect(tx).to.emit("Voted").withArgs(voterAddress, 1)
        })
        it("should end the voting session phase", async function () {
            const tx = await voting.endVotingSession()
            assert.equal(await voting.workflowStatus(), 4)
            expect(tx).to.emit("WorkflowStatusChange").withArgs(3, 4)
        })
    })

    describe("tallyVotes", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
            await voting.addVoter(voterAddress)
            await voting.addVoter(await accounts[2].getAddress())
            await voting.startProposalsRegistering()
            await voting.connect(voter).addProposal("prop1")
            await voting.endProposalsRegistering()
            await voting.startVotingSession()
            await voting.connect(voter).setVote(1)
            await voting.endVotingSession()
        })
        it("should pick the winning proposal", async function () {
            await voting.tallyVotes()

            const winningProposalId = await voting.winningProposalID()
            assert.equal(winningProposalId, 1)
        })
    })

})