export interface Coin {
  id: number;
  symbol: string;
  added_at: string;
}

export interface PriceHistory {
  id: number;
  coin_id: number;
  price: number;
  timestamp: string;
}