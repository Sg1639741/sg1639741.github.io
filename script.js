document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskTime = document.getElementById('taskTime');
    const addButton = document.getElementById('addButton');
    const taskList = document.getElementById('taskList');

    addButton.addEventListener('click', addTask);

    function addTask() {
        const taskText = taskInput.value.trim();
        const taskDateValue = taskDate.value.trim();
        const taskTimeValue = taskTime.value.trim();
        if (taskText === '') return;

        const li = document.createElement('li');
        li.innerHTML = `
            <span>${taskText}</span>
            <span class="time-display">${taskDateValue ? taskDateValue : 'No date'} ${taskTimeValue ? taskTimeValue : 'No time set'}</span>
            <button onclick="editTask(this)"><i class="fas fa-pencil-alt"></i></button>
            <button onclick="deleteTask(this)"><i class="fas fa-times"></i></button>
        `;
        taskList.appendChild(li);
        taskInput.value = '';
        taskDate.value = '';
        taskTime.value = '';
    }

    window.editTask = function(button) {
        const li = button.parentElement;
        const taskSpan = li.querySelector('span:first-child');
        const timeSpan = li.querySelector('.time-display');
        const currentText = taskSpan.textContent;
        const [currentDate, currentTime] = timeSpan.textContent.split(' ');

        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = currentText;

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = currentDate === 'No date' ? '' : currentDate;

        const timeInput = document.createElement('input');
        timeInput.type = 'time';
        timeInput.value = currentTime === 'No time set' ? '' : currentTime;

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = function() {
            taskSpan.textContent = editInput.value;
            timeSpan.textContent = `${dateInput.value ? dateInput.value : 'No date'} ${timeInput.value ? timeInput.value : 'No time set'}`;
            li.removeChild(editInput);
            li.removeChild(dateInput);
            li.removeChild(timeInput);
            li.removeChild(saveButton);
        };

        li.insertBefore(editInput, taskSpan);
        li.insertBefore(dateInput, taskSpan);
        li.insertBefore(timeInput, taskSpan);
        li.insertBefore(saveButton, button);
        taskSpan.style.display = 'none';
        timeSpan.style.display = 'none';
        button.style.display = 'none';
    };

    window.deleteTask = function(button) {
        const li = button.parentElement;
        taskList.removeChild(li);
    };
});


