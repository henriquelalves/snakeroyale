// Libs
const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Game = require('./game');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

app.set('port', (process.env.PORT || 3000))
app.use(express.static(__dirname + "/public"));

// ================================== MONGODB =========================================
// MongoDb setup
const dburl = 'mongodb://admin:admin0@ds139243.mlab.com:39243/snakeroyale';
const dbname = 'snakeroyale';

MongoClient.connect(dburl, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to the server");

    const db = client.db(dbname);

    insertDocuments(db, function () {
        client.close();
    });
})

const insertDocuments = function (db, callback) {
    // Get users collection
    const collection = db.collection('users');

    // Insert some documents
    collection.insertMany([
        { fb_id: 1, skins: [1, 2, 3] }, { fb_id: 2, skins: [1, 2, 3] }, { fb_id: 3, skins: [1, 2, 3] }
    ], function (err, result) {
        assert.equal(err, null);
        console.log("Inserted 3 documents into the collection");
        callback(result);
    });
}

var check_player_skin = function (id, callback) {
    MongoClient.connect(dburl, (err, client) => {
        assert.equal(null, err);
        console.log("Connected successfully to the server");

        const db = client.db(dbname);

        // Get the documents collection
        const collection = db.collection('users');
        // Find some documents
        collection.find({ 'fb_id': id }).toArray(function (err, docs) {
            console.log("Found the following records");
            console.log(docs);
            callback(docs);
        });
    })
    // const db = client.db(dbname);

    // // Get the documents collection
    // const collection = db.collection('users');
    // // Find some documents
    // collection.find({ 'fb_id': id }).toArray(function (err, docs) {
    //     console.log("Found the following records");
    //     console.log(docs);
    //     callback(docs);
    // });
}

// ========================================== GAME =============================================
// Rooms
const MAX_PLAYERS = 1;

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

// ================================================ SOCKET IO ====================================================
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
    if (room.number_of_players === MAX_PLAYERS) {
        room.began = true;
    }
})

// ================================================ SERVER ====================================================

// // HTTP page
// app.get('/', function (req, res) {
//     res.send('<h1>Hello world</h1>');
// })

// Check skins
app.get('/userskin/:id', function (req, res) {
    console.log("ID being requested: ", req.params.id);
    check_player_skin(req.params.id, function (docs) {
        res.end(JSON.stringify(docs));
    });
})

// HTTP page
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

// Starting the server
http.listen(app.get('port'), function () {
    console.log('listening on *:3000');
})