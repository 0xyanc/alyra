// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

error Spa__AlreadyAdopted();

contract Spa {
    struct Animal {
        string race;
        uint256 size;
        uint256 age;
        bool isAdopted;
    }

    Animal[] animals;
    mapping(address => uint256) public adoption;

    event AnimalAdded(uint256 indexed id);
    event AnimalAdopted(uint256 indexed _id, address indexed _addr);

    modifier mustExists(uint256 _id) {
        require(_id < animals.length, "This animal does not exist");
        _;
    }

    //CRUD
    function add(
        string memory _race,
        uint256 _size,
        uint256 _age
    ) external {
        animals.push(Animal(_race, _size, _age, false));
        emit AnimalAdded(animals.length - 1);
    }

    function get(uint256 _id)
        external
        view
        mustExists(_id)
        returns (Animal memory)
    {
        return animals[_id];
    }

    function set(
        uint256 _id,
        string memory _race,
        uint256 _size,
        uint256 _age
    ) external mustExists(_id) {
        animals[_id] = Animal(_race, _size, _age, false);
    }

    function remove(uint256 _id) external mustExists(_id) {
        delete animals[_id];
    }

    function adopt(uint256 _id) external mustExists(_id) {
        if (animals[_id].isAdopted) {
            revert Spa__AlreadyAdopted();
        }
        animals[_id].isAdopted = true;
        adoption[msg.sender] = _id;
        emit AnimalAdopted(_id, msg.sender);
    }

    function getAdoption(address _addr) external view returns (Animal memory) {
        return animals[adoption[_addr]];
    }

    /// Adopt a non adopted animal is the criterias match
    function adoptIfMax(
        string memory _race,
        uint256 _maxSize,
        uint256 _maxAge
    ) external returns (bool) {
        bytes32 raceForComparison = keccak256(abi.encodePacked(_race));
        for (uint256 animalIndex; animalIndex < animals.length; animalIndex++) {
            if (
                animals[animalIndex].size <= _maxSize &&
                animals[animalIndex].age <= _maxAge &&
                !animals[animalIndex].isAdopted &&
                keccak256(abi.encodePacked(animals[animalIndex].race)) ==
                raceForComparison
            ) {
                animals[animalIndex].isAdopted = true;
                adoption[msg.sender] = animalIndex;
                emit AnimalAdopted(animalIndex, msg.sender);
                return true;
            }
        }
        return false;
    }
}
