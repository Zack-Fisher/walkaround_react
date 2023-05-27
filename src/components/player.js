// Player.js
import React from 'react';

import { useEffect, useCallback } from 'react';
import { useEntity } from './entity';
import { PhysicalEntityData } from '../classes';

import { useEntityContext } from '../providers/entity_provider';
import { PhysTypes, usePhysics } from '../providers/physics_provider';

import PubSub from 'pubsub-js';
import { useKeyboard } from '../providers/keyboard_provider';
import { UPDATE } from './ticker';
import { Vector2 } from '../vec';

const Player = () => {
    const {self, update_self} = useEntity();

    const {type_from_id} = useEntityContext();

    const {collisions_list} = usePhysics();

    const {isKeyJustDown, isKeyDown} = useKeyboard();

    useEffect(() => {
        const token = PubSub.subscribe(PhysTypes.JUST_COLLIDING, (msg, data) => {
            if (data.one === self.id) {
                if (type_from_id(data.two) === 'NPCData')
                {
                    console.log('Player is colliding with NPC ', data.two);
                }
            }
        });

        return () => {PubSub.unsubscribe(token)};
    }, [self, type_from_id]);

    useEffect(() => {
        const interact = () => {
            // interact
            if (isKeyJustDown('z')) {
                collisions_list(self.id).forEach(other_id => {
                    if (type_from_id(other_id) === 'NPCData') {
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

            update_self({velocity: final_vel, box: self.box.translate(self.velocity)});
        }

        const token = PubSub.subscribe(UPDATE, (msg, data) => {
            move_input();

            interact();
        });

        return () => {PubSub.unsubscribe(token)};
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

export class PlayerData extends PhysicalEntityData {
    static component_fn = Player;

    constructor(start_x, start_y) {
        super(start_x, start_y, 50, 50);

        this.friction = 0.6;
        this.velocity = new Vector2(0, 0);
        this.acceleration = 9;
    }
}
