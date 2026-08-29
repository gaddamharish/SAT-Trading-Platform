const BASE_URL = 'https://api.dhan.co/v2';

class DhanApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = 'DhanApiError';
    this.status = status;
    this.body = body;
  }
}

class DhanClient {
  constructor({ clientId, accessToken, fetchImpl = globalThis.fetch, baseUrl = BASE_URL } = {}) {
    this.clientId = clientId || process.env.DHAN_CLIENT_ID;
    this.accessToken = accessToken || process.env.DHAN_ACCESS_TOKEN;
    this.fetchImpl = fetchImpl;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  isConfigured() {
    return Boolean(this.clientId && this.accessToken);
  }

  async request(path, { method = 'GET', body } = {}) {
    if (!this.isConfigured()) throw new Error('DHAN_CLIENT_NOT_CONFIGURED');
    if (typeof this.fetchImpl !== 'function') throw new Error('FETCH_NOT_AVAILABLE');

    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        'access-token': this.accessToken,
        'client-id': this.clientId,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });

    const text = await response.text();
    let payload;
    try { payload = text ? JSON.parse(text) : null; } catch { payload = { raw: text }; }
    if (!response.ok) {
      throw new DhanApiError(payload?.errorMessage || `Dhan API request failed (${response.status})`, response.status, payload);
    }
    return payload;
  }

  async profile() { return this.request('/profile'); }

  async getQuote(instruments) {
    return this.request('/marketfeed/quote', { method: 'POST', body: instruments });
  }

  async getLtp(instruments) {
    return this.request('/marketfeed/ltp', { method: 'POST', body: instruments });
  }

  async getOhlc(instruments) {
    return this.request('/marketfeed/ohlc', { method: 'POST', body: instruments });
  }

  async getOptionChain(payload) {
    return this.request('/optionchain', { method: 'POST', body: payload });
  }

  async getPositions() { return this.request('/positions'); }
  async getOrders() { return this.request('/orders'); }
  async getOrder(orderId) { return this.request(`/orders/${encodeURIComponent(orderId)}`); }

  // SAT remains advisory-first. Order placement is intentionally unavailable.
  async placeOrder() { throw new Error('AUTONOMOUS_ORDERING_DISABLED'); }
}

class DhanAdapter {
  constructor(client = new DhanClient()) { this.client = client; }
  isConfigured() { return this.client.isConfigured(); }
  async health() {
    if (!this.isConfigured()) return { connected: false, reason: 'NOT_CONFIGURED' };
    try {
      const profile = await this.client.profile();
      return { connected: true, clientId: profile?.dhanClientId || this.client.clientId, profile };
    } catch (error) {
      return { connected: false, reason: error.name === 'DhanApiError' ? error.message : error.message };
    }
  }
  async getQuote(instruments) { return this.client.getQuote(instruments); }
  async getLtp(instruments) { return this.client.getLtp(instruments); }
  async getOhlc(instruments) { return this.client.getOhlc(instruments); }
  async getOptionChain(payload) { return this.client.getOptionChain(payload); }
  async getPositions() { return this.client.getPositions(); }
  async getOrders() { return this.client.getOrders(); }
  async getOrder(orderId) { return this.client.getOrder(orderId); }
  async placeOrder() { throw new Error('AUTONOMOUS_ORDERING_DISABLED'); }
}

module.exports = { DhanAdapter, DhanClient, DhanApiError };
