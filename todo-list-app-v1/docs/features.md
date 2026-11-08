# Todo List Features

## Implemented features

- HTML5 semantic page structure
- Minimalist blue-and-white responsive design
- Add Task modal
- Add task validation and whitespace trimming
- Display task cards dynamically
- Completion checkboxes
- Completed-task strikethrough styling
- All, Active, and Completed filters
- Filter-specific empty-state messages
- Edit Task functionality using the existing task modal
- Delete confirmation modal
- Delete and cancel actions
- Local Storage persistence
- Safe handling of missing or invalid saved data
- Keyboard focus styles and accessible labels
- Modal backdrop closing and open/close transitions

## Suggested features

### Publish to GitHub Pages

Deploy the application using GitHub Pages so it can be accessed through a
public URL. The deployment should use the folder containing the final
`index.html` file as the published source.

### Dark and light theme

Add a theme toggle that allows users to switch between light and dark themes.
The selected theme could be stored in Local Storage so it remains active after
the page is refreshed.

### Task priority

Allow users to assign one of three priority levels to each task:

- High
- Medium
- Low

Priority could be shown with a color or label on each task card and included in
the task object stored in Local Storage.

Example:

```js
{
  id: "unique-string",
  title: "Complete project",
  completed: false,
  priority: "high"
}
```

Priority should be validated and preserved when tasks are edited or persisted.
