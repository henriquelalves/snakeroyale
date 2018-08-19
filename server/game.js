import Snake from '../objects/snake';
import Food from '../objects/food';

class SceneGame extends Phaser.Scene {
    constructor() {
        super({ key: "SceneGame" });
    }
    
    create() {
        console.log("game");

        this.snake = new Snake(this, 8, 8);
        this.food = new Food(this, 3, 4);
        this.cursors = this.input.keyboard.createCursorKeys();
        console.log(this.snake);
    }

    update(time, delta) {
        if (!this.snake.alive) {
            return;
        }

        if (this.cursors.left.isDown) {
            this.snake.faceLeft();
        }
        else if (this.cursors.right.isDown) {
            this.snake.faceRight();
        }
        else if (this.cursors.up.isDown) {
            this.snake.faceUp();
        }
        else if (this.cursors.down.isDown) {
            this.snake.faceDown();
        }

        if (this.snake.update(time)) {
            //  If the snake updated, we need to check for collision against food

            if (this.snake.collideWithFood(this.food)) {
                this.repositionFood();
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

        this.snake.updateGrid(testGrid);

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
            var pos = Phaser.Math.RND.pick(validLocations);

            //  And place it
            this.food.setPosition(pos.x * 16, pos.y * 16);

            return true;
        }
        else {
            return false;
        }
    }
}

export default SceneGame;