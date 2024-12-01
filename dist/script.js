"use strict";
// Array to store the notes
let notes = [];
// DOM elements
const noteList = document.getElementById("note-list");
const noteTitleInput = document.getElementById("note-title");
const noteContentInput = document.getElementById("note-content");
const saveNoteButton = document.getElementById("save-note");
// Variable to track the note being edited
let currentEditingNoteId = null;
// Load notes from Local Storage
function loadNotes() {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
    renderNotes();
}
// Save notes to Local Storage
function saveNotesToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}
// Create a new note
function createNote() {
    if (!noteTitleInput.value || !noteContentInput.value) {
        alert("Please fill in both fields.");
        return;
    }
    if (currentEditingNoteId !== null) {
        // If editing a note, update the existing note
        const noteToUpdate = notes.find(note => note.id === currentEditingNoteId);
        if (noteToUpdate) {
            noteToUpdate.title = noteTitleInput.value;
            noteToUpdate.content = noteContentInput.value;
        }
        currentEditingNoteId = null; // Reset editing state
        saveNoteButton.textContent = "Add Note"; // Change button back to "Add Note"
    }
    else {
        // Otherwise, create a new note
        const newNote = {
            id: Date.now(), // Unique ID based on timestamp
            title: noteTitleInput.value,
            content: noteContentInput.value,
        };
        notes.push(newNote);
    }
    noteTitleInput.value = "";
    noteContentInput.value = "";
    saveNotesToLocalStorage(); // Save updated notes to Local Storage
    renderNotes();
}
// Render notes to the UI
function renderNotes() {
    noteList.innerHTML = ""; // Clear the note list
    notes.forEach(note => {
        const noteElement = document.createElement("div");
        noteElement.className = "note";
        const titleElement = document.createElement("h3");
        titleElement.textContent = note.title;
        const contentElement = document.createElement("p");
        contentElement.textContent = note.content;
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editNote(note.id);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteNote(note.id);
        noteElement.appendChild(titleElement);
        noteElement.appendChild(contentElement);
        noteElement.appendChild(editButton);
        noteElement.appendChild(deleteButton);
        noteList.appendChild(noteElement);
    });
}
// Edit a note
function editNote(noteId) {
    const noteToEdit = notes.find(note => note.id === noteId);
    if (noteToEdit) {
        noteTitleInput.value = noteToEdit.title;
        noteContentInput.value = noteToEdit.content;
        currentEditingNoteId = noteToEdit.id;
        saveNoteButton.textContent = "Save Changes"; // Change button to "Save Changes"
    }
}
// Delete a note
function deleteNote(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    saveNotesToLocalStorage(); // Save notes after deletion
    renderNotes();
}
// Event listeners
saveNoteButton.addEventListener("click", createNote);
// Load notes when the page loads
loadNotes();
