const test = require('node:test');
const assert = require('node:assert/strict');
const { generateTotp, generateAccessToken, validateToken } = require('../src/sat/broker/dhan-totp');

test('generates RFC 6238 TOTP', () => {
  assert.equal(generateTotp('JBSWY3DPEHPK3PXP', 0), '282760');
});

test('generates Dhan token using TOTP without exposing secrets', async () => {
  let request;
  const result = await generateAccessToken({
    clientId: '1000000001', pin: '123456', totpSecret: 'JBSWY3DPEHPK3PXP', nowMs: 0,
    fetchImpl: async (url, options) => {
      request = { url, options };
      return { ok: true, status: 200, json: async () => ({ accessToken: 'jwt', expiryTime: '2099-01-01T00:00:00.000' }) };
    }
  });
  assert.equal(result.accessToken, 'jwt');
  assert.match(request.url, /dhanClientId=1000000001/);
  assert.match(request.url, /pin=123456/);
  assert.match(request.url, /totp=282760/);
});

test('validates generated access token through profile endpoint', async () => {
  const profile = await validateToken('jwt', async (url, options) => {
    assert.equal(url, 'https://api.dhan.co/v2/profile');
    assert.equal(options.headers['access-token'], 'jwt');
    return { ok: true, status: 200, json: async () => ({ dhanClientId: '1000000001', tokenValidity: '01/01/2099 00:00' }) };
  });
  assert.equal(profile.dhanClientId, '1000000001');
});
