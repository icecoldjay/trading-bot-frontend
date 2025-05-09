import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface OpportunityIndicatorProps {
  type: 'buy' | 'sell' | 'neutral';
  strength: number;
  priceDifference: number;
}

const OpportunityIndicator = ({ type, strength, priceDifference }: OpportunityIndicatorProps) => {
  const getStatusColor = () => {
    if (type === 'buy') return 'text-up';
    if (type === 'sell') return 'text-down';
    return 'text-neutral';
  };

  const getStatusText = () => {
    if (type === 'buy') return 'BUY OPPORTUNITY';
    if (type === 'sell') return 'SELL OPPORTUNITY';
    return 'NO OPPORTUNITY';
  };

  const getStatusIcon = () => {
    if (type === 'buy') return <ArrowUp className="w-6 h-6 text-up" />;
    if (type === 'sell') return <ArrowDown className="w-6 h-6 text-down" />;
    return null;
  };
  
  return (
    <Card className={`price-card ${type !== 'neutral' ? 'border-primary/50' : ''}`}>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Trading Opportunity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-xl font-bold ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${type === 'buy' ? 'bg-up' : type === 'sell' ? 'bg-down' : 'bg-neutral'}`} 
              style={{ width: `${strength * 100}%` }}
            />
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Price Difference: 
            <span className={`ml-1 font-semibold ${getStatusColor()}`}>
              {priceDifference > 0 ? '+' : ''}{priceDifference.toFixed(2)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityIndicator;
