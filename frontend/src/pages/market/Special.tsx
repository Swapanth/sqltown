// ─── Special Buildings ────────────────────────────────────────────────────────
// 10 Garden variants, Library, Fountain
import type { SVGBuildingProps } from './types';

// ── Shared garden sub-components ─────────────────────────────────────────────

const GDefs = () => (
  <defs>
    <radialGradient id="gGrass" cx="50%" cy="50%">
      <stop offset="0%" stopColor="#a8d868" stopOpacity="0.7"/>
      <stop offset="100%" stopColor="#4a8820" stopOpacity="0.3"/>
    </radialGradient>
    <radialGradient id="gWater" cx="35%" cy="35%">
      <stop offset="0%" stopColor="white" stopOpacity="0.45"/>
      <stop offset="100%" stopColor="#1870a8" stopOpacity="0.1"/>
    </radialGradient>
    <radialGradient id="gLeaf" cx="30%" cy="30%">
      <stop offset="0%" stopColor="#c8f080" stopOpacity="0.5"/>
      <stop offset="100%" stopColor="#1a5808" stopOpacity="0.2"/>
    </radialGradient>
  </defs>
);

function RoseBush({ cx, cy, color, r = 10 }: { cx: number; cy: number; color: string; r?: number }) {
  const petals = [0,60,120,180,240,300];
  return (
    <g>
      {petals.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const px = cx + Math.cos(rad) * r * 0.55;
        const py = cy + Math.sin(rad) * r * 0.55;
        return <ellipse key={i} cx={px} cy={py} rx={r*0.48} ry={r*0.35} fill={color} opacity="0.82"
          transform={`rotate(${deg},${px},${py})`} />;
      })}
      <circle cx={cx} cy={cy} r={r*0.3} fill="#f5e060" />
      <circle cx={cx} cy={cy} r={r*0.15} fill="#e8c020" />
    </g>
  );
}

function Leaf({ x, y, w = 14, h = 8, angle = 0, color = '#3a8830' }:
  { x: number; y: number; w?: number; h?: number; angle?: number; color?: string }) {
  return (
    <ellipse cx={x} cy={y} rx={w/2} ry={h/2} fill={color}
      transform={`rotate(${angle},${x},${y})`} />
  );
}

function RealisticTree({ cx, cy, trunkH = 28, trunkW = 8, canopyColor = '#2e7820', canopyR = 22 }:
  { cx: number; cy: number; trunkH?: number; trunkW?: number; canopyColor?: string; canopyR?: number }) {
  return (
    <g>
      <rect x={cx - trunkW/2} y={cy - trunkH} width={trunkW} height={trunkH} rx={trunkW/2}
        fill="url(#trunkGrad)" />
      <ellipse cx={cx} cy={cy - trunkH - canopyR*0.6} rx={canopyR} ry={canopyR*0.8}
        fill="#1a5010" opacity="0.35" transform="translate(3,6)" />
      <ellipse cx={cx} cy={cy - trunkH - canopyR*0.6} rx={canopyR} ry={canopyR*0.85} fill={canopyColor} />
      <ellipse cx={cx - canopyR*0.3} cy={cy - trunkH - canopyR*0.8}
        rx={canopyR*0.55} ry={canopyR*0.45} fill="#5ab838" opacity="0.5" />
      <defs>
        <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4a2a0a" />
          <stop offset="40%" stopColor="#7a4820" />
          <stop offset="100%" stopColor="#3a1e08" />
        </linearGradient>
      </defs>
    </g>
  );
}

// ── 10 Garden Variants ───────────────────────────────────────────────────────

function GardenRoseSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h} height={h} viewBox="0 0 120 120">
      <rect x="0" y="0" width="120" height="120" fill="#e8f4d8" rx="4" />
      <ellipse cx="60" cy="105" rx="56" ry="18" fill="#5a9830" opacity="0.4" />
      <rect x="4" y="88" width="112" height="28" rx="6" fill="#6aaa38" opacity="0.45" />
      {[90,80,70,60,50,40].map((y,i) => (
        <ellipse key={i} cx={60+(i%2===0?0:2)} cy={y} rx="9" ry="5" fill="#c8b890" opacity="0.8" />
      ))}
      <ellipse cx="28" cy="80" rx="20" ry="14" fill="#3a7820" opacity="0.7" />
      <RoseBush cx={18} cy={76} color="#e83060" r={9} />
      <RoseBush cx={30} cy={82} color="#f06090" r={8} />
      <RoseBush cx={22} cy={88} color="#c01840" r={7} />
      <ellipse cx="92" cy="80" rx="20" ry="14" fill="#3a7820" opacity="0.7" />
      <RoseBush cx={82} cy={76} color="#f07020" r={9} />
      <RoseBush cx={94} cy={82} color="#e05010" r={8} />
      <RoseBush cx={86} cy={88} color="#f8a040" r={7} />
      <path d="M10,48 Q60,18 110,48" stroke="#2a6010" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M10,48 Q60,18 110,48" stroke="#4a8828" strokeWidth="7" fill="none" strokeLinecap="round" />
      {[[20,46,'#f06090'],[40,32,'#e83060'],[60,22,'#f8a0b0'],[80,32,'#e83060'],[100,46,'#f06090']].map(([x,y,c],i)=>(
        <RoseBush key={i} cx={x as number} cy={y as number} color={c as string} r={6} />
      ))}
      <g transform="translate(52,58) rotate(-15)">
        <ellipse cx="-5" cy="0" rx="6" ry="4" fill="#f0a0d0" opacity="0.8" />
        <ellipse cx="5" cy="0" rx="6" ry="4" fill="#f0a0d0" opacity="0.8" />
        <line x1="0" y1="-5" x2="0" y2="5" stroke="#4a2008" strokeWidth="1" />
      </g>
      <GDefs />
    </svg>
  );
}

function GardenVegSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h} height={h} viewBox="0 0 120 120">
      <rect x="0" y="0" width="120" height="120" fill="#e8eed8" rx="4" />
      <rect x="6" y="36" width="108" height="78" rx="6" fill="#8b5e2a" opacity="0.7" />
      <rect x="6" y="36" width="108" height="78" rx="6" fill="none" stroke="#6a3e18" strokeWidth="6" />
      <line x1="6" y1="56" x2="114" y2="56" stroke="#5a3010" strokeWidth="2" opacity="0.5" />
      <line x1="6" y1="76" x2="114" y2="76" stroke="#5a3010" strokeWidth="2" opacity="0.5" />
      <line x1="6" y1="96" x2="114" y2="96" stroke="#5a3010" strokeWidth="2" opacity="0.5" />
      {[16,32,48,64,80,96,110].map((x,i) => (
        <g key={i}>
          <line x1={x} y1="55" x2={x} y2="40" stroke="#3a6010" strokeWidth="2" />
          <circle cx={x} cy="38" r="5" fill="#d83010" opacity="0.9" />
          <circle cx={x-2} cy="36" r="2" fill="#e84020" opacity="0.7" />
          <Leaf x={x-5} y={47} w={10} h={5} angle={-30} color="#2a6808" />
          <Leaf x={x+5} y={47} w={10} h={5} angle={30} color="#2a6808" />
        </g>
      ))}
      {[14,28,44,58,74,88,104].map((x,i) => (
        <g key={i}>
          <Leaf x={x} y={65} w={18} h={10} angle={0} color="#40a020" />
          <Leaf x={x-4} y={67} w={14} h={8} angle={-25} color="#58b830" />
          <Leaf x={x+4} y={67} w={14} h={8} angle={25} color="#58b830" />
        </g>
      ))}
      {[16,34,52,70,88,106].map((x,i) => (
        <g key={i}>
          <ellipse cx={x} cy={84} rx={4} ry={10} fill="#e87010" opacity="0.85" />
          <line x1={x-2} y1="75" x2={x-5} y2="68" stroke="#3a8010" strokeWidth="1.5" />
          <line x1={x} y1="75" x2={x} y2="66" stroke="#3a8010" strokeWidth="1.5" />
          <line x1={x+2} y1="75" x2={x+5} y2="68" stroke="#3a8010" strokeWidth="1.5" />
        </g>
      ))}
      {[22,52,82,108].map((x,i) => (
        <g key={i}>
          <ellipse cx={x} cy={106} rx="10" ry="8" fill="#e87818" opacity="0.9" />
          <line x1={x} y1="98" x2={x+6} y2="92" stroke="#3a7010" strokeWidth="2" />
        </g>
      ))}
      <g transform="translate(96,22)">
        <ellipse cx="0" cy="0" rx="10" ry="7" fill="#6a8898" />
        <rect x="-10" y="-3" width="20" height="10" rx="3" fill="#788898" />
        <path d="M10,0 Q18,-5 20,-10" stroke="#6a8898" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M-10,3 Q-16,3 -18,6" stroke="#6a8898" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <GDefs />
    </svg>
  );
}

function GardenZenSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h} height={h} viewBox="0 0 120 120">
      <rect x="0" y="0" width="120" height="120" fill="#f5f0e8" rx="4" />
      <rect x="4" y="4" width="112" height="112" rx="6" fill="#e8e0cc" />
      {[0,5,10,15,20,25].map((offset,i) => (
        <ellipse key={i} cx="75" cy="72" rx={18+offset} ry={12+offset}
          fill="none" stroke="#c8c0a8" strokeWidth="1.2" opacity={0.6-i*0.08} />
      ))}
      {[20,28,36,44,52,60,68,76,84,92,100,108].map((y,i) => (
        <line key={i} x1="8" y1={y} x2="52" y2={y} stroke="#c8c0a8" strokeWidth="1" opacity="0.5" />
      ))}
      <ellipse cx="78" cy="76" rx="18" ry="13" fill="#7a7870" />
      <ellipse cx="78" cy="74" rx="17" ry="11" fill="#8a8878" />
      <ellipse cx="74" cy="72" rx="8" ry="6" fill="#a8a898" opacity="0.6" />
      <ellipse cx="62" cy="80" rx="10" ry="8" fill="#6a6860" />
      <ellipse cx="62" cy="78" rx="9" ry="7" fill="#7a7868" />
      <ellipse cx="90" cy="82" rx="8" ry="6" fill="#6a6860" />
      <ellipse cx="72" cy="70" rx="6" ry="3" fill="#5a8030" opacity="0.6" />
      <ellipse cx="60" cy="76" rx="4" ry="2" fill="#4a7028" opacity="0.55" />
      {/* Pine bonsai */}
      <rect x="23" y="72" width="6" height="28" rx="2" fill="#5a3010" />
      <polygon points="26,20 42,50 10,50" fill="#2a5818" />
      <polygon points="26,30 44,58 8,58" fill="#2e6420" />
      <polygon points="26,42 46,68 6,68" fill="#347228" />
      <polygon points="18,35 26,20 30,38" fill="#4a8830" opacity="0.5" />
      <ellipse cx="100" cy="32" rx="12" ry="9" fill="#2e6020" />
      <ellipse cx="96" cy="29" rx="6" ry="5" fill="#3a7828" opacity="0.7" />
      {/* Bamboo fence */}
      {[4,14,24,34,44,54,64,74,84,94,104,114].map((x,i) => (
        <g key={i}>
          <rect x={x-2} y="2" width="5" height="10" rx="2" fill="#8aaa48" />
          {[4,7].map((d,j) => <line key={j} x1={x-2} y1={2+d} x2={x+3} y2={2+d} stroke="#6a8838" strokeWidth="0.8" opacity="0.6" />)}
        </g>
      ))}
      <line x1="2" y1="8" x2="118" y2="8" stroke="#6a8030" strokeWidth="2" opacity="0.5" />
      {/* Stone lantern */}
      <rect x="100" y="50" width="12" height="16" rx="2" fill="#b89040" />
      <rect x="98" y="48" width="16" height="5" rx="2" fill="#a07830" />
      <rect x="98" y="65" width="16" height="4" rx="2" fill="#a07830" />
      <rect x="103" y="42" width="6" height="8" rx="1" fill="#907028" />
      <rect x="102" y="53" width="8" height="9" rx="1" fill="#f5e060" opacity="0.7" />
      <GDefs />
    </svg>
  );
}

function GardenLotusSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h} height={h} viewBox="0 0 120 120">
      <rect x="0" y="0" width="120" height="120" fill="#d8eee0" rx="4" />
      <ellipse cx="60" cy="72" rx="52" ry="38" fill="#4098b8" opacity="0.55" />
      <ellipse cx="60" cy="72" rx="52" ry="38" fill="url(#gWater)" />
      <ellipse cx="60" cy="72" rx="48" ry="34" fill="#50a8c8" opacity="0.3" />
      {Array.from({length:20},(_,i) => {
        const a = (i/20)*Math.PI*2;
        return <ellipse key={i} cx={60+Math.cos(a)*52} cy={72+Math.sin(a)*38}
          rx="5" ry="3.5" fill="#8a7858" opacity="0.85"
          transform={`rotate(${i*18},${60+Math.cos(a)*52},${72+Math.sin(a)*38})`} />;
      })}
      {/* Lily pads */}
      {[[42,64,25],[70,58,20],[52,80,18],[80,75,16],[34,76,15],[65,86,14]].map(([x,y,r],i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={r} ry={(r as number)*0.7} fill="#3a9828" opacity="0.85" />
          <path d={`M${x},${y} L${x},${(y as number)-(r as number)*0.7}`} stroke="#2a7818" strokeWidth="1.5" />
          {[30,60,90,120,150].map((ang,j) => (
            <line key={j} x1={x} y1={y}
              x2={(x as number)+Math.cos(ang*Math.PI/180)*(r as number)}
              y2={(y as number)+Math.sin(ang*Math.PI/180)*(r as number)*0.7}
              stroke="#2a7818" strokeWidth="0.7" opacity="0.5" />
          ))}
        </g>
      ))}
      {/* Lotus flowers */}
      {[[42,60,'#f080b0'],[70,54,'#f8b0d0'],[52,76,'#e060a0'],[80,71,'#f090c0']].map(([x,y,c],i) => (
        <g key={i}>
          <line x1={x} y1={(y as number)+4} x2={(x as number)+1} y2={(y as number)+14} stroke="#2a7018" strokeWidth="2" />
          {[0,45,90,135,180,225,270,315].map((ang,j) => (
            <ellipse key={j}
              cx={(x as number)+Math.cos(ang*Math.PI/180)*7}
              cy={(y as number)+Math.sin(ang*Math.PI/180)*5}
              rx="5" ry="8" fill={c as string} opacity="0.75"
              transform={`rotate(${ang},${(x as number)+Math.cos(ang*Math.PI/180)*7},${(y as number)+Math.sin(ang*Math.PI/180)*5})`} />
          ))}
          {[0,60,120,180,240,300].map((ang,j) => (
            <ellipse key={j}
              cx={(x as number)+Math.cos(ang*Math.PI/180)*3}
              cy={(y as number)+Math.sin(ang*Math.PI/180)*2}
              rx="3.5" ry="6" fill="#ffe0f0" opacity="0.9"
              transform={`rotate(${ang},${(x as number)+Math.cos(ang*Math.PI/180)*3},${(y as number)+Math.sin(ang*Math.PI/180)*2})`} />
          ))}
          <circle cx={x} cy={y} r="4" fill="#f5e040" />
          <circle cx={x} cy={y} r="2.5" fill="#e8c020" />
        </g>
      ))}
      {/* Reeds */}
      {[[12,40],[16,30],[20,44],[9,34]].map(([x,y],i) => (
        <g key={i}>
          <path d={`M${x},118 Q${x+3},80 ${x},${y}`} stroke="#5a8820" strokeWidth="2.5" fill="none" />
          <ellipse cx={x} cy={y} rx="3.5" ry="9" fill="#7a5020" />
        </g>
      ))}
      {[[108,38],[112,48],[104,30],[116,42]].map(([x,y],i) => (
        <g key={i}>
          <path d={`M${x},118 Q${x-3},80 ${x},${y}`} stroke="#5a8820" strokeWidth="2.5" fill="none" />
          <ellipse cx={x} cy={y} rx="3.5" ry="9" fill="#7a5020" />
        </g>
      ))}
      <g transform="translate(58,40) rotate(20)">
        <ellipse cx="0" cy="0" rx="8" ry="2.5" fill="#60d0e0" opacity="0.7" />
        <ellipse cx="-10" cy="-3" rx="9" ry="3" fill="#80e8f8" opacity="0.55" />
        <ellipse cx="-10" cy="3" rx="9" ry="3" fill="#80e8f8" opacity="0.55" />
        <ellipse cx="8" cy="-3" rx="7" ry="2.5" fill="#80e8f8" opacity="0.55" />
        <ellipse cx="8" cy="3" rx="7" ry="2.5" fill="#80e8f8" opacity="0.55" />
        <circle cx="-1" cy="0" r="2.5" fill="#1a6080" />
      </g>
      <GDefs />
    </svg>
  );
}

function GardenOrchardSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h} height={h} viewBox="0 0 120 120">
      <rect x="0" y="0" width="120" height="120" fill="#ddf0c8" rx="4" />
      <rect x="0" y="80" width="120" height="40" rx="4" fill="#7ab830" opacity="0.35" />
      <rect x="0" y="90" width="120" height="30" rx="0" fill="#6aa828" opacity="0.3" />
      {[8,22,40,58,76,94,110].map((x,i) => (
        <g key={i}>
          <line x1={x} y1="110" x2={x-4} y2="100" stroke="#4a9018" strokeWidth="2" />
          <line x1={x} y1="110" x2={x} y2="99" stroke="#4a9018" strokeWidth="2" />
          <line x1={x} y1="110" x2={x+4} y2="100" stroke="#4a9018" strokeWidth="2" />
        </g>
      ))}
      {[22, 60, 98].map((x,i) => (
        <g key={i}>
          <RealisticTree cx={x} cy={82} trunkH={22} trunkW={7} canopyColor="#2e7818" canopyR={18} />
          {[[-8,-6],[4,-10],[10,-4],[-4,-14],[-12,-12]].map(([dx,dy],j) => (
            <g key={j}>
              <circle cx={x+dx} cy={82-22-18*0.6+dy} r="4.5" fill="#d83020" opacity="0.9" />
              <line x1={x+dx} y1={82-22-18*0.6+dy-4.5} x2={x+dx+1} y2={82-22-18*0.6+dy-8}
                stroke="#3a6010" strokeWidth="1" />
            </g>
          ))}
          {[-6,2,8].map((dx,j) => (
            <ellipse key={j} cx={x+dx} cy={83} rx="4" ry="2.5" fill="#c02818" opacity="0.7" />
          ))}
        </g>
      ))}
      {/* Beehive */}
      <rect x="4" y="68" width="4" height="18" rx="1" fill="#7a5020" />
      <ellipse cx="6" cy="65" rx="9" ry="11" fill="#e8a820" />
      {[58,62,66,70].map((y,i) => (
        <path key={i} d={`M${6-9*(1-Math.abs(64-y)/10)},${y} Q6,${y-2} ${6+9*(1-Math.abs(64-y)/10)},${y}`}
          stroke="#c88010" strokeWidth="1" fill="none" opacity="0.6" />
      ))}
      {[[20,55],[30,48],[14,62]].map(([x,y],i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="4" ry="2.5" fill="#f0c020" />
          <ellipse cx={x-2} cy={y-2} rx="3.5" ry="2" fill="rgba(200,230,255,0.6)" transform={`rotate(-30,${x-2},${y-2})`} />
          <ellipse cx={x+2} cy={y-2} rx="3.5" ry="2" fill="rgba(200,230,255,0.6)" transform={`rotate(30,${x+2},${y-2})`} />
        </g>
      ))}
      <GDefs />
    </svg>
  );
}

function GardenHerbSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h} height={h} viewBox="0 0 120 120">
      <rect x="0" y="0" width="120" height="120" fill="#e8f0d8" rx="4" />
      <ellipse cx="60" cy="70" rx="56" ry="48" fill="#5a9820" opacity="0.3" />
      <path d="M60,112 Q108,112 110,70 Q112,28 70,22 Q30,18 20,52" stroke="#9a8060" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M60,100 Q96,100 98,68 Q100,38 68,33 Q36,28 30,56" stroke="#a88a6a" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M60,88 Q84,88 86,66 Q88,46 66,42 Q46,40 42,60" stroke="#b89470" strokeWidth="10" fill="none" strokeLinecap="round" />
      <ellipse cx="60" cy="64" rx="18" ry="14" fill="#c8a078" />
      <path d="M60,112 Q108,112 110,70 Q112,28 70,22 Q30,18 20,52" stroke="#7a5028" strokeWidth="7" fill="none" opacity="0.5" />
      <path d="M60,100 Q96,100 98,68 Q100,38 68,33 Q36,28 30,56" stroke="#8a6030" strokeWidth="7" fill="none" opacity="0.5" />
      <path d="M60,88 Q84,88 86,66 Q88,46 66,42 Q46,40 42,60" stroke="#9a6838" strokeWidth="7" fill="none" opacity="0.5" />
      {[[88,106],[94,100],[82,100]].map(([x,y],i)=>(
        <g key={i}>
          <Leaf x={x} y={y} w={16} h={10} angle={i*15-15} color="#2a8010" />
          <Leaf x={x-4} y={y-2} w={12} h={7} angle={-20+i*10} color="#40a020" />
        </g>
      ))}
      {[[70,34],[64,30],[76,30]].map(([x,y],i)=>(
        <g key={i}>
          {[0,15,-15,30,-30].map((a,j)=>(
            <line key={j} x1={x} y1={y}
              x2={x+Math.cos(a*Math.PI/180)*10}
              y2={y+Math.sin((a+90)*Math.PI/180)*8}
              stroke="#3a6820" strokeWidth="2" />
          ))}
        </g>
      ))}
      {[[42,57],[36,62],[46,64]].map(([x,y],i)=>(
        <g key={i}>
          <Leaf x={x} y={y} w={14} h={9} angle={i*20} color="#1a9830" />
          <Leaf x={x} y={y} w={10} h={6} angle={i*20+40} color="#30b040" />
        </g>
      ))}
      {[[75,88],[82,84],[68,85]].map(([x,y],i)=>(
        <g key={i}>
          <line x1={x} y1={y} x2={x} y2={y-18} stroke="#4a6820" strokeWidth="2" />
          {[-3,0,3].map((dx,j)=>(
            <ellipse key={j} cx={x+dx} cy={y-14-j*3} rx="2.5" ry="4"
              fill={['#8868d0','#a080e0','#9070d8'][j]} opacity="0.85" />
          ))}
        </g>
      ))}
      {[[56,64],[64,60],[60,68]].map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="#6a8830" opacity="0.7" />
          <circle cx={x} cy={y} r="4" fill="#8aa840" opacity="0.6" />
          <circle cx={x-1} cy={y-2} r="1.5" fill="#f8e8f0" />
        </g>
      ))}
      <text x="94" y="118" fontSize="6" fill="#5a3010" fontFamily="serif" opacity="0.8">Basil</text>
      <text x="36" y="52" fontSize="6" fill="#5a3010" fontFamily="serif" opacity="0.8">Mint</text>
      <text x="70" y="98" fontSize="6" fill="#5a3010" fontFamily="serif" opacity="0.8">Lavender</text>
      <GDefs />
    </svg>
  );
}

function GardenWildSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h} height={h} viewBox="0 0 120 120">
      <rect x="0" y="0" width="120" height="120" fill="#e0eec8" rx="4" />
      <rect x="0" y="0" width="120" height="50" fill="#d0e8f8" opacity="0.4" rx="4" />
      <rect x="0" y="90" width="120" height="30" rx="4" fill="#70b030" opacity="0.4" />
      {[6,14,22,30,38,46,54,62,70,78,86,94,102,110,118].map((x,i) => (
        <path key={i} d={`M${x},120 Q${x+(i%3-1)*6},${60+(i%4)*8} ${x+(i%2===0?4:-4)},${35+(i%5)*10}`}
          stroke={['#4a8818','#3a7810','#5a9828','#408020'][i%4]} strokeWidth="2" fill="none" />
      ))}
      {[[20,50],[80,44],[50,38]].map(([x,y],i) => (
        <g key={i}>
          <line x1={x} y1="120" x2={x} y2={y+14} stroke="#4a8010" strokeWidth="3" />
          {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,j) => (
            <ellipse key={j}
              cx={x+Math.cos(a*Math.PI/180)*13} cy={y+Math.sin(a*Math.PI/180)*10}
              rx="5" ry="8" fill="#f0c020" opacity="0.85"
              transform={`rotate(${a},${x+Math.cos(a*Math.PI/180)*13},${y+Math.sin(a*Math.PI/180)*10})`} />
          ))}
          <circle cx={x} cy={y} r="10" fill="#7a3808" />
          <circle cx={x} cy={y} r="7" fill="#5a2808" />
          {[0,45,90,135,180,225,270,315].map((a,j) => (
            <circle key={j} cx={x+Math.cos(a*Math.PI/180)*4} cy={y+Math.sin(a*Math.PI/180)*3}
              r="1.2" fill="#c87020" opacity="0.7" />
          ))}
        </g>
      ))}
      {[[40,72],[60,65],[100,70],[14,68]].map(([x,y],i) => (
        <g key={i}>
          <path d={`M${x},120 Q${x+3},${y+20} ${x},${y+8}`} stroke="#3a6808" strokeWidth="2" fill="none" />
          {[0,90,180,270].map((a,j) => (
            <ellipse key={j} cx={x+Math.cos(a*Math.PI/180)*7} cy={y+Math.sin(a*Math.PI/180)*5}
              rx="7" ry="10" fill="#e02820" opacity="0.85"
              transform={`rotate(${a},${x+Math.cos(a*Math.PI/180)*7},${y+Math.sin(a*Math.PI/180)*5})`} />
          ))}
          <circle cx={x} cy={y} r="5" fill="#1a3808" />
        </g>
      ))}
      {[[88,80],[30,84],[110,76],[68,88]].map(([x,y],i) => (
        <g key={i}>
          <line x1={x} y1="120" x2={x} y2={y+8} stroke="#3a7010" strokeWidth="1.8" />
          {[0,36,72,108,144,180,216,252,288,324].map((a,j)=>(
            <ellipse key={j} cx={x+Math.cos(a*Math.PI/180)*6} cy={y+Math.sin(a*Math.PI/180)*4.5}
              rx="3" ry="5" fill="white" opacity="0.9"
              transform={`rotate(${a},${x+Math.cos(a*Math.PI/180)*6},${y+Math.sin(a*Math.PI/180)*4.5})`} />
          ))}
          <circle cx={x} cy={y} r="4" fill="#f0c020" />
          <circle cx={x} cy={y} r="2.5" fill="#d8a810" />
        </g>
      ))}
      {[[45,52,30,'#f090c0'],[90,60,-20,'#90b0f8']].map(([x,y,rot,c],i)=>(
        <g key={i} transform={`translate(${x},${y}) rotate(${rot})`}>
          <ellipse cx="-7" cy="-2" rx="7" ry="5" fill={c as string} opacity="0.8" />
          <ellipse cx="7" cy="-2" rx="7" ry="5" fill={c as string} opacity="0.8" />
          <ellipse cx="-5" cy="4" rx="5" ry="3.5" fill={c as string} opacity="0.6" />
          <ellipse cx="5" cy="4" rx="5" ry="3.5" fill={c as string} opacity="0.6" />
          <line x1="0" y1="-8" x2="0" y2="8" stroke="#2a1008" strokeWidth="1.2" />
        </g>
      ))}
      <GDefs />
    </svg>
  );
}

function GardenTopiarySVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h} height={h} viewBox="0 0 120 120">
      <rect x="0" y="0" width="120" height="120" fill="#e8f4e0" rx="4" />
      <rect x="0" y="70" width="120" height="50" rx="4" fill="#c8b890" opacity="0.5" />
      <rect x="52" y="0" width="16" height="120" fill="#c8b890" opacity="0.55" />
      <rect x="0" y="52" width="120" height="16" fill="#c8b890" opacity="0.55" />
      <rect x="2" y="2" width="48" height="48" rx="3" fill="#5a9828" opacity="0.55" />
      <rect x="70" y="2" width="48" height="48" rx="3" fill="#5a9828" opacity="0.55" />
      <rect x="2" y="70" width="48" height="48" rx="3" fill="#5a9828" opacity="0.55" />
      <rect x="70" y="70" width="48" height="48" rx="3" fill="#5a9828" opacity="0.55" />
      <polygon points="26,6 42,44 10,44" fill="#2a7010" />
      <polygon points="26,6 42,44 10,44" fill="url(#gLeaf)" opacity="0.4" />
      <polygon points="26,10 38,44 14,44" fill="#3a8820" />
      <circle cx="94" cy="26" r="20" fill="#2e7818" />
      <circle cx="88" cy="20" r="10" fill="#3e8828" opacity="0.6" />
      <circle cx="94" cy="26" r="20" fill="url(#gLeaf)" opacity="0.3" />
      <rect x="8" y="76" width="36" height="36" rx="3" fill="#327020" />
      <rect x="8" y="76" width="36" height="36" rx="3" fill="url(#gLeaf)" opacity="0.3" />
      {[84,92,100,108].map((y,i)=>(<line key={i} x1="8" y1={y} x2="44" y2={y} stroke="#1a4808" strokeWidth="1.2" opacity="0.4"/>))}
      {[16,24,32,40].map((x,i)=>(<line key={i} x1={x} y1="76" x2={x} y2="112" stroke="#1a4808" strokeWidth="1.2" opacity="0.4"/>))}
      <ellipse cx="94" cy="94" rx="20" ry="20" fill="#307018" />
      {[6,10,14,18].map((r,i)=>(
        <path key={i} d={`M94,${94-r} A${r},${r} 0 1,1 ${94-r},94`}
          stroke="#1a4808" strokeWidth="1.5" fill="none" opacity={0.4+i*0.1} />
      ))}
      {[[52,52],[68,52],[52,68],[68,68]].map(([x,y],i)=>(
        <g key={i}>
          <ellipse cx={x} cy={y-2} rx="6" ry="4" fill="#c8a060" />
          <path d={`M${x-5},${y+2} Q${x-6},${y+8} ${x-4},${y+10} L${x+4},${y+10} Q${x+6},${y+8} ${x+5},${y+2} Z`} fill="#b89050" />
          <ellipse cx={x} cy={y+10} rx="5" ry="2" fill="#a07840" />
          <circle cx={x} cy={y-3} r="2" fill="#d4b070" />
        </g>
      ))}
      <circle cx="60" cy="60" r="6" fill="#c8a060" />
      <circle cx="60" cy="60" r="4" fill="#e0b870" />
      <circle cx="60" cy="60" r="2" fill="#f0c870" />
      <GDefs />
    </svg>
  );
}

function GardenBonsaiSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h} height={h} viewBox="0 0 120 120">
      <rect x="0" y="0" width="120" height="120" fill="#f0ede0" rx="4" />
      {[0,15,30,45,60,75,90,105].map((y,i)=>(
        <line key={i} x1="0" y1={y} x2="120" y2={y} stroke="#d8c8a8" strokeWidth="1.5" opacity="0.4" />
      ))}
      {[0,15,30,45,60,75,90,105].map((x,i)=>(
        <line key={i} x1={x} y1="0" x2={x} y2="120" stroke="#d8c8a8" strokeWidth="1.5" opacity="0.4" />
      ))}
      <rect x="4" y="86" width="112" height="12" rx="3" fill="#8a5828" />
      {[90,94,98].map((y,i)=>(<line key={i} x1="4" y1={y} x2="116" y2={y} stroke="#6a4018" strokeWidth="0.8" opacity="0.4"/>))}
      <rect x="4" y="96" width="112" height="4" rx="1" fill="#7a4818" opacity="0.7" />
      {[8,24,88,104].map((x,i)=>(<rect key={i} x={x} y="98" width="6" height="18" rx="2" fill="#6a3810" />))}
      {/* Left bonsai tray */}
      <rect x="8" y="76" width="42" height="12" rx="4" fill="#5a3010" />
      <rect x="10" y="70" width="38" height="8" rx="3" fill="#7a5030" />
      <rect x="11" y="71" width="36" height="6" rx="2" fill="#5a3818" />
      {[[14,74],[22,72],[30,74],[38,72],[44,74]].map(([x,y],i)=>(
        <ellipse key={i} cx={x} cy={y} rx="3" ry="2" fill="#8a7860" opacity="0.7" />
      ))}
      {/* Windswept pine */}
      <path d="M29,72 Q24,55 18,42 Q22,38 20,28" stroke="#3a1808" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M22,48 Q10,44 4,50" stroke="#3a1808" strokeWidth="3" fill="none" />
      <path d="M20,38 Q32,30 38,22" stroke="#3a1808" strokeWidth="2.5" fill="none" />
      {[[5,46,'#1a5808'],[38,20,'#1e6010'],[18,26,'#247018'],[30,34,'#1c600e']].map(([x,y,c],i)=>(
        <g key={i}>
          <ellipse cx={x} cy={y} rx="12" ry="8" fill={c as string} />
          <ellipse cx={(x as number)+3} cy={(y as number)-2} rx="8" ry="5" fill="#2e7818" opacity="0.6" />
        </g>
      ))}
      {/* Right bonsai tray */}
      <rect x="70" y="76" width="46" height="12" rx="4" fill="#5a3010" />
      <rect x="72" y="70" width="42" height="8" rx="3" fill="#7a5030" />
      <rect x="73" y="71" width="40" height="6" rx="2" fill="#5a3818" />
      {[[76,74],[84,72],[92,74],[100,72],[108,74]].map(([x,y],i)=>(
        <ellipse key={i} cx={x} cy={y} rx="3" ry="2" fill="#8a7860" opacity="0.7" />
      ))}
      {/* Maple */}
      <path d="M93,72 L93,42" stroke="#3a1808" strokeWidth="5" fill="none" />
      <path d="M93,58 L78,48" stroke="#3a1808" strokeWidth="3" fill="none" />
      <path d="M93,52 L108,44" stroke="#3a1808" strokeWidth="3" fill="none" />
      <path d="M93,46 L82,34" stroke="#3a1808" strokeWidth="2.5" fill="none" />
      <path d="M93,46 L104,36" stroke="#3a1808" strokeWidth="2.5" fill="none" />
      {[[76,44,'#d04010'],[106,40,'#e85020'],[80,30,'#c03808'],[104,30,'#d84818'],[92,22,'#f06020']].map(([x,y,c],i)=>(
        <g key={i}>
          <ellipse cx={x} cy={y} rx="10" ry="8" fill={c as string} />
          <ellipse cx={(x as number)+3} cy={(y as number)-2} rx="7" ry="5" fill="#f07030" opacity="0.5" />
        </g>
      ))}
      {/* Calligraphy scroll */}
      <rect x="50" y="8" width="20" height="56" rx="2" fill="#f5e8c8" />
      <rect x="48" y="6" width="24" height="6" rx="2" fill="#7a3010" />
      <rect x="48" y="58" width="24" height="6" rx="2" fill="#7a3010" />
      <text x="57" y="40" fontSize="14" fill="#2a1008" fontFamily="serif" opacity="0.8">道</text>
      <text x="57" y="56" fontSize="10" fill="#4a2010" fontFamily="serif" opacity="0.6">禅</text>
      <GDefs />
    </svg>
  );
}

function GardenHangingSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h} height={h} viewBox="0 0 120 120">
      <rect x="0" y="0" width="120" height="120" fill="#e0ecd8" rx="4" />
      <rect x="20" y="14" width="80" height="18" rx="4" fill="#b8a070" />
      {[18,22,26].map((y,i)=>(<line key={i} x1="20" y1={y} x2="100" y2={y} stroke="#9a7e50" strokeWidth="1" opacity="0.4"/>))}
      <rect x="8" y="48" width="104" height="20" rx="4" fill="#c4a878" />
      <rect x="0" y="86" width="120" height="22" rx="4" fill="#cdb080" />
      {/* Soil */}
      <rect x="22" y="14" width="76" height="8" rx="2" fill="#6a3e18" opacity="0.5" />
      <rect x="10" y="48" width="100" height="10" rx="2" fill="#6a3e18" opacity="0.5" />
      <rect x="2" y="86" width="116" height="10" rx="2" fill="#6a3e18" opacity="0.5" />
      {/* Vines */}
      {[28,44,60,76,92].map((x,i)=>(
        <g key={i}>
          <path d={`M${x},32 Q${x+(i%2===0?-5:5)},50 ${x+(i%2===0?-8:8)},68`}
            stroke="#3a8020" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d={`M${x+(i%2===0?-8:8)},68 Q${x+(i%2===0?-12:12)},80 ${x+(i%2===0?-10:10)},95`}
            stroke="#3a8020" strokeWidth="2" fill="none" strokeLinecap="round" />
          {[38,54,72,86].map((y,j)=>(
            <Leaf key={j} x={x+(i%2===0?-4:4)*(j+1)} y={y} w={12} h={7}
              angle={(i%2===0?-30:30)+(j*15)} color={['#3a9020','#2a8018','#4aa028'][j%3]} />
          ))}
        </g>
      ))}
      {/* Geraniums — top */}
      {[28,44,60,76,92].map((x,i)=>(
        <g key={i}>
          <circle cx={x} cy={14} r="5" fill={['#e83040','#f05060','#e05080','#f06070','#c83050'][i]} opacity="0.9" />
          <circle cx={x} cy={14} r="2.5" fill="#f8e060" opacity="0.8" />
        </g>
      ))}
      {/* Petunias — mid */}
      {[20,38,56,74,90,108].map((x,i)=>(
        <g key={i}>
          {[0,60,120,180,240,300].map((a,j)=>(
            <ellipse key={j} cx={x+Math.cos(a*Math.PI/180)*5} cy={48+Math.sin(a*Math.PI/180)*4}
              rx="4" ry="5" fill={['#8040c0','#9050d0','#7030b0'][i%3]} opacity="0.8"
              transform={`rotate(${a},${x+Math.cos(a*Math.PI/180)*5},${48+Math.sin(a*Math.PI/180)*4})`} />
          ))}
          <circle cx={x} cy={48} r="3" fill="#f5e060" />
        </g>
      ))}
      {/* Ferns — bottom */}
      {[12,32,52,72,92,112].map((x,i)=>(
        <g key={i}>
          {[-25,-12,0,12,25].map((a,j)=>(
            <path key={j}
              d={`M${x},86 Q${x+Math.sin(a*Math.PI/180)*16},${78-Math.cos(a*Math.PI/180)*12} ${x+Math.sin(a*Math.PI/180)*22},${74-Math.cos(a*Math.PI/180)*16}`}
              stroke={['#2a8018','#3a9020','#1a7010','#3a9028','#2a8018'][j]}
              strokeWidth="2" fill="none" strokeLinecap="round" />
          ))}
        </g>
      ))}
      <GDefs />
    </svg>
  );
}

