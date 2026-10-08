import axios from 'axios';
import dotenv from 'dotenv';
import { ExternalApiError } from '../types/errors';

dotenv.config();

const CMC_API_KEY = process.env.CMC_API_KEY;
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

const cmcClient = axios.create({
  baseURL: CMC_BASE_URL,
  timeout: 5000, 
  headers: {
    'X-CMC_PRO_API_KEY': CMC_API_KEY,
  },
});

export interface CmcPriceResponse {
  data: {
    [symbol: string]: {
      quote: {
        USD: {
          price: number;
        };
      };
    };
  };
}

export const fetchPriceFromCMC = async (symbol: string): Promise<number> => {
  try {
    const response = await cmcClient.get<CmcPriceResponse>('/cryptocurrency/quotes/latest', {
      params: { symbol: symbol },
    });

    const price = response.data.data[symbol]?.quote?.USD?.price;
    
    if (price === undefined) {
      throw new ExternalApiError(`Price for ${symbol} not found in CMC response`);
    }

    return price;
  } catch (error: any) {
    if (error.response) {
      console.error('CMC API Error:', error.response.status, error.response.data);
      throw new ExternalApiError(`CoinMarketCap API error: ${error.response.status}`);
    } else if (error.request) {
      console.error('CMC Network Error:', error.message);
      throw new ExternalApiError('CoinMarketCap API is unavailable');
    } else {
      console.error('Unexpected Error:', error.message);
      throw error;
    }
  }
};