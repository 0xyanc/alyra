import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { useSigner } from "wagmi";
import Contract from "../../../backend/artifacts/contracts/Jobs.sol/Jobs";

const AddJob = ({ isOpen, onClose }) => {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const { data: signer } = useSigner();
  const toast = useToast();

  const [description, setDescription] = useState(null);
  const [priceInEth, setpriceInEth] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const addJob = async () => {
    try {
      setIsLoading(true);
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      const price = ethers.utils.parseUnits(priceInEth, "ether");
      const transaction = await contract.addJob(description, { value: price });
      transaction.wait(1);

      toast({
        title: "Success",
        description: "Job was successfully created",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (err) {
      if (err.code === 4001) {
        console.error("User rejected the transaction");
        // toast({
        //   title: "Rejected",
        //   description: "Transaction rejected by the user",
        //   status: "failed",
        //   duration: 9000,
        //   isClosable: true,
        // });
      } else {
        console.error(err);
        toast({
          title: "Error",
          description: "Error creating the job",
          status: "failed",
          duration: 9000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a job</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Spinner size="xl" m="auto" />
          ) : (
            <>
              <Text>Description :</Text>
              <Textarea placeholder="The description of the job" onChange={(e) => setDescription(e.target.value)} />
              <Text mt="1rem">Price :</Text>
              <Input
                placeholder="How much you will pay your work in ETH"
                onChange={(e) => setpriceInEth(e.target.value)}
                type="number"
              />
              <Button mt="1rem" colorScheme="green" onClick={() => addJob()}>
                Add
              </Button>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddJob;
