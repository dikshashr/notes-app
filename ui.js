import { DOM } from './dom.js';

export function showAuth() {
    DOM.authContainer.classList.remove('hidden');
    DOM.dashboardContainer.classList.add('hidden');
}

export function showDashboard() {
    DOM.authContainer.classList.add('hidden');
    DOM.dashboardContainer.classList.remove('hidden');
}
