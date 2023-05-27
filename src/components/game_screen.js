// GameScreen.js
import React from 'react';
import { useEntityContext } from '../providers/entity_provider';
import { PhysicsProvider } from '../providers/physics_provider';
import { KeyboardProvider } from '../providers/keyboard_provider';

const GameScreen = () => {
    const { entities, add_entity, remove_entity, query_entities, update_entity } = useEntityContext();

    if (entities === undefined) return null;
    return (
        <>
            <PhysicsProvider>
                <KeyboardProvider>
        <div>
           {
                entities.map(entity => {
                    if (!entity) return null;

                    // the static class member gives us access to the component function which should have a self and change_self prop.
                    const Component = entity.component_fn;
                    if (!Component) return null;
                    return (
                        <Component key={entity.id} 
                                // for any given entity, with component_fn wrapped in a mixin defined data struct,
                                // you have access to the following props for deconstruction:
                            // read only reference to self
                            self={entity} 
                            // update is curried
                            update_self={update_entity(entity.id)} 
                            // remove is not, we have to wrap it in a function.
                            remove_self={() => { remove_entity(entity.id) }} 
                        />
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
