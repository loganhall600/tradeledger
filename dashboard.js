import { sparkline } from '../charts.js';

export function DashboardPage(root, store){
  const { pnl, wr, avgR, dd } = store.getSummary();
  root.innerHTML = `
    <section class="tiles">
      <div class="tile"><div class="k">Net P&L</div><div class="v">$${pnl.toFixed(2)}</div></div>
      <div class="tile"><div class="k">Win Rate</div><div class="v">${wr}%</div></div>
      <div class="tile"><div class="k">Avg R/Trade</div><div class="v">${avgR}</div></div>
      <div class="tile"><div class="k">Max Drawdown</div><div class="v">$${dd.toFixed(2)}</div></div>
    </section>

    <section class="grid">
      <div class="card" style="grid-column: span 8">
        <h3>Equity Curve</h3>
        <div style="height:240px"><canvas id="eq"></canvas></div>
      </div>
      <div class="card" style="grid-column: span 4">
        <h3>Today</h3>
        <p class="tag">Session: London · New York</p>
        <p class="tag">Symbols: All</p>
        <p class="tag">Saved view: Default</p>
        <p style="color:var(--muted)">Use Settings to link Journal and Trades. Add widgets in Analytics.</p>
      </div>
    </section>
  `;
  const series = store.getEquitySeries();
  const labels = series.map(p => p.x);
  const vals = series.map(p => p.y);
  sparkline(document.getElementById('eq'), labels, vals);
}
