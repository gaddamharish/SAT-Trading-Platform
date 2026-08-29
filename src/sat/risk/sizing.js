function sizeByRisk({riskBudget,maxLossPerUnit,lotSize=1,maxLots=Infinity}={}){
  const budget=Number(riskBudget), loss=Number(maxLossPerUnit), lot=Math.max(1,Number(lotSize)||1);
  if(!Number.isFinite(budget)||budget<=0) throw new Error('riskBudget must be positive');
  if(!Number.isFinite(loss)||loss<=0) throw new Error('maxLossPerUnit must be positive');
  const raw=Math.floor(budget/(loss*lot));
  const lots=Math.max(0,Math.min(Number.isFinite(maxLots)?Math.max(0,Math.floor(maxLots)):raw,raw));
  return {lots,quantity:lots*lot,allocatedRisk:lots*lot*loss,unusedBudget:budget-lots*lot*loss};
}
function riskReward({maxProfit,maxLoss}={}){
  const profit=Number(maxProfit), loss=Number(maxLoss);
  if(!Number.isFinite(profit)||profit<0||!Number.isFinite(loss)||loss<=0) return null;
  return profit/loss;
}
module.exports={sizeByRisk,riskReward};
