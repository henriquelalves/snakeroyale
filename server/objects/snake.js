const Tile = require('./tile');

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

class Snake {
    constructor(game, x, y, direction) {

        this.game = game;
        this.body = [new Tile(x - 1, y)]; // Group of tiles
        this.head = new Tile(x, y);
        this.tail = new Tile(x - 1, y);

        this.alive = true;
        this.speed = 100;
        this.moveTime = 0;

        this.heading = direction;
        this.direction = direction;
    }

    getPosData() {
        var data = [];
        for (var i = 0; i < this.body.length; i++) {
            data = data.concat([this.body[i].x, this.body[i].y]);
        }
        data = data.concat([this.head.x, this.head.y]);
        console.log("Snake: ", data);
        return data;
    }

    update() {
        this.move();
    }

    faceLeft() {
        if (this.direction === UP || this.direction === DOWN) {
            this.heading = LEFT;
        }
    }

    faceRight() {
        if (this.direction === UP || this.direction === DOWN) {
            this.heading = RIGHT;
        }
    }

    faceUp() {
        if (this.direction === LEFT || this.direction === RIGHT) {
            this.heading = UP;
        }
    }

    faceDown() {
        if (this.direction === LEFT || this.direction === RIGHT) {
            this.heading = DOWN;
        }
    }

    move() {
        this.shiftPosition();

        switch (this.heading) {

            case LEFT:
                // this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                this.head.x -= 1;
                break;

            case RIGHT:
                // this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                this.head.x += 1;
                break;

            case UP:
                // this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                this.head.y -= 1;
                break;

            case DOWN:
                // this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                this.head.y += 1;
                break;
        }

        this.direction = this.heading;

        // Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

        // var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);
        var hitBody = this.hasBodyHeadCollided();

        // if (hitBody) {
        //     console.log('dead');

        //     this.alive = false;

        //     return false;
        // }
        // else {
        //     return true;
        // }
    }

    hasBodyHeadCollided() {
        for (var i = 0; i < this.body.length; i++) {
            if (this.body[i].x == this.head.x && this.body[i].y == this.head.y) {
                return true;
            }
        }
        return false;
    }

    shiftPosition() {
        this.tail.setPosition(this.body[this.body.length - 1].x, this.body[this.body.length - 1].y);

        for (var i = this.body.length - 1; i >= 0; i--) {
            if (i > 0) {
                this.body[i].setPosition(this.body[i - 1].x, this.body[i - 1].y);
            } else {
                this.body[i].setPosition(this.head.x, this.head.y);
            }
        }
    }

    grow() {
        var newPart = new Tile(this.tail.x, this.tail.y);
        this.body.push(newPart);
    }

    collideWithFood(food) {
        if (this.head.x === food.x && this.head.y === food.y) {
            this.grow();

            food.eat();

            //  For every 5 items of food eaten we'll increase the snake speed a little
            if (this.speed > 20 && food.total % 5 === 0) {
                this.speed -= 5;
            }

            return true;
        }
        else {
            return false;
        }
    }

    updateGrid(grid) {
        //  Remove all body pieces from valid positions list
        for (var i = 0; i < this.body.length; i++) {
            grid[this.body[i].y][this.body[i].x] = false;
        }
        return grid;
    }
}

module.exports = Snake;