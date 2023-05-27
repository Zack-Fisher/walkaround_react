import React, { useEffect } from "react";
import { useEntityContext } from "../providers/entity_provider";

import PubSub from "pubsub-js";
import { PhysTypes } from "../providers/physics_provider";
import { base_factory_mixin, entity_mixin, label_mixin, physical_mixin, pipe } from "../factory";
import { PLAYER_MIXIN } from "./player";

const NPC = ({self}) => {
    const {has_all_mixins} = useEntityContext();

    useEffect(() => {
        const token = PubSub.subscribe(PhysTypes.JUST_COLLIDING, (msg, data) => {
            if (data.one === self.id) {
                if (has_all_mixins(data.two, [PLAYER_MIXIN]))
                {
                    alert("hello.");
                }
            }
        });

        return () => {PubSub.unsubscribe(token)};
    }, [self, has_all_mixins]);

    if (self.box === undefined) return null;
    return (
        <div
        style={{
            position: "absolute",
            left: self.box.x,
            top: self.box.y,
            width: self.box.w,
            height: self.box.h,
            background: 'red',
        }}
        ></div>
    );
}

export const NPC_MIXIN = 'o_npc';

export const make_npc = (x, y) => {
    return pipe(
        base_factory_mixin,
        entity_mixin(NPC),
        physical_mixin(x, y, 50, 50),
        label_mixin(NPC_MIXIN),
    )();
}
