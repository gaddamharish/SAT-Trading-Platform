const test=require('node:test');
const assert=require('node:assert/strict');
const {selectStrike}=require('../src/sat/options/engine');

test('strike selection prefers target delta when chain deltas are available',()=>{
 const strike=selectStrike({spot:25000,targetDelta:.35,optionType:'CE',chain:[
  {strike:24900,optionType:'CE',delta:.55},{strike:25100,optionType:'CE',delta:.34},{strike:25200,optionType:'CE',delta:.22}
 ]});
 assert.equal(strike,25100);
});

test('strike selection falls back safely without delta chain',()=>{
 assert.equal(selectStrike({spot:25000,targetDelta:.5,optionType:'CE',step:50,strikes:[24900,25050,25200]}),25050);
});
