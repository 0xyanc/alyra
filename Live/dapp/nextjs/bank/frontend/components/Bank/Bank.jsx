import { Button, Flex, Heading, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useBlockNumber, useProvider, useSigner } from "wagmi";
import Events from "../Events/Events";
import Contract from "../../../backend/artifacts/contracts/Bank.sol/Bank";

const Bank = () => {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const toast = useToast();
  const contract = new ethers.Contract(contractAddress, Contract.abi, provider);
  const { data } = useBalance({
    address: address,
    watch: true,
  });

  const [balance, setBalance] = useState(0);
  const [amountToDeposit, setAmountToDeposit] = useState("");
  const [amountToWithdraw, setAmountToWithdraw] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  useEffect(() => {
    if (isConnected) {
      getBalanceInContract();
    }
  }, [address, isConnected]);

  useEffect(() => {
    loadPreviousEvents();
  }, []);

  useEffect(() => {
    if (eventsLoaded) {
      contract.on("EtherDeposited", (account, amount, event) => {
        console.log(event);
        handleEvent(event.transactionHash, "EtherDeposited", account, amount, new Date());
      });
      contract.on("EtherWithdrawn", (account, amount, event) => {
        handleEvent(event.transactionHash, "EtherWithdrawn", account, amount, new Date());
      });
    }
    return () => contract.removeAllListeners();
  }, [eventsLoaded]);

  const loadPreviousEvents = async () => {
    let filter = {
      address: contractAddress,
    };

    let allEvents = await contract.queryFilter(filter, 0, -1);
    let previousEvents = [];
    for (const event of allEvents) {
      const id = event.transactionHash;
      const name = event.event;
      const account = event.args.addr;
      const amount = event.args.amount;
      const date = new Date((await event.getBlock()).timestamp * 1000);
      previousEvents.unshift({ id, name, account, amount, date });
    }
    setEvents(previousEvents);
    setEventsLoaded(true);
  };

  const handleEvent = (id, name, account, amount, date) => {
    let allEvents = [...events];
    console.log(allEvents);
    const updatedEvents = [{ id, name, account, amount, date }, ...allEvents];
    console.log(updatedEvents);
    setEvents(updatedEvents);
  };

  const getBalanceInContract = async () => {
    if (isConnected) {
      const contract = new ethers.Contract(contractAddress, Contract.abi, provider);
      const currentBalance = await contract.getBalanceOfUser(address);
      const formattedBalance = ethers.utils.formatEther(currentBalance.toString());
      setBalance(formattedBalance);
    }
  };

  const depositEther = async () => {
    setIsLoading(true);
    try {
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      const amount = ethers.utils.parseUnits(amountToDeposit, "ether");
      const transaction = await contract.sendEthers({ value: amount });
      transaction.wait(1);
      getBalanceInContract();
      setAmountToDeposit("");
      showToast("Success!", "Successfully deposited " + amountToDeposit + " Eth to the smart contract", "success");
    } catch (err) {
      if (err.code === 4001) showToast("Transaction rejected", "User rejected the transaction", "error");
      else {
        showToast("Transaction error!", "An error occured", "error");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawEther = async () => {
    setIsLoading(true);
    try {
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      const amount = ethers.utils.parseUnits(amountToWithdraw, "ether");
      const transaction = await contract.withdraw(amount);
      transaction.wait(1);
      //
      getBalanceInContract();
      setAmountToWithdraw("");
      showToast("Success!", "Successfully withdrew " + amountToWithdraw + " Eth from the smart contract", "success");
    } catch (err) {
      if (err.code === 4001) showToast("Transaction rejected", "User rejected the transaction", "error");
      else {
        showToast("Transaction error!", "An error occured", "error");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (title, desc, status) => {
    return toast({
      title: title,
      description: desc,
      status: status,
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      <Flex p="2rem" alignItems="center" direction="column">
        <Heading>Bank DApp</Heading>
        {isConnected ? (
          <>
            <Text>You have {balance} Eth on the smart contract.</Text>
            <Heading mt="2rem">Deposit</Heading>
            <Flex mt="1rem">
              <Input placeholder="Amount in ETH" onChange={(e) => setAmountToDeposit(e.target.value)}></Input>
              <Button colorScheme="purple" onClick={() => depositEther()}>
                Deposit
              </Button>
            </Flex>
            <Heading mt="2rem">Withdraw</Heading>
            <Flex mt="1rem">
              <Input placeholder="Amount in ETH" onChange={(e) => setAmountToWithdraw(e.target.value)}></Input>
              <Button colorScheme="purple" onClick={() => withdrawEther()}>
                Withdraw
              </Button>
            </Flex>
            <Heading mt="2rem">Last Events</Heading>
            <Events events={events} mt="1rem" />
          </>
        ) : (
          <Text mt="1rem">Please connect your wallet to start</Text>
        )}
      </Flex>
    </>
  );
};

export default Bank;
