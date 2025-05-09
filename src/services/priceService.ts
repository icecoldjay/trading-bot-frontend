// src/services/priceService.ts

interface PriceData {
  timestamp: number;
  price: number;
}

interface Indicators {
  rsi: number;
  ema: number;
}

interface OpportunityStatus {
  type: 'buy' | 'sell' | 'neutral';
  strength: number;
}

interface PriceResponse {
  binance: number;
  dex: number;
  difference: number;
  percentDifference: number;
}

interface HistoricalPrices {
  binance: PriceData[];
  dex: PriceData[];
}

const API_BASE_URL = 'http://localhost:3000/api'; // http://residential-judie-icecoldjay-d28c46c7.koyeb.app/health


/**
 * Fetches current prices from both centralized and decentralized exchanges
 */
export const getPrices = async (): Promise<PriceResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/prices`);
    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }
    const data = await response.json();

    // Calculate differences
    const difference = data.centralized.price - data.dex.price;
    const percentDifference = (difference / data.dex.price) * 100;

    return {
      binance: data.centralized.price,
      dex: data.dex.price,
      difference,
      percentDifference
    };
  } catch (error) {
    console.error('Error fetching prices:', error);
    return {
      binance: 0,
      dex: 0,
      difference: 0,
      percentDifference: 0
    };
  }
};

/**
 * Fetches historical price data
 */
export const getHistoricalPrices = async (): Promise<HistoricalPrices> => {
  try {
    const response = await fetch(`${API_BASE_URL}/historical`);
    if (!response.ok) {
      throw new Error('Failed to fetch historical prices');
    }
    const data = await response.json();

    // Transform data to match expected format
    return {
      binance: data.binance.map((item: any) => ({
        timestamp: item.timestamp,
        price: item.price
      })),
      dex: data.dex.map((item: any) => ({
        timestamp: item.timestamp,
        price: item.price
      }))
    };
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return {
      binance: [],
      dex: []
    };
  }
};

/**
 * Fetches technical indicators
 */
export const getIndicators = async (): Promise<Indicators> => {
  try {
    const response = await fetch(`${API_BASE_URL}/indicators`);
    if (!response.ok) {
      throw new Error('Failed to fetch indicators');
    }
    const data = await response.json();

    return {
      rsi: data.rsi,
      ema: data.ema
    };
  } catch (error) {
    console.error('Error fetching indicators:', error);
    return {
      rsi: 0,
      ema: 0
    };
  }
};

/**
 * Determines if there's a trading opportunity
 */
export const getOpportunityStatus = async (): Promise<OpportunityStatus> => {
  try {
    const response = await fetch(`${API_BASE_URL}/opportunity`);
    if (!response.ok) {
      throw new Error('Failed to fetch opportunity status');
    }
    const data = await response.json();

    // Determine opportunity type based on your backend logic
    let type: 'buy' | 'sell' | 'neutral' = 'neutral';
    if (data.buyOpportunity) {
      type = 'buy';
    } else if (data.sellOpportunity) {
      type = 'sell';
    }

    // Calculate strength based on price difference and indicators
    const strength = Math.min(Math.abs(data.priceDifference * 100), 100);

    return {
      type,
      strength
    };
  } catch (error) {
    console.error('Error fetching opportunity status:', error);
    return {
      type: 'neutral',
      strength: 0
    };
  }
};

// Export types for use in components
export type { PriceData };
