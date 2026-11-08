# Todo List Application Architecture

This project is a framework-free Todo List application built with HTML5, CSS3,
and vanilla JavaScript. The implementation uses three source files and browser
Local Storage for persistence.

## Project structure

```text
todo-list-app-v1/
├── designs/
├── docs/
│   └── architecture.md
└── src/
    ├── index.html
    ├── script.js
    └── style.css
```

## File responsibilities

### `src/index.html`

Defines the semantic page structure:

- Header with the Todo List logo and name
- Main application section
- Add Task button
- All, Active, and Completed filter buttons
- Empty-state message
- Empty task list container
- Reusable Add/Edit Task modal
- Delete confirmation modal
- Accessible labels, dialog attributes, IDs, and button types

HTML provides the elements that JavaScript selects and updates. Task cards are
created dynamically by `script.js`, so task data is not duplicated in the
initial markup.

### `src/style.css`

Controls the visual presentation:

- Light blue-and-white theme
- CSS variables for colors, spacing, radii, shadows, and transitions
- Centered application container with a maximum width
- Responsive mobile layout
- Primary, secondary, edit, delete, and filter button states
- Consistent task cards and checkbox styling
- `.completed` task styling with muted text and strikethrough
- Empty-state presentation through the `#empty-state` element
- Centered modal backdrops and dialog panels
- `.is-open` modal visibility state
- Modal transitions and reduced-motion support
- Keyboard focus styles using `:focus-visible`

### `src/script.js`

Owns application state and behavior:

- Creates, updates, filters, and removes tasks
- Renders task cards using DOM methods
- Handles Add, Edit, Complete, Filter, and Delete interactions
- Opens and closes both modals
- Persists tasks in Local Storage
- Updates accessibility attributes such as `aria-pressed` and `aria-label`

## Application state

The script maintains these values:

```js
const tasks = [];
let currentFilter = "all";
let selectedTaskId = null;
let editingTaskId = null;
const STORAGE_KEY = "todoTasks";
```

- `tasks` is the mutable array containing all task objects.
- `currentFilter` controls which tasks are displayed. It is not persisted.
- `selectedTaskId` identifies the task awaiting delete confirmation.
- `editingTaskId` identifies the task being edited. `null` means Add mode.
- `STORAGE_KEY` is the Local Storage key used by the application.

Each task has this structure:

```js
{
  id: "unique-string",
  title: "Complete JavaScript assignment",
  completed: false
}
```

New IDs are generated with `crypto.randomUUID()` when available, with a
timestamp/random fallback for unsupported environments.

## Rendering flow

`renderTasks()` is the central UI update function:

1. Removes the existing task-card elements with `replaceChildren()`.
2. Uses `tasks.filter()` to create a visible list for the current filter.
3. Creates each task card with `createElement()`.
4. Displays the title using `textContent`, avoiding unsafe HTML insertion.
5. Creates a completion checkbox, Edit button, and Delete button.
6. Adds the `.completed` class when the task is complete.
7. Adds direct event listeners to the dynamically created controls.
8. Updates the empty-state message when no visible tasks match.

Filtering never changes `tasks`; it creates a separate array for display.

## Add Task flow

When the main Add Task button is clicked:

1. `resetAddTaskModal()` sets `editingTaskId` to `null`.
2. The modal heading becomes `Add New Task`.
3. The submit button becomes `Add Task`.
4. The input is cleared and focused.
5. The modal opens with the `is-open` class.

When the form is submitted:

1. The browser's default form submission is prevented.
2. The input is trimmed with `.trim()`.
3. Empty descriptions are rejected.
4. A new task object is created with `completed: false`.
5. The task is pushed into `tasks`.
6. `saveTasks()` persists the updated array.
7. `renderTasks()` refreshes the visible list.
8. The modal closes and the input is cleared.

## Edit Task flow

The Add Task modal is reused for editing.

When a task's Edit button is clicked:

1. Its ID is stored in `editingTaskId`.
2. Its current title is copied into the input.
3. The heading changes to `Edit Task`.
4. The submit button changes to `Save Changes`.
5. The existing modal opens and the input receives focus.

