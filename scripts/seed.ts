import { initDb, dbRun, dbGet } from '../src/db';

const API_KEY = 'test-api-key-123';

const seed = async () => {
  try {
    await initDb();

    const existing = await dbGet('SELECT * FROM api_keys WHERE key = ?', [API_KEY]);
    if (existing) {
      console.log(`API Key "${API_KEY}" already exists.`);
      process.exit(0);
    }

    await dbRun('INSERT INTO api_keys (key) VALUES (?)', [API_KEY]);
    console.log(`API Key "${API_KEY}" created successfully!`);
    console.log('Use it in the Authorization header: Bearer test-api-key-123');
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed API key:', error);
    process.exit(1);
  }
};

seed();