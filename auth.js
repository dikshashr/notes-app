import { DOM } from './dom.js';
import { loginUser, registerUser, setCurrentUser, getNotes } from './storage.js';
import { showDashboard, showAuth } from './ui.js';
import { setCurrentUserState, setNotesState } from './state.js';
import { renderNotes } from './notes.js';

export function initAuth() {

    /* LOGIN SUBMIT */
    DOM.loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = DOM.loginEmail.value.trim();
        const password = DOM.loginPassword.value.trim();

        // 1. Call the Server
        const user = await loginUser(email, password);

        if (!user) {
            alert('Invalid credentials');
            return;
        }

        // 2. Setup Local State
        setCurrentUser(user);
        setCurrentUserState(user);

        // 3. Fetch Notes from Server
        const userNotes = await getNotes(user.email);
        setNotesState(userNotes);

        // 4. Update UI
        showDashboard();
        renderNotes();
    });

    /* SIGNUP SUBMIT */
    DOM.signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = DOM.signupEmail.value.trim();
        const password = DOM.signupPassword.value.trim();
        const confirm = DOM.signupConfirm.value.trim();

        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }

        // Call the Server
        const success = await registerUser(email, password);

        if (success) {
            alert('Account created! Please login.');
            DOM.signupForm.reset();
            DOM.signupForm.classList.add('hidden');
            DOM.loginForm.classList.remove('hidden');
        } else {
            alert('User already exists or server error');
        }
    });

    /* TOGGLE BUTTONS */
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');

    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', () => {
            DOM.loginForm.classList.add('hidden');
            DOM.signupForm.classList.remove('hidden');
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            DOM.signupForm.classList.add('hidden');
            DOM.loginForm.classList.remove('hidden');
        });
    }

    /* LOGOUT */
    DOM.logoutBtn.addEventListener('click', () => {
        setCurrentUser(null);
        showAuth();
    });
}
