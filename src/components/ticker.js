// creates a setinterval that sends 'update' pubsub messages.

import React from "react";
import { useEffect } from "react";

import PubSub from 'pubsub-js';

export const UPDATE = 'update';

export const Ticker = ({fps}) => {
    useEffect(() => {
        const interval = setInterval(() => {
            PubSub.publish(UPDATE, {});
        }, 1000 / fps);
        return () => clearInterval(interval);
    }, [fps]);

    return null;
}
