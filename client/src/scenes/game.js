// import Snake from '../objects/snake';
// import Food from '../objects/food';

class SceneGame extends Phaser.Scene {
    constructor() {
        super({ key: "SceneGame" });
    }

    create() {
        // console.log("io: ", window.io());
        this.socket = window.io('localhost:3000');
        this.socket.on('connect', (socket) => {
            console.log("Connected!");
        })

        this.imagesGroup = this.add.group();
        console.log(this.imagesGroup);

        var that = this;
        this.socket.on('game_update', (state) => {
            that.onGameUpdate(state);
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    onGameUpdate(state) {
        this.imagesGroup.clear(true, true);
        for (var pos in state) {
            this.imagesGroup.create(state[pos].x * 16, state[pos].y * 16, 'body');
        }
        console.log(this.imagesGroup);
    }

    update(time, delta) {

        if (this.cursors.left.isDown) {
            this.socket.emit('keyboard', 0);
        }
        else if (this.cursors.right.isDown) {
            this.socket.emit('keyboard', 1);
        }
        else if (this.cursors.up.isDown) {
            this.socket.emit('keyboard', 2);
        }
        else if (this.cursors.down.isDown) {
            this.socket.emit('keyboard', 3);
        }
    }

}

export default SceneGame;