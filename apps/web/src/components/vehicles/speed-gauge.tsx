'use client';

import * as React from 'react';
import { formatSpeed } from '@/lib/utils';

interface SpeedGaugeProps {
  speed: number;
  maxSpeed?: number;
  size?: number;
  className?: string;
  showLabel?: boolean;
}

export function SpeedGauge({ 
  speed, 
  maxSpeed = 120, 
  size = 120,
  className,
  showLabel = true
}: SpeedGaugeProps) {
  const normalizedSpeed = Math.min(speed, maxSpeed);
  const percentage = (normalizedSpeed / maxSpeed) * 100;
  
  // Calculate angle (from -135° to 135° = 270° total)
  const angle = (percentage / 100) * 270 - 135;
  
  const radius = size / 2 - 10;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference * 0.75; // 270 degrees
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  const getSpeedColor = () => {
    if (percentage < 50) return '#22c55e'; // green
    if (percentage < 80) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDasharray * 0.25}
          className="text-muted opacity-20"
          strokeLinecap="round"
        />
        
        {/* Speed arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={getSpeedColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
          strokeLinecap="round"
        />
        
        {/* Needle */}
        <g className="transition-transform duration-500 ease-out" 
           style={{ 
             transformOrigin: `${size / 2}px ${size / 2}px`,
             transform: `rotate(${angle + 90}deg)`
           }}>
          <line
            x1={size / 2}
            y1={size / 2 + 5}
            x2={size / 2}
            y2={size / 2 - radius + 15}
            stroke={getSpeedColor()}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={4}
            fill={getSpeedColor()}
          />
        </g>
      </svg>
      
      {/* Speed display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold" style={{ color: getSpeedColor() }}>
          {Math.round(speed)}
        </div>
        {showLabel && (
          <div className="text-xs text-muted-foreground">
            km/h
          </div>
        )}
      </div>
      
      {/* Max speed indicator */}
      {showLabel && (
        <div className="absolute bottom-2 text-xs text-muted-foreground">
          Max: {maxSpeed}
        </div>
      )}
    </div>
  );
}