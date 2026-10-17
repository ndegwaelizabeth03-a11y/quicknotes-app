
"use strict";

// Select the required HTML elements.
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const notesList = document.querySelector("#notes-list");
const clearAllButton = document.querySelector("#clear-all-btn");

const STORAGE_KEY = "quicknotes-notes";

// Store notes as an array of objects.
let notes = [];

// Load notes from localStorage.
function loadNotes() {
    try {
        const savedNotes = localStorage.getItem(STORAGE_KEY);

        if (savedNotes === null) {
            notes = [];
            return;
        }

        const parsedNotes = JSON.parse(savedNotes);

        if (!Array.isArray(parsedNotes)) {
            notes = [];
            return;
        }

        // Accept only notes with the expected fields and categories.
        notes = parsedNotes.filter(note =>
            note &&
            typeof note.id === "string" &&
            typeof note.text === "string" &&
            note.text.trim().length > 0 &&
            note.text.length <= 200 &&
            ["Personal", "Work", "Study"].includes(note.category) &&
            typeof note.createdAt === "string" &&
            !Number.isNaN(Date.parse(note.createdAt))
        );
    } catch (error) {
        notes = [];
        errorMessage.textContent =
            "Saved notes could not be loaded from this browser.";
    }
}

// Save notes as JSON.
function saveNotes() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        return true;
    } catch (error) {
        errorMessage.textContent =
            "Notes could not be saved. Browser storage may be unavailable.";
        return false;
    }
}

// Display the correct total count.
function updateNoteCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

// Render the notes list and apply the search filter.
function render() {
    notesList.replaceChildren();

    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(note =>
        note.text.toLowerCase().includes(searchTerm)
    );

    updateNoteCount();
    clearAllButton.hidden = notes.length === 0;

    if (filteredNotes.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-message";

        emptyItem.textContent = searchTerm
            ? "No notes match your search."
            : "No notes to display. Add your first note above.";

        notesList.appendChild(emptyItem);
        return;
    }

    filteredNotes.forEach(note => {
        const noteCard = document.createElement("li");
        noteCard.classList.add(
            "note-card",
            `category-${note.category.toLowerCase()}`
        );

        const noteText = document.createElement("p");
        noteText.className = "note-text";
        noteText.textContent = note.text;

        const noteMeta = document.createElement("div");
        noteMeta.className = "note-meta";

        const categoryLabel = document.createElement("span");
        categoryLabel.classList.add(
            "category-label",
            `category-${note.category.toLowerCase()}`
        );
        categoryLabel.textContent = note.category;

        const dateLabel = document.createElement("time");
        dateLabel.className = "note-date";
        dateLabel.dateTime = note.createdAt;
        dateLabel.textContent = new Date(note.createdAt).toLocaleString();

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
            "aria-label",
            `Delete note: ${note.text}`
        );

        deleteButton.addEventListener("click", function () {
            deleteNote(note.id);
        });

        noteMeta.append(
            categoryLabel,
            dateLabel,
            deleteButton
        );

        noteCard.append(noteText, noteMeta);
        notesList.appendChild(noteCard);
    });
}

// Add a note after validating the input.
noteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text.length === 0) {
        errorMessage.textContent = "Please type a note first.";
        noteInput.focus();
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        noteInput.focus();
        return;
    }

    if (!["Personal", "Work", "Study"].includes(category)) {
        errorMessage.textContent = "Please select a valid category.";
        return;
    }

    const newNote = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text: text,
        category: category,
        createdAt: new Date().toISOString()
    };

    notes.unshift(newNote);

    if (!saveNotes()) {
        notes = notes.filter(note => note.id !== newNote.id);
        render();
        return;
    }

    errorMessage.textContent = "";
    noteInput.value = "";
    searchInput.value = "";

    render();
    noteInput.focus();
});

// Delete one note by its unique ID.
function deleteNote(id) {
    const previousNotes = notes;

    notes = notes.filter(note => note.id !== id);

    if (!saveNotes()) {
        notes = previousNotes;
        render();
        return;
    }

    errorMessage.textContent = "";
    render();
}

// Update the displayed notes whenever the search changes.
searchInput.addEventListener("input", render);

// Bonus: clear all notes after asking for confirmation.
clearAllButton.addEventListener("click", function () {
    if (notes.length === 0) {
        return;
    }

    if (confirm("Delete all notes?")) {
        const previousNotes = notes;
        notes = [];

        if (!saveNotes()) {
            notes = previousNotes;
            render();
            return;
        }

        errorMessage.textContent = "";
        render();
    }
});

// Restore saved notes and display the initial page.
loadNotes();
render();
