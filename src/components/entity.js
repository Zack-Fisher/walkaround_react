import React, { createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const EntityContext = createContext();

const Entity = ({self, update_self}) => {
    return (
        <div>
        </div>
    );
}

export class EntityData {
    static component_fn = Entity;

    constructor() {
        this.id = uuidv4();
    }

    update(updated_fields) {
        return new Entity({...this, ...updated_fields})
    }
}

export const ent = (WrappedComponent) => {
    return ({self, update_self}) => {
        return (
            <EntityContext.Provider value={{self, update_self}}>
                <WrappedComponent />
            </EntityContext.Provider>
        )
    }
}

export const useEntity = () => useContext(EntityContext);
