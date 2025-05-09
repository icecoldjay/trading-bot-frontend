import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { PriceData } from '@/services/priceService';

interface ChartData {
  timestamp: number;
  binance: number;
  dex: number;
  difference: number;
}

interface PriceChartProps {
  binanceData: PriceData[];
  dexData: PriceData[];
  emaValue?: number;
}

const formatTooltipValue = (value: number) => `$${value.toFixed(2)}`;

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const PriceChart = ({ binanceData, dexData, emaValue }: PriceChartProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    // Combine the data from both sources
    const combinedData: ChartData[] = [];
    
    // Use the last 100 data points for the chart
    const startIndex = Math.max(0, binanceData.length - 100);
    
    for (let i = startIndex; i < binanceData.length; i++) {
      const binanceItem = binanceData[i];
      // Find the closest timestamp in dexData
      const dexItem = dexData.find(item => {
        return Math.abs(item.timestamp - binanceItem.timestamp) < 60000;
      }) || { timestamp: binanceItem.timestamp, price: 0 };
      
      combinedData.push({
        timestamp: binanceItem.timestamp,
        binance: binanceItem.price,
        dex: dexItem.price,
        difference: binanceItem.price - dexItem.price,
      });
    }
    
    setChartData(combinedData);
  }, [binanceData, dexData]);

  return (
    <Card className="w-full h-full col-span-3">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Price Chart</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Tabs defaultValue="comparison">
          <TabsList>
            <TabsTrigger value="comparison">Price Comparison</TabsTrigger>
            <TabsTrigger value="difference">Price Difference</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comparison" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTimestamp} 
                  stroke="rgba(255,255,255,0.5)" 
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value}`}
                  stroke="rgba(255,255,255,0.5)"
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelFormatter={(label) => formatTimestamp(Number(label))}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="binance" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="dex" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }} 
                />
                {emaValue && (
                  <Line
                    type="monotone"
                    dataKey={() => emaValue}
                    stroke="#f59e0b"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    name="EMA"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="difference" className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTimestamp}
                  stroke="rgba(255,255,255,0.5)" 
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  stroke="rgba(255,255,255,0.5)"
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price Difference']}
                  labelFormatter={(label) => formatTimestamp(Number(label))}
                />
                <defs>
                  <linearGradient id="colorDiff" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="difference" 
                  stroke="#3b82f6" 
                  fill="url(#colorDiff)" 
                  dot={false}
                  activeDot={{ r: 4 }}
                  name="Price Difference"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
