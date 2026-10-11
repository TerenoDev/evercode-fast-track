import request from 'supertest';
import app from '../app';
import db, { initDb, dbRun } from '../db';

const API_KEY = 'test-api-key-123';

describe('Coins API E2E Tests', () => {
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

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('Authentication', () => {
    it('should return 401 if no token provided (Negative)', async () => {
      const res = await request(app).get('/api/coins');
      expect(res.status).toBe(401);
    });

    it('should return 401 if invalid token provided (Negative)', async () => {
      const res = await request(app)
        .get('/api/coins')
        .set('Authorization', 'Bearer wrong-token');
      expect(res.status).toBe(401);
    });
  });

  describe('Coins CRUD', () => {
    it('should add a coin and return 201 (Positive)', async () => {
      const res = await request(app)
        .post('/api/coins')
        .set('Authorization', `Bearer ${API_KEY}`)
        .send({ symbol: 'BTC' });

      expect(res.status).toBe(201);
      expect(res.body.symbol).toBe('BTC');
      expect(res.body.id).toBeDefined();
    });

    it('should return 400 for invalid symbol (Negative)', async () => {
      const res = await request(app)
        .post('/api/coins')
        .set('Authorization', `Bearer ${API_KEY}`)
        .send({ symbol: 'B' });
      expect(res.status).toBe(400);
    });

    it('should return 409 if coin already exists (Negative)', async () => {
      await dbRun("INSERT INTO tracked_coins (symbol) VALUES ('BTC')");
      const res = await request(app)
        .post('/api/coins')
        .set('Authorization', `Bearer ${API_KEY}`)
        .send({ symbol: 'BTC' });
      expect(res.status).toBe(409);
    });

    it('should get all coins (Positive)', async () => {
      await dbRun("INSERT INTO tracked_coins (symbol) VALUES ('ETH')");
      const res = await request(app)
        .get('/api/coins')
        .set('Authorization', `Bearer ${API_KEY}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].symbol).toBe('ETH');
    });

    it('should delete a coin and return 204 (Positive)', async () => {
      const result = await dbRun("INSERT INTO tracked_coins (symbol) VALUES ('SOL')");
      const coinId = result.lastID;
      
      const res = await request(app)
        .delete(`/api/coins/${coinId}`)
        .set('Authorization', `Bearer ${API_KEY}`);
      expect(res.status).toBe(204);
    });

    it('should return 404 when deleting non-existent coin (Negative)', async () => {
      const res = await request(app)
        .delete('/api/coins/9999')
        .set('Authorization', `Bearer ${API_KEY}`);
      expect(res.status).toBe(404);
    });

    it('should return 400 for invalid coin ID (Negative)', async () => {
      const res = await request(app)
        .delete('/api/coins/abc')
        .set('Authorization', `Bearer ${API_KEY}`);
      expect(res.status).toBe(400);
    });
  });
});