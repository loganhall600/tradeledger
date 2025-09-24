
(() => {
  'use strict';
  const LS_TRADES='trades_v1', LS_SETTINGS='tl_settings_v1';
  let trades=[], settings={currencySymbol:'£',startingBankroll:0,calcMode:'auto',pointValue:1};
  const $=s=>document.querySelector(s);
  const E={banner:$('#banner'),form:$('#trade-form'),id:$('#t-id'),date:$('#t-date'),symbol:$('#t-symbol'),direction:$('#t-direction'),
    setup:$('#t-setup'),entry:$('#t-entry'),stop:$('#t-stop'),target:$('#t-target'),qty:$('#t-qty'),exit:$('#t-exit'),fees:$('#t-fees'),
    result:$('#t-result'),risk:$('#t-risk'),pnl:$('#t-pnl'),notes:$('#t-notes'),tags:$('#t-tags'),manualFields:$('#manual-fields'),
    saveBtn:$('#save-btn'),resetBtn:$('#reset-btn'),fSearch:$('#f-search'),fResult:$('#f-result'),fDir:$('#f-direction'),
    fFrom:$('#f-from'),fTo:$('#f-to'),fClear:$('#f-clear'),chipSymbols:$('#chip-symbols'),chipSetups:$('#chip-setups'),stats:$('#stats'),
    sCurrency:$('#s-currency'),sBankroll:$('#s-bankroll'),sPoint:$('#s-point'),sCalc:$('#s-calc'),sSave:$('#s-save'),sReset:$('#s-reset'),
    sPreview:$('#s-preview'),tableBody:document.querySelector('#trades-table tbody'),btnExport:$('#btn-export'),btnExportJson:$('#btn-export-json'),
    fileCsv:$('#file-csv'),fileJson:$('#file-json'),btnSettings:$('#btn-settings'),cEquity:$('#chart-equity'),cDaily:$('#chart-daily'),cHist:$('#chart-hist')};

  // banners
  const proto=location.protocol.replace(':',''); const STORAGE_OK=(()=>{try{const k='__t'+Math.random();localStorage.setItem(k,'1');localStorage.removeItem(k);return true}catch(e){return false}})();
  const notes=[]; if(!(proto==='http'||proto==='https')) notes.push('Opened via "'+proto+':". Use https for saving/install.');
  if(!STORAGE_OK) notes.push('Local storage is blocked.'); if(notes.length){E.banner.style.display='block'; E.banner.textContent=notes.join(' ')}

  function load(){try{trades=JSON.parse(localStorage.getItem(LS_TRADES))||[]}catch{} try{settings=Object.assign(settings, JSON.parse(localStorage.getItem(LS_SETTINGS))||{})}catch{}}
  function saveTrades(){try{localStorage.setItem(LS_TRADES, JSON.stringify(trades))}catch{}}
  function saveSettings(){try{localStorage.setItem(LS_SETTINGS, JSON.stringify(settings))}catch{}}

  const esc=s=>String(s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const money=x=>(settings.currencySymbol||'')+Number(x||0).toFixed(2);
  const parseTags=s=>(s||'').split(',').map(t=>t.trim()).filter(Boolean);

  function calc(tr){
    if(settings.calcMode==='manual'){
      const risk=Number(tr.riskDollar||0); const pnl=(tr.pnlDollar==null||tr.pnlDollar==='')?null:Number(tr.pnlDollar);
      return {risk,pnl,r:(pnl!=null&&risk>0)?pnl/risk:null};
    }
    const pv=Number(settings.pointValue)||1;
    const risk=Math.abs(Number(tr.entry)-Number(tr.stop))*Number(tr.qty||0)*pv;
    let pnl=null; if(tr.exitWtdAvg!=null&&tr.exitWtdAvg!==''){ const mult=tr.direction==='long'?1:-1; pnl=(Number(tr.exitWtdAvg)-Number(tr.entry))*Number(tr.qty||0)*pv*mult-Number(tr.fees||0); }
    return {risk,pnl,r:(pnl!=null&&risk>0)?pnl/risk:null};
  }

  function unique(field){return Array.from(new Set(trades.map(t=>(t[field]||'').trim()).filter(Boolean)))}
  function renderChips(){E.chipSymbols.innerHTML=unique('symbol').map(s=>`<button class="chip" data-k="symbol" data-v="${esc(s)}">${esc(s)}</button>`).join(''); E.chipSetups.innerHTML=unique('setup').map(s=>`<button class="chip" data-k="setup" data-v="${esc(s)}">${esc(s)}</button>`).join('')}

  function filtered(){
    const q=(E.fSearch.value||'').toLowerCase().trim(), r=E.fResult.value, d=E.fDir.value, f=E.fFrom.value, t=E.fTo.value;
    return trades.filter(x=>{
      if(q && !(x.symbol+' '+x.setup+' '+(x.notes||'')+' '+(x.tags||[]).join(' ')).toLowerCase().includes(q)) return false;
      if(r && x.result!==r) return false; if(d && x.direction!==d) return false; if(f && x.date<f) return false; if(t && x.date>t) return false; return true;
    }).sort((a,b)=>(b.date+a.id)<(a.date+b.id)?-1:1);
  }

  function renderTable(){
    E.tableBody.innerHTML=filtered().map(t=>{const c=calc(t);const pnl=(settings.calcMode==='manual')?c.pnl:(t.result!=='pending'?c.pnl:0);const r=c.r;const tags=(t.tags||[]).join('; ');
      return `<tr><td>${esc(t.date)}</td><td>${esc(t.symbol)}</td><td>${esc(t.direction[0].toUpperCase())}</td><td>${esc(t.setup||'')}</td><td>${t.entry??''}</td><td>${t.stop??''}</td><td>${t.target??''}</td><td>${t.qty??''}</td><td>${t.exitWtdAvg??''}</td><td>${pnl==null?'':(pnl>=0?'+':'')+money(pnl)}</td><td>${r==null?'':r.toFixed(2)}</td><td><span class="tag ${t.result}">${t.result}</span></td><td>${esc((t.notes||'')+(tags?(' | '+tags):''))}</td><td><button class="small" data-action="edit" data-id="${t.id}">Edit</button><button class="small" data-action="mark-win" data-id="${t.id}">Win</button><button class="small" data-action="mark-loss" data-id="${t.id}">Loss</button><button class="small" data-action="mark-be" data-id="${t.id}">BE</button><button class="small" data-action="delete" data-id="${t.id}">Delete</button></td></tr>`}).join('')||'<tr><td colspan="14" style="color:var(--muted);text-align:center;padding:14px">No trades yet.</td></tr>';
  }

  let chE=null,chD=null,chH=null;
  function renderStats(){
    const settled=trades.filter(t=>t.result!=='pending'), wins=settled.filter(t=>t.result==='win'), losses=settled.filter(t=>t.result==='loss'), be=settled.filter(t=>t.result==='breakeven');
    let net=0,sumWin=0,sumLoss=0,countWin=0,countLoss=0,totalR=0,cum=0; const equity=[], daily={};
    settled.forEach(t=>{const {pnl,r}=calc(t); const p=Number(pnl||0); net+=p; totalR+=(r||0); if(t.result==='win'){sumWin+=p;countWin++;} if(t.result==='loss'){sumLoss+=p;countLoss++;} daily[t.date]=(daily[t.date]||0)+p;});
    trades.slice().sort((a,b)=>(a.date+a.id)<(b.date+b.id)?-1:1).forEach(t=>{if(t.result==='pending')return; const {pnl}=calc(t); cum+=Number(pnl||0); equity.push(cum)});
    const wr=settled.length?(wins.length/settled.length*100):0, avgWinR=countWin?(totalR>0?totalR/countWin:0):0, avgLossR=countLoss?((sumLoss!==0?Math.abs(totalR-totalR):0)/countLoss):0;
    const expectancyR = settled.length? ((wins.length/settled.length)*(countWin? (totalR>0?totalR/countWin:0):0) - (losses.length/settled.length)*(countLoss? (sumLoss?Math.abs(sumLoss)/countLoss:0):0)) : 0;
    const profitFactor = sumLoss!==0 ? (sumWin/abs(sumLoss)) : (sumWin>0?Infinity:0);
    function abs(x){return Math.abs(x)}
    let peak=-1e9,maxDD=0; equity.forEach(v=>{peak=Math.max(peak,v); maxDD=Math.min(maxDD,v-peak)});
    const balance=(Number(settings.startingBankroll)||0)+net;
    const card=(k,v)=>`<div class="card"><div class="k">${k}</div><div class="v">${v}</div></div>`;
    E.stats.innerHTML=[card('Trades/Settled/Pending',`${trades.length} / ${settled.length} / ${trades.length-settled.length}`),card('Wins/Losses/BE',`${wins.length} / ${losses.length} / ${be.length}`),card('Win Rate',`${wr.toFixed(1)}%`),card('Net P&L',(net>=0?'+':'')+money(net)),card('Total R',totalR.toFixed(2)),card('Expectancy (R)',expectancyR.toFixed(2)),card('Profit Factor', (sumLoss===0?(sumWin>0?'∞':'0.00'):(sumWin/Math.abs(sumLoss)).toFixed(2))),card('Max Drawdown',money(maxDD)),card('Balance',money(balance))].join('');

    if(typeof Chart!=='undefined'){
      const labelsEq = equity.map((_,i)=>String(i+1));
      if(chE) chE.destroy(); chE = new Chart(E.cEquity.getContext('2d'), {type:'line', data:{labels:labelsEq,datasets:[{label:'Equity',data:equity,tension:.25}]}, options:{plugins:{legend:{display:false},title:{display:true,text:'Equity Glidepath'}}, scales:{x:{title:{display:true,text:'Trade #'}},y:{title:{display:true,text:'P&L'}}}}});
      const days=Object.keys(daily).sort(), vals=days.map(d=>daily[d]);
      if(chD) chD.destroy(); chD = new Chart(E.cDaily.getContext('2d'), {type:'bar', data:{labels:days,datasets:[{label:'Daily Net',data:vals} ]}, options:{plugins:{legend:{display:false},title:{display:true,text:'Daily Scoreboard'}}, scales:{y:{title:{display:true,text:'P&L'}}}}});
      const rVals=settled.map(t=>{const r=calc(t).r; return r||0}); const buckets=new Array(21).fill(0); rVals.forEach(r=>{const v=Math.max(-10,Math.min(10,r)); const idx=Math.round(v)+10; buckets[idx]++;}); const labelsH=Array.from({length:21},(_,i)=>(i-10)+'R');
      if(chH) chH.destroy(); chH = new Chart(E.cHist.getContext('2d'), {type:'bar', data:{labels:labelsH,datasets:[{label:'R Count',data:buckets}]}, options:{plugins:{legend:{display:false},title:{display:true,text:'R Histogram'}}}});
    }
  }

  function resetForm(){E.form.reset();E.id.value='';E.saveBtn.textContent='Save Trade';E.date.value=new Date().toISOString().slice(0,10);E.manualFields.hidden=(settings.calcMode!=='manual')}
  function addOrUpdate(e){e.preventDefault();const t={id:E.id.value||(Date.now()+Math.random().toString(36).slice(2,7)),date:E.date.value||new Date().toISOString().slice(0,10),symbol:(E.symbol.value||'').trim(),direction:E.direction.value,setup:(E.setup.value||'').trim(),entry:parseFloat(E.entry.value),stop:parseFloat(E.stop.value),target:E.target.value?parseFloat(E.target.value):null,qty:parseFloat(E.qty.value)||0,exitWtdAvg:E.exit.value?parseFloat(E.exit.value):null,fees:E.fees.value?parseFloat(E.fees.value):0,result:E.result.value,notes:(E.notes.value||'').trim(),tags:parseTags(E.tags.value),riskDollar:E.risk.value?parseFloat(E.risk.value):null,pnlDollar:E.pnl.value?parseFloat(E.pnl.value):null}; if(!t.symbol){alert('Symbol is required');return} if(!isFinite(t.entry)||!isFinite(t.stop)){alert('Entry and Stop are required numbers');return} const idx=trades.findIndex(x=>x.id===t.id); if(idx>=0) trades[idx]=t; else trades.push(t); saveTrades(); resetForm(); renderAll(); }
  function onTableClick(e){const b=e.target.closest('button'); if(!b) return; const id=b.dataset.id, a=b.dataset.action; const t=trades.find(x=>x.id===id); if(!t) return;
    if(a==='edit'){E.id.value=t.id;E.date.value=t.date;E.symbol.value=t.symbol;E.direction.value=t.direction;E.setup.value=t.setup||'';E.entry.value=t.entry??'';E.stop.value=t.stop??'';E.target.value=t.target??'';E.qty.value=t.qty??'';E.exit.value=t.exitWtdAvg??'';E.fees.value=t.fees??'';E.result.value=t.result;E.notes.value=t.notes||'';E.tags.value=(t.tags||[]).join(', ');E.risk.value=t.riskDollar??'';E.pnl.value=t.pnlDollar??'';E.saveBtn.textContent='Update Trade';window.scrollTo({top:0,behavior:'smooth'})}
    else if(a==='delete'){if(confirm('Delete this trade?')){trades=trades.filter(x=>x.id!==id);saveTrades();renderAll()}}
    else if(a==='mark-win'||a==='mark-loss'||a==='mark-be'){t.result=a==='mark-win'?'win':(a==='mark-loss'?'loss':'breakeven');saveTrades();renderAll()}
  }

  function download(name,data,type){const blob=new Blob([data],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url)}
  function exportCSV(){const headers=['id','date','symbol','direction','setup','entry','stop','target','qty','exitWtdAvg','fees','pnl','rMultiple','result','notes','tags']; const rows=trades.map(t=>{const c=calc(t); const obj=Object.assign({},t); obj.pnl=(c.pnl==null?'':c.pnl.toFixed(2)); obj.rMultiple=(c.r==null?'':c.r.toFixed(2)); obj.tags=(obj.tags||[]).join(';'); return headers.map(h=>`"${String(obj[h]??'').replaceAll('"','""')}"`).join(',')}); download('trades.csv',[headers.join(','),...rows].join('\n'),'text/csv')}
  function exportJSON(){download('trades.json', JSON.stringify({settings,trades},null,2), 'application/json')}
  function parseCSVLine(line){const out=[];let cur='';let q=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch=='"'){if(q&&line[i+1]=='"'){cur+='"';i++;continue} q=!q;continue} if(ch==','&&!q){out.push(cur);cur='';continue} cur+=ch} out.push(cur); return out.map(s=>s.trim())}
  function importCSV(file){const r=new FileReader();r.onload=()=>{const text=r.result; const lines=text.split(/\r?\n/).filter(Boolean); if(lines.length<2) return alert('CSV seems empty'); const header=lines[0].split(',').map(h=>h.trim().replace(/^"|"$/g,'')); const imported=[]; for(let i=1;i<lines.length;i++){const p=parseCSVLine(lines[i]); if(p.length!==header.length) continue; const o={}; for(let j=0;j<header.length;j++) o[header[j]]=p[j].replace(/^"|"$/g,''); o.entry=parseFloat(o.entry)||0; o.stop=parseFloat(o.stop)||0; o.target=o.target?parseFloat(o.target):null; o.qty=parseFloat(o.qty)||0; o.exitWtdAvg=o.exitWtdAvg?parseFloat(o.exitWtdAvg):null; o.fees=o.fees?parseFloat(o.fees):0; o.pnlDollar=o.pnl?parseFloat(o.pnl):null; o.riskDollar=null; o.tags=(o.tags||'').split(';').map(s=>s.trim()).filter(Boolean); imported.push(o)} for(const imp of imported){const idx=trades.findIndex(t=>t.id===imp.id); if(idx>=0) trades[idx]=Object.assign(trades[idx],imp); else trades.push(imp)} saveTrades(); renderAll(); alert(`Imported ${imported.length} rows`)}; r.readAsText(file)}
  function restoreJSON(file){const r=new FileReader(); r.onload=()=>{try{const data=JSON.parse(r.result); if(data.settings) settings=Object.assign(settings,data.settings); if(Array.isArray(data.trades)) trades=data.trades; saveSettings(); saveTrades(); renderAll(); alert('Restore complete')}catch(e){alert('Invalid JSON')}}; r.readAsText(file)}

  function hydrate(){E.sCurrency.value=settings.currencySymbol||'£'; E.sBankroll.value=settings.startingBankroll||0; E.sPoint.value=settings.pointValue||1; E.sCalc.value=settings.calcMode||'auto'; E.manualFields.hidden=(settings.calcMode!=='manual'); E.sPreview.textContent=`Calc mode: ${settings.calcMode}. Risk = |entry-stop| × qty × pointValue (${settings.pointValue}).`}
  function bind(){E.form.addEventListener('submit', addOrUpdate); E.resetBtn.addEventListener('click', resetForm); E.tableBody.addEventListener('click', onTableClick);
    E.fSearch.addEventListener('input', renderAll); E.fResult.addEventListener('change', renderAll); E.fDir.addEventListener('change', renderAll); E.fFrom.addEventListener('change', renderAll); E.fTo.addEventListener('change', renderAll); E.fClear.addEventListener('click', ()=>{E.fSearch.value='';E.fResult.value='';E.fDir.value='';E.fFrom.value='';E.fTo.value='';renderAll()});
    document.addEventListener('click', e=>{const chip=e.target.closest('.chip'); if(!chip) return; const v=chip.dataset.v; E.fSearch.value=v; renderAll()});
    E.btnExport.addEventListener('click', exportCSV); E.btnExportJson.addEventListener('click', exportJSON);
    E.fileCsv.addEventListener('change', e=>{const f=e.target.files?.[0]; if(f) importCSV(f); e.target.value=''});
    E.fileJson.addEventListener('change', e=>{const f=e.target.files?.[0]; if(f) restoreJSON(f); e.target.value=''});
    E.sSave.addEventListener('click', ()=>{settings.currencySymbol=(E.sCurrency.value||'£').trim()||'£'; settings.startingBankroll=parseFloat(E.sBankroll.value)||0; settings.pointValue=parseFloat(E.sPoint.value)||1; settings.calcMode=E.sCalc.value||'auto'; saveSettings(); hydrate(); renderAll()});
    E.sReset.addEventListener('click', ()=>{settings={currencySymbol:'£',startingBankroll:0,calcMode:'auto',pointValue:1}; saveSettings(); hydrate(); renderAll()});
    $('#btn-settings').addEventListener('click', ()=>{window.scrollTo({top:document.body.scrollHeight, behavior:'smooth'})});
  }
  function renderAll(){renderChips();renderTable();renderStats();hydrate()}
  function init(){try{trades=JSON.parse(localStorage.getItem(LS_TRADES))||[]}catch{} try{settings=Object.assign(settings, JSON.parse(localStorage.getItem(LS_SETTINGS))||{})}catch{} bind(); resetForm(); renderAll()}
  init();
})();