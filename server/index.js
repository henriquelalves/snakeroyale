// Libs
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Game
const Game = require('./game');
var game = new Game();

// HTTP page
app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
})

// Socket io
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log("user disconnected!");
    });
    socket.on('keyboard', (key) => {
        console.log('keyboard pressed! ', key)
    });


    setInterval(() => {
        game.update();
        console.log(game.getState());
        socket.emit('game_update', game.getState());
    }, 1000);
})

// Starting the server
http.listen(3000, function () {
    console.log('listening on *:3000');
})