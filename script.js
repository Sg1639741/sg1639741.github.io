// Get DOM elements
const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const addTaskBtn = document.getElementById('add-task-btn');
const todoList = document.getElementById('todo-list');

// Get the popup modal elements
const popupModal = document.getElementById('popup-modal');
const closePopupBtn = document.getElementById('close-popup-btn');
const popupTaskText = document.getElementById('popup-task-text');

// Create an audio object for the alarm sound
const alarmSound = new Audio('alarm.mp3');  // Make sure this file is in the same directory or adjust the path accordingly

// Load tasks from localStorage
document.addEventListener('DOMContentLoaded', () => {
    // Set the minimum date and time for the input field to current date and time
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16); // Format to "YYYY-MM-DDTHH:MM"
    dueDateInput.setAttribute('min', formattedDate);

    loadTasks();
});

// Add a new task
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText === '') {
        alert("Please enter a task!");
        return;
    }

    if (!dueDate) {
        alert("Please select a due date and time!");
        return;
    }

    const dueDateTime = new Date(dueDate);

    // Create a new task object with the due time
    const task = {
        text: taskText,
        completed: false,
        dueTime: dueDateTime
    };

    // Save task in localStorage
    let tasks = getTasksFromStorage();
    tasks.push(task);
    saveTasksToStorage(tasks);

    // Set an alarm for this task
    setAlarm(task, tasks.length - 1);

    // Append task to the list
    renderTask(task);

    // Reset inputs
    taskInput.value = '';
    dueDateInput.value = '';
}

// Toggle task completion status
function toggleTaskCompletion(index) {
    let tasks = getTasksFromStorage();
    tasks[index].completed = !tasks[index].completed;
    saveTasksToStorage(tasks);
    renderTasks();
}

// Delete a task
function deleteTask(index) {
    let tasks = getTasksFromStorage();
    tasks.splice(index, 1);
    saveTasksToStorage(tasks);
    renderTasks();
}

// Get tasks from localStorage
function getTasksFromStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Save tasks to localStorage
function saveTasksToStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks when page loads
function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach((task, index) => {
        renderTask(task, index);
        // Set alarms for existing tasks
        if (task.dueTime && !task.completed) {
            setAlarm(task, index);
        }
    });
}

// Render all tasks
function renderTasks() {
    todoList.innerHTML = '';  // Clear the list
    const tasks = getTasksFromStorage();
    tasks.forEach((task, index) => renderTask(task, index));
}

// Render a single task
function renderTask(task, index) {
    const li = document.createElement('li');
    if (task.completed) {
        li.classList.add('completed');
    }

    li.innerHTML = `
        <span class="task-text" onclick="toggleTaskCompletion(${index})">${task.text}</span>
        ${task.dueTime ? `<span class="task-due-time">Due: ${task.dueTime.toLocaleString()}</span>` : ''}
        <button class="delete-btn" onclick="deleteTask(${index})">&times;</button>
    `;
    
    todoList.appendChild(li);
}

// Set an alarm for the task
function setAlarm(task, index) {
    const now = new Date();
    const timeRemaining = task.dueTime - now;

    if (timeRemaining > 0) {
        // Set a timeout to trigger the alarm
        setTimeout(() => {
            // Play the alarm sound
            alarmSound.play();

            // Show the notification and popup
            showNotification(task);
            showPopup(task);
        }, timeRemaining);
    }
}

// Show a browser notification
function showNotification(task) {
    // Request permission to send notifications
    if (Notification.permission === 'granted') {
        new Notification('Task Reminder', {
            body: `Task "${task.text}" is due!`,
            icon: 'https://via.placeholder.com/40', // Optional: an icon for the notification
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Task Reminder', {
                    body: `Task "${task.text}" is due!`,
                    icon: 'https://via.placeholder.com/40',
                });
            }
        });
    }
}

// Show the task due notification in the modal
function showPopup(task) {
    popupTaskText.textContent = `Your task "${task.text}" is due now!`;
    popupModal.style.display = 'block';
}

// Close the popup modal when user clicks the "Close" button
closePopupBtn.addEventListener('click', () => {
    popupModal.style.display = 'none';
});
