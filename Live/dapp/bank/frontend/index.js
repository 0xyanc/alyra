import { ethers } from "./ethers.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById('connectButton')
const sendEthersAmount = document.getElementById('sendEthersAmount')
const sendEthers = document.getElementById('sendEthers')
const withdrawEthersAmount = document.getElementById('withdrawEthersAmount')
const withdrawEthers = document.getElementById('withdrawEthers')
const balance = document.getElementById('balance')
let connectedAccount

connectButton.addEventListener('click', async function () {
    if (typeof window.ethereum !== "undefined") {
        const resultAccount = await window.ethereum.request({ method: "eth_requestAccounts" })
        connectedAccount = ethers.utils.getAddress(resultAccount[0])
        connectButton.innerHTML = "Connected with " + connectedAccount.substring(0, 5) + "..." + connectedAccount.substring(connectedAccount.length - 4)
        await showBalance()
    }
    else {
        connectButton.innerHTML = "Please install Metamask!"
    }
})

async function showBalance() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(contractAddress, abi, provider)
        const bal = await contract.getBalanceOfUser(connectedAccount)
        balance.innerHTML = ethers.utils.formatEther(bal.toString())
    }
    catch (e) {
        console.log(e)
    }

}

sendEthers.addEventListener('click', async function () {
    if (typeof window.ethereum !== "undefined" && connectedAccount) {
        //Getter = provider
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)

            const inputNumberByUser = ethers.utils.parseUnits(sendEthersAmount.value, "ether")
            console.log(`${inputNumberByUser}`)
            const transaction = await contract.sendEthers({ value: inputNumberByUser })
            await transaction.wait(1)
            await showBalance()
            // const bal = await contract.getBalanceOfUser()
            // balance.innerHTML = bal.toString()
        }
        catch (e) {
            console.log(e.message)
        }
    }
})

withdrawEthers.addEventListener('click', async function () {
    if (typeof window.ethereum !== "undefined" && connectedAccount) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, abi, signer)

            const inputNumberByUser = ethers.utils.parseUnits(withdrawEthersAmount.value, "ether")
            console.log(`${inputNumberByUser}`)
            const transaction = await contract.withdraw(inputNumberByUser)
            await transaction.wait(1)
            await showBalance()
            // const bal = await contract.getBalanceOfUser()
            // balance.innerHTML = bal.toString()
        }
        catch (e) {
            console.log(e)
        }
    }
})