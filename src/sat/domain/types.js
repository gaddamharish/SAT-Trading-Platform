/** SAT domain validation and freshness contracts. */
function assertFresh(snapshot, maxAgeMs) {
  if (!snapshot || !Number.isFinite(snapshot.timestamp)) return {ok:false, reason:'MISSING_TIMESTAMP'};
  const age = Date.now() - snapshot.timestamp;
  if (age < 0 || age > maxAgeMs) return {ok:false, reason:'STALE_DATA', ageMs:age};
  return {ok:true, ageMs:age};
}
function normalizeOptionLeg(leg) {
  const required=['strike','optionType','side','quantity'];
  for (const key of required) if (leg[key] === undefined) throw new Error(`Missing leg field: ${key}`);
  if (!['CE','PE'].includes(leg.optionType)) throw new Error('Invalid option type');
  if (!['BUY','SELL'].includes(leg.side)) throw new Error('Invalid leg side');
  if (!Number.isFinite(leg.strike) || leg.strike <= 0) throw new Error('Invalid strike');
  if (!Number.isInteger(leg.quantity) || leg.quantity <= 0) throw new Error('Invalid quantity');
  return {...leg};
}
module.exports={assertFresh,normalizeOptionLeg};
