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

        this.cursors = this.input.keyboard.createCursorKeys();
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