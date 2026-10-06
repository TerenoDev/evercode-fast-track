import { Request, Response, NextFunction } from 'express';
import { dbGet } from '../db';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const apiKey = await dbGet('SELECT * FROM api_keys WHERE key = ? AND is_active = 1', [token]);
    if (!apiKey) {
      return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};