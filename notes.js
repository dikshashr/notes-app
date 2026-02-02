import { DOM } from './dom.js';
import { saveNotes } from './storage.js';
import { currentUser, notes, activeNoteId, setNotesState, setActiveNoteId } from './state.js';

function formatNoteDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);


    if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } 
    else {
        return date.toLocaleDateString();
    }
}

export function renderNotes() {
    DOM.notesList.innerHTML = '';

    if (!notes.length) {
        DOM.notesList.innerHTML = '<p style="text-align:center; color: var(--text-muted); margin-top: 20px;">No notes yet</p>';
        return;
    }

    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note-card';

        
        const displayDate = formatNoteDate(note.createdAt);

        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <span class="note-title">${note.title || 'Untitled Note'}</span>
                <span class="note-date" style="font-size: 0.75rem; color: var(--text-muted); min-width: 60px; text-align: right;">${displayDate}</span>
            </div>
            <button class="delete-btn">Delete</button>
        `;

        div.onclick = () => {
            setActiveNoteId(note.id); 
            DOM.titleInput.value = note.title;
            DOM.contentInput.value = note.content;
            DOM.editorWrapper.classList.remove('hidden');
            DOM.emptyState.classList.add('hidden');
        };

        div.querySelector('.delete-btn').onclick = e => {
            e.stopPropagation();
            deleteNote(note.id); 
        };

        DOM.notesList.appendChild(div);
    });
}

export function createNewNote() {
    setActiveNoteId(null);
    DOM.titleInput.value = '';
    DOM.contentInput.value = '';
    const quillElement = document.querySelector('.ql-editor');
    if(quillElement) quillElement.innerHTML = '';
    DOM.editorWrapper.classList.remove('hidden');
    DOM.emptyState.classList.add('hidden');
}

export function saveNote() {
    const title = DOM.titleInput.value.trim();
    const content = DOM.contentInput.value.trim();

    let updatedNotes = [...notes];

    if (activeNoteId) {
        const note = updatedNotes.find(n => n.id === activeNoteId);
        if (!note) return;
        note.title = title;
        note.content = content;
    } else {
        updatedNotes.unshift({
            id: 'note_' + Date.now(),
            title,
            content
        });
    }

    setNotesState(updatedNotes);
    saveNotes(currentUser.email, updatedNotes);
    renderNotes();

    DOM.editorWrapper.classList.add('hidden');
    DOM.emptyState.classList.remove('hidden');
}

export function deleteNote(id) {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotesState(updatedNotes);
    saveNotes(currentUser.email, updatedNotes);
    renderNotes();
}
