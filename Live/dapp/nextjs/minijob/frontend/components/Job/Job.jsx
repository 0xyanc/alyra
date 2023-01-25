import { Button, Container, GridItem, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useAccount, useSigner } from "wagmi";
import Contract from "../../../backend/artifacts/contracts/Jobs.sol/Jobs";

const Job = ({ job }) => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const payWorker = async (jobId) => {
    try {
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      const transaction = await contract.setIsFinishedAndPay(jobId);
      transaction.wait(1);
    } catch (err) {
      if (err.code === 4001) {
        console.error("User rejected the transaction");
      } else {
        console.error(err);
      }
    }
  };

  const takeJob = async (jobId) => {
    try {
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      const transaction = await contract.takeJob(jobId);
      transaction.wait(1);
    } catch (err) {
      if (err.code === 4001) {
        console.error("User rejected the transaction");
      } else {
        console.error(err);
      }
    }
  };

  return (
    <GridItem w="100%">
      <Container borderWidth="1px" borderRadius="lg" overflow="hidden" p="1rem">
        <Text>Author: {job.author}</Text>
        <Text mt="1rem" mb="1rem">
          Description: {job.description}
        </Text>

        {job.isFinished ? (
          // job is finished
          <Text as="b" color="red">
            Job is finished.
          </Text>
        ) : job.worker ? (
          // job is not finished but is taken
          address !== job.author ? (
            // job is taken and user is not the author
            <Text as="b" color="green">
              Job taken.
            </Text>
          ) : (
            // job is taken and user is the author
            <Button colorScheme="red" onClick={() => payWorker(job.id)}>
              Pay
            </Button>
          )
        ) : address !== job.author ? (
          // job is open to be taken
          <Button colorScheme="green" onClick={() => takeJob(job.id)}>
            Work
          </Button>
        ) : (
          // job is open to be taken but user is the author
          <br />
        )}
      </Container>
    </GridItem>
  );
};

export default Job;
