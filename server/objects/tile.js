class Tile {
    constructor (x, y) {
        // this.position = {x:x, y:y};
        this.x = x;
        this.y = y;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}

module.exports = Tile;