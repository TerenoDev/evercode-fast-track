import { dbAll, dbGet, dbRun } from '../db';

export const getAllCoins = async () => {
  return dbAll('SELECT * FROM tracked_coins');
};

export const getCoinBySymbol = async (symbol: string) => {
  return dbGet('SELECT * FROM tracked_coins WHERE symbol = ?', [symbol]);
};

export const addCoin = async (symbol: string) => {
  return dbRun('INSERT INTO tracked_coins (symbol) VALUES (?)', [symbol]);
};

export const deleteCoin = async (id: number) => {
  return dbRun('DELETE FROM tracked_coins WHERE id = ?', [id]);
};