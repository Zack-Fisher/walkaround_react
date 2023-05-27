import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useEntityContext } from './entity_provider';
import PubSub from 'pubsub-js';
import { PHYS_UPDATE } from '../components/ticker';
import { PHYSICAL_MIXIN } from '../factory';

export const PhysTypes = {
    FINISHED_COLLIDING: 'finished_colliding',
    JUST_COLLIDING: 'just_colliding',
}

const finished_colliding = (entity_one_id, entity_two_id) => {
    return {
        one: entity_one_id,
        two: entity_two_id,
    }
}

const just_colliding = (entity_one_id, entity_two_id) => {
    return {
        one: entity_one_id,
        two: entity_two_id,
    }
}

export const PhysicsContext = createContext();

export const PhysicsProvider = ({ children, fps }) => {
    const { entities, has_all_mixins, and_query } = useEntityContext();

    const [collisionState, setCollisionState] = useState({});


    // returns a list of all the entities (ids) that are colliding with the given entity
    const collisions_list = useCallback((entity_id) => {
        const collisions = [];
        Object.keys(collisionState[entity_id]).forEach((other_entity_id) => {
            if (collisionState[entity_id][other_entity_id]) collisions.push(other_entity_id);
        });
        return collisions;
    }, [collisionState]);

    // define basic physics queries for the hook
    const is_colliding = useCallback((id_one, id_two) => {
        const entity_one = entities.find(entity => entity.id === id_one);
        const entity_two = entities.find(entity => entity.id === id_two);
        if (!entity_one || !entity_two) return false;
        return (
            entity_one.box.x < entity_two.box.x + entity_two.box.w &&
            entity_one.box.x + entity_one.box.w > entity_two.box.x &&
            entity_one.box.y < entity_two.box.y + entity_two.box.h &&
            entity_one.box.y + entity_one.box.h > entity_two.box.y
        );
    }, [entities]);

    // handle the physics tick, subscribe to the tick line
    useEffect(() => {
        const token = PubSub.subscribe(PHYS_UPDATE, (msg, data) => {
            // query for everything with a box collider in the world.
            const phys_entities = and_query([PHYSICAL_MIXIN]);
            let newCollisionState = {};

            phys_entities.forEach((entity, i) => {
                phys_entities.forEach((otherEntity, j) => {
                    if (entity.id !== otherEntity.id) {
                        const colliding = is_colliding(entity.id, otherEntity.id);
                        if (!newCollisionState[entity.id]) newCollisionState[entity.id] = {};

                        newCollisionState[entity.id][otherEntity.id] = colliding

                        if (collisionState[entity.id]) {
                            if (colliding && !collisionState[entity.id][otherEntity.id]) {
                                PubSub.publish(PhysTypes.JUST_COLLIDING, just_colliding(entity.id, otherEntity.id));
                            }
                            if (!colliding && collisionState[entity.id][otherEntity.id]) {
                                PubSub.publish(PhysTypes.FINISHED_COLLIDING, finished_colliding(entity.id, otherEntity.id));
                            }
                        }
                    }
                });
            });

            setCollisionState(newCollisionState);
        });

        return () => {PubSub.unsubscribe(token)};
    });

    return (
        <PhysicsContext.Provider value={{ is_colliding, collisions_list }}>
            {children}
        </PhysicsContext.Provider>
    );
}

export const usePhysics = () => useContext(PhysicsContext);
