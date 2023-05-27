// GameScreen.js
import React from 'react';
import { PlayerData } from './player';
import { useState } from 'react';
import { ent } from './entity';
import { NPCData } from './npc';
import { useEntityContext } from '../providers/entity_provider';
import { PhysicsProvider } from '../providers/physics_provider';
import Pubsub from './pubsub';
import { KeyboardProvider } from '../providers/keyboard_provider';

const GameScreen = () => {
    const {entities, add_entity, remove_entity, query_entities, update_entity} = useEntityContext();

    if (entities === undefined) return null;
    return (
        <>
        <PhysicsProvider fps={60}>
            <KeyboardProvider>
                <div>
                    {
                        entities.map(entity => {
                            if (!entity) return null;
                            // the static class member gives us access to the component function which should have a self and change_self prop.
                            const Component = ent(entity.constructor.component_fn);
                            if (!Component) return null;
                            return (
                                <Component key={entity.id} self={entity} update_self={update_entity(entity.id)} />
                            )
                        })
                    }
                </div>
            </KeyboardProvider>
        </PhysicsProvider>
        </>
    );
};

export default GameScreen;
