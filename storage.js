const API_URL = 'http://localhost:5000/api';

// --- AUTHENTICATION ---

export async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) return null;
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}

export async function registerUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return response.ok;
    } catch (error) {
        console.error('Signup error:', error);
        return false;
    }
}

// --- NOTES ---

export async function getNotes(email) {
    try {
        const response = await fetch(`${API_URL}/notes?email=${email}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Fetch notes error:', error);
        return [];
    }
}

export async function saveNotes(email, notes) {
    try {
        await fetch(`${API_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, notes })
        });
    } catch (error) {
        console.error('Save notes error:', error);
    }
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('pn_current_user'));
}

export function setCurrentUser(user) {
    if (user) {
        localStorage.setItem('pn_current_user', JSON.stringify(user));
    } else {
        localStorage.removeItem('pn_current_user');
    }
}

export function getUsers() { return []; }
export function saveUsers() { }