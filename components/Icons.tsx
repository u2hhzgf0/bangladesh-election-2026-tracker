
import React from 'react';

export const RiceIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M50 10 C50 10 30 30 30 55 C30 80 50 90 50 90 C50 90 70 80 70 55 C70 30 50 10 Z M50 20 C60 40 60 70 50 80 C40 70 40 40 50 20 Z" />
    <path d="M50 30 C55 40 55 50 50 60 C45 50 45 40 50 30 Z" opacity="0.6" />
    <path d="M40 45 Q50 35 60 45" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M40 65 Q50 55 60 65" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const ScaleIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <rect x="48" y="20" width="4" height="60" />
    <rect x="30" y="80" width="40" height="4" />
    <path d="M20 30 L80 30" stroke="currentColor" strokeWidth="4" />
    <circle cx="50" cy="30" r="4" />
    <path d="M20 30 L10 60 L30 60 Z" opacity="0.8" />
    <path d="M80 30 L70 60 L90 60 Z" opacity="0.8" />
  </svg>
);
