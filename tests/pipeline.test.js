const test=require('node:test');const assert=require('node:assert/strict');const {runDecisionPipeline}=require('../src/sat/engine/pipeline');
const base=()=>({marketSnapshot:{timestamp:Date.now()},features:{trend:1},regime:'TREND',evidence:{technical:{ema:true},derivatives:{pcr:true},historical:{matches:2}},legs:[{strike:25000,optionType:'CE',side:'BUY',quantity:1}],netPremium:100,riskBudget:1000,liquidityOk:true,executionRisk:'LOW',direction:'BULLISH',strategy:'LONG_CALL',confidence:.82});
test('suppresses stale data',()=>{const x=base();x.marketSnapshot.timestamp=Date.now()-60000;assert.equal(runDecisionPipeline(x).status,'SUPPRESSED')});
test('requires exact legs',()=>{const x=base();x.legs=[];assert.equal(runDecisionPipeline(x).reason,'EXACT_LEGS_REQUIRED')});
test('enforces human approval',()=>{const r=runDecisionPipeline(base());assert.equal(r.execution.requiresHumanApproval,true);assert.equal(r.execution.brokerConfirmed,false)});
test('risk gate suppresses over-budget trade',()=>{const x=base();x.riskBudget=1;const r=runDecisionPipeline(x);assert.equal(r.status,'SUPPRESSED');assert.equal(r.stage,'RISK')});
