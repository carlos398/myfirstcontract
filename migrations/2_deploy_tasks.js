const TasksContracts = artifacts.require("TasksContracts");

module.exports = function (deployer) {
  deployer.deploy(TasksContracts);
};
