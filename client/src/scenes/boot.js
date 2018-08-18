class SceneBoot extends Phaser.Scene {
    constructor() {
        super({ key: "SceneBoot" });
    }

    preload() {
        this.load.json('assetsData', 'assets.json');
    }

    create() {
        console.log(this.scene);
        this.scene.start("ScenePreload");
    }
}

export default SceneBoot;