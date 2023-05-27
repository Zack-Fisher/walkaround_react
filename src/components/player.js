import React from 'react';

import { useEffect } from 'react';
import { base_factory_mixin, entity_mixin, label_mixin, mover_mixin, physical_mixin, pipe } from '../factory';

import { useEntityContext } from '../providers/entity_provider';
import { PhysTypes, usePhysics } from '../providers/physics_provider';

import PubSub from 'pubsub-js';
import { useKeyboard } from '../providers/keyboard_provider';
import { UPDATE } from './ticker';
import { Vector2 } from '../vec';
import { NPC_MIXIN } from './npc';
import { ITEM_MIXIN } from './item';

const Player = ({ self, update_self }) => {
    const { has_all_mixins } = useEntityContext();
    const { collisions_list } = usePhysics();
    const { isKeyJustDown, isKeyDown } = useKeyboard();

    useEffect(() => {
        const token = PubSub.subscribe(PhysTypes.JUST_COLLIDING, (msg, data) => {
            if (data.one === self.id) {
                if (has_all_mixins(data.two, [NPC_MIXIN])) {
                    console.log('Player is colliding with NPC ', data.two);
                }
                if (has_all_mixins(data.two, [ITEM_MIXIN])) {
                    console.log('Player is colliding with Item ', data.two)
                }
            }
        });

        return () => { PubSub.unsubscribe(token) };
    }, [self, has_all_mixins]);

    useEffect(() => {
        const interact = () => {
            // interact
            if (isKeyJustDown('z')) {
                collisions_list(self.id).forEach(other_id => {
                    if (has_all_mixins(other_id, [NPC_MIXIN])) {
                        console.log('Player is interacting with NPC ', other_id);
                    }
                })
            }
        }

        const move_input = () => {
            let new_vel = new Vector2(0, 0);

            if (isKeyDown('ArrowUp')) {
                new_vel.y -= self.acceleration;
            }
            if (isKeyDown('ArrowDown')) {
                new_vel.y += self.acceleration;
            }
            if (isKeyDown('ArrowLeft')) {
                new_vel.x -= self.acceleration;
            }
            if (isKeyDown('ArrowRight')) {
                new_vel.x += self.acceleration;
            }


            // player input modifies the velocity, not position
            let final_vel = self.velocity.add(new_vel);
            // apply friction
            final_vel = final_vel.mul(self.friction);

            update_self({ velocity: final_vel, box: self.box.translate(self.velocity) });
        }

        const token = PubSub.subscribe(UPDATE, (msg, data) => {
            move_input();

            interact();
        });

        return () => { PubSub.unsubscribe(token) };
    })

    return (
        <div style={{
            position: 'absolute',
            left: self.box.x,
            top: self.box.y,
            width: self.box.w,
            height: self.box.h,
            background: 'blue',
            zIndex: 1,
        }}></div>
    )
}

export const PLAYER_MIXIN = 'o_player';

export const make_player = (x, y) => {
    return pipe(
        base_factory_mixin,
        entity_mixin(Player),
        physical_mixin(x, y, 32, 64),
        mover_mixin(1.5, 0.7),
        label_mixin(PLAYER_MIXIN),
    )();
}
