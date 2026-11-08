// Application state
const tasks = [];
let currentFilter = "all";
let selectedTaskId = null;
let editingTaskId = null;
const STORAGE_KEY = "todoTasks";

// Main page elements
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const openAddTaskButton = document.getElementById("open-add-task-button");

// Filter controls
const filterButtons = document.querySelectorAll("#task-filters button");
const filterAllButton = document.getElementById("filter-all");
const filterActiveButton = document.getElementById("filter-active");
const filterCompletedButton = document.getElementById("filter-completed");

// Add Task modal elements
const addTaskModal = document.getElementById("add-task-modal");
const addTaskForm = document.getElementById("add-task-form");
const addTaskModalHeading = document.getElementById("add-task-modal-heading");
const taskDescriptionInput = document.getElementById("task-description");
const closeAddTaskModalButton = document.getElementById("close-add-task-modal");
const cancelAddTaskButton = document.getElementById("cancel-add-task");
const submitAddTaskButton = document.getElementById("submit-add-task");

// Delete confirmation modal elements
const deleteTaskModal = document.getElementById("delete-task-modal");
const deleteTaskModalMessage = document.getElementById("delete-task-modal-message");
const closeDeleteTaskModalButton = document.getElementById("close-delete-task-modal");
const cancelDeleteTaskButton = document.getElementById("cancel-delete-task");
const confirmDeleteTaskButton = document.getElementById("confirm-delete-task");

// Save the current task data as JSON in the browser's Local Storage.
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Unable to save tasks to Local Storage.", error);
  }
}

// Load saved task data and keep the empty array when data is missing or invalid.
function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
      return;
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (
      !Array.isArray(parsedTasks) ||
      parsedTasks.some(
        (task) =>
          !task ||
          typeof task.id !== "string" ||
          typeof task.title !== "string" ||
          typeof task.completed !== "boolean",
      )
    ) {
      console.error("Saved task data contains invalid task records.");
      return;
    }

    tasks.push(...parsedTasks);
  } catch (error) {
    console.error("Unable to load valid tasks from Local Storage.", error);
  }
}

// Render the tasks that belong to the current filter.
function renderTasks() {
  taskList.replaceChildren();

  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === "active") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  visibleTasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-card");

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    const completionCheckbox = document.createElement("input");
    completionCheckbox.type = "checkbox";
    completionCheckbox.checked = task.completed;
    completionCheckbox.id = `task-${task.id}`;
    completionCheckbox.dataset.taskId = task.id;
    completionCheckbox.setAttribute("aria-label", `Complete ${task.title}`);
    completionCheckbox.addEventListener("change", () => {
      const taskToUpdate = tasks.find(
        (currentTask) => currentTask.id === completionCheckbox.dataset.taskId,
      );

      if (!taskToUpdate) {
        return;
      }

      taskToUpdate.completed = !taskToUpdate.completed;
      saveTasks();
      renderTasks();
    });

    const taskTitle = document.createElement("label");
    taskTitle.className = "task-title";
    taskTitle.htmlFor = completionCheckbox.id;
    taskTitle.textContent = task.title;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-task-button";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      selectedTaskId = task.id;
      deleteTaskModalMessage.textContent = `Are you sure you want to delete "${task.title}"?`;
      openDeleteTaskModal();
    });

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "edit-task-button";
    editButton.setAttribute("aria-label", `Edit ${task.title}`);
    editButton.textContent = "✎";
    editButton.addEventListener("click", () => {
      editingTaskId = task.id;
      taskDescriptionInput.value = task.title;
      addTaskModalHeading.textContent = "Edit Task";
      submitAddTaskButton.textContent = "Save Changes";
      openAddTaskModal();
      taskDescriptionInput.focus();
    });

    taskItem.append(completionCheckbox, taskTitle, editButton, deleteButton);
    taskList.appendChild(taskItem);
  });

  updateEmptyState(visibleTasks.length === 0);
}

