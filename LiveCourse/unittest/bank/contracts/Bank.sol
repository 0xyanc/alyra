// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Bank {
    struct Account {
        uint256 balance;
        uint256 lastPayment;
    }

    mapping(address => Account) private accounts;

    event EtherDeposited(address indexed account, uint256 amount);
    event EtherWithdrawn(address indexed account, uint256 amount);

    function getBalanceAndLastPayment() external view returns (Account memory) {
        return accounts[msg.sender];
    }

    function withdraw(uint256 _amount) external {
        require(
            accounts[msg.sender].balance >= _amount,
            "Not enough ether in your balance."
        );
        accounts[msg.sender].balance -= _amount;
        (bool received, ) = msg.sender.call{value: _amount}("");
        require(received, "Could not send ether");
    }

    function deposit() external payable {
        require(msg.value > 0, "Not enough deposit");
        accounts[msg.sender].balance += msg.value;
        accounts[msg.sender].lastPayment = block.timestamp;
        emit EtherWithdrawn(msg.sender, msg.value);
    }
}
