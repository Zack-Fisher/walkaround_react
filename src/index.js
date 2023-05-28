import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WebSocketProvider } from './providers/websocket_provider';

const root = ReactDOM.createRoot(document.getElementById('root'));
// the websocketprovider gives a send() controller function and it provides event lines
// that other providers can subscribe to.
// the model should send the messages itself, based on its own state.
// the model should mutate itself based off of state messages procured from the websocket
// through pubsub.

root.render(
    // everything uses the same websocket in the app.
    <WebSocketProvider url="ws://localhost:3000">
        <App />
    </WebSocketProvider>
);
