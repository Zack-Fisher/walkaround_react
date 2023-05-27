import React, { useEffect } from "react";
import { EntityData, useEntity } from "./entity";
import { PhysicalEntityData } from "../classes";
import { useEntityContext } from "../providers/entity_provider";

import PubSub from "pubsub-js";
import { PhysTypes } from "../providers/physics_provider";

const NPC = () => {
    const {self} = useEntity();

    const {type_from_id} = useEntityContext();

    useEffect(() => {
        const token = PubSub.subscribe(PhysTypes.JUST_COLLIDING, (msg, data) => {
            if (data.one === self.id) {
                if (type_from_id(data.two) === 'PlayerData')
                {
                    alert("hello.");
                }
            }
        });

        return () => {PubSub.unsubscribe(token)};
    }, [self, type_from_id]);

    if (self.box === undefined) return null;
    return (
        <div
        style={{
            position: "absolute",
            left: self.box.x,
            top: self.box.y,
            width: self.box.w,
            height: self.box.h,
            background: self.color,
        }}
        ></div>
    );
}

export class NPCData extends PhysicalEntityData {
    static component_fn = NPC;

    constructor(x = 50, y = 50, color = "red") {
        super(x, y, 50, 50);
        this.color = color;
    }
}
