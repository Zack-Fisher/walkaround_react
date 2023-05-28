import { make_error, make_init } from "./messages";
import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';

// constructors
const make_client_state = (ws) => {
    return {
        id: uuidv4(),
        ws,
    }
}
const make_socket_state = (wss) => {
    return {
        wss,
        clients: [],
        add_client: function(ws) {
            this.clients.push(make_client_state(ws));
            console.log('Added client with id:', this.clients[this.clients.length - 1].id)
        },
    }
}

// helpers
// pass this an object
const broadcast = (wss, message) => {
    const str_message = JSON.stringify(message);
    console.log('Broadcasting: ', message)
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(str_message);
        }
    });
}

// main callback setup
export const setup_socket = (wss) => {
    let socket_state = make_socket_state(wss);

    socket_state.wss.on('connection', ws => {
        socket_state.add_client(ws);

        console.log('Client connected');
        ws.send(JSON.stringify(make_init()));

        ws.on('error', error => {
            console.log('Error:', error);
            ws.send(JSON.stringify(make_error(error)));
        });

        ws.on('message', message => {
            const data = JSON.parse(message);
            console.log('Received:', data);
            // just broadcast to all other users on the line by default.
            broadcast(wss, data);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return socket_state;
}
