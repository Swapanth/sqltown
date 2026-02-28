import React, { useEffect, useRef } from 'react';
import type { City, CityBuilding as CityBuildingType } from '../../models/types';
import './CityVisualization.css';

// Import building SVG components from market
import { HaveliSVG, MudHutSVG, MerchantVillaSVG, NobleTownhouseSVG, CourtyardHouseSVG, StiltHouseSVG } from '../../pages/market/Residential';
import { TempleSVG } from '../../pages/market/Religious';
import { MarketSVG, TheatreSVG } from '../../pages/market/Commercial';
import { GateSVG, WellSVG } from '../../pages/market/Infrastructure';
import { GardenSVG, LibrarySVG, FountainSVG } from '../../pages/market/Special';

interface CityVisualizationProps {
    city: City;
    interactive?: boolean;
    mode?: 'view' | 'edit';
    onBuildingClick?: (building: CityBuildingType) => void;
    animated?: boolean;
    compact?: boolean;
}

// SVG Map for building components
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

export const CityVisualization: React.FC<CityVisualizationProps> = ({
    city,
    interactive = false,
    onBuildingClick,
    animated = true,
    compact = false,
}) => {
    const canvasHeight = compact ? '300px' : '100%';

    return (
        <div className="city-visualization-container" style={{ height: canvasHeight, minHeight: '100vh' }}>
            {/* Sky with gradient */}
            <div className="city-sky">
                {/* Sun */}
                <div className="city-sun">
                    <div className="sun-core"></div>
                    <div className="sun-rays">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="sun-ray" style={{ transform: `rotate(${i * 30}deg)` }} />
                        ))}
                    </div>
                </div>

                {/* Animated Clouds */}
                {animated && (
                    <div className="city-clouds">
                        <CloudSVG className="city-cloud cloud-1" delay="0s" />
                        <CloudSVG className="city-cloud cloud-2" delay="3s" />
                        <CloudSVG className="city-cloud cloud-3" delay="6s" />
                        <CloudSVG className="city-cloud cloud-4" delay="9s" />
                    </div>
                )}
            </div>

            {/* City View */}
            <div className="city-scene">
                {/* Background Skyscrapers */}
                <div className="city-skyscrapers">
                    <div className="skyscraper skyscraper-1"></div>
                    <div className="skyscraper skyscraper-2"></div>
                    <div className="skyscraper skyscraper-3"></div>
                    <div className="skyscraper skyscraper-4"></div>
                    <div className="skyscraper skyscraper-5"></div>
                </div>

                {/* Background Trees */}
                <BackgroundTree className="bg-tree bg-tree-1" />
                <BackgroundTree className="bg-tree bg-tree-2" />

                {/* City Billboard */}
                <div className="city-billboard">
                    <div className="billboard-text">{city.city_name}</div>
                </div>

                {/* Street Elements */}
                <Streetlamp position="left" />
                <Streetlamp position="center-left" />
                <Streetlamp position="center-right" />
                <Streetlamp position="right" />



                {/* Buildings */}
                <div className="city-buildings">
                    {(() => {
                        // Define fixed buildings to display
                        const fixedBuildings: CityBuildingType[] = [
                            {
                                building_id: 1,
                                city_id: city.city_id,
                                building_type_id: 1,
                                building_type: {
                                    building_type_id: 1,
                                    building_name: 'haveli',
                                    display_name: 'Haveli',
                                    description: 'A grand haveli',
                                    category: 'residential',
                                    unlock_level: 1,
                                    base_cost_coins: 100,
                                    base_population: 10,
                                    icon_url: '',
                                    emoji: '🏛️'
                                },
                                position_x: 0,
                                position_y: 0,
                                building_level: 1,
                                capacity: 10,
                                current_occupancy: 10,
                                is_active: true,
                                built_at: new Date().toISOString()
                            },
                            {
                                building_id: 2,
                                city_id: city.city_id,
                                building_type_id: 2,
                                building_type: {
                                    building_type_id: 2,
                                    building_name: 'merchant_villa',
                                    display_name: 'Merchant Villa',
                                    description: 'A merchant villa',
                                    category: 'residential',
                                    unlock_level: 1,
                                    base_cost_coins: 100,
                                    base_population: 10,
                                    icon_url: '',
                                    emoji: '🏘️'
                                },
                                position_x: 0,
                                position_y: 0,
                                building_level: 1,
                                capacity: 10,
                                current_occupancy: 10,
                                is_active: true,
                                built_at: new Date().toISOString()
                            },
                            {
                                building_id: 3,
                                city_id: city.city_id,
                                building_type_id: 3,
                                building_type: {
                                    building_type_id: 3,
                                    building_name: 'noble_townhouse',
                                    display_name: 'Noble Townhouse',
                                    description: 'A noble townhouse',
                                    category: 'residential',
                                    unlock_level: 1,
                                    base_cost_coins: 100,
                                    base_population: 10,
                                    icon_url: '',
                                    emoji: '🏛️'
                                },
                                position_x: 0,
                                position_y: 0,
                                building_level: 1,
                                capacity: 10,
                                current_occupancy: 10,
                                is_active: true,
                                built_at: new Date().toISOString()
                            },
                            {
                                building_id: 4,
                                city_id: city.city_id,
                                building_type_id: 4,
                                building_type: {
                                    building_type_id: 17,
                                    building_name: 'garden',
                                    display_name: 'Vegetable Patch',
                                    description: 'A vegetable patch',
                                    category: 'special',
                                    unlock_level: 1,
                                    base_cost_coins: 100,
                                    base_population: 10,
                                    icon_url: '',
                                    emoji: '🌱'
                                },
                                position_x: 0,
                                position_y: 0,
                                building_level: 1,
                                capacity: 10,
                                current_occupancy: 10,
                                is_active: true,
                                built_at: new Date().toISOString()
                            },
                            {
                                building_id: 5,
                                city_id: city.city_id,
                                building_type_id: 5,
                                building_type: {
                                    building_type_id: 5,
                                    building_name: 'stilt_house',
                                    display_name: 'Stilt House',
                                    description: 'A stilt house',
                                    category: 'residential',
                                    unlock_level: 1,
                                    base_cost_coins: 100,
                                    base_population: 10,
                                    icon_url: '',
                                    emoji: '🏚️'
                                },
                                position_x: 0,
                                position_y: 0,
                                building_level: 1,
                                capacity: 10,
                                current_occupancy: 10,
                                is_active: true,
                                built_at: new Date().toISOString()
                            },
                            {
                                building_id: 6,
                                city_id: city.city_id,
                                building_type_id: 6,
                                building_type: {
                                    building_type_id: 24,
                                    building_name: 'garden',
                                    display_name: 'Bonsai Garden',
                                    description: 'A bonsai garden',
                                    category: 'special',
                                    unlock_level: 1,
                                    base_cost_coins: 100,
                                    base_population: 10,
                                    icon_url: '',
                                    emoji: '🌳'
                                },
                                position_x: 0,
                                position_y: 0,
                                building_level: 1,
                                capacity: 10,
                                current_occupancy: 10,
                                is_active: true,
                                built_at: new Date().toISOString()
                            }
                        ];
                        
                        return fixedBuildings.map((building, index) => (
                            <CityBuilding
                                key={building.building_id}
                                building={building}
                                index={index}
                                onClick={() => interactive && onBuildingClick?.(building)}
                                interactive={interactive}
                                animated={animated}
                            />
                        ));
                    })()}
                </div>

                {/* Ground/Road */}
                <div className="city-ground"></div>
            </div>

            
        </div>
    );
};

