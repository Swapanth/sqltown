import { useState } from 'react';
import './MarketPage.css';

// ── Category building components ───────────────────────────────────────────────
import { HaveliSVG, MudHutSVG, MerchantVillaSVG, NobleTownhouseSVG, CourtyardHouseSVG, StiltHouseSVG } from './Residential';
import { TempleSVG } from './Religious';
import { MarketSVG, TheatreSVG } from './Commercial';
import { GateSVG, WellSVG } from './Infrastructure';
import { GardenSVG, LibrarySVG, FountainSVG } from './Special';

import type { BuildingType } from './types';

// ─── SVG Map ──────────────────────────────────────────────────────────────────
const SVG_MAP: Record<string, React.ComponentType<{ h?: number; variant?: number }>> = {
  temple:           TempleSVG,
  market:           MarketSVG,
  theatre:          TheatreSVG,
  gate:             GateSVG,
  well:             WellSVG,
  garden:           GardenSVG,
  library:          LibrarySVG,
  fountain:         FountainSVG,
  haveli:           HaveliSVG,
  mud_hut:          MudHutSVG,
  merchant_villa:   MerchantVillaSVG,
  noble_townhouse:  NobleTownhouseSVG,
  courtyard_house:  CourtyardHouseSVG,
  stilt_house:      StiltHouseSVG,
};

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MOCK_BUILDINGS: BuildingType[] = [
  // Religious
  { id: 3,  building_name: 'temple',          display_name: 'Temple',            category: 'religious',       description: 'A sacred golden-domed sanctuary for prayer and offerings.',                                      base_population: 60,  base_cost_coins: 500, unlock_level: 2 },
  // Residential
  { id: 11, building_name: 'haveli',          display_name: 'Haveli',            category: 'residential',     description: 'A grand Rajasthani mansion adorned with jharokha balconies and indigo arched windows.',           base_population: 95,  base_cost_coins: 580, unlock_level: 3 },
  { id: 12, building_name: 'mud_hut',         display_name: 'Mud Hut',           category: 'residential',     description: 'A humble ochre hut with a thatched straw roof and a flower pot by the door.',                    base_population: 12,  base_cost_coins: 80,  unlock_level: 1 },
  { id: 13, building_name: 'merchant_villa',  display_name: "Merchant's Villa",  category: 'residential',     description: 'A prosperous whitewashed two-storey villa with teal shutters and a vine-draped facade.',          base_population: 55,  base_cost_coins: 340, unlock_level: 2 },
  { id: 14, building_name: 'noble_townhouse', display_name: 'Noble Townhouse',   category: 'residential',     description: 'A tall narrow brick townhouse with arched windows and a wrought-iron lantern by the door.',        base_population: 38,  base_cost_coins: 260, unlock_level: 2 },
  { id: 15, building_name: 'courtyard_house', display_name: 'Courtyard House',   category: 'residential',     description: 'A sprawling sandy house built around a shaded courtyard with a flowering tree at its heart.',       base_population: 70,  base_cost_coins: 450, unlock_level: 3 },
  { id: 16, building_name: 'stilt_house',     display_name: 'Stilt House',       category: 'residential',     description: 'A weathered riverside dwelling raised on stilts, with a corrugated tin roof and small dock.',       base_population: 28,  base_cost_coins: 190, unlock_level: 1 },
  // Commercial
  { id: 4,  building_name: 'market',          display_name: 'Bazaar',            category: 'commercial',      description: 'A bustling open market brimming with goods and spices.',                                          base_population: 80,  base_cost_coins: 420, unlock_level: 2 },
  { id: 5,  building_name: 'theatre',         display_name: 'Theatre',           category: 'commercial',      description: 'A grand stage where stories and dramas come alive.',                                              base_population: 120, base_cost_coins: 650, unlock_level: 3 },
  // Infrastructure
  { id: 6,  building_name: 'gate',            display_name: 'City Gate',         category: 'infrastructure',  description: 'An ornate gateway welcoming all who enter the city.',                                             base_population: 0,   base_cost_coins: 350, unlock_level: 2 },
  { id: 7,  building_name: 'well',            display_name: 'Well',              category: 'infrastructure',  description: 'A stone well providing fresh water to the community.',                                            base_population: 10,  base_cost_coins: 120, unlock_level: 1 },
  // Special
  { id: 9,  building_name: 'library',         display_name: 'Library',           category: 'special',         description: 'A quiet hall of knowledge, housing ancient manuscripts.',                                        base_population: 30,  base_cost_coins: 400, unlock_level: 3 },
  { id: 10, building_name: 'fountain',        display_name: 'Fountain',          category: 'special',         description: 'A carved stone fountain at the heart of the plaza.',                                             base_population: 5,   base_cost_coins: 250, unlock_level: 1 },
  { id: 8,  building_name: 'garden', variant: 0, display_name: 'Rose Garden',       category: 'special', description: 'A fragrant rose garden with arching hedges and climbing blooms.',               base_population: 18, base_cost_coins: 200, unlock_level: 1 },
  { id: 17, building_name: 'garden', variant: 1, display_name: 'Vegetable Patch',   category: 'special', description: 'Neatly tended raised beds of tomatoes, carrots, and pumpkins.',                 base_population: 10, base_cost_coins: 120, unlock_level: 1 },
  { id: 18, building_name: 'garden', variant: 2, display_name: 'Zen Garden',        category: 'special', description: 'A serene raked gravel garden with mossy boulders and a sculptural pine.',       base_population: 8,  base_cost_coins: 280, unlock_level: 2 },
  { id: 19, building_name: 'garden', variant: 3, display_name: 'Lotus Pond',        category: 'special', description: 'A glassy pond brimming with lotus flowers and lily pads.',                      base_population: 20, base_cost_coins: 320, unlock_level: 2 },
  { id: 20, building_name: 'garden', variant: 4, display_name: 'Orchard',           category: 'special', description: 'A sun-dappled orchard of fruit trees alive with honeybees.',                   base_population: 30, base_cost_coins: 240, unlock_level: 1 },
  { id: 21, building_name: 'garden', variant: 5, display_name: 'Herb Spiral',       category: 'special', description: 'A spiral stone bed planted with basil, mint, rosemary, and lavender.',         base_population: 12, base_cost_coins: 160, unlock_level: 1 },
  { id: 22, building_name: 'garden', variant: 6, display_name: 'Wildflower Meadow', category: 'special', description: 'An untamed meadow of sunflowers, poppies, and daisies with butterflies.',      base_population: 14, base_cost_coins: 180, unlock_level: 1 },
  { id: 23, building_name: 'garden', variant: 7, display_name: 'Topiary Garden',    category: 'special', description: 'Precisely sculpted topiaries in geometric forms around a gravel courtyard.',   base_population: 16, base_cost_coins: 380, unlock_level: 3 },
  { id: 24, building_name: 'garden', variant: 8, display_name: 'Bonsai Garden',     category: 'special', description: 'A tranquil garden of aged bonsai trees on polished wood stands.',              base_population: 10, base_cost_coins: 450, unlock_level: 3 },
  { id: 25, building_name: 'garden', variant: 9, display_name: 'Hanging Garden',    category: 'special', description: 'A cascading terraced garden heavy with geraniums, petunias, and ferns.',       base_population: 22, base_cost_coins: 350, unlock_level: 2 },
];

