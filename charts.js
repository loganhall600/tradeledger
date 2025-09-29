export function sparkline(canvas, labels, values, opts={}){
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type:'line',
    data:{ labels, datasets:[{ data: values, tension:.25, borderWidth:2, pointRadius:0, fill:false }] },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{display:false}, tooltip:{enabled:true} },
      scales:{ x:{ display:false }, y:{ display:false } }
    }
  });
}
