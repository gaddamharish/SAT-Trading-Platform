const {buildDefinedRiskStrategy}=require('../options/engine');
function bearCallSpread({expiry,shortStrike,longStrike,shortPremium,longPremium,quantity=1,liquidity}){
 if(!(shortStrike<longStrike)) throw new Error('Bear call spread requires shortStrike < longStrike');
 return buildDefinedRiskStrategy({strategy:'BEAR_CALL_SPREAD',expiry,netPremium:(shortPremium-longPremium)*quantity,liquidity,legs:[{strike:shortStrike,optionType:'CE',side:'SELL',quantity},{strike:longStrike,optionType:'CE',side:'BUY',quantity}]});
}
function bullPutSpread({expiry,shortStrike,longStrike,shortPremium,longPremium,quantity=1,liquidity}){
 if(!(longStrike<shortStrike)) throw new Error('Bull put spread requires longStrike < shortStrike');
 return buildDefinedRiskStrategy({strategy:'BULL_PUT_SPREAD',expiry,netPremium:(shortPremium-longPremium)*quantity,liquidity,legs:[{strike:longStrike,optionType:'PE',side:'BUY',quantity},{strike:shortStrike,optionType:'PE',side:'SELL',quantity}]});
}
function longStraddle({expiry,strike,callPremium,putPremium,quantity=1,liquidity}){
 return buildDefinedRiskStrategy({strategy:'LONG_STRADDLE',expiry,netPremium:(callPremium+putPremium)*quantity,liquidity,legs:[{strike,optionType:'CE',side:'BUY',quantity},{strike,optionType:'PE',side:'BUY',quantity}]});
}
function longStrangle({expiry,putStrike,callStrike,putPremium,callPremium,quantity=1,liquidity}){
 if(!(putStrike<callStrike)) throw new Error('Long strangle requires putStrike < callStrike');
 return buildDefinedRiskStrategy({strategy:'LONG_STRANGLE',expiry,netPremium:(putPremium+callPremium)*quantity,liquidity,legs:[{strike:putStrike,optionType:'PE',side:'BUY',quantity},{strike:callStrike,optionType:'CE',side:'BUY',quantity}]});
}
module.exports={bearCallSpread,bullPutSpread,longStraddle,longStrangle};
