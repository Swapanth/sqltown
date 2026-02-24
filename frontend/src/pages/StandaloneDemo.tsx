import React from 'react';
import GameDemo from './GameDemo';

// Standalone demo page that doesn't require authentication
export const StandaloneDemo: React.FC = () => {
  return (
    <div>
      <GameDemo />
    </div>
  );
};

export default StandaloneDemo;