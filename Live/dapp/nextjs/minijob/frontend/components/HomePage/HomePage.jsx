import { Grid, Heading, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useBlockNumber, useProvider } from "wagmi";
import EmptyJobs from "../EmptyJobs/EmptyJobs";
import Job from "../Job/Job";
import Contract from "../../../backend/artifacts/contracts/Jobs.sol/Jobs";

const HomePage = () => {
  const JOB_ADDED = "JobAdded";
  const JOB_TAKEN = "JobTaken";
  const JOB_IS_FINISHED_AND_PAID = "JobIsFinishedAndPaid";
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const provider = useProvider();
  const { address, isConnected } = useAccount();
  const contract = new ethers.Contract(contractAddress, Contract.abi, provider);

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobsLoaded, setJobsLoaded] = useState(null);

  useEffect(() => {
    loadAllJobs();
  }, []);

  useEffect(() => {
    if (jobsLoaded) {
      contract.on(JOB_ADDED, (author, description, price, jobId, isFinished) => {
        console.log("JOB ADDED EVENT");
        const id = jobId.toString();
        console.log(jobs);
        let updatedJobs = [...jobs, { id, author, description, worker: null, price, isFinished }];
        console.log(updatedJobs);
        // updatedJobs.push({ id, author, description, worker: null, price, isFinished });
        // console.log(updatedJobs);
        setJobs(updatedJobs);
        console.log(jobs);
      });
      contract.on(JOB_TAKEN, (worker, jobId) => {
        console.log("JOB TAKEN EVENT");
        console.log(jobs);
        const id = jobId.toString();
        const jobsCopy = [...jobs];
        jobs[id].worker = worker;
        console.log(jobsCopy);
        setJobs(jobsCopy);
        console.log(jobs);
      });
      contract.on(JOB_IS_FINISHED_AND_PAID, (author, worker, jobId, pricePaid) => {
        console.log("JOB FINISHED EVENT");
        const id = jobId.toString();
        const jobsCopy = [...jobs];
        jobsCopy[id].isFinished = true;
        setJobs(jobsCopy);
      });
    }
    return () => contract.removeAllListeners();
  }, [jobsLoaded]);

  const loadAllJobs = async () => {
    let filter = {
      address: contractAddress,
    };

    let allEvents = await contract.queryFilter(filter, 0, -1);
    let jobList = [];
    for await (const event of allEvents) {
      const name = event.event;
      if (name === JOB_ADDED) {
        const author = event.args[0];
        const description = event.args[1];
        const price = event.args[2];
        const id = event.args[3].toString();
        const isFinished = event.args[4];
        jobList.push({ id, author, description, worker: null, price, isFinished });
      } else if (name === JOB_TAKEN) {
        const worker = event.args[0];
        const id = event.args[1].toString();
        jobList[id].worker = worker;
      } else if (name === JOB_IS_FINISHED_AND_PAID) {
        const id = event.args[2].toString();
        jobList[id].isFinished = true;
      }
    }
    console.log(jobList);
    setJobs(jobList);
    setJobsLoaded(true);
  };

  return (
    <>
      {isConnected ? (
        jobs.length === 0 ? (
          <EmptyJobs />
        ) : (
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {jobs.map((job) => {
              return <Job job={job} key={job.id} />;
            })}
          </Grid>
        )
      ) : (
        <Heading align="center">Please connect your wallet to start.</Heading>
      )}
    </>
  );
};

export default HomePage;
