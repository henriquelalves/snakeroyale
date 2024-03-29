const Snake = require('./objects/snake');
const Food = require('./objects/food');
const GameMath = require('./objects/math');

class Game {
    constructor() {
        // Game constants
        this.BOARD_WIDTH = 20;
        this.BOARD_HEIGHT = 10;

        // Create snakes array
        this.snakes = new Array(10);
        this.snakes.fill(null);
        this.number_players = 0;

        // Food initial position
        this.food = new Food(3, 4);

        // Collision map
        this.map = [];

        // Dead players
        this.dead_players = [];
    }

    createPlayer() {
        // Check if there is a maximum number of players
        if (this.number_players === 10) // FIXME 10 is not the maximum number of players anymore, is it?
            return -1

        // First open player slot
        var i;
        for (i = 0; i < this.snakes.length; i++) {
            if (this.snakes[i] === null)
                break
        }

        this.snakes[i] = new Snake(this, 8, 2*i, 3);
        this.number_players += 1;
        return i;
    }

    removePlayer(player) {
        this.number_players -= 1;
        delete this.snakes[player];
        this.snakes[player] = null;
    }

    playerInput(player, input) {
        switch (input) {
            case 0:
                this.snakes[player].faceUp();
                break;
            case 1:
                this.snakes[player].faceDown();
                break;
            case 2:
                this.snakes[player].faceLeft();
                break;
            case 3:
                this.snakes[player].faceRight();
                break;
        }
    }

    getState() {
        // Get array of data numbers
        // Array is made like this: [player (11 if food), number of positions, x1, y1, x2, y2, ..., player2, number of positions2, etc]
        var data = [];
        var d = null;
        for (var i = 0; i < this.snakes.length; i += 1) {
            if (this.snakes[i] === null) {
                continue;
            }
            d = this.snakes[i].getPosData();
            data = data.concat([i, d.length].concat(d));
        }

        d = this.food.getPosData();
        data = data.concat([11, 2].concat(d));

        // Compact array by concatenating each number in 8 bits inside a integer
        // JAVASCRIPT CAST NUMBERS TO 32bits IN BIT OPERATIONS!
        console.log(data);
        var compact_data = [];
        var data_index = data.length - 1
        while(data_index >= 0) {
            var i = 0;
            var d = 0;
            while (i < 4) {
                if (data_index < 0){
                    break;
                }
                d += (data[data_index] << (i*8));
                i += 1;
                data_index -= 1;
            }
            compact_data.unshift(d);
        }
        
        // console.log(compact_data);

        return compact_data;
    }

    update() {
        this.map = [];
        this.snakes.forEach((snake) => {
            if (snake === null)
                return;
            snake.update();
            snake.fill(this.map);
            if (snake.collideWithFood(this.food)) {
                this.repositionFood();
            }
        });

        for (var i = 0; i < this.snakes.length; i += 1) {
            if (this.snakes[i] === null) {
                continue;
            }
            if (this.map[this.snakes[i].getHeadKey()]) {
                console.log("Player " + i.toString() + " is dead.");
                this.dead_players.push(i);
            }
        }
    }

    repositionFood() {
        var testGrid = [];

        for (var y = 0; y < 30; y++) {
            testGrid[y] = [];

            for (var x = 0; x < 40; x++) {
                testGrid[y][x] = true;
            }
        }

        this.snakes.forEach((snake) => {
            if (snake === null)
                return;
            snake.updateGrid(testGrid);
        });

        //  Purge out false positions
        var validLocations = [];

        for (var y = 0; y < 30; y++) {
            for (var x = 0; x < 40; x++) {
                if (testGrid[y][x] === true) {
                    //  Is this position valid for food? If so, add it here ...
                    validLocations.push({ x: x, y: y });
                }
            }
        }

        if (validLocations.length > 0) {
            //  Use the RNG to pick a random food position
            // var pos = Phaser.Math.RND.pick(validLocations);

            var pos = { x: GameMath.between(0, this.BOARD_WIDTH), y: GameMath.between(0, this.BOARD_HEIGHT) };

            //  And place it
            this.food.setPosition(pos.x, pos.y);

            return true;
        }
        else {
            return false;
        }
    }
}

module.exports = Game;