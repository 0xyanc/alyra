const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = async(deployer, network, accounts) => {
    console.log('**** DEPLOYING CONTRACT ****');
    await deployer.deploy(SimpleStorage, 44, {from: accounts[0], value: 1000});
    console.log(`**** END **** `);
    let instance = await SimpleStorage.deployed();
    let num = await instance.retrieve();
    console.log(`**** Stored number: ${num} ****`);
    await instance.store(555);
    num = await instance.retrieve();
    console.log(`**** Stored number: ${num} ****`);
}