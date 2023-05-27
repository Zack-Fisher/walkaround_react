import React, { useContext } from "react";
import { createContext } from "react";
import { useState } from "react";
import { PlayerData } from "../components/player";
import { NPCData } from "../components/npc";
import { ItemData } from "../components/item";

const EntityContext = createContext();

export const EntityProvider = ({children}) => {
    const [entities, setEntities] = useState([
        new PlayerData(),
        new NPCData(100, 100),
        new NPCData(200, 200),
        new ItemData(300, 300),
    ]);

    const add_entity = (entity) => {
        setEntities([...entities, entity]);
    }

    const remove_entity = (id) => {
        setEntities(entities.filter(entity => entity.id !== id));
    }

    const query_entities = (query) => {
        return entities.filter(query);
    }

    const type_from_id = (id) => {
        const entity = entities.find(entity => entity.id === id);
        if (!entity) return null;
        return entity.constructor.name;
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
        <EntityContext.Provider value={{entities, type_from_id, add_entity, remove_entity, query_entities, update_entity}}>
            {children}
        </EntityContext.Provider>
    )
}

export const useEntityContext = () => useContext(EntityContext);
