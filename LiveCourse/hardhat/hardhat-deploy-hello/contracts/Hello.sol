// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Hello is Ownable {
    string private name;

    constructor(string memory _name) {
        name = _name;
    }

    function sayHello() external view returns (string memory) {
        return string.concat("Hello ", name);
    }

    function getName() external view returns (string memory) {
        return name;
    }

    function setName(string memory _name) external onlyOwner {
        name = _name;
    }
}
