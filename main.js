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
    DOM.editorWrapper = document.getElementById('editor-wrapper');
    DOM.emptyState = document.getElementById('empty-state');
    DOM.newNoteBtn = document.getElementById('new-note-btn');
    DOM.saveBtn = document.getElementById('save-note-btn');
    DOM.logoutBtn = document.getElementById('logout-btn');

    initAuth();

    // Check if user is already logged in (from previous session)
    const user = getCurrentUser();

    if (user) {
        setCurrentUserState(user);
        // FETCH NOTES FROM SERVER (Async)
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
            e.stopPropagation(); // Click bubble rokne ke liye
            themeMenu.classList.toggle('hidden');
        });
    }

    // 3. Handle Theme Selection
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedTheme = option.getAttribute('data-theme');

            // Apply Theme
            document.body.setAttribute('data-theme', selectedTheme);

            // Save to LocalStorage
            localStorage.setItem('pn_theme', selectedTheme);

            // Close menu
            themeMenu.classList.add('hidden');
        });
    });

    // 4. Click outside to close menu
    document.addEventListener('click', (e) => {
        if (themeMenu && !themeMenu.contains(e.target) && e.target !== themeBtn) {
            themeMenu.classList.add('hidden');
        }
    });
});