// Building Component
interface CityBuildingProps {
    building: CityBuildingType;
    index: number;
    onClick?: () => void;
    interactive?: boolean;
    animated?: boolean;
}

const CityBuilding: React.FC<CityBuildingProps> = ({
    building,
    index,
    onClick,
    interactive,
    animated,
}) => {
    const buildingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (animated && buildingRef.current) {
            setTimeout(() => {
                buildingRef.current?.classList.add('building-visible');
            }, index * 200);
        }
    }, [animated, index]);

    // Get the building component from SVG_MAP
    const buildingName = building.building_type.building_name.toLowerCase();
    const BuildingSVG = SVG_MAP[buildingName];
    
    // Determine variant based on display name for gardens
    let variant = 0;
    if (buildingName === 'garden') {
        const gardenVariants: Record<string, number> = {
            'Rose Garden': 0,
            'Vegetable Patch': 1,
            'Zen Garden': 2,
            'Lotus Pond': 3,
            'Orchard': 4,
            'Herb Garden': 5,
            'Wildflower Meadow': 6,
            'Topiary Garden': 7,
            'Bonsai Garden': 8,
            'Hanging Garden': 9
        };
        variant = gardenVariants[building.building_type.display_name] ?? 0;
    }
    
    // Calculate height based on building level - doubled size
    const baseHeight = 200;
    const height = baseHeight + (building.building_level * 30);

    return (
        <div
            ref={buildingRef}
            className={`city-building ${interactive ? 'interactive' : ''} ${animated ? 'building-animated' : 'building-visible'}`}
            onClick={onClick}
            title={`${building.building_type.display_name} (Level ${building.building_level})`}
        >
            {/* Label and badge at the top */}
            <div className="building-top-info">
                <div className="building-label">{building.building_type.display_name}</div>
                {building.building_level > 1 && (
                    <div className="building-level-badge">{building.building_level}</div>
                )}
            </div>
            
            {/* SVG Building */}
            <div className="building-svg-wrapper">
                {BuildingSVG ? (
                    <BuildingSVG h={height} variant={variant} />
                ) : (
                    <GenericBuilding building={building} />
                )}
            </div>
        </div>
    );
};

// Generic Building (fallback for buildings without SVG)
const GenericBuilding: React.FC<{ building: CityBuildingType }> = ({ building }) => {
    const height = 80 + (building.building_level * 20);
    const width = 60 + (building.building_level * 10);

    return (
        <div className="generic-building-container">
            <div
                className="generic-building"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                }}
            >
                <div className="building-emoji">{building.building_type.emoji}</div>
            </div>
        </div>
    );
};

// Cloud SVG Component
const CloudSVG: React.FC<{ className: string; delay: string }> = ({ className, delay }) => (
    <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="762px"
        height="331px"
        viewBox="0 0 762 331"
        className={className}
        style={{ animationDelay: delay }}
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

// Background Tree Component
const BackgroundTree: React.FC<{ className: string }> = ({ className }) => (
    <div className={className}>
        <div className="tree-trunk"></div>
        <div className="tree-foliage"></div>
    </div>
);

// Streetlamp Component
const Streetlamp: React.FC<{ position: string }> = ({ position }) => (
    <div className={`streetlamp streetlamp-${position}`}>
        <div className="streetlamp-glow"></div>
    </div>
);
