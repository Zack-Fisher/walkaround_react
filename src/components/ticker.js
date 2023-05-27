// creates a setinterval that sends 'update' pubsub messages.

import React from "react";
import { useEffect } from "react";

import PubSub from 'pubsub-js';

export const UPDATE = 'update';
export const PHYS_UPDATE = 'phys_update';

export const Ticker = ({fps, phys_fps}) => {
    useEffect(() => {
        const interval = setInterval(() => {
            PubSub.publish(UPDATE, {});
        }, 1000 / fps);

        const phys_interval = setInterval(() => {
            PubSub.publish(PHYS_UPDATE, {});
        }, 1000 / phys_fps);

        return () => clearInterval(interval);
    }, [fps, phys_fps]);

    return null;
}
