const test=require('node:test');
const assert=require('node:assert/strict');
const sat=require('../src/sat');

test('risk sizing never exceeds budget',()=>{
 const x=sat.sizeByRisk({riskBudget:10000,maxLossPerUnit:1200,lotSize:50});
 assert.equal(x.lots,0);
 assert.ok(x.allocatedRisk<=10000);
});

test('risk sizing allocates whole lots within budget',()=>{
 const x=sat.sizeByRisk({riskBudget:100000,maxLossPerUnit:1200,lotSize:50});
 assert.equal(x.lots,1);
 assert.equal(x.allocatedRisk,60000);
});

test('portfolio gate blocks excessive gross risk',()=>{
 const exposure=sat.aggregateExposure([{maxLoss:80000,pnl:1000,delta:1,gamma:2,theta:-3,vega:4}]);
 const r=sat.portfolioRiskGate({exposure,portfolioRiskLimit:50000});
 assert.equal(r.passed,false);
 assert.ok(r.failures.includes('PORTFOLIO_RISK_LIMIT'));
});

test('advanced strategies expose exact legs',()=>{
 const x=sat.bullPutSpread({expiry:'2026-09-03',shortStrike:25000,longStrike:24900,shortPremium:80,longPremium:40,quantity:1,liquidity:true});
 assert.equal(x.legs.length,2);
 assert.deepEqual(x.legs.map(l=>[l.strike,l.optionType,l.side]),[[24900,'PE','BUY'],[25000,'PE','SELL']]);
});

test('long straddle requires same strike call and put',()=>{
 const x=sat.longStraddle({expiry:'2026-09-03',strike:25000,callPremium:120,putPremium:110,quantity:1,liquidity:true});
 assert.equal(x.legs.length,2);
 assert.equal(x.netPremium,230);
});
