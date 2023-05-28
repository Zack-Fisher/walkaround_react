import React, { createContext, useContext, useEffect, useRef } from 'react';
import PubSub from 'pubsub-js';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, url }) => {
    const webSocketRef = useRef(null);

    useEffect(() => {
        webSocketRef.current = new WebSocket(url);

        webSocketRef.current.onmessage = (message) => {
            const data = JSON.parse(message.data);
            PubSub.publish('websocket.message', data);
        };

        webSocketRef.current.onerror = (error) => {
            console.log(`WebSocket error: ${error}`);
        };

        return () => {
            if (webSocketRef.current) {
                webSocketRef.current.close();
            }
        };
    }, [url]);

    const send = (message) => {
        if (webSocketRef.current.readyState === WebSocket.OPEN) {
            webSocketRef.current.send(JSON.stringify(message));
        }
    };

    return (
        // send an OBJECT that gets automatically json stringified.
        // all communications should be in json.
        <WebSocketContext.Provider value={{ send }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
