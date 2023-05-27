// the main hud for the game, goes over everything else.

import React from 'react';
import Inventory from './hud_components/inventory';

const HUD = () => {
    return (
        <div style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            color: 'white',
            zIndex: 100,
        }}>
            <h1>HUD</h1>
            <p>inventory</p>

            <Inventory />
        </div>
    );
}

export default HUD;
