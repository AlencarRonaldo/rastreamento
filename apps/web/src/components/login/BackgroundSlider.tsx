'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundImage {
  src: string;
  alt: string;
  attribution?: string;
}

const backgroundImages: BackgroundImage[] = [
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop',
    alt: 'Centro de controle de rastreamento veicular moderno',
    attribution: 'Vehicle Tracking Control Center'
  },
  {
    src: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2940&auto=format&fit=crop',
    alt: 'Frota de veículos comerciais em movimento',
    attribution: 'Commercial Fleet Management'
  },
  {
    src: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2940&auto=format&fit=crop',
    alt: 'Motorista profissional com tecnologia GPS',
    attribution: 'Professional Driver Technology'
  },
  {
    src: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?q=80&w=2940&auto=format&fit=crop',
    alt: 'Dashboard de análise de dados de frota',
    attribution: 'Fleet Analytics Dashboard'
  },
  {
    src: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2940&auto=format&fit=crop',
    alt: 'Centro de operações logísticas 24/7',
    attribution: 'Logistics Operations Center'
  }
];

export default function BackgroundSlider() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [nextImageIndex, setNextImageIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageLoaded(false);
      setNextImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
      
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        setImageLoaded(true);
      }, 500);
    }, 8000); // Change image every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Current Image */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Image
          src={backgroundImages[currentImageIndex].src}
          alt={backgroundImages[currentImageIndex].alt}
          fill
          className="object-cover"
          priority={currentImageIndex === 0}
          quality={90}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Preload Next Image */}
      <div className="absolute inset-0 opacity-0 pointer-events-none">
        <Image
          src={backgroundImages[nextImageIndex].src}
          alt={backgroundImages[nextImageIndex].alt}
          fill
          className="object-cover"
          quality={90}
        />
      </div>

      {/* Professional Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-blue-900/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      {/* Animated Mesh Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated GPS Points */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-pulse absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full opacity-60" />
        <div className="animate-pulse absolute top-2/3 right-1/3 w-3 h-3 bg-green-500 rounded-full opacity-60" style={{ animationDelay: '1s' }} />
        <div className="animate-pulse absolute bottom-1/4 left-1/2 w-3 h-3 bg-yellow-500 rounded-full opacity-60" style={{ animationDelay: '2s' }} />
        <div className="animate-pulse absolute top-1/2 right-1/4 w-3 h-3 bg-red-500 rounded-full opacity-60" style={{ animationDelay: '3s' }} />
      </div>

      {/* Image Attribution */}
      <div className="absolute bottom-4 left-4 text-white/50 text-xs">
        {backgroundImages[currentImageIndex].attribution}
      </div>
    </div>
  );
}