// Show or hide the empty-state message based on the visible task count.
function updateEmptyState(isEmpty) {
  emptyState.hidden = !isEmpty;

  if (!isEmpty) {
    return;
  }

  const emptyMessages = {
    all: "No tasks yet. Add your first task!",
    active: "No active tasks.",
    completed: "No completed tasks.",
  };

  emptyState.textContent = emptyMessages[currentFilter];
}

// Keep the selected filter visually and semantically synchronized.
function updateActiveFilterButton() {
  filterButtons.forEach((button) => {
    const isSelected = button.dataset.filter === currentFilter;
    button.classList.toggle("active-filter", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

// Change the current filter without modifying the original tasks array.
function setFilter(filter) {
  currentFilter = filter;
  updateActiveFilterButton();
  renderTasks();
}

// Open a modal with a CSS class and remove its native hidden state.
function openModal(modal) {
  modal.classList.add("is-open");
  modal.hidden = false;
}

// Close a modal by removing its CSS class and restoring its hidden state.
function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.hidden = true;
}

// Keep these named helpers ready for the modal controls added later.
function openAddTaskModal() {
  openModal(addTaskModal);
}

function closeAddTaskModal() {
  closeModal(addTaskModal);
}

function resetAddTaskModal() {
  editingTaskId = null;
  addTaskModalHeading.textContent = "Add New Task";
  submitAddTaskButton.textContent = "Add Task";
  taskDescriptionInput.value = "";
}

function cancelAddTask() {
  closeAddTaskModal();
  resetAddTaskModal();
}

function openDeleteTaskModal() {
  openModal(deleteTaskModal);
}

function closeDeleteTaskModal() {
  closeModal(deleteTaskModal);
}

function resetDeleteTaskSelection() {
  selectedTaskId = null;
  deleteTaskModalMessage.textContent = "Are you sure you want to delete this task?";
}

// Add Task modal controls
openAddTaskButton.addEventListener("click", () => {
  resetAddTaskModal();
  openAddTaskModal();
  taskDescriptionInput.focus();
});

cancelAddTaskButton.addEventListener("click", cancelAddTask);
closeAddTaskModalButton.addEventListener("click", cancelAddTask);

// Close the Add Task modal only when the backdrop itself is clicked.
addTaskModal.addEventListener("click", (event) => {
  if (event.target === addTaskModal) {
    cancelAddTask();
  }
});

// Delete confirmation modal controls
function cancelTaskDeletion() {
  closeDeleteTaskModal();
  resetDeleteTaskSelection();
}

cancelDeleteTaskButton.addEventListener("click", cancelTaskDeletion);
closeDeleteTaskModalButton.addEventListener("click", cancelTaskDeletion);

deleteTaskModal.addEventListener("click", (event) => {
  if (event.target === deleteTaskModal) {
    cancelTaskDeletion();
  }
});

confirmDeleteTaskButton.addEventListener("click", () => {
  if (!selectedTaskId) {
    cancelTaskDeletion();
    return;
  }

  const taskIdToDelete = selectedTaskId;
  tasks.splice(
    0,
    tasks.length,
    ...tasks.filter((task) => task.id !== taskIdToDelete),
  );
  saveTasks();
  renderTasks();
  closeDeleteTaskModal();
  resetDeleteTaskSelection();
});

// Add a new task after validating and cleaning the submitted description.
addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskTitle = taskDescriptionInput.value.trim();

  if (!taskTitle) {
    taskDescriptionInput.focus();
    return;
  }

  if (editingTaskId !== null) {
    const taskToUpdate = tasks.find((task) => task.id === editingTaskId);

    if (!taskToUpdate) {
      cancelAddTask();
      return;
    }

    taskToUpdate.title = taskTitle;
    saveTasks();
    renderTasks();
    closeAddTaskModal();
    resetAddTaskModal();
    return;
  }

  const task = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: taskTitle,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  closeAddTaskModal();
  taskDescriptionInput.value = "";
});

// Filter buttons only change which tasks render; they do not remove tasks.
filterAllButton.addEventListener("click", () => setFilter("all"));
filterActiveButton.addEventListener("click", () => setFilter("active"));
filterCompletedButton.addEventListener("click", () => setFilter("completed"));

// Establish the initial empty view.
loadTasks();
updateActiveFilterButton();
renderTasks();