// ─── Infrastructure Buildings ─────────────────────────────────────────────────
// City Gate, Well
import type { SVGBuildingProps } from './types';

export function GateSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 1.1} height={h} viewBox="0 0 132 120">
      <ellipse cx="66" cy="118" rx="58" ry="5" fill="rgba(80,45,15,0.12)" />
      {/* Left pillar */}
      <rect x="4" y="28" width="30" height="90" rx="3" fill="#b88048" />
      <rect x="4" y="28" width="30" height="90" rx="3" fill="url(#gPil)" opacity="0.3" />
      {/* Right pillar */}
      <rect x="98" y="28" width="30" height="90" rx="3" fill="#b88048" />
      <rect x="98" y="28" width="30" height="90" rx="3" fill="url(#gPil)" opacity="0.3" />
      {/* Pillar caps */}
      <rect x="0" y="22" width="38" height="10" rx="3" fill="#8a5828" />
      <rect x="94" y="22" width="38" height="10" rx="3" fill="#8a5828" />
      {/* Lotus finials */}
      <ellipse cx="19" cy="20" rx="10" ry="7" fill="#e8c050" />
      <ellipse cx="113" cy="20" rx="10" ry="7" fill="#e8c050" />
      <text x="14" y="24" fontSize="12">🪷</text>
      <text x="108" y="24" fontSize="12">🪷</text>
      {/* Arch lintel */}
      <rect x="4" y="50" width="124" height="18" rx="3" fill="#9a6030" />
      <rect x="4" y="44" width="124" height="10" rx="3" fill="#c88040" />
      {/* Gold band */}
      <rect x="4" y="48" width="124" height="5" rx="0" fill="#e8b830" opacity="0.7" />
      {/* Decorative motifs */}
      {[22,44,66,88,110].map((x,i) => (
        <circle key={i} cx={x} cy="49" r="4" fill="#d4a030" opacity="0.8" />
      ))}
      {/* Ground path */}
      <rect x="34" y="68" width="64" height="50" fill="#c8a860" opacity="0.4" />
      <defs>
        <linearGradient id="gPil" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="50%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function WellSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 0.85} height={h} viewBox="0 0 100 120">
      <ellipse cx="50" cy="118" rx="40" ry="5" fill="rgba(80,45,15,0.12)" />
      {/* Well body */}
      <ellipse cx="50" cy="80" rx="32" ry="10" fill="#9a7848" />
      <rect x="18" y="70" width="64" height="48" rx="4" fill="#b89060" />
      <rect x="18" y="70" width="64" height="48" rx="4" fill="url(#wBody)" opacity="0.3" />
      {[78,86,94,102,110].map((y,i) => (
        <line key={i} x1="18" y1={y} x2="82" y2={y} stroke="#9a7040" strokeWidth="1" opacity="0.5" />
      ))}
      {/* Water */}
      <ellipse cx="50" cy="72" rx="28" ry="9" fill="#60a8c8" />
      <ellipse cx="50" cy="72" rx="28" ry="9" fill="url(#wWater)" opacity="0.6" />
      {/* Posts */}
      <rect x="20" y="32" width="10" height="42" rx="2" fill="#7a5028" />
      <rect x="70" y="32" width="10" height="42" rx="2" fill="#7a5028" />
      {/* Roof */}
      <polygon points="50,6 88,32 12,32" fill="#8b4518" />
      <polygon points="50,6 88,32 12,32" fill="url(#wRoof)" opacity="0.2" />
      <polygon points="50,11 84,32 16,32" fill="#a05828" />
      {/* Rope & bucket */}
      <line x1="50" y1="32" x2="50" y2="72" stroke="#a07840" strokeWidth="2" strokeDasharray="4,2" />
      <rect x="44" y="60" width="12" height="10" rx="2" fill="#8b5020" />
      <defs>
        <linearGradient id="wBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="wRoof" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="wWater" cx="40%" cy="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1860a0" stopOpacity="0.1" />
        </radialGradient>
      </defs>
    </svg>
  );
}
