// script.js
document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('add-task-btn').addEventListener('click', addTask);

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    if (taskText === '') return;

    const taskItem = createTaskElement(taskText);
    document.getElementById('task-list').appendChild(taskItem);
    saveTaskToLocalStorage(taskText);

    taskInput.value = '';
}

function createTaskElement(taskText, completed = false) {
    const taskItem = document.createElement('li');
    taskItem.className = `task-item${completed ? ' completed' : ''}`;
    taskItem.innerHTML = `
        <span>${taskText}</span>
        <div class="task-actions">
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
            <button class="toggle">${completed ? 'Undo' : 'Complete'}</button>
        </div>
    `;

    taskItem.querySelector('.edit').addEventListener('click', () => editTask(taskItem));
    taskItem.querySelector('.delete').addEventListener('click', () => deleteTask(taskItem));
    taskItem.querySelector('.toggle').addEventListener('click', () => toggleTaskCompletion(taskItem));

    return taskItem;
}

function editTask(taskItem) {
    const taskText = prompt('Edit your task', taskItem.firstChild.textContent.trim());
    if (taskText !== null) {
        taskItem.firstChild.textContent = taskText.trim();
        updateLocalStorage();
    }
}

function deleteTask(taskItem) {
    taskItem.remove();
    updateLocalStorage();
}

function toggleTaskCompletion(taskItem) {
    taskItem.classList.toggle('completed');
    taskItem.querySelector('.toggle').textContent = taskItem.classList.contains('completed') ? 'Undo' : 'Complete';
    updateLocalStorage();
}

function saveTaskToLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.completed);
        document.getElementById('task-list').appendChild(taskItem);
    });
}

function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(taskItem => {
        tasks.push({
            text: taskItem.firstChild.textContent.trim(),
            completed: taskItem.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
