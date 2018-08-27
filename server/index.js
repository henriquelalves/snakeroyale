// Libs
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Game
const Game = require('./game');
var game = new Game();
var current_connections = {};

setInterval(() => {
    game.update();
    console.log(game.getState());
    for (var socket_id in current_connections) {
        current_connections[socket_id].socket.emit('game_update', game.getState());
    }
}, 1000);

// HTTP page
app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
})

// Socket io
io.on('connection', function (socket) {
    // Adding player to game
    console.log('a user connected');
    current_connections[socket.id] = {socket: socket, player: game.createPlayer()};

    socket.on('disconnect', () => {
        console.log("user disconnected!");
        // Removing player from game
        game.removePlayer(current_connections[socket.id].player);
        delete current_connections[socket.id];

    });

    socket.on('keyboard', (key) => {
        game.playerInput(current_connections[socket.id].player, key);
    });
})

// Starting the server
http.listen(3000, function () {
    console.log('listening on *:3000');
})