'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, MapPin, Shield } from 'lucide-react';

interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: React.ElementType;
  color: string;
}

const stats: Stat[] = [
  {
    label: 'Veículos Rastreados',
    value: 15000,
    suffix: '+',
    icon: MapPin,
    color: 'text-blue-400'
  },
  {
    label: 'Clientes Ativos',
    value: 3500,
    suffix: '+',
    icon: Users,
    color: 'text-green-400'
  },
  {
    label: 'Uptime do Sistema',
    value: 99.9,
    suffix: '%',
    icon: TrendingUp,
    color: 'text-yellow-400'
  },
  {
    label: 'Alertas Enviados',
    value: 50000,
    suffix: '+',
    icon: Shield,
    color: 'text-purple-400'
  }
];

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const isDecimal = end % 1 !== 0;
    
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const currentCount = end * easeOutCubic(progress);
      
      setCount(isDecimal ? parseFloat(currentCount.toFixed(1)) : Math.floor(currentCount));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {count.toLocaleString('pt-BR')}
      {suffix}
    </span>
  );
}

export default function ServiceStats() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`
              transform transition-all duration-700 
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {isVisible && <AnimatedCounter end={stat.value} suffix={stat.suffix} />}
                </div>
              </div>
              <p className="text-xs text-slate-300">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}