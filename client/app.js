
App = {

    contracts: {},
    init: async () => {
        console.log('loaded')
        await App.loadEthereum()
        await App.loadAccount()
        await App.loadContracts()
        App.reder()
        await App.renderTasks()
    },

    loadEthereum: async () => {

        if (window.ethereum) {
            App.web3Provider = window.ethereum
            await window.ethereum.request({method: 'eth_requestAccounts'})
        } 
        else if (window.web3) {
            web3 = new web3(window.web3.currentProvider)
        }
        else {
            alert('You need to install Metamask in your browser')
        }
    },

    loadAccount: async () =>{
        const acount = await window.ethereum.request({method: 'eth_requestAccounts'})
        App.account = acount[0]
    },

    loadContracts: async () => {
        const res = await fetch("TasksContracts.json")
        const tasksContractJSON = await res.json()
        
        App.contracts.TasksContracts = TruffleContract(tasksContractJSON)

        App.contracts.TasksContracts.setProvider(App.web3Provider)

        App.TasksContracts = await App.contracts.TasksContracts.deployed()
    },

    reder: () => {
        document.getElementById('account').innerText = App.account
    },

    renderTasks: async () => {
        const taskcounter = await App.TasksContracts.taskCounter()
        const taskCounterNumber = taskcounter.toNumber()

        let html = ''
        
        for (let i = 1; i <= taskCounterNumber; i++) {
            const task = await App.TasksContracts.tasks(i)
            const taskID = task[0]
            const taskTitle = task[1]
            const taskDescription = task[2]
            const taskDone = task[3]
            const taskCreated = task[4] 

            let taskElement = `
            <div class="card bg-dark my-2">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h3>${taskTitle}</h3>
                    <div class="form-check form-switch">
                        <input class="form-check-input" data-id="${taskID}" type="checkbox" ${taskDone && "checked"} onchange="App.toggleDone(this)"/>
                    </div>
                </div>
                <div class="card-body">
                    <p>${taskDescription}</p>
                    <h6 class="text-muted">This task was created at ${new Date(taskCreated * 1000).toLocaleString()}</h6>
                </div>
            </div>`

            html += taskElement;
        }

        document.querySelector('#taskList').innerHTML = html;
    },

    createTask: async (title, description) => {
        const result = await App.TasksContracts.createTask(title, description, {
            from: App.account
        });
        console.log(result.logs[0].args)
    },

    toggleDone: async (element) => {
        const taskID = element.dataset.id;
        await App.TasksContracts.toggleDone(taskID, {
            from: App.account
        })

        window.location.reload()
    }

}
