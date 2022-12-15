// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

contract Bank {
    mapping(address => uint256) balances;

    function withdraw() external {
        require(balances[msg.sender] > 0, "You don't have any ether");
        balances[msg.sender] = 0;
        (bool received, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(received, "Could not send ether");
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }
}
