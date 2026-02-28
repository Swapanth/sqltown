// ─── Commercial Buildings ─────────────────────────────────────────────────────
// Bazaar (Market), Theatre
import type { SVGBuildingProps } from './types';

export function MarketSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 0.95} height={h} viewBox="0 0 114 120">
      <ellipse cx="57" cy="118" rx="50" ry="5" fill="rgba(80,45,15,0.12)" />
      {/* Body */}
      <rect x="6" y="52" width="102" height="66" rx="3" fill="#b87840" />
      <rect x="6" y="52" width="102" height="66" rx="3" fill="url(#mWall)" opacity="0.3" />
      {/* Flat roof with parapet */}
      <rect x="2" y="38" width="110" height="16" rx="3" fill="#9a5c28" />
      <rect x="2" y="34" width="110" height="8" rx="3" fill="#a86830" />
      {/* Parapet crenels */}
      {[6,22,38,54,70,86,102].map((x,i) => (
        <rect key={i} x={x} y="28" width="10" height="10" rx="2" fill="#9a5c28" />
      ))}
      {/* Striped awning */}
      <rect x="6" y="52" width="102" height="14" rx="0" fill="url(#mAwning)" />
      <rect x="4" y="52" width="106" height="14" rx="0" fill="none" stroke="#8b4020" strokeWidth="1.5" />
      {/* Hanging decorations */}
      {[20,38,56,74,92].map((x,i) => (
        <g key={i}>
          <line x1={x} y1="52" x2={x-4} y2="62" stroke="#d47830" strokeWidth="1" />
          <circle cx={x-4} cy="63" r="3" fill={['#e85030','#e8a030','#40a050','#3060c0','#e85030'][i]} opacity="0.9" />
        </g>
      ))}
      {/* Stalls */}
      <rect x="14" y="72" width="34" height="24" rx="2" fill="#8b5028" />
      <rect x="16" y="74" width="30" height="10" rx="1" fill="#a06030" />
      <text x="31" y="83" textAnchor="middle" fontSize="9" fill="#f5d890">🍎🥬🌶</text>
      <rect x="66" y="72" width="34" height="24" rx="2" fill="#8b5028" />
      <rect x="68" y="74" width="30" height="10" rx="1" fill="#a06030" />
      <text x="83" y="83" textAnchor="middle" fontSize="9" fill="#f5d890">🥖🫙🧅</text>
      {/* Door */}
      <rect x="46" y="80" width="22" height="38" rx="2" fill="#5a2d10" />
      <defs>
        <linearGradient id="mWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
        <pattern id="mAwning" x="0" y="0" width="20" height="14" patternUnits="userSpaceOnUse">
          <rect width="10" height="14" fill="#e84030" />
          <rect x="10" width="10" height="14" fill="#fff8e8" />
        </pattern>
      </defs>
    </svg>
  );
}

export function TheatreSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 0.9} height={h} viewBox="0 0 108 120">
      <ellipse cx="54" cy="118" rx="46" ry="5" fill="rgba(80,45,15,0.13)" />
      {/* Body */}
      <rect x="6" y="45" width="96" height="73" rx="4" fill="#c8906a" />
      <rect x="6" y="45" width="96" height="73" rx="4" fill="url(#thWall)" opacity="0.2" />
      {/* Triangular pediment */}
      <polygon points="54,6 100,45 8,45" fill="#8b4520" />
      <polygon points="54,6 100,45 8,45" fill="url(#thPed)" opacity="0.2" />
      <polygon points="54,12 94,45 14,45" fill="#a05528" />
      <text x="43" y="36" fontSize="16" opacity="0.9">🎭</text>
      {/* Columns */}
      {[16,38,62,84].map((x,i) => (
        <g key={i}>
          <rect x={x} y="45" width="9" height="64" rx="2" fill="#d4a860" />
          <rect x={x} y="45" width="9" height="64" rx="2" fill="url(#thCol)" opacity="0.3" />
          <ellipse cx={x+4.5} cy="45" rx="6" ry="3.5" fill="#c8a050" />
          <ellipse cx={x+4.5} cy="103" rx="6" ry="3.5" fill="#ae8438" />
        </g>
      ))}
      {/* Stage entrance */}
      <rect x="36" y="72" width="36" height="46" rx="18 18 0 0" fill="#3d1808" />
      <rect x="38" y="74" width="32" height="44" rx="16 16 0 0" fill="#2a1005" />
      {/* Red curtains */}
      <rect x="36" y="72" width="10" height="44" rx="5 0 0 0" fill="#9a1020" opacity="0.8" />
      <rect x="62" y="72" width="10" height="44" rx="0 5 0 0" fill="#9a1020" opacity="0.8" />
      <defs>
        <linearGradient id="thWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="thPed" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="thCol" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="50%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}
