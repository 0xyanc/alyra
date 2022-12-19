const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Units tests of AlyraIsERC20 smart contract", function () {
        let accounts;
        let AlyraIsERC20;
        before(async () => {
            accounts = await ethers.getSigners() 
            deployer = accounts[0]
        })

        describe("Deployment", async function() {
            it("should deploy the smart contract", async function() {
                await deployments.fixture(["main"])
                AlyraIsERC20 = await ethers.getContract("AlyraIsERC20")
            })
            it("should have the correct balance for the owner", async function() {
                let balanceOfOwner = await AlyraIsERC20.balanceOf(deployer.getAddress());
                assert.equal(balanceOfOwner.toString(), 1000000 * 10**18);
            })
            it("should have the correct name and symbol", async function() {
                let name = await AlyraIsERC20.name();
                let symbol = await AlyraIsERC20.symbol();
                assert.equal(name, "Alyra");
                assert.equal(symbol, "AlToken");
            })
        })

        describe("Mint", async function() {
            it("should mint tokens to the specified address", async function() {
                let recipient = accounts[1].address
                await AlyraIsERC20.mint(recipient, 2222);
                let balance = await AlyraIsERC20.balanceOf(recipient);
                assert.equal(balance.toString(), "2222");
            })
            it("should revert because it's not the owner", async function() {
                await expect(
                    AlyraIsERC20.connect(accounts[1]).mint(deployer.getAddress(), 2222))
                    .to.be.revertedWith("Ownable: caller is not the owner");
            })
        })
    })