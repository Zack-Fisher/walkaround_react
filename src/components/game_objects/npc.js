import React, { useEffect, useState } from "react";
import { useEntityContext } from "../../providers/entity_provider";

import PubSub from "pubsub-js";
import { base_factory_mixin, entity_mixin, label_mixin, physical_mixin, pipe } from "../../factory";
import { PhysTypes } from "../../providers/physics_provider";
import Textbox from "../helpers/textbox";

const NPC = ({self}) => {
    const {has_all_mixins} = useEntityContext();
    const [isTalking, setIsTalking] = useState(false);

    useEffect(() => {
        const token = PubSub.subscribe(PhysTypes.JUST_COLLIDING, (msg, data) => {
            if (data.one === self.id) {
                if (has_all_mixins(data.two, [])) {
                    setIsTalking(true);
                    setTimeout(() => {
                        setIsTalking(false);
                    }, 1000)
                }
            }
        });

        return () => {PubSub.unsubscribe(token)};
    }, [self, has_all_mixins, setIsTalking]);

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
        }}>
            {/* conditionally render the textbox based on the state  */}
            {isTalking && <Textbox message={self.message} />}
        </div>
    );
}

export const NPC_MIXIN = 'o_npc';

export const make_npc = (x, y, message) => {
    let o =  pipe(
        base_factory_mixin,
        entity_mixin(NPC),
        physical_mixin(x, y, 50, 50),
        label_mixin(NPC_MIXIN),
    )();
    o.message = message;
    return o;
}
