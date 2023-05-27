import React from 'react';

import { useEffect } from 'react';
import { base_factory_mixin, entity_mixin, label_mixin, mover_mixin, physical_mixin, pipe } from '../../factory';

import { useEntityContext } from '../../providers/entity_provider';
import { PhysTypes, usePhysics } from '../../providers/physics_provider';

import PubSub from 'pubsub-js';
import { Actions, useKeyboard } from '../../providers/keyboard_provider';
import { Vector2 } from '../../vec';
import { UPDATE } from '../ticker';
import { ITEM_MIXIN } from './item';
import { NPC_MIXIN } from './npc';

// just make the action_state a property of the character
const Character = ({ self, update_self }) => {
    const { has_all_mixins } = useEntityContext();
    const { collisions_list } = usePhysics();
    const { isActionJustActivated, isActionActive } = useKeyboard(self.action_state);

    useEffect(() => {
        const interact = () => {
            // interact
            if (isActionJustActivated(Actions.INTERACT)) {
                collisions_list(self.id).forEach(other_id => {
                    if (has_all_mixins(other_id, [NPC_MIXIN])) {
                        console.log('Player is interacting with NPC ', other_id);
                    }
                })
            }
        }

        const move_input = () => {
            let new_vel = new Vector2(0, 0);

            if (isActionActive(Actions.MOVE_UP)) {
                new_vel.y -= self.acceleration;
            }
            if (isActionActive(Actions.MOVE_DOWN)) {
                new_vel.y += self.acceleration;
            }
            if (isActionActive(Actions.MOVE_LEFT)) {
                new_vel.x -= self.acceleration;
            }
            if (isActionActive(Actions.MOVE_RIGHT)) {
                new_vel.x += self.acceleration;
            }

            let modifier = 1.0;
            if (isActionActive(Actions.SPRINT)) {
                modifier = 1.5;
            }

            // player input modifies the velocity, not position
            let final_vel = self.velocity.add(new_vel.mul(modifier));
            // apply friction
            final_vel = final_vel.mul(self.friction);

            update_self({ velocity: final_vel, box: self.box.translate(self.velocity) });
        }

        const token = PubSub.subscribe(UPDATE, (msg, data) => {
            move_input();

            interact();
        });

        return () => { PubSub.unsubscribe(token) };
    });

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

    return (
        <div style={{
            position: 'relative',
            left: self.box.x,
            top: self.box.y,
            width: self.box.w,
            height: self.box.h,
            background: 'blue',
            zIndex: 1,
        }}></div>
    )
}

export const CHARACTER_MIXIN = 'o_character';

export const make_character = (x, y) => {
    let o = pipe(
        base_factory_mixin,
        entity_mixin(Character),
        physical_mixin(x, y, 32, 64),
        mover_mixin(1.5, 0.7),
        label_mixin(CHARACTER_MIXIN),
    )();

    o.inventory = [{"name": "sword", "damage": 10}];
    o.equipment = {"head": null, "chest": null, "legs": null, "feet": null, "weapon": null};

    return o;
}

export default Character;
