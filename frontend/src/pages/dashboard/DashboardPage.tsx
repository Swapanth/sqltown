import React from 'react';
import { Link } from 'react-router-dom';
import { CityVisualization } from '../../components/game/CityVisualization';
import { currentUserCity } from '../../data/mockCities';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Full-Screen City Background */}
            <div className="absolute inset-0 w-full h-full">
                <CityVisualization
                    city={currentUserCity}
                    animated={true}
                    interactive={false}
                    compact={false}
                />
            </div>

            {/* Top Header Overlay */}
            
        </div>
    );
};
