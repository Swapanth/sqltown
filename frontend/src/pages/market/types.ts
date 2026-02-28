// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface BuildingType {
  id: number;
  building_name: string;
  display_name: string;
  category: 'residential' | 'religious' | 'commercial' | 'infrastructure' | 'special';
  description: string;
  base_population: number;
  base_cost_coins: number;
  unlock_level: number;
  variant?: number; // used by multi-variant buildings like garden
}

export interface SVGBuildingProps {
  h?: number;
  variant?: number;
}
