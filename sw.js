const CACHE = 'tl-ui-refresh-v1';
const ASSETS = [
  './','./index.html','./styles.css','./app.js','./router.js','./store.js','./charts.js',
  './manifest.webmanifest','./components/shell.js',
  './pages/dashboard.js','./pages/trades.js','./pages/journal.js','./pages/analytics.js','./pages/playbooks.js','./pages/settings.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE && caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  const isNav = req.mode==='navigate' || (req.method==='GET' && req.headers.get('accept')?.includes('text/html'));

  if (isNav) {
    e.respondWith(
      fetch(req).then(res => { caches.open(CACHE).then(c=>c.put(req,res.clone())); return res; })
      .catch(()=> caches.match('./index.html'))
    );
    return;
  }

  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        caches.open(CACHE).then(c=>c.put(req,res.clone())); return res;
      }))
    );
    return;
  }

  e.respondWith(fetch(req).catch(()=>caches.match(req)));
});

self.addEventListener('message', (e)=>{ if(e.data==='SKIP_WAITING') self.skipWaiting(); });
