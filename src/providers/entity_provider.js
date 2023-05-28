import React, { useCallback, useContext, useEffect } from "react";
import { createContext } from "react";
import { useState } from "react";
import { make_npc } from "../components/game_objects/npc";
import { make_item } from "../components/game_objects/item";
import { CHARACTER_MIXIN, make_character } from "../components/game_objects/character";
import { useWebSocket } from "./websocket_provider";

// symlink the subproject to share files with the backend
import * as M from 'walkaround_backend/src/messages';

const EntityContext = createContext();

export const EntityProvider = ({children}) => {
    const [entities, setEntities] = useState([
        make_character(100, 100),
        make_item(500, 200),
        make_npc(60, 60, "hello brother"),
    ]);

    const add_entity = (entity) => {
        setEntities([...entities, entity]);

        return entity.id;
    }

    const remove_entity = (id) => {
        setEntities(entities.filter(entity => entity.id !== id));
    }

    // return the array with all the mixins.
    const or_query = (mixin_list) => {
        return entities.filter(entity => entity.has_one_mixin(mixin_list));
    }
    const and_query = useCallback((mixin_list) => {
        return entities.filter(entity => entity.has_all_mixins(mixin_list));
    }, [entities])

    const has_one_mixin = (id, mixin_list) => {
        const entity = entities.find(entity => entity.id === id);
        if (!entity) return false;
        return entity.has_one_mixin(mixin_list);
    }
    const has_all_mixins = (id, mixin_list) => {
        const entity = entities.find(entity => entity.id === id);
        if (!entity) return false;
        return entity.has_all_mixins(mixin_list);
    }

    const update_entity = (id) => (updated_fields) => {
        const update_individual = (entity) => {
            for (const key in updated_fields) {
                entity[key] = updated_fields[key];
            }
            return entity;
        }
        const new_ents = entities.map(entity => entity.id === id ? update_individual(entity) : entity);
        setEntities(new_ents);
    }

    const {send} = useWebSocket();

    // now, interact with the websocket on an interval, providing entity updates
    // for the server to process. also, process the server's messages and estimate the 
    // current state.
    useEffect(() => {
        // once a second update the entity velocity.
        const interval = setInterval(() => {
            const characters = and_query([CHARACTER_MIXIN]);

            // update the server with the current state of the characters.
            characters.forEach(character => {
                send(
                    M.make_property_update(
                        "velocity",
                        character.velocity,
                    )
                )
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [entities, and_query, send]);

    // access the entities structure from these filtered methods.
    return (
        <EntityContext.Provider value={{entities, 
            // management
            add_entity, remove_entity, update_entity,
            // queries
            has_all_mixins, has_one_mixin, or_query, and_query,
        }}>
            {children}
        </EntityContext.Provider>
    )
}

export const useEntityContext = () => useContext(EntityContext);
