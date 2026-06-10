const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* =========================
   ADD TASK
========================= */

addTaskBtn.addEventListener("click", addTask);

function addTask() {

    const text = taskInput.value.trim();
    const date = taskDate.value;
    const time = taskTime.value;
    const priority = taskPriority.value;

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text,
        date,
        time,
        priority,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";

    renderTasks();
}

/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    const searchText = searchInput.value.toLowerCase();

    filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchText)
    );

    filteredTasks.forEach(task => {

        const card = document.createElement("div");

        card.className =
            `task-card ${task.completed ? "completed" : ""}`;

        card.innerHTML = `
            <div class="task-header">

                <div class="task-title">
                    ${task.text}
                </div>

                <span class="priority ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>

            </div>

            <div class="task-info">
                📅 ${task.date || "No Date"}
                &nbsp;&nbsp;
                ⏰ ${task.time || "No Time"}
            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleComplete(${task.id})"
                >
                    ${task.completed ? "↩ Undo" : "✔ Complete"}
                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    ✏ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    🗑 Delete
                </button>

            </div>
        `;

        taskList.appendChild(card);
    });

    updateStats();
}

/* =========================
   COMPLETE TASK
========================= */

function toggleComplete(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

/* =========================
   EDIT TASK
========================= */

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    const updatedText = prompt(
        "Edit Task:",
        task.text
    );

    if (
        updatedText === null ||
        updatedText.trim() === ""
    ) {
        return;
    }

    task.text = updatedText.trim();

    saveTasks();
    renderTasks();
}

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", renderTasks);

/* =========================
   FILTERS
========================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter =
            button.getAttribute("data-filter");

        renderTasks();
    });
});

/* =========================
   STATS
========================= */

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
}

/* =========================
   LOCAL STORAGE
========================= */

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* =========================
   INITIAL LOAD
========================= */

renderTasks();