When the form is submitted in edit mode:

1. The title is trimmed and validated.
2. The existing task is found with `tasks.find()`.
3. Only the `title` property is changed.
4. The original `id` and `completed` values are preserved.
5. The updated array is saved and rendered.
6. The modal closes and returns to Add mode.

Editing works under every filter because the task is searched in the complete
`tasks` array, not only in the currently visible task list.

Cancel, close-icon, and backdrop actions call `cancelAddTask()`, which closes
the modal and resets the heading, submit label, input, and `editingTaskId`.

## Completion flow

Each rendered checkbox stores the task ID in `data-task-id`.

When a checkbox changes:

1. The ID is read from the checkbox.
2. `tasks.find()` locates the matching task.
3. The `completed` value is toggled.
4. The updated tasks are saved.
5. `renderTasks()` redraws the list.

The checkbox is checked when `task.completed` is `true`. Completed titles use
the `.completed` card state and receive a strikethrough style.

## Filtering flow

The three filter buttons call `setFilter()` with one of these values:

- `all`: displays every task
- `active`: displays tasks where `completed` is `false`
- `completed`: displays tasks where `completed` is `true`

`setFilter()` updates `currentFilter`, synchronizes the selected button's
`.active-filter` class and `aria-pressed` attribute, then calls `renderTasks()`.

The selected filter remains active after adding, editing, completing, or
deleting a task.

If no tasks match the selected filter, the empty-state messages are:

- All: `No tasks yet. Add your first task!`
- Active: `No active tasks.`
- Completed: `No completed tasks.`

## Delete flow

When a task's Delete button is clicked:

1. Its ID is stored in `selectedTaskId`.
2. The delete modal message includes the task title.
3. The confirmation modal opens.

Cancel, close-icon, and backdrop actions close the modal and reset
`selectedTaskId`.

When Delete is confirmed:

1. The selected ID is copied locally.
2. `tasks.filter()` creates an array excluding that ID.
3. `splice()` replaces the original array contents with the filtered results.
4. The updated tasks are saved.
5. The current filtered view is rendered.
6. The modal closes and the selected ID is reset.

## Local Storage flow

### Saving

`saveTasks()` uses:

```js
localStorage.setItem("todoTasks", JSON.stringify(tasks));
```

`JSON.stringify()` converts the JavaScript array into a string because Local
Storage stores string values.

Tasks are saved after:

- Adding a task
- Completing or uncompleting a task
- Editing a task
- Deleting a task

### Loading

`loadTasks()` runs before the initial `renderTasks()` call:

1. Retrieves the value with `localStorage.getItem("todoTasks")`.
2. Returns with an empty `tasks` array if no value exists.
3. Parses saved text with `JSON.parse()`.
4. Verifies that the result is an array of valid task records.
5. Adds the valid records to `tasks`.

Invalid or corrupted JSON is caught and logged. Invalid task shapes are
rejected without preventing the application from starting with an empty list.
The current filter is intentionally not saved.

## Modal behavior

`openModal()` and `closeModal()` are shared helpers:

- Opening adds `.is-open` and removes the native `hidden` state.
- Closing removes `.is-open` and restores the native `hidden` state.

The CSS uses `.is-open` for visibility, backdrop styling, centered layout, and
subtle transitions. Clicking inside a modal does not close it; clicking the
backdrop itself does.

## Startup sequence

At the bottom of `script.js`, the application:

1. Loads saved tasks.
2. Marks the All filter as active.
3. Renders the initial task list or empty state.

## Verification checklist

- Add a normal task.
- Reject an empty or whitespace-only task.
- Edit a task and confirm only its title changes.
- Edit an active task while using the Active filter.
- Edit a completed task while using the Completed filter.
- Complete and uncomplete a task.
- Verify All, Active, and Completed filtering.
- Open Delete and cancel it.
- Delete a task after confirmation.
- Refresh the page and verify tasks persist.
- Test modal close icons, Cancel buttons, backdrop clicks, and keyboard focus.
- Verify invalid Local Storage data does not crash the application.
