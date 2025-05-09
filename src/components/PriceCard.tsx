
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface PriceCardProps {
  title: string;
  value: string | number;
  change?: number;
  subValue?: string;
  icon?: ReactNode;
  className?: string;
  pulsingValue?: boolean;
}

const PriceCard = ({ 
  title, 
  value, 
  change, 
  subValue, 
  icon, 
  className,
  pulsingValue = false
}: PriceCardProps) => {
  return (
    <Card className={cn("price-card", className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon && <span className="text-muted-foreground">{icon}</span>}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-1">
        <div className={cn("text-2xl font-bold", pulsingValue && "animate-pulse-opacity")}>
          {value}
        </div>
        {(change !== undefined || subValue) && (
          <div className="flex items-center mt-1">
            {change !== undefined && (
              <span className={cn(
                "text-sm mr-2",
                change > 0 ? "text-up" : change < 0 ? "text-down" : "text-neutral"
              )}>
                {change > 0 ? "+" : ""}{change.toFixed(2)}%
              </span>
            )}
            {subValue && (
              <span className="text-sm text-muted-foreground">{subValue}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceCard;
