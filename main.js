import { getCurrentUser, getNotes } from './storage.js';
import { setCurrentUserState, setNotesState } from './state.js';
import { showAuth, showDashboard } from './ui.js';
import { initAuth } from './auth.js';
import { renderNotes, createNewNote, saveNote } from './notes.js';
import { DOM } from './dom.js';

document.addEventListener('DOMContentLoaded', async () => {

    DOM.authContainer = document.getElementById('auth-container');
    DOM.dashboardContainer = document.getElementById('dashboard-container');
    DOM.loginForm = document.getElementById('login-form');
    DOM.loginEmail = document.getElementById('login-email');
    DOM.loginPassword = document.getElementById('login-password');
    DOM.signupForm = document.getElementById('signup-form');
    DOM.signupEmail = document.getElementById('signup-email');
    DOM.signupPassword = document.getElementById('signup-password');
    DOM.signupConfirm = document.getElementById('signup-confirm');
    DOM.notesList = document.getElementById('notes-list');
    DOM.titleInput = document.getElementById('note-title-input');
    DOM.contentInput = document.getElementById('note-content-input');
    DOM.notePreview = document.getElementById('note-preview');
    DOM.editorWrapper = document.getElementById('editor-wrapper');
    DOM.emptyState = document.getElementById('empty-state');
    DOM.newNoteBtn = document.getElementById('new-note-btn');
    DOM.saveBtn = document.getElementById('save-note-btn');
    DOM.logoutBtn = document.getElementById('logout-btn');
    
    DOM.editNoteBtn.addEventListener('click', () => {
        DOM.splitEditor.classList.remove('view-only'); 
        DOM.editNoteBtn.classList.add('hidden');       
        DOM.saveBtn.classList.remove('hidden');        
        DOM.titleInput.readOnly = false;               
    });

    DOM.contentInput.addEventListener('input', () => {
        const rawText = DOM.contentInput.value;
        DOM.notePreview.innerHTML = marked.parse(rawText);
    });

    DOM.editNoteBtn = document.getElementById('edit-note-btn');
    DOM.splitEditor = document.getElementById('split-editor-container');

    DOM.contentInput.addEventListener('input', () => {
        const rawText = DOM.contentInput.value;
        DOM.notePreview.innerHTML = marked.parse(rawText);
    });

    initAuth();

    const user = getCurrentUser();

    if (user) {
        setCurrentUserState(user);
        // FETCH NOTES FROM SERVER
        const notes = await getNotes(user.email);
        setNotesState(notes);

        showDashboard();
        renderNotes();
    } else {
        showAuth();
    }

    DOM.newNoteBtn.addEventListener('click', createNewNote);
    DOM.saveBtn.addEventListener('click', saveNote);

    const themeBtn = document.getElementById('theme-btn');
    const themeMenu = document.getElementById('theme-menu');
    const themeOptions = document.querySelectorAll('.theme-option');

    // 1. Load saved theme
    const savedTheme = localStorage.getItem('pn_theme') || 'default';
    document.body.setAttribute('data-theme', savedTheme);

    // 2. Toggle Menu
    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            themeMenu.classList.toggle('hidden');
        });
    }

    // 3. Handle Theme Selection
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedTheme = option.getAttribute('data-theme');

            document.body.setAttribute('data-theme', selectedTheme);

            localStorage.setItem('pn_theme', selectedTheme);

            themeMenu.classList.add('hidden');
        });
    });

    if (DOM.editBtn && DOM.previewBtn) {
        
        // Switch to PREVIEW
        DOM.previewBtn.addEventListener('click', () => {
            const rawText = DOM.contentInput.value;
            DOM.notePreview.innerHTML = marked.parse(rawText); 
            
            DOM.contentInput.classList.add('hidden'); 
            DOM.notePreview.classList.remove('hidden'); 
            DOM.notePreview.style.display = 'block'; 

            DOM.editBtn.classList.remove('active');
            DOM.previewBtn.classList.add('active');
        });

        // Switch to EDIT
        DOM.editBtn.addEventListener('click', () => {
            DOM.notePreview.classList.add('hidden'); 
            DOM.notePreview.style.display ='none'; 
            
            DOM.contentInput.classList.remove('hidden'); 
            
            DOM.previewBtn.classList.remove('active');
            DOM.editBtn.classList.add('active');
        });
    }

    // 4. Click outside to close menu
    document.addEventListener('click', (e) => {
        if (themeMenu && !themeMenu.contains(e.target) && e.target !== themeBtn) {
            themeMenu.classList.add('hidden');
        }
    });
});
