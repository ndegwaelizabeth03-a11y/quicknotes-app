
# QuickNotes

QuickNotes is a simple, responsive note-taking web application that helps users organise their personal, work and study notes. Users can add notes, assign categories, search by note text, delete individual notes and clear all notes after confirmation. The application saves notes in the browser using localStorage so they remain available after a page refresh.

## Features

- Add notes under Personal, Work or Study.
- Validate empty notes and notes longer than 200 characters.
- Display each note's category and creation date.
- Delete individual notes.
- Search notes without case sensitivity.
- Display the correct total note count.
- Save and restore notes using localStorage and JSON.
- Clear all notes with a confirmation prompt.
- Responsive layout for desktop and mobile screens.
- Accessible labels and validation messages.

## How to Run Locally

1. Clone or download this repository.
2. Open the `quicknotes-app` folder in Visual Studio Code.
3. Open `index.html` directly in your browser, or use the Live Server extension.
4. Add, search and manage your notes.

No npm installation or build process is required.

Notes are stored in the current browser's localStorage. They are not automatically synchronised across browsers or devices.

## What I Learned

- How to structure pages with semantic HTML and correctly linked labels.
- How to use CSS Flexbox, category classes and media queries.
- How to handle forms, validation and events using JavaScript.
- How to use arrays and objects to manage notes.
- How to save and restore data using JSON.stringify, JSON.parse and localStorage.
- How to use Git commits to track changes throughout a project.