const PLAYER = { total_coins: 380, city_level: 2 };

const CATEGORIES = [
  { id: 'all',            name: 'All',           },
  { id: 'residential',    name: 'Residential',   },
  { id: 'religious',      name: 'Religious',     },
  { id: 'commercial',     name: 'Commercial',    },
  { id: 'infrastructure', name: 'Infrastructure' },
  { id: 'special',        name: 'Special',       },
];

// ─── Building Illustration ────────────────────────────────────────────────────
function BuildingIllustration({ name, height = 110, variant = 0 }: { name: string; height?: number; variant?: number }) {
  const Comp = SVG_MAP[name.toLowerCase()] ?? MerchantVillaSVG;
  return (
    <div className="bld-wrap">
      <Comp h={height} variant={variant} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MarketPage() {
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState<BuildingType | null>(null);

  const filtered = cat === 'all' ? MOCK_BUILDINGS : MOCK_BUILDINGS.filter(b => b.category === cat);
  const canAfford  = (b: BuildingType) => PLAYER.total_coins >= b.base_cost_coins;
  const isUnlocked = (b: BuildingType) => PLAYER.city_level >= b.unlock_level;

  const handleBuy = (b: BuildingType, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (canAfford(b) && isUnlocked(b)) {
      alert(`Purchased ${b.display_name}! (Demo)`);
      setSelected(null);
    }
  };

  return (
    <div className="mp-root">
      {/* ── Sky Elements ── */}
      <div className="mp-sun">
        <div className="mp-sun-core"></div>
        <div className="mp-sun-rays">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="mp-sun-ray" style={{ transform: `rotate(${i * 30}deg)` }} />
          ))}
        </div>
      </div>

      <div className="mp-clouds">
        <CloudSVG className="mp-cloud mp-cloud-1" />
        <CloudSVG className="mp-cloud mp-cloud-2" />
        <CloudSVG className="mp-cloud mp-cloud-3" />
      </div>

      {/* ── Header ── */}
      <header className="mp-header">
        <div className="mp-header-inner">
          <button className="mp-back">← Back</button>
          <div className="mp-title">
            <h1> Building Market</h1>
            <p>Expand your city with new structures</p>
          </div>
          <div className="mp-coins">
            <span className="mp-coin-icon">🪙</span>
            <span className="mp-coin-amt">{PLAYER.total_coins}</span>
          </div>
        </div>
      </header>

      {/* ── Category Filter ── */}
      <div className="mp-cats">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`mp-cat-btn ${cat === c.id ? 'active' : ''}`}
            onClick={() => setCat(c.id)}
          >
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className="mp-grid">
        {filtered.map(b => {
          const unlocked   = isUnlocked(b);
          const affordable = canAfford(b);
          return (
            <div
              key={b.id}
              className={`mp-card ${!unlocked ? 'locked' : ''}`}
              onClick={() => unlocked && setSelected(b)}
            >
              <div className="mp-card-preview">
                {!unlocked && <div className="mp-lock-badge">🔒 Lvl {b.unlock_level}</div>}
                <BuildingIllustration name={b.building_name} height={120} variant={b.variant ?? 0} />
              </div>
              <div className="mp-card-body">
                <h3 className="mp-card-name">{b.display_name}</h3>
                <p className="mp-card-desc">{b.description}</p>
                <div className="mp-card-stats">
                  <div className="mp-stat"><span>👥</span><span>{b.base_population}</span></div>
                  <div className="mp-stat"><span>🪙</span><span>{b.base_cost_coins}</span></div>
                </div>
              </div>
              <div className="mp-card-footer">
                {unlocked ? (
                  <button
                    className={`mp-buy-btn ${affordable ? 'can' : 'cannot'}`}
                    onClick={e => handleBuy(b, e)}
                  >
                    {affordable ? 'Purchase' : 'Not Enough Coins'}
                  </button>
                ) : (
                  <button className="mp-buy-btn locked-btn" disabled>Locked</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal ── */}
      {selected && (
        <div className="mp-overlay" onClick={() => setSelected(null)}>
          <div className="mp-modal" onClick={e => e.stopPropagation()}>
            <button className="mp-modal-close" onClick={() => setSelected(null)}>✕</button>
            <div className="mp-modal-preview">
              <BuildingIllustration name={selected.building_name} height={160} variant={selected.variant ?? 0} />
            </div>
            <div className="mp-modal-body">
              <h2 className="mp-modal-name">{selected.display_name}</h2>
              <p className="mp-modal-desc">{selected.description}</p>
              <div className="mp-modal-stats">
                <div className="mp-modal-stat">
                  <span className="mp-modal-stat-label">Category</span>
                  <span className="mp-modal-stat-value" style={{ textTransform: 'capitalize' }}>{selected.category}</span>
                </div>
                <div className="mp-modal-stat">
                  <span className="mp-modal-stat-label">Population</span>
                  <span className="mp-modal-stat-value">👥 {selected.base_population}</span>
                </div>
                <div className="mp-modal-stat">
                  <span className="mp-modal-stat-label">Unlock Level</span>
                  <span className="mp-modal-stat-value">⭐ {selected.unlock_level}</span>
                </div>
                <div className="mp-modal-stat">
                  <span className="mp-modal-stat-label">Cost</span>
                  <span className="mp-modal-stat-value">🪙 {selected.base_cost_coins}</span>
                </div>
              </div>
              <button
                className={`mp-modal-buy ${canAfford(selected) ? 'can' : 'cannot'}`}
                onClick={() => handleBuy(selected)}
                disabled={!canAfford(selected)}
              >
                {canAfford(selected)
                  ? `Purchase for 🪙 ${selected.base_cost_coins}`
                  : 'Not Enough Coins'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


// ─── Cloud SVG Component ──────────────────────────────────────────────────────
const CloudSVG: React.FC<{ className: string }> = ({ className }) => (
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="762px"
    height="331px"
    viewBox="0 0 762 331"
    className={className}
  >
    <path
      fill="#FFFFFF"
      d="M715.394,228h-16.595c0.79-5.219,1.201-10.562,1.201-16c0-58.542-47.458-106-106-106
      c-8.198,0-16.178,0.932-23.841,2.693C548.279,45.434,488.199,0,417.5,0c-84.827,0-154.374,65.401-160.98,148.529
      C245.15,143.684,232.639,141,219.5,141c-49.667,0-90.381,38.315-94.204,87H46.607C20.866,228,0,251.058,0,279.5
      S20.866,331,46.607,331h668.787C741.133,331,762,307.942,762,279.5S741.133,228,715.394,228z"
    />
  </svg>
);
