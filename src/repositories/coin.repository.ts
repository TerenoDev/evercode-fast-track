import { dbAll, dbGet, dbRun } from '../db';
import { Coin, PriceHistory } from '../types/coin.types';

export const getAllCoins = async (): Promise<Coin[]> => {
  return dbAll<Coin>('SELECT * FROM tracked_coins');
};

export const getCoinBySymbol = async (symbol: string): Promise<Coin | undefined> => {
  return dbGet<Coin>('SELECT * FROM tracked_coins WHERE symbol = ?', [symbol]);
};

export const addCoin = async (symbol: string) => {
  return dbRun('INSERT INTO tracked_coins (symbol) VALUES (?)', [symbol]);
};

export const deleteCoin = async (id: number) => {
  return dbRun('DELETE FROM tracked_coins WHERE id = ?', [id]);
};

export const addPriceHistory = async (coinId: number, price: number) => {
  return dbRun(
    'INSERT INTO price_history (coin_id, price) VALUES (?, ?)',
    [coinId, price]
  );
};

export const getPriceHistory = async (coinId: number): Promise<PriceHistory[]> => {
  return dbAll<PriceHistory>(
    'SELECT * FROM price_history WHERE coin_id = ? ORDER BY timestamp DESC',
    [coinId]
  );
};