// ── Garden dispatcher ─────────────────────────────────────────────────────────

const GARDEN_VARIANTS = [
  GardenRoseSVG, GardenVegSVG, GardenZenSVG, GardenLotusSVG, GardenOrchardSVG,
  GardenHerbSVG, GardenWildSVG, GardenTopiarySVG, GardenBonsaiSVG, GardenHangingSVG,
];

export function GardenSVG({ h = 120, variant = 0 }: SVGBuildingProps) {
  const Comp = GARDEN_VARIANTS[(variant ?? 0) % GARDEN_VARIANTS.length];
  return <Comp h={h} />;
}

// ── Library ───────────────────────────────────────────────────────────────────

export function LibrarySVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 0.9} height={h} viewBox="0 0 108 120">
      <ellipse cx="54" cy="118" rx="46" ry="5" fill="rgba(80,45,15,0.12)" />
      <rect x="8" y="42" width="92" height="76" rx="4" fill="#c09858" />
      <rect x="8" y="42" width="92" height="76" rx="4" fill="url(#lWall)" opacity="0.25" />
      <polygon points="54,8 100,42 8,42" fill="#8a5020" />
      <polygon points="54,8 100,42 8,42" fill="url(#lPed)" opacity="0.2" />
      <polygon points="54,14 94,42 14,42" fill="#a06028" />
      <text x="46" y="34" fontSize="14">📚</text>
      {[16,40,60,84].map((x,i) => (
        <g key={i}>
          <rect x={x} y="42" width="9" height="64" rx="2" fill="#d4a860" />
          <rect x={x} y="42" width="9" height="64" rx="2" fill="url(#lCol)" opacity="0.3" />
          <ellipse cx={x+4.5} cy="42" rx="6" ry="3.5" fill="#be9448" />
          <ellipse cx={x+4.5} cy="106" rx="6" ry="3.5" fill="#ae8438" />
        </g>
      ))}
      <rect x="38" y="76" width="28" height="42" rx="14 14 0 0" fill="#4a2408" />
      <rect x="40" y="78" width="24" height="40" rx="12 12 0 0" fill="#3a1a05" />
      <rect x="14" y="52" width="20" height="18" rx="2" fill="#d4c090" />
      {['#e83020','#3050d0','#30a840','#e0a020','#8030c0'].map((c,i) => (
        <rect key={i} x={15+i*3.8} y="53" width="3" height="16" rx="1" fill={c} opacity="0.85" />
      ))}
      <rect x="74" y="52" width="20" height="18" rx="2" fill="#d4c090" />
      {['#e83020','#3050d0','#30a840','#e0a020','#8030c0'].map((c,i) => (
        <rect key={i} x={75+i*3.8} y="53" width="3" height="16" rx="1" fill={c} opacity="0.85" />
      ))}
      <defs>
        <linearGradient id="lWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="lPed" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="lCol" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="50%" stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── Fountain ──────────────────────────────────────────────────────────────────

export function FountainSVG({ h = 120 }: SVGBuildingProps) {
  return (
    <svg width={h * 0.85} height={h} viewBox="0 0 100 120">
      <ellipse cx="50" cy="118" rx="44" ry="5" fill="rgba(80,45,15,0.12)" />
      <ellipse cx="50" cy="102" rx="44" ry="14" fill="#b89060" />
      <ellipse cx="50" cy="98" rx="44" ry="14" fill="#c8a870" />
      <ellipse cx="50" cy="98" rx="40" ry="11" fill="#68b4d8" />
      <ellipse cx="50" cy="98" rx="40" ry="11" fill="url(#fWater)" opacity="0.6" />
      <ellipse cx="50" cy="98" rx="28" ry="8" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <ellipse cx="50" cy="98" rx="16" ry="5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
      <ellipse cx="50" cy="82" rx="22" ry="8" fill="#b88a50" />
      <ellipse cx="50" cy="78" rx="22" ry="8" fill="#c8a060" />
      <ellipse cx="50" cy="78" rx="18" ry="6" fill="#60a8d0" />
      <rect x="44" y="54" width="12" height="28" rx="4" fill="#b08848" />
      <rect x="42" y="52" width="16" height="6" rx="3" fill="#c09a58" />
      <ellipse cx="50" cy="52" rx="16" ry="6" fill="#b88a50" />
      <ellipse cx="50" cy="50" rx="16" ry="6" fill="#c8a060" />
      <ellipse cx="50" cy="50" rx="13" ry="5" fill="#58a0cc" />
      <path d="M50,42 Q42,56 34,74" stroke="#80c8e8" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M50,42 Q58,56 66,74" stroke="#80c8e8" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M50,42 Q44,52 40,60" stroke="#a8d8f0" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M50,42 Q56,52 60,60" stroke="#a8d8f0" strokeWidth="1.5" fill="none" opacity="0.6" />
      <circle cx="50" cy="40" r="5" fill="#d4a860" />
      <circle cx="50" cy="40" r="3" fill="#80c8e8" />
      <defs>
        <radialGradient id="fWater" cx="40%" cy="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1860a0" stopOpacity="0.1" />
        </radialGradient>
      </defs>
    </svg>
  );
}
