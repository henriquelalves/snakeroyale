const Snake = require('./objects/snake');
const Food = require('./objects/food');

class Game {
    constructor() {
        this.snakes = new Array(10);
        this.snakes.fill(null);
        console.log(this.snakes);
        this.number_players = 0;
        this.food = new Food(3, 4);
    }

    createPlayer() {
        // Check if there is a maximum number of players
        if (this.number_players === 10)
            return -1

        // First open player slot
        var i;
        for (i = 0; i < this.snakes.length; i++) {
            if (this.snakes[i] === null)
                break
        }

        this.snakes[i] = new Snake(8, 8);
        this.number_players += 1;
        return i;
    }

    removePlayer(player) {
        this.number_players -= 1;
        delete this.snakes[player];
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
        var data = [];
        this.snakes.forEach((snake) => {
            if (snake === null)
                return;
            data = data.concat(snake.getPosData());
        })
        data = data.concat(this.food.getPosData());
        return data;
    }

    update() {
        this.snakes.forEach((snake) => {
            if (snake === null)
                return;
            snake.update();
            if (snake.collideWithFood(this.food)) {
                this.repositionFood();
            }
        });
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
            var pos = { x: 10, y: 10 };

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