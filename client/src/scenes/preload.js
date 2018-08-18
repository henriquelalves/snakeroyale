class ScenePreload extends Phaser.Scene {
    constructor () {
        super({key: "ScenePreload"});
    }

    create () {
        this.scene.start('SceneMenu');
    }
}

export default ScenePreload;