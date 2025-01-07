// DOM Elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Load tasks from localStorage
document.addEventListener("DOMContentLoaded", loadTasks);

// Add Task
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const task = { text: taskText, completed: false };
    addTaskToDOM(task);
    saveTaskToLocalStorage(task);

    taskInput.value = "";
});

// Add task to the DOM
function addTaskToDOM(task) {
    const taskItem = document.createElement("li");
    if (task.completed) taskItem.classList.add("completed");

    const taskContent = document.createElement("span");
    taskContent.textContent = task.text;
    taskItem.appendChild(taskContent);

    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.addEventListener("click", () => {
        taskItem.classList.toggle("completed");
        task.completed = !task.completed;
        updateTaskInLocalStorage(task.text, task.completed);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
        taskList.removeChild(taskItem);
        deleteTaskFromLocalStorage(task.text);
    });

    taskItem.appendChild(completeButton);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
}

// Save task to localStorage
function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => addTaskToDOM(task));
}

// Get tasks from localStorage
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

// Update task in localStorage
function updateTaskInLocalStorage(taskText, completed) {
    const tasks = getTasksFromLocalStorage();
    const taskIndex = tasks.findIndex((task) => task.text === taskText);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}

// Delete task from localStorage
function deleteTaskFromLocalStorage(taskText) {
    const tasks = getTasksFromLocalStorage();
    const filteredTasks = tasks.filter((task) => task.text !== taskText);
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
}
