import { Request, Response } from 'express';
import { z } from 'zod';
import * as coinRepository from '../repositories/coin.repository';

const addCoinSchema = z.object({
  symbol: z.string().min(2).max(10).toUpperCase(), 
});

export const getAllCoins = async (req: Request, res: Response) => {
  try {
    const coins = await coinRepository.getAllCoins();
    return res.status(200).json(coins);
  } catch (error) {
    console.error('Error getting coins:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const addCoin = async (req: Request, res: Response) => {
  try {
    const validation = addCoinSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      });
    }

    const { symbol } = validation.data;

    const existingCoin = await coinRepository.getCoinBySymbol(symbol);
    if (existingCoin) {
      return res.status(409).json({ error: 'Coin already tracked' });
    }

    const result = await coinRepository.addCoin(symbol);
    return res.status(201).json({ 
      id: result.lastID, 
      symbol, 
      message: 'Coin added successfully' 
    });
  } catch (error) {
    console.error('Error adding coin:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCoin = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: 'Coin ID is required' });
    }

    const id = parseInt(req.params.id as string, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid coin ID' });
    }

    const result = await coinRepository.deleteCoin(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    return res.status(204).send(); 
  } catch (error) {
    console.error('Error deleting coin:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};