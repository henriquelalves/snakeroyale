const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

class Food extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene);
        this.scene = scene;

        this.setTexture('food');
        this.setPosition(x * 16, y * 16);
        this.setOrigin(0);

        this.total = 0;

        this.scene.children.add(this);
    }

    eat() {
        this.total++;
    }
}

class Snake {
    constructor(scene, x, y) {
        // super(scene);
        console.log("NEW");
        this.scene = scene;

        this.headPosition = new Phaser.Geom.Point(x, y);

        this.body = this.scene.add.group();

        this.head = this.body.create(x * 16, y * 16, 'body');
        this.head.setOrigin(0);

        this.alive = true;

        this.speed = 100;

        this.moveTime = 0;

        this.tail = new Phaser.Geom.Point(x, y);

        this.heading = RIGHT;
        this.direction = RIGHT;
    }

    update(time) {
        if (time >= this.moveTime) {
            return this.move(time);
        }
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

    move(time) {
        switch (this.heading) {
            case LEFT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                break;

            case RIGHT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                break;

            case UP:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                break;

            case DOWN:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                break;
        }

        this.direction = this.heading;

        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

        var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

        if (hitBody) {
            console.log('dead');

            this.alive = false;

            return false;
        }
        else {
            this.moveTime = time + this.speed;
            return true;
        }
    }

    grow() {
        var newPart = this.body.create(this.tail.x, this.tail.y, 'body');
        newPart.setOrigin(0);
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
        this.body.children.each(function (segment) {

            var bx = segment.x / 16;
            var by = segment.y / 16;

            grid[by][bx] = false;

        });

        return grid;
    }
}

class SceneGame extends Phaser.Scene {
    constructor() {
        super({ key: "SceneGame" });
    }
    preload() {
        this.load.image('food', 'assets/food.png');
        this.load.image('body', 'assets/body.png');
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