const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { BigNumber } = require("ethers")

if (!developmentChains.includes(network.name)) {
    describe.skip
    return
}
describe("Units tests of Spa smart contract", function () {
    let accounts
    let spa
    before(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
    })

    describe("Add", async function () {
        beforeEach(async () => {
            await deployments.fixture(["spa"])
            spa = await ethers.getContract("Spa")
        })

        it("should add a non adopted animal with the description", async function () {
            await spa.add("labrador", 100, 2)
            const animal = await spa.get(0);
            assertAnimal(animal, "labrador", 100, 2, false)
        })
        it("should add the animal and emit the AnimalAdded event", async function () {
            const added = await spa.add("doberman", 200, 4)
            expect(added).to.emit(spa, "AnimalAdded").withArgs(1)
        })
    })

    describe("Get", async function () {
        beforeEach(async () => {
            await deployments.fixture(["spa"])
            spa = await ethers.getContract("Spa")
            await spa.add("labrador", 100, 2)
        })
        it("should the animal with the correct info", async function () {
            const animal = await spa.get(0)
            assertAnimal(animal, "labrador", 100, 2, false)
        })
        it("should revert if the animal id does not exist", async function () {
            await expect(spa.get(1)).to.be.revertedWith("This animal does not exist")
        })
    })

    describe("Set", async function () {
        beforeEach(async () => {
            await deployments.fixture(["spa"])
            spa = await ethers.getContract("Spa")
            await spa.add("labrador", 100, 2)
        })
        it("should update the animal info", async function () {
            await spa.set(0, "doberman", 200, 4)
            const animal = await spa.get(0)
            assertAnimal(animal, "doberman", 200, 4, false)
        })
        it("should revert if the animal id does not exist", async function () {
            await expect(spa.set(1, "doberman", 200, 4)).to.be.revertedWith("This animal does not exist")
        })
    })

    describe("Remove", async function () {
        beforeEach(async () => {
            await deployments.fixture(["spa"])
            spa = await ethers.getContract("Spa")
            await spa.add("labrador", 100, 2)
            await spa.add("doberman", 200, 4)
        })
        it("should remove the animal info from the list", async function () {
            await spa.remove(0);
            const animal = await spa.get(0)
            assertAnimal(animal, "", 0, 0, false)
        })
        it("should revert if the animal id does not exist", async function () {
            await expect(spa.remove(2)).to.be.revertedWith("This animal does not exist")
        })
    })

    describe("Adopt", async function () {
        beforeEach(async () => {
            await deployments.fixture(["spa"])
            spa = await ethers.getContract("Spa")
            await spa.add("labrador", 100, 2)
            await spa.add("doberman", 200, 4)
        })
        it("should change the animal isAdopted to true and populate the adoption mapping", async function () {
            const adoption = await spa.adopt(1)
            const deployerAddress = await deployer.getAddress()
            const animal = await spa.get(1)
            assert.equal(animal.isAdopted, true)

            const adoptionAnimal = await spa.adoption(deployerAddress)
            assert.equal(adoptionAnimal, 1)

            await expect(adoption).to.emit(spa, "AnimalAdopted").withArgs(1, deployerAddress)
        })
        it("should revert if the animal does not exist", async function () {
            await expect(spa.adopt(2)).to.be.revertedWith("This animal does not exist")
        })
        it("should revert if the animal is already adopted", async function () {
            await spa.adopt(1)
            await expect(spa.adopt(1)).to.be.revertedWithCustomError(spa, "Spa__AlreadyAdopted")
        })
    })

    describe("Get Adoption", async function () {
        beforeEach(async () => {
            await deployments.fixture(["spa"])
            spa = await ethers.getContract("Spa")
            await spa.add("labrador", 100, 2)
            await spa.adopt(0)
        })
        it("should the adopted animal with the correct info", async function () {
            const animal = await spa.getAdoption(await deployer.getAddress())
            assertAnimal(animal, "labrador", 100, 2, true)
        })
    })

    describe("Adopt If Max ", async function () {
        beforeEach(async () => {
            await deployments.fixture(["spa"])
            spa = await ethers.getContract("Spa")
            await spa.add("labrador", 100, 5)
            await spa.add("doberman", 200, 4)
            await spa.add("chihuahua", 50, 6)
            await spa.adopt(0)
        })
        it("should match the criterias, return true and set the found animal isAdopted to true", async function () {
            const deployerAddress = await deployer.getAddress()

            const adopted = await spa.adoptIfMax("doberman", 250, 5)
            assert.equal(adopted.true)

            const animal = await spa.get(1)
            assertAnimal(animal, "doberman", 200, 4, true)

            const adoptionAnimal = await spa.adoption(deployerAddress)
            assert.equal(adoptionAnimal, 1)

            expect(adopted).to.emit(spa, "AnimalAdopted").withArgs(1, deployerAddress)
        })
        it("should not match the size criteria and return false", async function () {
            const adopted = await spa.adoptIfMax("doberman", 199, 5)
            assert.equal(adopted.false)
        })
        it("should not match the age criteria and return false", async function () {
            const adopted = await spa.adoptIfMax("doberman", 200, 2)
            assert.equal(adopted.false)
        })
        it("should not match the race criteria and return false", async function () {
            const adopted = await spa.adoptIfMax("corgi", 200, 2)
            assert.equal(adopted.false)
        })
        it("should match the criteria and return false because already adopted", async function () {
            const adopted = await spa.adoptIfMax("labrador", 199, 5)
            assert.equal(adopted.false)
        })
    })

    describe("Workflow ", async function () {
        before(async () => {
            await deployments.fixture(["spa"])
            spa = await ethers.getContract("Spa")
        })
        it("should add animals to the list", async function () {
            await spa.add("labrador", 100, 2)
            await spa.add("doberman", 200, 4)
            await spa.add("corgi", 50, 5)
            const lab = await spa.get(0);
            assertAnimal(lab, "labrador", 100, 2, false)
            const dob = await spa.get(1);
            assertAnimal(dob, "doberman", 200, 4, false)
            const corgi = await spa.get(2);
            assertAnimal(corgi, "corgi", 50, 5, false)
        })
        it("should update the animal info", async function () {
            await spa.set(1, "doberman", 250, 10)
            const animal = await spa.get(1)
            assertAnimal(animal, "doberman", 250, 10, false)
        })
        it("should adopt the first animal", async function () {
            const adopting = await spa.adopt(1)
            const deployerAddress = await deployer.getAddress()
            const animal = await spa.get(1)
            assert.equal(animal.isAdopted, true)
            const adoptedAnimal = await spa.getAdoption(deployerAddress)
            assertAnimal(adoptedAnimal, "doberman", 250, 10, true)
            expect(adopting).to.emit("AnimalAdopted").withArgs(1, deployerAddress)
        })
        it("should adopt a small corgi", async function () {
            const adoptingAddress = await accounts[1].getAddress()
            const adopting = await spa.connect(accounts[1]).adoptIfMax("corgi", 50, 5)
            const animal = await spa.get(2)
            assert.equal(animal.isAdopted, true)
            const adoptedAnimal = await spa.getAdoption(adoptingAddress)
            assertAnimal(adoptedAnimal, "corgi", 50, 5, true)
            expect(adopting).to.emit("AnimalAdopted").withArgs(2, adoptingAddress)
        })
    })

})

function assertAnimal(animal, race, size, age, isAdopted) {
    assert.equal(animal.race, race)
    assert.equal(animal.size, size)
    assert.equal(animal.age, age)
    assert.equal(animal.isAdopted, isAdopted)
}
