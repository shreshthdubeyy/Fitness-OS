'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 36 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="logoBlueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="100%" stopColor="#1d4ed8"/>
        </linearGradient>
        <linearGradient id="logoSilverPlate" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="100%" stopColor="#cbd5e1"/>
        </linearGradient>
      </defs>
      
      {/* Outer Hexagon Badge */}
      <polygon points="256,32 448,142 448,370 256,480 64,370 64,142" fill="#0f172a" stroke="url(#logoBlueGlow)" strokeWidth="12" strokeLinejoin="round"/>
      <polygon points="256,48 432,150 432,362 256,464 80,362 80,150" fill="none" stroke="#2563eb" strokeWidth="3" strokeOpacity="0.5"/>

      {/* Geometric Dumbbell Center */}
      <g transform="translate(0, 10)">
        <rect x="190" y="244" width="132" height="24" rx="6" fill="url(#logoSilverPlate)"/>
        <rect x="174" y="226" width="16" height="60" rx="4" fill="url(#logoBlueGlow)"/>
        <rect x="322" y="226" width="16" height="60" rx="4" fill="url(#logoBlueGlow)"/>
        <path d="M 120,200 L 164,216 L 164,296 L 120,312 Z" fill="url(#logoSilverPlate)" stroke="#1e293b" strokeWidth="2"/>
        <path d="M 96,214 L 116,222 L 116,290 L 96,298 Z" fill="url(#logoSilverPlate)"/>
        <path d="M 392,200 L 348,216 L 348,296 L 392,312 Z" fill="url(#logoSilverPlate)" stroke="#1e293b" strokeWidth="2"/>
        <path d="M 416,214 L 396,222 L 396,290 L 416,298 Z" fill="url(#logoSilverPlate)"/>
        <rect x="80" y="248" width="16" height="16" rx="4" fill="url(#logoSilverPlate)"/>
        <rect x="416" y="248" width="16" height="16" rx="4" fill="url(#logoSilverPlate)"/>
      </g>
    </svg>
  );
};
