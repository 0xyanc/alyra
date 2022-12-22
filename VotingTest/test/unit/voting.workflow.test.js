const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

if (!developmentChains.includes(network.name)) {
    describe.skip
    return
}
describe("Unit tests of Voting smart contract: happy path workflow", function () {
    let accounts
    let voting
    before(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        deployerAddress = await deployer.getAddress()
        voter1 = accounts[1]
        voterAddress1 = await voter.getAddress()
        voter2 = accounts[2]
        voterAddress2 = await voter2.getAddress()
    })

    describe("Workflow", async function () {
        before(async () => {
            await deployments.fixture(["voting"])
            voting = await ethers.getContract("Voting")
        })
        it("should registers voters to the list", async function () {
            const voterAdd1 = await voting.addVoter(voterAddress1)
            const voterAdd2 = await voting.addVoter(voterAddress2)

            newVoter1 = await voting.connect(voter1).getVoter(voterAddress1)
            assert(newVoter1.isRegistered === true)
            expect(voterAdd1).to.emit(voting, "VoterRegistered").withArgs(voterAddress1)

            newVoter2 = await voting.connect(voter2).getVoter(voterAddress2)
            assert(newVoter2.isRegistered === true)
            expect(voterAdd2).to.emit(voting, "VoterRegistered").withArgs(voterAddress2)
        })
        it("should change status to ProposalsRegistrationStarted=1 and add a GENESIS proposal if the admin tries to start the proposal registering phase ", async function () {
            const tx = await voting.startProposalsRegistering()
            assert.equal(await voting.workflowStatus(), 1)
            const genesis = await voting.connect(voter1).getOneProposal(0)
            assert.equal(genesis.description, "GENESIS")
            assert.equal(genesis.voteCount, 0)
            expect(tx).to.emit(voting, "WorkflowStatusChange").withArgs(0, 1)
        })
        it("should add proposals by registered voters", async function () {
            const addProp1 = await voting.connect(voter1).addProposal("bitcoin")
            const addProp2 = await voting.connect(voter2).addProposal("ethereum")

            const prop1 = await voting.connect(voter1).getOneProposal(1)
            assert(prop1.description === "bitcoin")
            expect(addProp1).to.emit(voting, "ProposalRegistered").withArgs(1)

            const prop2 = await voting.connect(voter).getOneProposal(2)
            assert(prop2.description === "ethereum")
            expect(addProp2).to.emit(voting, "ProposalRegistered").withArgs(2)
        })
        it("should end the proposal registering phase", async function () {
            const tx = await voting.endProposalsRegistering()
            assert.equal(await voting.workflowStatus(), 2)
            expect(tx).to.emit(voting, "WorkflowStatusChange").withArgs(1, 2)
        })
        it("should start the voting session phase", async function () {
            const tx = await voting.startVotingSession()
            assert.equal(await voting.workflowStatus(), 3)
            expect(tx).to.emit(voting, "WorkflowStatusChange").withArgs(2, 3)
        })
        it("should update vote count and the voters info and emit the event Voted(address, uint)", async function () {
            const tx1 = await voting.connect(voter1).setVote(2)
            const tx2 = await voting.connect(voter2).setVote(2)

            const registeredVoter1 = await voting.connect(voter1).getVoter(voterAddress1)
            assert.equal(registeredVoter1.hasVoted, true)
            assert.equal(registeredVoter1.votedProposalId, 2)
            const registeredVoter2 = await voting.connect(voter1).getVoter(voterAddress2)
            assert.equal(registeredVoter2.hasVoted, true)
            assert.equal(registeredVoter2.votedProposalId, 2)

            proposal = await voting.connect(voter).getOneProposal(2)
            assert.equal(proposal.voteCount, 2)

            expect(tx1).to.emit(voting, "Voted").withArgs(voterAddress1, 2)
            expect(tx2).to.emit(voting, "Voted").withArgs(voterAddress2, 2)
        })
        it("should end the voting session phase", async function () {
            const tx = await voting.endVotingSession()
            assert.equal(await voting.workflowStatus(), 4)
            expect(tx).to.emit(voting, "WorkflowStatusChange").withArgs(3, 4)
        })
        it("should pick the winning proposal", async function () {
            const tx = await voting.tallyVotes()

            const winningProposalId = await voting.winningProposalID()
            assert.equal(winningProposalId, 2)
            assert.equal(await voting.workflowStatus(), 5)
            expect(tx).to.emit(voting, "WorkflowStatusChange").withArgs(4, 5)
        })
    })

})