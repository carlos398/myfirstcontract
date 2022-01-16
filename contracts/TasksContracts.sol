// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.6;

contract TasksContracts {

    uint public taskCounter = 0;

    constructor () {
        createTask("my first task", "i need to do someting");
    }

    event TaskCreated(
        uint id,
        string title,
        string description,
        bool done,
        uint createdAt
    );

    struct Task {
        uint id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    mapping (uint256 => Task ) public tasks;

    function createTask(string memory _title, string memory _description) public {
        taskCounter++;
        tasks[taskCounter] = Task(taskCounter, _title, _description, false, block.timestamp);
        emit TaskCreated(taskCounter, _title, _description, false, block.timestamp);
    }

    function toggleDone(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
    }
    
}