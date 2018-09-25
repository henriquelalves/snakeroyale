// Libs
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Game
const Game = require('./game');
var game = new Game();
var current_connections = {};
var players_skins = new Array(10);
players_skins.fill(0);
var players_sockets = new Array(10);
players_sockets.fill(0);

setInterval(() => {
    game.update();
    console.log(game.getState());
    for (var socket_id in current_connections) {
        current_connections[socket_id].socket.emit('game-update', game.getState());
    }
    for (var i = 0; i < game.dead_players.length; i+=1) {
        players_sockets[game.dead_players[i]].emit('player-died');
        // game.removePlayer(i);
        game.dead_players.splice(0,1);
    }

}, 1000);

// HTTP page
app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
})

// Socket io
io.on('connection', function (socket) {
    // Adding player to game
    console.log('a user connected!');
    current_connections[socket.id] = { socket: socket, player: game.createPlayer() };
    players_skins[current_connections[socket.id].player] = socket.handshake.query.skin;
    players_sockets[current_connections[socket.id].player] = socket;

    // Send new skin-player table
    io.emit('player-skins', players_skins);

    // If player disconnected
    socket.on('disconnect', () => {
        console.log("user disconnected!");
        // Removing player from game
        game.removePlayer(current_connections[socket.id].player);
        players_skins[current_connections[socket.id].player] = 0;
        players_sockets[current_connections[socket.id].player] = 0;
        delete current_connections[socket.id];

    });

    // On player input
    socket.on('keyboard', (key) => {
        game.playerInput(current_connections[socket.id].player, key);
    });
})

// Starting the server
http.listen(3000, function () {
    console.log('listening on *:3000');
})