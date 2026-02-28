// ─── Religious Buildings ──────────────────────────────────────────────────────
// Ashram, Temple
import type { SVGBuildingProps } from './types';

export function TempleSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 0.85} height={h} viewBox="0 0 100 120">
      <ellipse cx="50" cy="118" rx="44" ry="5" fill="rgba(80,45,15,0.15)" />
      {/* Base platform */}
      <rect x="6" y="98" width="88" height="20" rx="3" fill="#c8a060" />
      <rect x="6" y="98" width="88" height="20" rx="3" fill="url(#tBase)" opacity="0.3" />
      {/* Main hall */}
      <rect x="18" y="68" width="64" height="32" rx="3" fill="#e8c87a" />
      <rect x="18" y="68" width="64" height="32" rx="3" fill="url(#tWall)" opacity="0.25" />
      {/* Arch entrance */}
      <rect x="36" y="76" width="28" height="24" rx="14 14 0 0" fill="#6a3810" />
      <rect x="38" y="78" width="24" height="22" rx="12 12 0 0" fill="#3d2008" />
      {/* Shikhara tower */}
      <rect x="30" y="34" width="40" height="36" rx="3" fill="#daa850" />
      <rect x="30" y="34" width="40" height="36" rx="3" fill="url(#tTower)" opacity="0.2" />
      {[42,50,58].map((y,i) => (
        <rect key={i} x={30+i*3} y={y} width={40-i*6} height="7" rx="2" fill="#c89030" opacity="0.6" />
      ))}
      {/* Dome */}
      <ellipse cx="50" cy="34" rx="20" ry="14" fill="#f0c040" />
      <ellipse cx="50" cy="34" rx="20" ry="14" fill="url(#tDome)" opacity="0.3" />
      {/* Kalash */}
      <ellipse cx="50" cy="20" rx="5" ry="3" fill="#e8a820" />
      <line x1="50" y1="20" x2="50" y2="10" stroke="#c88018" strokeWidth="2" />
      <circle cx="50" cy="9" r="5" fill="#f0c030" />
      <circle cx="50" cy="9" r="3" fill="#ffe060" />
      <text x="50" y="38" textAnchor="middle" fontSize="14" fill="#8b5010" fontFamily="serif" opacity="0.8">ॐ</text>
      <defs>
        <linearGradient id="tBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="tWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="tTower" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="tDome" cx="35%" cy="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#b07808" stopOpacity="0.2" />
        </radialGradient>
      </defs>
    </svg>
  );
}
