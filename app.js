import { mountShell } from './components/shell.js';
import { initRouter } from './router.js';
import { Store } from './store.js';

window.TL = { Store }; // dev aid in console

const appEl = document.getElementById('app');
const store = new Store();

mountShell(appEl);               // render sidebar + topbar
initRouter(store);               // start hash routing

// Default route
if (!location.hash) location.hash = '#/app/dashboard';
