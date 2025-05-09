import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface IndicatorCardProps {
  title: string;
  value: number | null;
  min?: number;
  max?: number;
  lowThreshold?: number;
  highThreshold?: number;
  format?: (value: number) => string;
}

const IndicatorCard = ({
  title,
  value,
  min = 0,
  max = 100,
  lowThreshold = 30,
  highThreshold = 70,
  format = (value) => value?.toFixed(2) ?? 'N/A',
}: IndicatorCardProps) => {
  // Determine the indicator status
  const getIndicatorStatus = () => {
    if (value === null) return "indicator-neutral";
    if (value <= lowThreshold) return "indicator-bad";
    if (value >= highThreshold) return "indicator-bad";
    return "indicator-good";
  };

  // Calculate progress percentage
  const progressPercentage = value === null ? 0 : ((value - min) / (max - min)) * 100;

  // Determine progress color based on thresholds
  const getProgressColor = () => {
    if (value === null) return "bg-neutral";
    if (value <= lowThreshold) return "bg-down";
    if (value >= highThreshold) return "bg-down";
    return "bg-up";
  };

  return (
    <Card className="price-card">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={getIndicatorStatus()}>{format(value)}</span>
            <span className="text-xs text-muted-foreground">
              {min} - {max}
            </span>
          </div>
          <Progress value={progressPercentage} className={`h-2 ${getProgressColor()}`} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Oversold (&lt;{lowThreshold})</span>
            <span>Overbought (&gt;{highThreshold})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndicatorCard;