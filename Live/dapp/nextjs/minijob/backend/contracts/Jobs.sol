// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

///@title A mini job smart contract
///@author Yannick C.
contract Jobs {
    struct Job {
        address author;
        address worker;
        string description;
        uint price;
        bool isFinished;
    }

    Job[] jobs;

    event JobAdded(address indexed author, string description, uint price, uint id, bool isFinished);
    event JobTaken(address indexed worker, uint id);
    event JobIsFinishedAndPaid(address indexed author, address indexed worker, uint id, uint pricePaid);

    ///@notice Allows to add a new job
    ///@param _description the complete description of the job
    function addJob(string calldata _description) external payable {
        Job memory job;
        job.author = msg.sender;
        job.description = _description;
        job.price = msg.value;

        jobs.push(job);
        emit JobAdded(msg.sender, _description, msg.value, jobs.length - 1, false);
    }

    ///@notice Allows to take the job
    ///@param _id the index of the job in the jobs array
    function takeJob(uint _id) external {
        require(msg.sender != jobs[_id].author, "The author cannot take the job");
        require(jobs[_id].worker == address(0), "Job already taken");
        jobs[_id].worker = msg.sender;

        emit JobTaken(msg.sender, _id);
    }

    ///@notice Allows to end the job and to pay the worker
    ///@param _id the index of the job in the jobs array
    function setIsFinishedAndPay(uint _id)  external {
        require(jobs[_id].worker != address(0), "Job not taken yet");
        require(msg.sender == jobs[_id].author, "You are not the author of this job");
        require(!jobs[_id].isFinished, "This job is already finished and paid");
        jobs[_id].isFinished = true;
        (bool success,) = jobs[_id].worker.call{value: jobs[_id].price}("");
        require(success, "Failed to send Ether");

        emit JobIsFinishedAndPaid(jobs[_id].author, jobs[_id].worker, _id, jobs[_id].price);
    }
}
