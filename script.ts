// Note interface
interface Note {
    id: number;
    title: string;
    content: string;
  }
  
  // Array to store the notes
  let notes: Note[] = [];
  
  // DOM elements TypeScript’s strict typing
  const noteList = document.getElementById("note-list") as HTMLDivElement;
  const noteTitleInput = document.getElementById("note-title") as HTMLInputElement;
  const noteContentInput = document.getElementById("note-content") as HTMLTextAreaElement;
  const saveNoteButton = document.getElementById("save-note") as HTMLButtonElement;
  
  // Variable to track the note being edited
  let currentEditingNoteId: number | null = null;
  
  // Load notes from Local Storage
  function loadNotes(): void {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      notes = JSON.parse(savedNotes);
    }
    renderNotes();
  }
  
  // Save notes to Local Storage
  function saveNotesToLocalStorage(): void {
    localStorage.setItem("notes", JSON.stringify(notes));
  }
  
  // Create a new note
  function createNote(): void {
    try {
      if (!noteTitleInput.value.trim() || !noteContentInput.value.trim()) {
        throw new Error("Both title and content fields are required.");
      }
  
      if (currentEditingNoteId !== null) {
        // Update existing note
        const noteToUpdate = notes.find(note => note.id === currentEditingNoteId);
        if (!noteToUpdate) {
          throw new Error("The note to edit does not exist.");
        }
        noteToUpdate.title = noteTitleInput.value;
        noteToUpdate.content = noteContentInput.value;
        currentEditingNoteId = null;
        saveNoteButton.textContent = "Add Note";
      } else {
        // Create a new note
        const newNote: Note = {
          id: Date.now(),
          title: noteTitleInput.value,
          content: noteContentInput.value,
        };
        notes.push(newNote);
      }
  
      noteTitleInput.value = "";
      noteContentInput.value = "";
      saveNotesToLocalStorage();
      renderNotes();
    } catch (error) {
      alert((error as Error).message); // Display the error to the user
    }
  }
  
  
  // Render notes to the UI
  function renderNotes(): void {
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
  function editNote(noteId: number): void {
    const noteToEdit = notes.find(note => note.id === noteId);
    if (noteToEdit) {
      noteTitleInput.value = noteToEdit.title;
      noteContentInput.value = noteToEdit.content;
      currentEditingNoteId = noteToEdit.id;
      saveNoteButton.textContent = "Save Changes"; // Change button to "Save Changes"
    }
  }
  
  // Delete a note
  function deleteNote(noteId: number): void {
    notes = notes.filter(note => note.id !== noteId);
    saveNotesToLocalStorage(); // Save notes after deletion
    renderNotes();
  }
  
  // Event listeners
  saveNoteButton.addEventListener("click", createNote);
  
  // Load notes when the page loads
  loadNotes();
  