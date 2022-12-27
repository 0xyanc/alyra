# Testing the Voting smart contract
The goal is to write the tests of the Voting smart contract provided by Alyra and can be found in *contracts/Voting.sol*

## Structure
The tests are written is the *test/unit* folder and are split into categories in its own file:

- **modifier**: the modifiers onlyOwner and onlyVoter are tested for each function where applicable

- **status**: all the Workflow status changes and requirements are tested here

- **feature**: the features of each function are tested here

- **workflow**: happy path of the expected behaviour of the smart contract

##  Implementation Details
**beforeEach** is used to have a fresh and appropriate state of the smart contract for each test to run correctly.

**before** is used for the workflow rundown test suite so we can see how the smart contract works.

## Commands
Run this command to start the tests:

    yarn hardhat test

Run this command to check the coverage:

    yarn hardhat coverage

The expected output is:
| File  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines | 
|--|--|--|--|--|--|
| contracts/ | 100 | 100 | 100 | 100 | |
| Voting.sol | 100 | 100 | 100 | 100 | |
| All files | 100 | 100 | 100 | 100 | |