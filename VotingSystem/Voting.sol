// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

error Voting__WrongStatus();
error Voting__VoterNotRegistered();
error Voting__AlreadyVoted();
error Voting__ProposalDoesNotExist();
error Voting__AlreadyAtLastStep();

/// @author Yannick C.
/// @title A Voting system smart contract
contract Voting is Ownable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }
    struct Proposal {
        string description;
        uint256 voteCount;
    }
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    mapping(address => Voter) public whitelistedVoters;
    Proposal[] public proposals;
    uint256 private winningProposalId;
    WorkflowStatus public status;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);

    modifier onlyStatus(WorkflowStatus _status) {
        if (status != _status) {
            revert Voting__WrongStatus();
        }
        _;
    }
    modifier onlyWhitelisted() {
        if (!whitelistedVoters[msg.sender].isRegistered) {
            revert Voting__VoterNotRegistered();
        }
        _;
    }

    /// Go to next WorkflowStatusChange status
    function goToNextStep() public onlyOwner {
        if (status == type(WorkflowStatus).max) {
            revert Voting__AlreadyAtLastStep();
        }
        WorkflowStatus previousStatus = status;
        status = WorkflowStatus(uint256(status) + 1);
        emit WorkflowStatusChange(previousStatus, status);
    }

    /// Whitelist a Voter
    /// @param _voter Voter to add to the whitelist
    function registerVoter(address _voter)
        external
        onlyOwner
        onlyStatus(WorkflowStatus.RegisteringVoters)
    {
        whitelistedVoters[_voter].isRegistered = true;
        emit VoterRegistered(_voter);
    }

    /// Voter can register their proposals
    /// @param _description description of the proposal
    function registerProposal(string memory _description)
        external
        onlyWhitelisted
        onlyStatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        Proposal memory proposal = Proposal(_description, 0);
        uint256 proposalId = proposals.length;
        proposals.push(proposal);
        emit ProposalRegistered(proposalId);
    }

    /// Voters vote for their preferred proposal
    /// @param _proposalId id of the proposal to vote for
    function voteForProposal(uint256 _proposalId)
        external
        onlyWhitelisted
        onlyStatus(WorkflowStatus.VotingSessionStarted)
    {
        if (_proposalId >= proposals.length) {
            revert Voting__ProposalDoesNotExist();
        }
        if (whitelistedVoters[msg.sender].hasVoted) {
            revert Voting__AlreadyVoted();
        }
        proposals[_proposalId].voteCount++;
        whitelistedVoters[msg.sender].hasVoted = true;
        whitelistedVoters[msg.sender].votedProposalId = _proposalId;
        emit Voted(msg.sender, _proposalId);
    }

    /// Admin counts the votes
    function countVotes()
        external
        onlyOwner
        onlyStatus(WorkflowStatus.VotingSessionEnded)
    {
        uint256 tempWinningId;
        for (uint256 currentId = 1; currentId < proposals.length; currentId++) {
            if (
                proposals[currentId].voteCount >
                proposals[currentId - 1].voteCount
            ) {
                tempWinningId = currentId;
            }
        }
        winningProposalId = tempWinningId;
        goToNextStep();
    }

    /// Get the winning proposal
    /// @return the winning proposal
    function getWinner()
        external
        view
        onlyStatus(WorkflowStatus.VotesTallied)
        returns (Proposal memory)
    {
        return proposals[winningProposalId];
    }
}
