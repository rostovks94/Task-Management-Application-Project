document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const activeTaskList = document.getElementById('activeTaskList');
    const completedTaskList = document.getElementById('completedTaskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    renderTasks();
    renderCompletedTasks();
    renderAllTasks();

    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const taskIndex = taskForm.getAttribute('data-task-index');

        if (taskIndex !== null && taskIndex !== "") {
            tasks[taskIndex] = { title, description, dueDate, completed: false };
        } else {
            tasks.push({ title, description, dueDate, completed: false });
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        renderCompletedTasks();
        renderAllTasks();
        taskForm.reset();
        taskForm.removeAttribute('data-task-index');
        $('#taskModal').modal('hide');
    });

    function renderTasks() {
        activeTaskList.innerHTML = '';

        tasks.forEach((task, index) => {
            const card = createTaskCard(task, index);
            if (!task.completed) {
                activeTaskList.appendChild(card);
            }
        });
    }

    function renderCompletedTasks() {
        completedTaskList.innerHTML = '';

        completedTasks.forEach((task, index) => {
            const card = createTaskCard(task, index);
            completedTaskList.appendChild(card);
        });
    }

    function renderAllTasks() {
        taskList.innerHTML = '';

        tasks.forEach((task, index) => {
            const card = createTaskCard(task, index);
            taskList.appendChild(card);
        });

        completedTasks.forEach((task, index) => {
            const card = createTaskCard(task, index, true);
            taskList.appendChild(card);
        });
    }

    function createTaskCard(task, index, isCompleted = false) {
        const card = document.createElement('div');
        card.className = 'col-sm-4';
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const timeDifference = dueDate - today;
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

        card.innerHTML = `
            <div class="card ${task.completed ? 'card-completed' : ''}">
                <div class="card-body">
                    <h5 class="card-title">${task.title} <span class="badge ${task.completed ? 'badge-secondary' : 'badge-primary'}">${task.completed ? 'Completed' : 'Active'}</span></h5>
                    <p class="card-text">${task.description}</p>
                    <p class="card-text ${daysDifference <= 1 && !task.completed ? 'text-danger' : ''}"><small class="text-muted">Due date: <span class="${daysDifference <= 1 && !task.completed ? 'text-danger' : ''}">${task.dueDate}</span></small></p>
                    <button class="btn btn-primary" onclick="editTask(${index}, ${isCompleted})">View Details</button>
                    <button class="btn btn-success" onclick="completeTask(${index})">Complete</button>
                    <button class="btn btn-danger" onclick="deleteTask(${index}, ${isCompleted})">Delete Task</button>
                </div>
            </div>
        `;
        return card;
    }

    window.editTask = function (index, isCompleted) {
        const task = isCompleted ? completedTasks[index] : tasks[index];
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskDueDate').value = task.dueDate;
        taskForm.setAttribute('data-task-index', index);
        $('#taskModal').modal('show');
    }

    window.completeTask = function (index) {
        tasks[index].completed = true;
        completedTasks.push(tasks[index]);
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        renderTasks();
        renderCompletedTasks();
        renderAllTasks();
    }

    window.deleteTask = function (index, isCompleted) {
        if (isCompleted) {
            completedTasks.splice(index, 1);
            localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
            renderCompletedTasks();
        } else {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        }
        renderAllTasks();
    }

    window.returnTask = function (index) {
        const task = completedTasks[index];
        task.completed = false;
        tasks.push(task);
        completedTasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
        renderTasks();
        renderCompletedTasks();
        renderAllTasks();
    }
});