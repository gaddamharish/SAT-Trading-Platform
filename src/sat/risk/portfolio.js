function aggregateExposure(positions=[]){
  return positions.reduce((a,p)=>({
    grossRisk:a.grossRisk+(Number(p.maxLoss)||0),
    netPnl:a.netPnl+(Number(p.pnl)||0),
    delta:a.delta+(Number(p.delta)||0),
    gamma:a.gamma+(Number(p.gamma)||0),
    theta:a.theta+(Number(p.theta)||0),
    vega:a.vega+(Number(p.vega)||0)
  }),{grossRisk:0,netPnl:0,delta:0,gamma:0,theta:0,vega:0});
}
function portfolioRiskGate({exposure,dailyLossLimit,portfolioRiskLimit}={}){
  const failures=[]; const e=exposure||aggregateExposure([]);
  if(Number.isFinite(dailyLossLimit)&&e.netPnl < -Math.abs(dailyLossLimit)) failures.push('DAILY_LOSS_LIMIT');
  if(Number.isFinite(portfolioRiskLimit)&&e.grossRisk > Math.abs(portfolioRiskLimit)) failures.push('PORTFOLIO_RISK_LIMIT');
  return {passed:failures.length===0,failures,exposure:e};
}
module.exports={aggregateExposure,portfolioRiskGate};
