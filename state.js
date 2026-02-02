export let currentUser = null;
export let notes = [];
export let activeNoteId = null;

export function setCurrentUserState(user) {
    currentUser = user;
}

export function setNotesState(newNotes) {
    notes = newNotes;
}

export function setActiveNoteId(id) {
    activeNoteId = id;
}
