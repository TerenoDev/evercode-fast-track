import request from 'supertest';
import app from '../app';
import db, { initDb, dbRun } from '../db';

const API_KEY = 'test-api-key-123';

describe('Price Endpoints', () => {
  beforeAll(async () => {
    await initDb();
    await dbRun("INSERT INTO api_keys (key) VALUES (?)", [API_KEY]);
  });

  beforeEach(async () => {
    await dbRun("DELETE FROM tracked_coins");
    await dbRun("DELETE FROM price_history");
  });

  afterAll(async () => {
    await new Promise((resolve) => db.close(resolve));
  });

  it('should return 404 for non-tracked coin price (Negative)', async () => {
    const res = await request(app)
      .get('/api/coins/FAKE/price')
      .set('Authorization', `Bearer ${API_KEY}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Coin is not tracked');
  });

  it('should return 404 for non-tracked coin history (Negative)', async () => {
    const res = await request(app)
      .get('/api/coins/FAKE/history')
      .set('Authorization', `Bearer ${API_KEY}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Coin is not tracked');
  });

  it('should return 401 without token (Negative)', async () => {
    const res = await request(app).get('/api/coins/BTC/price');
    expect(res.status).toBe(401);
  });

  it('should return empty history for tracked coin with no prices (Positive)', async () => {
    await dbRun("INSERT INTO tracked_coins (symbol) VALUES ('BTC')");
    
    const res = await request(app)
      .get('/api/coins/BTC/history')
      .set('Authorization', `Bearer ${API_KEY}`);
    expect(res.status).toBe(200);
    expect(res.body.history).toEqual([]);
  });

  it('should return saved price history (Positive)', async () => {
    const result = await dbRun("INSERT INTO tracked_coins (symbol) VALUES ('BTC')");
    const coinId = result.lastID;
    
    await dbRun("INSERT INTO price_history (coin_id, price) VALUES (?, ?)", [coinId, 50000]);
    await dbRun("INSERT INTO price_history (coin_id, price) VALUES (?, ?)", [coinId, 51000]);
    
    const res = await request(app)
      .get('/api/coins/BTC/history')
      .set('Authorization', `Bearer ${API_KEY}`);
    
    expect(res.status).toBe(200);
    expect(res.body.history.length).toBe(2);
    expect(res.body.history[0].price).toBe(51000);
  });
});