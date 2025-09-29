export class Store {
  constructor(){
    // Try to read existing data from your current app keys (best guess fallback)
    const ls = localStorage.getItem('tradeledger.trades') || localStorage.getItem('trades') || '[]';
    try { this.trades = JSON.parse(ls); } catch { this.trades = []; }
    // Seed a few demo trades if empty (so charts render)
    if (!this.trades.length) {
      this.trades = [
        { date:'2025-09-22', symbol:'MES1!', direction:'Long', r: 0.98, pnl: 146.88 },
        { date:'2025-09-22', symbol:'MES1!', direction:'Long', r: 0.91, pnl: 136.88 },
        { date:'2025-09-23', symbol:'MES1!', direction:'Long', r:-0.07, pnl:  -9.16 },
        { date:'2025-09-23', symbol:'MES1!', direction:'Short', r: 1.40, pnl: 210.00 },
        { date:'2025-09-24', symbol:'MES1!', direction:'Long', r: 1.33, pnl: 200.00 },
      ];
    }
  }
  getSummary(){
    const pnl = this.trades.reduce((s,t)=>s+(+t.pnl||0),0);
    const wins = this.trades.filter(t=>t.pnl>0).length;
    const wr = this.trades.length? Math.round((wins/this.trades.length)*100):0;
    const avgR = this.trades.length? (this.trades.reduce((s,t)=>s+(+t.r||0),0)/this.trades.length).toFixed(2):'0.00';
    const equity = this._equity();
    let peak = -1e9, maxDD = 0;
    for (const v of equity){ if (v>peak) peak=v; maxDD = Math.min(maxDD, v-peak); }
    return { pnl, wr, avgR, dd: maxDD };
  }
  _equity(){
    let e=0; return this.trades.map(t=> e += (+t.pnl||0));
  }
  getEquitySeries(){
    let e=0; return this.trades.map((t,i)=>({ x:i+1, y:(e+=(+t.pnl||0)) }));
  }
}
