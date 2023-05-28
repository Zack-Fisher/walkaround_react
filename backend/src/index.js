const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const path = require('path');
const { define_routes } = require('./routes');
const { setup_socket } = require('./socket');

// Create a new Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the directory for views (optional, defaults to 'views' directory)
app.set('views', __dirname + '/views');

// setup basic GET routes for logging and interfacing with the server
define_routes(app);

// Start the HTTP server
const server = app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});

// Set up the WebSocket server
const wss = new WebSocket.Server({ server });

const socket_state = setup_socket(wss);
