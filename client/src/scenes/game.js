class SceneGame extends Phaser.Scene {
    constructor() {
        super({ key: "SceneGame" });
    }

    create() {
        // Analytics
        window.ga('send', 'pageview', 'game');

        // Sprite group for rendering
        this.imagesGroup = this.add.group();
        this.skins = new Array(10);
        this.offsetx = (window.innerWidth / 2.0) - (72 * 9.5);
        this.offsety = (window.innerHeight / 2.0) - (72 * 4.5);
        this.background = this.add.tileSprite(window.innerWidth / 2.0, window.innerHeight / 2.0, 72 * 20, 72 * 10, 'grid');
        console.log(this.imagesGroup);

        // Set camera initial zoom
        this.border_offset = 50;
        var min_zoom = Math.min(window.innerWidth / ((72 * 20) + this.border_offset), window.innerHeight / ((72 * 10) + this.border_offset))
        this.cameras.main.setZoom(min_zoom);

        // Socket.io setup
        //  this.socket = window.io('https://secure-fjord-42060.herokuapp.com/', { query: 'skin=000' + Math.floor(Math.random() * 10).toString() });
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
        });
        this.socket.on('player-died', () => {
            that.onPlayerDied();
        })

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.on("pointerup", this.endSwipe, this);
    }

    endSwipe(e) {
        var swipeTime = e.upTime - e.downTime;
        var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        var swipeNormal = new Phaser.Geom.Point(swipe.x / swipeMagnitude, swipe.y / swipeMagnitude);
        if (swipeMagnitude > 20 && swipeTime < 1000 && (Math.abs(swipeNormal.y) > 0.8 || Math.abs(swipeNormal.x) > 0.8)) {
            if (swipeNormal.x > 0.8) {
                this.socket.emit('keyboard', 3);
            }
            if (swipeNormal.x < -0.8) {
                this.socket.emit('keyboard', 2);
            }
            if (swipeNormal.y > 0.8) {
                this.socket.emit('keyboard', 1);
            }
            if (swipeNormal.y < -0.8) {
                this.socket.emit('keyboard', 0);
            }
        }
    }

    onPlayerDied() {
        this.socket.disconnect();
        this.scene.start('SceneMenu');
    }

    onSkinsUpdate(skins) {
        this.skins = skins;
    }

    onGameUpdate(state) {
        this.imagesGroup.clear(true, true);
        
        // Decompact data
        var data = [];
        var i;
        for (i = 0; i < state.length; i += 1) {
            var c_data = state[i];
            data.push((c_data & (255 << 24)) >> 24);
            data.push((c_data & (255 << 16)) >> 16);
            data.push((c_data & (255 << 8)) >> 8);
            data.push(c_data & (255));
        }

        if (data[1] === 0)
            data.splice(0, 2);

        i = 0;
        while (i < data.length) {
            var poss = data[i + 1];
            var skin = "1000";
            if (data[i] !== 11)
                skin = this.skins[i];
            i += 2;
            for (var j = 0; j < poss; j += 2) {
                this.imagesGroup.create(this.offsetx + data[i + j] * 72, this.offsety + data[i + j + 1] * 72, 'emoji', skin);
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
