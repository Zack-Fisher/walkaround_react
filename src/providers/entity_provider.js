import React, { useContext } from "react";
import { createContext } from "react";
import { useState } from "react";
import { make_player } from "../components/player";
import { make_npc } from "../components/npc";
import { make_item } from "../components/item";

const EntityContext = createContext();

export const EntityProvider = ({children}) => {
    const [entities, setEntities] = useState([
        make_player(0, 0),
        make_npc(100, 100),
        make_item(500, 200),
    ]);

    const add_entity = (entity) => {
        setEntities([...entities, entity]);
    }

    const remove_entity = (id) => {
        setEntities(entities.filter(entity => entity.id !== id));
    }

    // return the array with all the mixins.
    const or_query = (mixin_list) => {
        return entities.filter(entity => entity.has_one_mixin(mixin_list));
    }
    const and_query = (mixin_list) => {
        return entities.filter(entity => entity.has_all_mixins(mixin_list));
    }

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
