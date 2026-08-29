const crypto = require('node:crypto');

const AUTH_URL = 'https://auth.dhan.co/app/generateAccessToken';

function base32ToBuffer(secret) {
  const normalized = String(secret).replace(/\s+/g, '').replace(/=+$/g, '').toUpperCase();
  if (!/^[A-Z2-7]+$/.test(normalized)) throw new Error('INVALID_TOTP_SECRET');
  let bits = '';
  for (const ch of normalized) bits += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.indexOf(ch).toString(2).padStart(5, '0');
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

function generateTotp(secret, nowMs = Date.now(), digits = 6, period = 30) {
  const key = base32ToBuffer(secret);
  const counter = Math.floor(nowMs / 1000 / period);
  const counterBuf = Buffer.alloc(8);
  counterBuf.writeBigUInt64BE(BigInt(counter));
  const digest = crypto.createHmac('sha1', key).update(counterBuf).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const code = ((digest.readUInt32BE(offset) & 0x7fffffff) % (10 ** digits)).toString().padStart(digits, '0');
  return code;
}

async function generateAccessToken({ clientId, pin, totpSecret, fetchImpl = globalThis.fetch, nowMs = Date.now() }) {
  if (!clientId || !pin || !totpSecret) throw new Error('DHAN_TOTP_CONFIG_INCOMPLETE');
  if (typeof fetchImpl !== 'function') throw new Error('FETCH_NOT_AVAILABLE');
  const totp = generateTotp(totpSecret, nowMs);
  const url = `${AUTH_URL}?dhanClientId=${encodeURIComponent(clientId)}&pin=${encodeURIComponent(pin)}&totp=${encodeURIComponent(totp)}`;
  const response = await fetchImpl(url, { method: 'POST', headers: { Accept: 'application/json' } });
  const body = await response.json();
  if (!response.ok || !body.accessToken) {
    const error = new Error(body.errorMessage || body.message || 'DHAN_TOKEN_GENERATION_FAILED');
    error.status = response.status;
    error.response = body;
    throw error;
  }
  return { ...body, accessToken: body.accessToken };
}

async function validateToken(accessToken, fetchImpl = globalThis.fetch) {
  if (!accessToken) throw new Error('DHAN_ACCESS_TOKEN_REQUIRED');
  const response = await fetchImpl('https://api.dhan.co/v2/profile', {
    headers: { Accept: 'application/json', 'access-token': accessToken }
  });
  const body = await response.json();
  if (!response.ok) {
    const error = new Error(body.errorMessage || body.message || 'DHAN_TOKEN_INVALID');
    error.status = response.status;
    error.response = body;
    throw error;
  }
  return body;
}

module.exports = { generateTotp, generateAccessToken, validateToken };
