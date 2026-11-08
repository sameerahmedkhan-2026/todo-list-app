# Todo List App

A Todo List application built incrementally for learning and teaching
frontend development.

The repository is organized by application version. The current version is a
beginner-friendly HTML5, CSS3, and vanilla JavaScript app. Future versions may
use React or introduce additional features and architectural improvements.

## Versions

### v1: HTML, CSS, and Vanilla JavaScript

The current application is located in [`todo-list-app-v1/`](./todo-list-app-v1/).
It uses browser Local Storage and does not require a build tool, framework, or
external dependency.

Implemented features include:

- Add tasks with validation
- Edit existing task titles
- Complete and uncomplete tasks
- All, Active, and Completed filters
- Delete confirmation modal
- Add/Edit task modal
- Local Storage persistence
- Responsive blue-and-white interface
- Accessible labels, buttons, focus states, and dialogs

### v2: React application

The planned second version may rebuild the application with React to introduce:

- Components and reusable UI sections
- React state management
- More structured event handling
- A maintainable component-based architecture
- Improved development and testing workflows

### v3: Further enhancements

The third version may extend the React application with additional features,
integrations, and production improvements.

Possible enhancements include:

- Dark and light themes
- High, Medium, and Low task priorities
- GitHub Pages or another deployment platform
- More advanced task organization
- Improved accessibility and keyboard navigation
- Automated testing
- Backend or cloud data synchronization

## v1 project structure

```text
todo-list-app-v1/
├── designs/
├── docs/
│   ├── architecture.md
│   ├── features.md
│   └── todo-list-app-class.pptx
├── index.html
└── src/
    ├── index.html
    ├── script.js
    └── style.css
```

The root `index.html` is used by the GitHub Pages deployment. The files in
`src/` contain the application source files.

## Running v1 locally

### Option 1: Open the HTML file directly

Open [`todo-list-app-v1/index.html`](./todo-list-app-v1/index.html) in a
browser.

### Option 2: Use a local server

From the repository root, run a simple local server:

```bash
python3 -m http.server 8000
```

Then open:

<http://localhost:8000/todo-list-app-v1/>

Using a local server is recommended because it more closely matches a hosted
website.

## How v1 works

Tasks are stored as JavaScript objects:

```js
{
  id: "unique-string",
  title: "Complete JavaScript assignment",
  completed: false
}
```

The application:

1. Loads saved tasks from Local Storage.
2. Renders tasks based on the selected filter.
3. Updates task objects when users add, edit, complete, or delete tasks.
4. Saves changes using the `todoTasks` Local Storage key.
5. Re-renders the visible task list after each change.

## Documentation

- [Architecture documentation](./todo-list-app-v1/docs/architecture.md)
- [Implemented and suggested features](./todo-list-app-v1/docs/features.md)
- [Class presentation](./todo-list-app-v1/docs/todo-list-app-class.pptx)

## Deployment

The repository includes a GitHub Actions workflow for GitHub Pages:

```text
.github/workflows/deploy-pages.yml
```

The workflow publishes the `todo-list-app-v1/` application when changes are
pushed to the `main` branch.

## Learning goals

This project is intended to practice:

- Semantic HTML
- CSS layout and responsive design
- DOM selection and manipulation
- JavaScript arrays and objects
- Event listeners
- Form validation
- Filtering data with `filter()`
- Finding records with `find()`
- Local Storage and JSON
- Incremental feature development
- Git and GitHub deployment

## License

This project is intended for educational and personal learning purposes.
