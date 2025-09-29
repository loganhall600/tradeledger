import { DashboardPage } from './pages/dashboard.js';
import { TradesPage } from './pages/trades.js';
import { JournalPage } from './pages/journal.js';
import { AnalyticsPage } from './pages/analytics.js';
import { PlaybooksPage } from './pages/playbooks.js';
import { SettingsPage } from './pages/settings.js';

const routes = {
  '#/app/dashboard': DashboardPage,
  '#/app/trades': TradesPage,
  '#/app/journal': JournalPage,
  '#/app/analytics': AnalyticsPage,
  '#/app/playbooks': PlaybooksPage,
  '#/app/settings': SettingsPage,
};

export function initRouter(store){
  const render = () => {
    const key = Object.keys(routes).find(k => location.hash.startsWith(k)) || '#/app/dashboard';
    const Page = routes[key];
    document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href')===key));
    const outlet = document.getElementById('page-outlet');
    outlet.innerHTML = '';
    Page(outlet, store);
    document.querySelector('.topbar .title').textContent = key.split('/').slice(-1)[0].replace(/^\w/, c=>c.toUpperCase());
  };
  addEventListener('hashchange', render);
  render();
}
