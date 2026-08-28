function scoreOpportunity({confidence=0,technical=0,derivatives=0,historical=0,liquidity=0,risk=0}={}){const clamp=x=>Math.max(0,Math.min(1,Number(x)||0));return clamp(.30*confidence+.20*technical+.20*derivatives+.15*historical+.10*liquidity+.05*(1-clamp(risk)));}
function rankOpportunities(items=[]){return [...items].map(x=>({...x,score:scoreOpportunity(x)})).sort((a,b)=>b.score-a.score);}
module.exports={scoreOpportunity,rankOpportunities};
