const Tile = require('./tile')

class Food extends Tile {
    constructor(x, y) {
        super(x, y);
        this.total = 0;
    }

    getPosData() {
        return [this.x, this.y];
    }

    eat() {
        this.total++;
    }
}

module.exports = Food;