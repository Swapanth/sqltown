import type { City, CityBuilding } from '../models/types';
import { mockBuildingTypes } from './mockBuildingTypes';
import { mockUsers } from './mockUsers';

// Helper to generate random buildings for a city
const generateCityBuildings = (cityId: number, cityLevel: number, count: number): CityBuilding[] => {
    const availableBuildings = mockBuildingTypes.filter(bt => bt.unlock_level <= cityLevel);

    return Array.from({ length: count }, (_, i) => {
        const buildingType = availableBuildings[Math.floor(Math.random() * availableBuildings.length)];
        return {
            building_id: cityId * 100 + i,
            city_id: cityId,
            building_type_id: buildingType.building_type_id,
            building_type: buildingType,
            position_x: 50 + (i % 5) * 150,
            position_y: 100 + Math.floor(i / 5) * 120,
            building_level: 1 + Math.floor(Math.random() * 3),
            capacity: buildingType.base_population * 2,
            current_occupancy: Math.floor(Math.random() * buildingType.base_population),
            is_active: true,
            built_at: new Date(2026, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
        };
    });
};

// Current user's city
export const currentUserCity: City = {
    city_id: 1,
    user_id: 1,
    dialect_id: 1,
    dialect: 'mysql',
    city_name: 'Vrindavan',
    city_description: 'My first sacred SQL city',
    city_level: 5,
    total_xp: 2340,
    total_coins: 1500,
    population: 234,
    city_theme: 'vrindavan',
    is_public: true,
    created_at: '2026-01-15T10:00:00Z',
    last_updated_at: '2026-02-14T17:00:00Z',
    buildings: generateCityBuildings(1, 5, 12),
};

// Generate 100+ mock cities
export const mockCities: City[] = [
    currentUserCity,
    ...Array.from({ length: 99 }, (_, i) => {
        const userId = (i % 50) + 1;
        const user = mockUsers[userId - 1];
        const cityLevel = Math.floor(Math.random() * 42) + 1;
        const cityThemes: Array<'vrindavan' | 'mathura' | 'ayodhya' | 'kashi' | 'modern'> = ['vrindavan', 'mathura', 'ayodhya', 'kashi', 'modern'];
        const dialects: Array<'mysql' | 'postgresql' | 'sqlite'> = ['mysql', 'postgresql', 'sqlite'];
        const dialect = dialects[Math.floor(Math.random() * dialects.length)];

        return {
            city_id: i + 2,
            user_id: userId,
            dialect_id: dialect === 'mysql' ? 1 : dialect === 'postgresql' ? 2 : 3,
            dialect,
            city_name: `${user.username}'s ${cityThemes[i % cityThemes.length]}`,
            city_description: `A beautiful ${dialect} city`,
            city_level: cityLevel,
            total_xp: cityLevel * 500 + Math.floor(Math.random() * 500),
            total_coins: cityLevel * 100 + Math.floor(Math.random() * 200),
            population: cityLevel * 10 + Math.floor(Math.random() * 50),
            city_theme: cityThemes[i % cityThemes.length],
            is_public: Math.random() > 0.2,
            created_at: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
            last_updated_at: new Date(2026, 1, Math.floor(Math.random() * 14) + 1).toISOString(),
            buildings: generateCityBuildings(i + 2, cityLevel, Math.min(cityLevel + 5, 20)),
        };
    }),
];

export const getCityById = (cityId: number): City | undefined => {
    return mockCities.find(c => c.city_id === cityId);
};

export const getCitiesByUserId = (userId: number): City[] => {
    return mockCities.filter(c => c.user_id === userId);
};

export const getPublicCities = (): City[] => {
    return mockCities.filter(c => c.is_public).sort((a, b) => b.total_xp - a.total_xp);
};
