import React from 'react';

export const ZenAvatar: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0 }} />
        <stop offset="70%" style={{ stopColor: 'currentColor', stopOpacity: 0.1 }} />
        <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.3 }} />
      </radialGradient>
      <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 0 }} />
        <stop offset="80%" style={{ stopColor: '#818cf8', stopOpacity: 0.2 }} />
        <stop offset="100%" style={{ stopColor: '#818cf8', stopOpacity: 0.5 }} />
      </radialGradient>
    </defs>
    <g filter="url(#glow-filter)">
      <circle cx="100" cy="100" r="90" fill="url(#grad1)" stroke="currentColor" strokeWidth="1">
        <animate attributeName="r" values="90;95;90" dur="4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="70" fill="transparent" stroke="currentColor" strokeWidth="1.5">
         <animate attributeName="r" values="70;65;70" dur="5s" repeatCount="indefinite" />
         <animate attributeName="stroke-opacity" values="1;0.5;1" dur="5s" repeatCount="indefinite" />
      </circle>
       <circle cx="100" cy="100" r="50" fill="url(#grad2)" stroke="#a78bfa" strokeWidth="2">
         <animate attributeName="r" values="50;55;50" dur="6s" repeatCount="indefinite" />
         <animate attributeName="stroke-opacity" values="1;0.7;1" dur="6s" repeatCount="indefinite" />
      </circle>
    </g>
  </svg>
);