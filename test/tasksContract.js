const TasksContract = artifacts.require("TasksContracts");

contract("TasksContract", () => {
  before(async () => {
    this.tasksContract = await TasksContract.deployed();
  });

  it("migrate deployed succesfully", async () => {
    const address = this.tasksContract.address;

    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  it("get Tasks List", async () => {
    const tasksCounter = await this.tasksContract.taskCounter();
    const task = await this.tasksContract.tasks(tasksCounter);

    assert.equal(task.id.toNumber(), tasksCounter);
    assert.equal(task.title, "my first task");
    assert.equal(task.description, "i need to do someting");
    assert.equal(task.done, false);
    assert.equal(tasksCounter, 1);
  });

  it("task created succesfully", async () => {
    const result = await this.tasksContract.createTask(
      "Some task",
      "description two"
    );
    const taskevent = result.logs[0].args;
    const tasksCounter = await this.tasksContract.taskCounter();

    assert.equal(tasksCounter, 2);
    assert.equal(taskevent.id.toNumber(), 2);
    assert.equal(taskevent.title, "Some task");
    assert.equal(taskevent.description, "description two");
    assert.equal(taskevent.done, false);
  });

  it("task toggle done", async () => {
    const result = await this.tasksContract.toggleDone(1);
    const taskEvent = result.logs[0].args;
    const task = await this.tasksContract.tasks(1);

    assert.equal(task.done, true);
    assert.equal(taskEvent.done, true);
    assert.equal(taskEvent.id, 1);
  });
});
