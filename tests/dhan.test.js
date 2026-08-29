const test = require('node:test');
const assert = require('node:assert/strict');
const { DhanClient, DhanAdapter } = require('../src/sat/broker/dhan');

test('Dhan client is unconfigured without credentials', () => {
  const client = new DhanClient({ clientId: '', accessToken: '' });
  assert.equal(client.isConfigured(), false);
});

test('Dhan client sends v2 authentication headers', async () => {
  let request;
  const client = new DhanClient({
    clientId: 'TESTCLIENT',
    accessToken: 'TESTTOKEN',
    baseUrl: 'https://example.test/v2',
    fetchImpl: async (url, options) => {
      request = { url, options };
      return { ok: true, status: 200, text: async () => JSON.stringify({ dhanClientId: 'TESTCLIENT', tokenValidity: 'valid' }) };
    },
  });

  const profile = await client.profile();
  assert.equal(profile.dhanClientId, 'TESTCLIENT');
  assert.equal(request.url, 'https://example.test/v2/profile');
  assert.equal(request.options.headers['access-token'], 'TESTTOKEN');
  assert.equal(request.options.headers['client-id'], 'TESTCLIENT');
});

test('Dhan adapter health reports connected when profile succeeds', async () => {
  const client = new DhanClient({
    clientId: 'TESTCLIENT',
    accessToken: 'TESTTOKEN',
    fetchImpl: async () => ({ ok: true, status: 200, text: async () => JSON.stringify({ dhanClientId: 'TESTCLIENT' }) }),
  });
  const health = await new DhanAdapter(client).health();
  assert.equal(health.connected, true);
  assert.equal(health.clientId, 'TESTCLIENT');
});

test('Dhan adapter never enables autonomous order placement', async () => {
  const adapter = new DhanAdapter(new DhanClient({ clientId: 'TESTCLIENT', accessToken: 'TESTTOKEN' }));
  await assert.rejects(() => adapter.placeOrder({}), /AUTONOMOUS_ORDERING_DISABLED/);
});
