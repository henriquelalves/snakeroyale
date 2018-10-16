// Libs
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const Game = require('./game');

// Rooms
var rooms = [];

var Room = function () {
    return {
        game: new Game(),
        began: false,
        room: 0,
        number_of_players: 0,
        current_connections: {},
        players_skins: new Array(10),
        players_sockets: new Array(10)
    }
}

var createRoom = function () {
    rooms.push(Room());
    var that = rooms[rooms.length - 1];
    setInterval(() => {
        if (that.began)
            that.game.update();
        console.log(that.game.getState());

        for (var socket_id in that.current_connections) {
            that.current_connections[socket_id].socket.emit('game-update', that.game.getState());
        }
        for (var i = 0; i < that.game.dead_players.length; i += 1) {
            that.players_sockets[that.game.dead_players[i]].emit('player-died');
            that.game.dead_players.splice(0, 1);
        }
    }, 1000);
}

// Game

// var game = new Game();
// var current_connections = {};
// var players_skins = new Array(10);
// players_skins.fill(0);
// var players_sockets = new Array(10);
// players_sockets.fill(0);

// setInterval(() => {
//     game.update();
//     console.log(game.getState());
//     for (var socket_id in current_connections) {
//         current_connections[socket_id].socket.emit('game-update', game.getState());
//     }
//     for (var i = 0; i < game.dead_players.length; i += 1) {
//         players_sockets[game.dead_players[i]].emit('player-died');
//         // game.removePlayer(i);
//         game.dead_players.splice(0, 1);
//     }

// }, 1000);

// HTTP page
app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
})

// Socket io
io.on('connection', function (socket) {
    // Check if it needs another room
    console.log('a user connected!');
    if (rooms.length === 0 || rooms[rooms.length - 1].began === true) {
        createRoom();
    }

    var room = rooms[rooms.length - 1];

    // Set new player
    room.current_connections[socket.id] = { socket: socket, player: room.game.createPlayer() };
    room.players_skins[room.current_connections[socket.id].player] = socket.handshake.query.skin;
    room.players_sockets[room.current_connections[socket.id].player] = socket;
    room.number_of_players += 1

    // Send new skin-player table
    io.emit('player-skins', room.players_skins);

    // If player disconnected
    socket.on('disconnect', () => {
        console.log("user disconnected!");
        // Removing player from game
        room.game.removePlayer(room.current_connections[socket.id].player);
        room.players_skins[room.current_connections[socket.id].player] = 0;
        room.players_sockets[room.current_connections[socket.id].player] = 0;
        delete room.current_connections[socket.id];

    });

    // On player input
    socket.on('keyboard', (key) => {
        room.game.playerInput(room.current_connections[socket.id].player, key);
    });

    // Check if room should start
    if (room.number_of_players === 4) {
        room.began = true;
    }
})

// Starting the server
http.listen(3000, function () {
    console.log('listening on *:3000');
})