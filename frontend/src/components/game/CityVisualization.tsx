import React from 'react';
import type { City, CityBuilding as CityBuildingType } from '../../models/types';
import clsx from 'clsx';

interface CityVisualizationProps {
    city: City;
    interactive?: boolean;
    mode?: 'view' | 'edit';
    onBuildingClick?: (building: CityBuildingType) => void;
    animated?: boolean;
    compact?: boolean;
}

export const CityVisualization: React.FC<CityVisualizationProps> = ({
    city,
    interactive = false,
    mode: _mode = 'view',
    onBuildingClick,
    animated = true,
    compact = false,
}) => {
    const canvasHeight = compact ? '300px' : '500px';

    return (
        <div className="relative bg-gradient-to-b from-sky-blue to-white rounded-lg overflow-hidden shadow-lg" style={{ height: canvasHeight }}>
            {/* Sky Layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-blue via-blue-200 to-transparent">
                {/* Sun */}
                <div className="absolute top-8 right-12 w-16 h-16 bg-sun-yellow rounded-full shadow-lg animate-pulse-slow"></div>

                {/* Clouds */}
                {animated && (
                    <>
                        <div className="absolute top-12 left-20 w-24 h-12 bg-white rounded-full opacity-70 animate-float"></div>
                        <div className="absolute top-20 right-32 w-32 h-14 bg-white rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
                    </>
                )}
            </div>

            {/* Ground Layer */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-grass-green to-green-300"></div>

            {/* Buildings Layer */}
            <div className="absolute inset-0 flex items-end justify-center pb-32">
                <div className="relative w-full max-w-4xl h-full">
                    {city.buildings.map((building, index) => (
                        <CityBuilding
                            key={building.building_id}
                            building={building}
                            onClick={() => interactive && onBuildingClick?.(building)}
                            interactive={interactive}
                            animated={animated}
                            animationDelay={index * 0.1}
                        />
                    ))}
                </div>
            </div>

            {/* City Info Overlay */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-md">
                <h3 className="font-heading font-bold text-lg">{city.city_name}</h3>
                <div className="flex gap-4 mt-2 text-sm">
                    <div>
                        <span className="text-gray-600">Level:</span>
                        <span className="ml-1 font-bold text-primary">{city.city_level}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Population:</span>
                        <span className="ml-1 font-bold">{city.population}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Buildings:</span>
                        <span className="ml-1 font-bold">{city.buildings.length}</span>
                    </div>
                </div>
            </div>

            {/* Coins & XP Display */}
            <div className="absolute top-4 right-4 flex gap-3">
                <div className="bg-warning bg-opacity-90 rounded-lg px-3 py-2 shadow-md flex items-center gap-2">
                    <span className="text-xl">🪙</span>
                    <span className="font-bold">{city.total_coins}</span>
                </div>
                <div className="bg-primary bg-opacity-90 text-white rounded-lg px-3 py-2 shadow-md flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <span className="font-bold">{city.total_xp}</span>
                </div>
            </div>
        </div>
    );
};

interface CityBuildingProps {
    building: CityBuildingType;
    onClick?: () => void;
    interactive?: boolean;
    animated?: boolean;
    animationDelay?: number;
}

const CityBuilding: React.FC<CityBuildingProps> = ({
    building,
    onClick,
    interactive,
    animated,
    animationDelay = 0,
}) => {
    const buildingEmoji = building.building_type.emoji;
    const buildingSize = 40 + (building.building_level * 10);

    return (
        <div
            className={clsx(
                'absolute transition-all duration-300',
                interactive && 'cursor-pointer hover:scale-110 hover:-translate-y-2',
                animated && 'animate-building-rise'
            )}
            style={{
                left: `${building.position_x}px`,
                bottom: `${building.position_y}px`,
                animationDelay: `${animationDelay}s`,
            }}
            onClick={onClick}
            title={`${building.building_type.display_name} (Level ${building.building_level})`}
        >
            {/* Building */}
            <div
                className="flex items-center justify-center bg-building-brown rounded-lg shadow-lg border-2 border-gray-700"
                style={{
                    width: `${buildingSize}px`,
                    height: `${buildingSize}px`,
                    fontSize: `${buildingSize * 0.6}px`,
                }}
            >
                {buildingEmoji}
            </div>

            {/* Building Level Badge */}
            {building.building_level > 1 && (
                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {building.building_level}
                </div>
            )}

            {/* Smoke animation for certain buildings */}
            {animated && ['dharamshala', 'ashram'].includes(building.building_type.building_name) && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                    <div className="w-2 h-8 bg-gray-400 opacity-50 rounded-full animate-pulse"></div>
                </div>
            )}
        </div>
    );
};
