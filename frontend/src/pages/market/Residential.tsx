// ─── Residential Buildings ────────────────────────────────────────────────────
// Dharamshala, Haveli, Mud Hut, Merchant's Villa, Noble Townhouse,
// Courtyard House, Stilt House
import type { SVGBuildingProps } from './types';

export function HaveliSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 1.05} height={h} viewBox="0 0 126 120">
      <ellipse cx="63" cy="118" rx="56" ry="5" fill="rgba(80,45,15,0.13)" />
      {/* Main body — 3 storeys */}
      <rect x="8" y="30" width="110" height="88" rx="3" fill="#e8935a" />
      <rect x="8" y="30" width="110" height="88" rx="3" fill="url(#hvWall)" opacity="0.25" />
      {/* Storey dividers */}
      <rect x="8" y="58" width="110" height="5" rx="0" fill="#c46c30" />
      <rect x="8" y="86" width="110" height="5" rx="0" fill="#c46c30" />
      {/* Top parapet crenels */}
      {[10,24,38,52,66,80,94,108].map((x,i) => (
        <rect key={i} x={x} y="20" width="10" height="14" rx="2" fill="#d4784a" />
      ))}
      <rect x="8" y="28" width="110" height="6" rx="0" fill="#bf6535" />
      {/* Jharokha windows — top floor */}
      {[14,46,78].map((x,i) => (
        <g key={i}>
          <rect x={x} y="36" width="22" height="18" rx="0" fill="#2a1860" opacity="0.85" />
          <path d={`M${x},42 Q${x+11},32 ${x+22},42`} fill="#3d2890" />
          <rect x={x+2} y="38" width="8" height="14" rx="1" fill="#c8a8f0" opacity="0.5" />
          <rect x={x+12} y="38" width="8" height="14" rx="1" fill="#c8a8f0" opacity="0.5" />
          <rect x={x-2} y="52" width="26" height="4" rx="1" fill="#c46c30" />
        </g>
      ))}
      {/* Mid floor windows */}
      {[14,46,78].map((x,i) => (
        <g key={i}>
          <rect x={x} y="63" width="22" height="20" rx="2" fill="#1a1248" opacity="0.8" />
          <path d={`M${x},70 Q${x+11},61 ${x+22},70`} fill="#2d1e70" />
          <line x1={x+11} y1="63" x2={x+11} y2="83" stroke="#8878c0" strokeWidth="1" opacity="0.6" />
        </g>
      ))}
      {/* Ground floor arch entrance */}
      <path d="M44,118 L44,93 Q63,78 82,93 L82,118 Z" fill="#3d2010" />
      <path d="M46,118 L46,94 Q63,81 80,94 L80,118 Z" fill="#2a1008" />
      <rect x="14" y="92" width="22" height="26" rx="11 11 0 0" fill="#1a1248" opacity="0.8" />
      <rect x="90" y="92" width="22" height="26" rx="11 11 0 0" fill="#1a1248" opacity="0.8" />
      {[20,54,88].map((x,i) => (
        <circle key={i} cx={x+5} cy="76" r="3" fill="#f0c040" opacity="0.7" />
      ))}
      <defs>
        <linearGradient id="hvWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MudHutSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 0.88} height={h} viewBox="0 0 106 120">
      <ellipse cx="53" cy="118" rx="48" ry="6" fill="rgba(80,45,15,0.15)" />
      {[8,22,38,56,72,88].map((x,i) => (
        <ellipse key={i} cx={x} cy="116" rx="5" ry="3" fill="#60a030" opacity="0.5" />
      ))}
      {/* Hut body */}
      <ellipse cx="53" cy="90" rx="42" ry="30" fill="#c8904a" />
      <ellipse cx="53" cy="90" rx="42" ry="30" fill="url(#mhBody)" opacity="0.3" />
      {[72,82,92,100].map((y,i) => (
        <path key={i} d={`M${12+i*2},${y} Q53,${y-4} ${94-i*2},${y}`} stroke="#a86e2a" strokeWidth="1.2" fill="none" opacity="0.4" />
      ))}
      {/* Thatched roof cone */}
      <ellipse cx="53" cy="62" rx="44" ry="10" fill="#b88020" />
      <polygon points="53,8 96,62 10,62" fill="#c89830" />
      <polygon points="53,8 96,62 10,62" fill="url(#mhRoof)" opacity="0.2" />
      {[18,28,38,48,58].map((y,i) => (
        <path key={i} d={`M${10+i*3.5},${y+4} Q53,${y} ${96-i*3.5},${y+4}`} stroke="#a07018" strokeWidth="2.5" fill="none" opacity="0.55" />
      ))}
      <circle cx="53" cy="8" r="5" fill="#d4a030" />
      <circle cx="53" cy="8" r="3" fill="#f0c050" />
      {/* Door */}
      <rect x="40" y="84" width="26" height="34" rx="13 13 0 0" fill="#6a3808" />
      <rect x="42" y="86" width="22" height="32" rx="11 11 0 0" fill="#4a2406" />
      {/* Round window */}
      <circle cx="75" cy="82" r="8" fill="#2a1808" />
      <circle cx="75" cy="82" r="6" fill="#a8c8e0" opacity="0.6" />
      <line x1="69" y1="82" x2="81" y2="82" stroke="#7aa0b8" strokeWidth="1.2" />
      <line x1="75" y1="76" x2="75" y2="88" stroke="#7aa0b8" strokeWidth="1.2" />
      {/* Hanging flower pot */}
      <line x1="24" y1="68" x2="24" y2="80" stroke="#8b5020" strokeWidth="1" />
      <path d="M18,80 Q24,86 30,80" fill="#c0501a" />
      <ellipse cx="24" cy="78" rx="6" ry="4" fill="#d06020" />
      <circle cx="22" cy="77" r="2" fill="#f03060" />
      <circle cx="26" cy="77" r="2" fill="#f05030" />
      <defs>
        <radialGradient id="mhBody" cx="35%" cy="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6a3800" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id="mhRoof" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0.12" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MerchantVillaSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 1.0} height={h} viewBox="0 0 120 120">
      <ellipse cx="60" cy="118" rx="52" ry="5" fill="rgba(80,45,15,0.12)" />
      {/* Body */}
      <rect x="8" y="42" width="104" height="76" rx="3" fill="#f0ead8" />
      <rect x="8" y="42" width="104" height="76" rx="3" fill="url(#mvWall)" opacity="0.2" />
      <rect x="8" y="76" width="104" height="5" rx="0" fill="#d4c8a0" />
      {/* Terracotta tiled roof */}
      <rect x="4" y="28" width="112" height="18" rx="3" fill="#c05828" />
      {[4,22,40,58,76,94,108].map((x,i) => (
        <ellipse key={i} cx={x+8} cy="37" rx="9" ry="5" fill="#d46830" opacity="0.7" />
      ))}
      <polygon points="60,8 108,28 12,28" fill="#a84820" />
      <polygon points="60,8 108,28 12,28" fill="url(#mvRoof)" opacity="0.2" />
      {/* Second floor teal shuttered windows */}
      {[16,50,84].map((x,i) => (
        <g key={i}>
          <rect x={x} y="48" width="22" height="24" rx="2" fill="#d8e8d0" />
          <rect x={x} y="48" width="10" height="24" rx="1" fill="#2a7858" opacity="0.85" />
          <rect x={x+12} y="48" width="10" height="24" rx="1" fill="#2a7858" opacity="0.85" />
          {[52,57,62,66].map((y,j) => (
            <line key={j} x1={x+1} y1={y} x2={x+9} y2={y} stroke="#1a5840" strokeWidth="0.8" opacity="0.6" />
          ))}
        </g>
      ))}
      {/* Ground floor */}
      <rect x="44" y="82" width="32" height="36" rx="16 16 0 0" fill="#3d1808" />
      <rect x="46" y="84" width="28" height="34" rx="14 14 0 0" fill="#2a1005" />
      <circle cx="68" cy="102" r="3" fill="#d4a030" />
      <rect x="12" y="84" width="26" height="20" rx="2" fill="#d8e8d0" />
      <rect x="12" y="84" width="12" height="20" rx="1" fill="#2a7858" opacity="0.8" />
      <rect x="26" y="84" width="12" height="20" rx="1" fill="#2a7858" opacity="0.8" />
      <rect x="82" y="84" width="26" height="20" rx="2" fill="#d8e8d0" />
      <rect x="82" y="84" width="12" height="20" rx="1" fill="#2a7858" opacity="0.8" />
      <rect x="96" y="84" width="12" height="20" rx="1" fill="#2a7858" opacity="0.8" />
      {/* Balcony railing */}
      <rect x="8" y="70" width="104" height="4" rx="2" fill="#b0a070" />
      {[12,20,28,36,44,52,60,68,76,84,92,100,108].map((x,i) => (
        <rect key={i} x={x} y="58" width="2" height="14" rx="1" fill="#b0a070" />
      ))}
      {/* Climbing vine */}
      <path d="M8,118 Q10,90 14,70 Q18,50 22,42" stroke="#3a8020" strokeWidth="2" fill="none" opacity="0.6" />
      {[95,80,65,55].map((y,i) => (
        <ellipse key={i} cx={8+i*4} cy={y} rx="6" ry="4" fill="#4a9828" opacity="0.7" transform={`rotate(${i*20},${8+i*4},${y})`} />
      ))}
      <defs>
        <linearGradient id="mvWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.1" />
          <stop offset="100%" stopColor="white" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="mvRoof" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function NobleTownhouseSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 0.72} height={h} viewBox="0 0 86 120">
      <ellipse cx="43" cy="118" rx="38" ry="5" fill="rgba(80,45,15,0.13)" />
      {/* Brick body */}
      <rect x="6" y="28" width="74" height="90" rx="3" fill="#b04830" />
      {Array.from({length:9},(_,row) => (
        Array.from({length: row%2===0 ? 5 : 4},(_,col) => (
          <rect
            key={`${row}-${col}`}
            x={row%2===0 ? 7+col*14 : 14+col*14}
            y={30+row*10}
            width="12" height="8"
            rx="1"
            fill={row%3===0 ? '#a03828' : '#be5235'}
            stroke="#8a2e20"
            strokeWidth="0.5"
            opacity="0.9"
          />
        ))
      ))}
      {/* Steeply pitched slate roof */}
      <polygon points="43,4 82,28 4,28" fill="#3a3a4a" />
      <polygon points="43,4 82,28 4,28" fill="url(#ntRoof)" opacity="0.25" />
      {[10,16,22].map((y,i) => (
        <line key={i} x1={4+i*6} y1={y+18} x2={82-i*6} y2={y+18} stroke="#5a5a6a" strokeWidth="1" opacity="0.5" />
      ))}
      {/* Chimney */}
      <rect x="56" y="6" width="10" height="18" rx="2" fill="#4a3828" />
      <rect x="54" y="4" width="14" height="5" rx="2" fill="#5a4838" />
      {/* Arched door */}
      <rect x="28" y="80" width="30" height="38" rx="15 15 0 0" fill="#1a0a04" />
      <rect x="30" y="82" width="26" height="36" rx="13 13 0 0" fill="#2d1208" />
      <circle cx="52" cy="102" r="3" fill="#d4b030" />
      {/* Windows */}
      <rect x="10" y="38" width="22" height="26" rx="2" fill="#1a0a04" />
      <rect x="12" y="40" width="18" height="22" rx="11 11 0 0" fill="#90b8d8" opacity="0.7" />
      <line x1="21" y1="40" x2="21" y2="62" stroke="#6090b0" strokeWidth="1" />
      <rect x="54" y="38" width="22" height="26" rx="2" fill="#1a0a04" />
      <rect x="56" y="40" width="18" height="22" rx="9 9 0 0" fill="#90b8d8" opacity="0.7" />
      <line x1="65" y1="40" x2="65" y2="62" stroke="#6090b0" strokeWidth="1" />
      <rect x="10" y="70" width="22" height="20" rx="2" fill="#1a0a04" />
      <rect x="12" y="72" width="18" height="16" rx="1" fill="#90b8d8" opacity="0.6" />
      <line x1="21" y1="72" x2="21" y2="88" stroke="#6090b0" strokeWidth="1" />
      {/* Iron lantern */}
      <line x1="43" y1="28" x2="43" y2="38" stroke="#3a2010" strokeWidth="2" />
      <rect x="39" y="38" width="8" height="10" rx="2" fill="#2a1808" />
      <rect x="40" y="39" width="6" height="8" rx="1" fill="#f0e060" opacity="0.8" />
      <defs>
        <linearGradient id="ntRoof" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CourtyardHouseSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 1.15} height={h} viewBox="0 0 138 120">
      <ellipse cx="69" cy="118" rx="62" ry="5" fill="rgba(80,45,15,0.11)" />
      {/* Wings */}
      <rect x="4" y="38" width="42" height="80" rx="3" fill="#ddc890" />
      <rect x="4" y="38" width="42" height="80" rx="3" fill="url(#chWall)" opacity="0.2" />
      <rect x="92" y="38" width="42" height="80" rx="3" fill="#ddc890" />
      <rect x="92" y="38" width="42" height="80" rx="3" fill="url(#chWall)" opacity="0.2" />
      {/* Back wall */}
      <rect x="4" y="38" width="130" height="28" rx="3" fill="#c8b478" />
      {/* Flat roof parapets */}
      {[4,18,32].map((x,i) => (<rect key={i} x={x} y="30" width="10" height="12" rx="2" fill="#b8a060" />))}
      {[94,108,122].map((x,i) => (<rect key={i} x={x} y="30" width="10" height="12" rx="2" fill="#b8a060" />))}
      <rect x="4" y="36" width="130" height="5" rx="0" fill="#a89050" />
      {/* Courtyard */}
      <rect x="46" y="66" width="46" height="52" rx="3" fill="#d0e8f0" opacity="0.5" />
      <rect x="46" y="66" width="46" height="52" rx="3" fill="none" stroke="#b8d0e0" strokeWidth="1.5" />
      <ellipse cx="69" cy="104" rx="10" ry="5" fill="#5a9830" opacity="0.5" />
      <rect x="66" y="96" width="6" height="10" rx="2" fill="#7a4820" opacity="0.6" />
      <ellipse cx="69" cy="96" rx="10" ry="8" fill="#3a8820" opacity="0.7" />
      {/* Windows */}
      <rect x="10" y="48" width="16" height="14" rx="2" fill="#1a1440" opacity="0.75" />
      <rect x="30" y="48" width="12" height="14" rx="2" fill="#1a1440" opacity="0.75" />
      <rect x="10" y="72" width="30" height="18" rx="2" fill="#1a1440" opacity="0.75" />
      <line x1="25" y1="72" x2="25" y2="90" stroke="#4040a0" strokeWidth="1" opacity="0.5" />
      <rect x="96" y="48" width="16" height="14" rx="2" fill="#1a1440" opacity="0.75" />
      <rect x="116" y="48" width="16" height="14" rx="2" fill="#1a1440" opacity="0.75" />
      <rect x="96" y="72" width="30" height="18" rx="2" fill="#1a1440" opacity="0.75" />
      <line x1="111" y1="72" x2="111" y2="90" stroke="#4040a0" strokeWidth="1" opacity="0.5" />
      {/* Entrance */}
      <rect x="56" y="90" width="26" height="28" rx="13 13 0 0" fill="#1a1248" />
      <rect x="58" y="92" width="22" height="26" rx="11 11 0 0" fill="#0e0c30" />
      <circle cx="76" cy="106" r="2.5" fill="#e0b828" />
      <path d="M56,90 Q69,80 82,90" fill="none" stroke="#d4a028" strokeWidth="2" opacity="0.8" />
      <defs>
        <linearGradient id="chWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function StiltHouseSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 0.95} height={h} viewBox="0 0 114 120">
      {/* Water */}
      <rect x="0" y="96" width="114" height="24" rx="4" fill="#4090b8" opacity="0.4" />
      <path d="M0,100 Q14,96 28,100 Q42,104 56,100 Q70,96 84,100 Q98,104 114,100 L114,120 L0,120 Z" fill="#3880a8" opacity="0.35" />
      {[104,110].map((y,i) => (
        <path key={i} d={`M8,${y} Q30,${y-3} 56,${y} Q82,${y+3} 106,${y}`} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
      ))}
      {/* Stilts */}
      {[16,36,56,76,96].map((x,i) => (
        <rect key={i} x={x} y="80" width="6" height="40" rx="2" fill="#6a3e18" />
      ))}
      {/* Cross braces */}
      <line x1="16" y1="90" x2="42" y2="110" stroke="#5a3010" strokeWidth="2" opacity="0.6" />
      <line x1="42" y1="90" x2="16" y2="110" stroke="#5a3010" strokeWidth="2" opacity="0.6" />
      <line x1="62" y1="90" x2="88" y2="110" stroke="#5a3010" strokeWidth="2" opacity="0.6" />
      <line x1="88" y1="90" x2="62" y2="110" stroke="#5a3010" strokeWidth="2" opacity="0.6" />
      {/* Platform */}
      <rect x="8" y="74" width="98" height="8" rx="2" fill="#8a5828" />
      {[14,26,38,50,62,74,86,98].map((x,i) => (
        <line key={i} x1={x} y1="74" x2={x} y2="82" stroke="#6a4018" strokeWidth="1" opacity="0.5" />
      ))}
      {/* House body */}
      <rect x="12" y="30" width="90" height="46" rx="3" fill="#4a7858" />
      {[36,42,48,54,60,66].map((y,i) => (
        <line key={i} x1="12" y1={y} x2="102" y2={y} stroke="#3a6048" strokeWidth="1.2" opacity="0.5" />
      ))}
      <rect x="12" y="30" width="90" height="46" rx="3" fill="url(#shWall)" opacity="0.2" />
      {/* Corrugated tin roof */}
      <rect x="6" y="18" width="102" height="16" rx="2" fill="#9a8060" />
      {[8,16,24,32,40,48,56,64,72,80,88,96,104].map((x,i) => (
        <path key={i} d={`M${x},18 Q${x+4},26 ${x+8},18`} fill="#b09070" opacity="0.6" />
      ))}
      <polygon points="57,6 104,18 10,18" fill="#7a6048" />
      <polygon points="57,6 104,18 10,18" fill="url(#shRoof)" opacity="0.2" />
      {/* Windows */}
      <rect x="18" y="36" width="24" height="20" rx="2" fill="#c8e8d8" opacity="0.8" />
      <line x1="30" y1="36" x2="30" y2="56" stroke="#a0c8b0" strokeWidth="1.2" />
      <line x1="18" y1="46" x2="42" y2="46" stroke="#a0c8b0" strokeWidth="1.2" />
      <rect x="70" y="36" width="24" height="20" rx="2" fill="#c8e8d8" opacity="0.8" />
      <line x1="82" y1="36" x2="82" y2="56" stroke="#a0c8b0" strokeWidth="1.2" />
      <line x1="70" y1="46" x2="94" y2="46" stroke="#a0c8b0" strokeWidth="1.2" />
      {/* Door */}
      <rect x="46" y="46" width="22" height="28" rx="2" fill="#2a1808" />
      <rect x="48" y="48" width="18" height="26" rx="1" fill="#1a1005" />
      <circle cx="64" cy="62" r="2" fill="#d4a028" />
      {/* Dock */}
      <rect x="90" y="82" width="20" height="4" rx="1" fill="#7a5020" opacity="0.7" />
      <rect x="106" y="76" width="4" height="10" rx="1" fill="#6a4018" />
      <defs>
        <linearGradient id="shWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="shRoof" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
