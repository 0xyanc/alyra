const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

if (!developmentChains.includes(network.name)) {
    describe.skip
    return
}
describe("Unit tests of WorkflowStatus management Voting smart contract", function () {
    let accounts
    let voting
    before(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        deployerAddress = await deployer.getAddress()
        voter = accounts[1]
        voterAddress = await voter.getAddress()
    })

    describe("status in RegisteringVoters", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
            await voting.addVoter(deployerAddress)
        })
        it("should change status to ProposalsRegistrationStarted=1 and add a GENESIS proposal if the admin tries to start the proposal registering phase ", async function () {
            const tx = await voting.startProposalsRegistering()

            assert.equal(await voting.workflowStatus(), 1)
            const genesis = await voting.getOneProposal(0)
            assert.equal(genesis.description, "GENESIS")
            assert.equal(genesis.voteCount, 0)
            expect(tx).to.emit(voting, "WorkflowStatusChange").withArgs(0, 1)
        })
        it("should revert if the admin tries to end the proposal registering phase", async function () {
            await expect(voting.endProposalsRegistering())
                .to.be.revertedWith("Registering proposals havent started yet")
        })
        it("should revert if the admin tries to start the voting session phase", async function () {
            await expect(voting.startVotingSession())
                .to.be.revertedWith("Registering proposals phase is not finished")
        })
        it("should revert if the admin tries to end the voting session phase", async function () {
            await expect(voting.endVotingSession())
                .to.be.revertedWith("Voting session havent started yet")
        })
        it("should revert if the admin tries to tally votes", async function () {
            await expect(voting.tallyVotes())
                .to.be.revertedWith("Current status is not voting session ended")
        })
        it("should revert if the status is not in ProposalsRegistrationStarted", async function () {
            await expect(voting.addProposal("proposal1"))
                .to.be.revertedWith("Proposals are not allowed yet")
        })
        it("should revert if the status is not in VotingSessionStarted", async function () {
            await expect(voting.setVote(0))
                .to.be.revertedWith("Voting session havent started yet")
        })
    })

    describe("status in ProposalsRegistrationStarted", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
            await voting.addVoter(deployerAddress)
            await voting.startProposalsRegistering()
        })
        it("should revert if the admin tries to start the proposal registering phase", async function () {
            await expect(voting.startProposalsRegistering())
                .to.be.revertedWith("Registering proposals cant be started now")
        })
        it("should end the proposal registering phase", async function () {
            const tx = await voting.endProposalsRegistering()
            assert.equal(await voting.workflowStatus(), 2)
            expect(tx).to.emit(voting, "WorkflowStatusChange").withArgs(1, 2)
        })
        it("should revert if the admin tries to start the voting session phase", async function () {
            await expect(voting.startVotingSession())
                .to.be.revertedWith("Registering proposals phase is not finished")
        })
        it("should revert if the admin tries to end the voting session phase", async function () {
            await expect(voting.endVotingSession())
                .to.be.revertedWith("Voting session havent started yet")
        })
        it("should revert if the status is not in RegisteringVoters", async function () {
            await expect(voting.addVoter(voterAddress))
                .to.be.revertedWith("Voters registration is not open yet")
        })
        it("should revert if the admin tries to tally votes", async function () {
            await expect(voting.tallyVotes())
                .to.be.revertedWith("Current status is not voting session ended")
        })
        it("should revert if the status is not in VotingSessionStarted", async function () {
            await expect(voting.setVote(0))
                .to.be.revertedWith("Voting session havent started yet")
        })
    })

    describe("status in ProposalsRegistrationEnded", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
            await voting.addVoter(deployerAddress)
            await voting.startProposalsRegistering()
            await voting.endProposalsRegistering()
        })
        it("should revert if the admin tries to start the proposal registering phase", async function () {
            await expect(voting.startProposalsRegistering())
                .to.be.revertedWith("Registering proposals cant be started now")
        })
        it("should revert if the admin tries to end the proposal registering phase", async function () {
            await expect(voting.endProposalsRegistering())
                .to.be.revertedWith("Registering proposals havent started yet")
        })
        it("should start the voting session phase", async function () {
            const tx = await voting.startVotingSession()
            assert.equal(await voting.workflowStatus(), 3)
            expect(tx).to.emit(voting, "WorkflowStatusChange").withArgs(2, 3)
        })
        it("should revert if the admin tries to end the voting session phase", async function () {
            await expect(voting.endVotingSession())
                .to.be.revertedWith("Voting session havent started yet")
        })
        it("should revert if the admin tries to tally votes", async function () {
            await expect(voting.tallyVotes())
                .to.be.revertedWith("Current status is not voting session ended")
        })
        it("should revert if the status is not in RegisteringVoters", async function () {
            await expect(voting.addVoter(voterAddress))
                .to.be.revertedWith("Voters registration is not open yet")
        })
        it("should revert if the status is not in ProposalsRegistrationStarted", async function () {
            await expect(voting.addProposal("proposal1"))
                .to.be.revertedWith("Proposals are not allowed yet")
        })
        it("should revert if the status is not in VotingSessionStarted", async function () {
            await expect(voting.setVote(0))
                .to.be.revertedWith("Voting session havent started yet")
        })
    })

    describe("status in VotingSessionStarted", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
            await voting.addVoter(deployerAddress)
            await voting.startProposalsRegistering()
            await voting.endProposalsRegistering()
            await voting.startVotingSession()
        })
        it("should revert if the admin tries to start the proposal registering phase", async function () {
            await expect(voting.startProposalsRegistering())
                .to.be.revertedWith("Registering proposals cant be started now")
        })
        it("should revert if the admin tries to end the proposal registering phase", async function () {
            await expect(voting.endProposalsRegistering())
                .to.be.revertedWith("Registering proposals havent started yet")
        })
        it("should revert if the admin tries to start the voting session phase", async function () {
            await expect(voting.startVotingSession())
                .to.be.revertedWith("Registering proposals phase is not finished")
        })
        it("should end the voting session phase", async function () {
            const tx = await voting.endVotingSession()
            assert.equal(await voting.workflowStatus(), 4)
            expect(tx).to.emit(voting, "WorkflowStatusChange").withArgs(3, 4)
        })
        it("should revert if the admin tries to tally votes", async function () {
            await expect(voting.tallyVotes())
                .to.be.revertedWith("Current status is not voting session ended")
        })
        it("should revert if the status is not in RegisteringVoters", async function () {
            await expect(voting.addVoter(voterAddress))
                .to.be.revertedWith("Voters registration is not open yet")
        })
        it("should revert if the status is not in ProposalsRegistrationStarted", async function () {
            await expect(voting.addProposal("proposal1"))
                .to.be.revertedWith("Proposals are not allowed yet")
        })
    })

    describe("status in VotingSessionEnded", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
            await voting.addVoter(deployerAddress)
            await voting.startProposalsRegistering()
            await voting.endProposalsRegistering()
            await voting.startVotingSession()
            await voting.endVotingSession()
        })
        it("should revert if the admin tries to start the proposal registering phase", async function () {
            await expect(voting.startProposalsRegistering())
                .to.be.revertedWith("Registering proposals cant be started now")
        })
        it("should revert if the admin tries to end the proposal registering phase", async function () {
            await expect(voting.endProposalsRegistering())
                .to.be.revertedWith("Registering proposals havent started yet")
        })
        it("should revert if the admin tries to start the voting session phase", async function () {
            await expect(voting.startVotingSession())
                .to.be.revertedWith("Registering proposals phase is not finished")
        })
        it("should revert if the admin tries to end the voting session phase", async function () {
            await expect(voting.endVotingSession())
                .to.be.revertedWith("Voting session havent started yet")
        })
        it("should tally the votes and change the workflow status", async function () {
            const tx = await voting.tallyVotes()
            assert.equal(await voting.workflowStatus(), 5)
            expect(tx).to.emit(voting, "WorkflowStatusChange").withArgs(4, 5)
        })
        it("should revert if the status is not in RegisteringVoters", async function () {
            await expect(voting.addVoter(voterAddress))
                .to.be.revertedWith("Voters registration is not open yet")
        })
        it("should revert if the status is not in ProposalsRegistrationStarted", async function () {
            await expect(voting.addProposal("proposal1"))
                .to.be.revertedWith("Proposals are not allowed yet")
        })
        it("should revert if the status is not in VotingSessionStarted", async function () {
            await expect(voting.setVote(0))
                .to.be.revertedWith("Voting session havent started yet")
        })
    })

    describe("status in VotesTallied", async function () {
        beforeEach(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
            await voting.addVoter(deployerAddress)
            await voting.startProposalsRegistering()
            await voting.endProposalsRegistering()
            await voting.startVotingSession()
            await voting.endVotingSession()
            await voting.tallyVotes()
        })
        it("should revert if the admin tries to start the proposal registering phase", async function () {
            await expect(voting.startProposalsRegistering())
                .to.be.revertedWith("Registering proposals cant be started now")
        })
        it("should revert if the admin tries to end the proposal registering phase", async function () {
            await expect(voting.endProposalsRegistering())
                .to.be.revertedWith("Registering proposals havent started yet")
        })
        it("should revert if the admin tries to start the voting session phase", async function () {
            await expect(voting.startVotingSession())
                .to.be.revertedWith("Registering proposals phase is not finished")
        })
        it("should revert if the admin tries to end the voting session phase", async function () {
            await expect(voting.endVotingSession())
                .to.be.revertedWith("Voting session havent started yet")
        })
        it("should revert if the admin tries to tally votes", async function () {
            await expect(voting.tallyVotes())
                .to.be.revertedWith("Current status is not voting session ended")
        })
        it("should revert if the status is not in RegisteringVoters", async function () {
            await expect(voting.addVoter(voterAddress))
                .to.be.revertedWith("Voters registration is not open yet")
        })
        it("should revert if the status is not in ProposalsRegistrationStarted", async function () {
            await expect(voting.addProposal("proposal1"))
                .to.be.revertedWith("Proposals are not allowed yet")
        })
        it("should revert if the status is not in VotingSessionStarted", async function () {
            await expect(voting.setVote(0))
                .to.be.revertedWith("Voting session havent started yet")
        })
    })
})