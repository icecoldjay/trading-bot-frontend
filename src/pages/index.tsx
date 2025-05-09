import React, { useState, useEffect } from 'react';
import { 
  getPrices, 
  getHistoricalPrices, 
  getIndicators,
  getOpportunityStatus,
  PriceData
} from '@/services/priceService';
import PriceCard from '@/components/PriceCard';
import PriceChart from '@/components/PriceChart';
import IndicatorCard from '@/components/IndicatorCard';
import OpportunityIndicator from '@/components/OpportunityIndicator';
import { RefreshCw, TrendingUp, TrendingDown, ChartLine, DollarSign } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const [prices, setPrices] = useState({ 
    binance: 0, 
    dex: 0, 
    difference: 0, 
    percentDifference: 0 
  });
  const [historicalData, setHistoricalData] = useState<{ 
    binance: PriceData[], 
    dex: PriceData[] 
  }>({ binance: [], dex: [] });
  const [indicators, setIndicators] = useState({ rsi: 0, ema: 0 });
  const [opportunity, setOpportunity] = useState<{ 
    type: 'buy' | 'sell' | 'neutral'; 
    strength: number 
  }>({ type: 'neutral', strength: 0 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      
      const [pricesData, historicalPrices, indicatorsData, opportunityData] = await Promise.all([
        getPrices(),
        getHistoricalPrices(),
        getIndicators(),
        getOpportunityStatus()
      ]);
      
      setPrices(pricesData);
      setHistoricalData(historicalPrices);
      setIndicators(indicatorsData);
      setOpportunity(opportunityData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(() => {
      fetchData();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border/40 py-4">
        <div className="container flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">WBTC Oracle</h1>
            <p className="text-sm text-muted-foreground">
              Price monitoring dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 text-xs">
              Last updated: {formatTime(lastUpdated)}
            </Badge>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={fetchData} 
              disabled={isRefreshing}
              className="gap-1"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <PriceCard 
            title="Binance Price (BTC/USDT)" 
            value={formatCurrency(prices.binance)} 
            icon={<DollarSign className="w-4 h-4" />}
            pulsingValue={true}
          />
          <PriceCard 
            title="DEX Price (WBTC/BUSD)" 
            value={formatCurrency(prices.dex)} 
            icon={<DollarSign className="w-4 h-4" />}
            pulsingValue={true}
          />
          <PriceCard 
            title="Price Difference" 
            value={formatCurrency(prices.difference)} 
            change={prices.percentDifference}
            icon={prices.difference > 0 ? 
              <TrendingUp className="w-4 h-4 text-up" /> : 
              <TrendingDown className="w-4 h-4 text-down" />
            }
          />
          <OpportunityIndicator 
            type={opportunity.type} 
            strength={opportunity.strength} 
            priceDifference={prices.percentDifference} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <PriceChart 
            binanceData={historicalData.binance} 
            dexData={historicalData.dex} 
            emaValue={indicators.ema}
          />
          <Card className="lg:col-span-1">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg">Technical Indicators</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-4">
                <IndicatorCard 
                  title="Relative Strength Index (RSI)" 
                  value={indicators.rsi} 
                  min={0} 
                  max={100} 
                  lowThreshold={30} 
                  highThreshold={70} 
                />
                <IndicatorCard 
                  title="Exponential Moving Average (EMA)" 
                  value={indicators.ema} 
                  min={Math.floor(indicators.ema * 0.95)} 
                  max={Math.ceil(indicators.ema * 1.05)} 
                  lowThreshold={indicators.ema * 0.98} 
                  highThreshold={indicators.ema * 1.02} 
                  format={(value) => formatCurrency(value)}
                />
              </div>
              <Card className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Trading Parameters</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Profit Threshold</span>
                    <span>0.60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Slippage</span>
                    <span>0.20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trailing Stop Loss</span>
                    <span>0.50%</span>
                  </div>
                </div>
              </Card>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="border-t border-border/40 py-4">
        <div className="container">
          <div className="text-sm text-muted-foreground text-center">
            WBTC Scalping Bot - Price Monitoring Dashboard
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;