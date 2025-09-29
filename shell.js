export function mountShell(root){
  root.innerHTML = `
  <div class="app">
    <aside class="sidebar">
      <div class="brand">
        <div class="dot"></div>
        <h1>TradeLedger&nbsp;Pro</h1>
      </div>
      <nav class="nav">
        <a href="#/app/dashboard"><svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>Dashboard</a>
        <a href="#/app/trades"><svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h12v2H3v-2z"/></svg>Trades</a>
        <a href="#/app/journal"><svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M19 2H8a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h11V2zM8 4h9v16H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path fill="currentColor" d="M5 6h2v12H5z"/></svg>Journal</a>
        <a href="#/app/analytics"><svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M3 3h2v18H3V3zm16 8h2v10h-2V11zM7 13h2v8H7v-8zm8-6h2v14h-2V7z"/></svg>Analytics</a>
        <a href="#/app/playbooks"><svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4zm14 14V8a2 2 0 0 0-2-2H6v10a2 2 0 0 0 2 2h10z"/></svg>Playbooks</a>
        <a href="#/app/settings"><svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm8.94 4.94l-1.41-.82a7.96 7.96 0 0 0 0-2.24l1.41-.82-1.41-2.44-1.63.67a8.04 8.04 0 0 0-1.94-1.12L15.7 2h-3.4l-.65 1.98a8.04 8.04 0 0 0-1.94 1.12l-1.63-.67L4.67 6.9l1.41.82a7.96 7.96 0 0 0 0 2.24l-1.41.82 1.41 2.44 1.63-.67c.6.46 1.24.85 1.94 1.12L12.3 22h3.4l.65-1.98c.7-.27 1.34-.66 1.94-1.12l1.63.67 1.41-2.44z"/></svg>Settings</a>
      </nav>
    </aside>

    <main class="main">
      <div class="topbar">
        <div class="title">Dashboard</div>
        <div class="filters">
          <span class="tag">Date: Last 30d</span>
          <span class="tag">Symbol: All</span>
          <span class="tag">Session: All</span>
        </div>
      </div>
      <div id="page-outlet" class="page"></div>
    </main>
  </div>`;
}
