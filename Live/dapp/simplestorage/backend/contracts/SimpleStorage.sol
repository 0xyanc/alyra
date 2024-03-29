// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

/**
 * @title SimpleStorage
 * @dev Store & retrieve value in a variable
 */
contract SimpleStorage {

    uint256 number;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public {
        number = num;
    }

    /**
     * @dev Return value 
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256){
        return number;
    }
}