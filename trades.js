export function TradesPage(root, store){
  const rows = store.trades.map(t=>`
    <tr>
      <td>${t.date}</td>
      <td>${t.symbol}</td>
      <td>${t.direction}</td>
      <td>${(+t.r||0).toFixed(2)}R</td>
      <td>$${(+t.pnl||0).toFixed(2)}</td>
    </tr>`).join('');
  root.innerHTML = `
    <div class="card">
      <h3>Trades</h3>
      <table class="table">
        <thead><tr><th>Date</th><th>Symbol</th><th>Dir</th><th>R</th><th>P&L</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
