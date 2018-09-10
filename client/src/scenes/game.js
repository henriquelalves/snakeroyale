// import Snake from '../objects/snake';
// import Food from '../objects/food';

class SceneGame extends Phaser.Scene {
    constructor() {
        super({ key: "SceneGame" });
    }

    create() {
        // this.socket = window.io('https://secure-fjord-42060.herokuapp.com/');

        // Sprite group for rendering
        this.imagesGroup = this.add.group();
        this.skins = new Array(10);
        console.log(this.imagesGroup);

        // Socket.io setup
        this.socket = window.io('localhost:3000', { query: 'skin=000' + Math.floor(Math.random() * 10).toString() });
        this.socket.on('connect', (socket) => {
            console.log("Connected!");
        })

        var that = this;
        this.socket.on('game-update', (state) => {
            that.onGameUpdate(state);
        });
        this.socket.on('player-skins', (skins) => {
            that.onSkinsUpdate(skins);
        })

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    onSkinsUpdate(skins) {
        this.skins = skins;
    }

    onGameUpdate(state) {
        this.imagesGroup.clear(true, true);
        // console.log(state);
        var i = 0;
        while (i < state.length) {
            var poss = state[i + 1];
            var skin = "1000";
            if (state[i] !== -1)
                var skin = this.skins[i];
            i += 2;
            for (var j = 0; j < poss; j += 2) {
                this.imagesGroup.create(state[i + j] * 72, state[i + j + 1] * 72, 'emoji', skin);
            }
            i += j;
        }
    }

    update(time, delta) {

        if (this.cursors.up.isDown) {
            this.socket.emit('keyboard', 0);
        }
        else if (this.cursors.down.isDown) {
            this.socket.emit('keyboard', 1);
        }
        else if (this.cursors.left.isDown) {
            this.socket.emit('keyboard', 2);
        }
        else if (this.cursors.right.isDown) {
            this.socket.emit('keyboard', 3);
        }
    }

}

export default SceneGame;
