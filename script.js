// DOM Elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskCategory = document.getElementById("task-category");
const taskList = document.getElementById("task-list");
const taskHistoryList = document.getElementById("task-history");
const clearHistoryButton = document.getElementById("clear-history");

// Load tasks and history from localStorage
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadTaskHistory();
});

// Add Task
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    const taskCat = taskCategory.value;
    if (taskText === "") return;

    const task = { text: taskText, completed: false, category: taskCat };
    addTaskToDOM(task);
    saveTaskToLocalStorage(task);

    taskInput.value = "";
});

// Add task to the DOM
function addTaskToDOM(task) {
    const taskItem = document.createElement("li");
    if (task.completed) taskItem.classList.add("completed");

    const taskContent = document.createElement("span");
    taskContent.textContent = `${task.text} (${task.category})`;
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
        addToTaskHistory(task);
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

// Add task to history
function addToTaskHistory(task) {
    const history = getTaskHistoryFromLocalStorage();
    history.push(task);
    localStorage.setItem("taskHistory", JSON.stringify(history));
    addHistoryToDOM(task);
}

// Add task history to DOM
function addHistoryToDOM(task) {
    const historyItem = document.createElement("li");
    historyItem.textContent = `${task.text} (${task.category})`;

    const restoreButton = document.createElement("button");
    restoreButton.textContent = "Restore";
    restoreButton.addEventListener("click", () => {
        restoreTask(task);
        taskHistoryList.removeChild(historyItem);
    });

    historyItem.appendChild(restoreButton);
    taskHistoryList.appendChild(historyItem);
}

// Restore task from history
function restoreTask(task) {
    addTaskToDOM(task);
    saveTaskToLocalStorage(task);
    deleteTaskFromHistory(task.text);
}

// Load task history from localStorage
function loadTaskHistory() {
    const history = getTaskHistoryFromLocalStorage();
    history.forEach((task) => addHistoryToDOM(task));
}

// Get task history from localStorage
function getTaskHistoryFromLocalStorage() {
    return JSON.parse(localStorage.getItem("taskHistory")) || [];
}

// Delete task from history
function deleteTaskFromHistory(taskText) {
    const history = getTaskHistoryFromLocalStorage();
    const filteredHistory = history.filter((task) => task.text !== taskText);
    localStorage.setItem("taskHistory", JSON.stringify(filteredHistory));
}

// Clear all task history
clearHistoryButton.addEventListener("click", () => {
    localStorage.removeItem("taskHistory");
    taskHistoryList.innerHTML = "";
});
