import React, { useEffect } from "react";
import {pipe, base_factory_mixin, entity_mixin, physical_mixin, label_mixin} from "../../factory";
import { PhysTypes } from "../../providers/physics_provider";

import PubSub from "pubsub-js";
import { useEntityContext } from "../../providers/entity_provider";
import { CHARACTER_MIXIN } from "./character";

const Item = ({self, remove_self}) => {
    const {has_all_mixins} = useEntityContext();

    useEffect(() => {
        const token = PubSub.subscribe(PhysTypes.JUST_COLLIDING, (msg, data) => {
            if (data.one === self.id) {
                if (has_all_mixins(data.two, [CHARACTER_MIXIN])) {
                    remove_self();
                }
            }
        });

        return () => { PubSub.unsubscribe(token) };
    }, [self, has_all_mixins, remove_self]);

    return (
        <div
        style={{
            position: 'relative',
            left: self.box.x,
            top: self.box.y,
            width: self.box.w,
            height: self.box.h,
            background: 'yellow',
        }}
        ></div>
    );
}

export const ITEM_MIXIN = 'o_item';

export const make_item = (x, y) => {
    return pipe(
        base_factory_mixin,
        entity_mixin(Item),
        physical_mixin(x, y, 50, 50),
        label_mixin(ITEM_MIXIN),
    )();
}
