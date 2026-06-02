
// ===============================
// Select elements
// ===============================
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-task-button");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const clearBtn = document.getElementById("clear-tasks-button");

const filterButtons = document.querySelectorAll(".filter-button");

// ===============================
// App state (main brain)
// ===============================
let tasks = [];
let currentFilter = "all";


// ===============================
// Load tasks on page start
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks();
});


// ===============================
// Add Task
// ===============================
addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = input.value.trim();

  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);

  input.value = "";

  saveTasks();
  renderTasks();
}


// ===============================
// Render Tasks (heart of app)
// ===============================
function renderTasks() {
  // taskList.innerHTML = "";
  taskList.replaceChildren();

  let filteredTasks = tasks;

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(t => !t.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    // checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", () => {
      toggleComplete(task.id);
    });

    // text
    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) span.classList.add("completed");

    // delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";

    delBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });

    if (filteredTasks.length === 0) {
    const empty = document.createElement("p");
    //empty.textContent = "No tasks here yet...";
    empty.style.opacity = "0.6";
    empty.style.textAlign = "center";
    taskList.appendChild(empty);
  }

  updateCount();
}


// ===============================
// Delete Task
// ===============================
// function deleteTask(id) {
//   tasks = tasks.filter(task => task.id !== id);

//   saveTasks();
//   renderTasks();
// }
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}


// ===============================
// Toggle Complete
// ===============================
function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks();
}


// ===============================
// Clear Completed
// ===============================
clearBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);

  saveTasks();
  renderTasks();
});


// ===============================
// Filter Buttons
// ===============================
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    currentFilter = btn.id.replace("filter-", "");

    renderTasks();
  });
});


// ===============================
// LocalStorage
// ===============================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
  }
}


// ===============================
// Task Counter
// ===============================
  function updateCount() {
  const total = tasks.length;
  const remaining = tasks.filter(t => !t.completed).length;

  if (total === 0) {
    taskCount.textContent = "0 tasks remaining";
  } 
  else if (remaining === 0) {
    taskCount.textContent = "All tasks completed 🎉";
  } 
  else if (remaining === 1) {
    taskCount.textContent = "1 task remaining";
  } 
  else {
    taskCount.textContent = `${remaining} tasks remaining`;
  }
}