class SceneBoot extends Phaser.Scene {
    constructor () {
        super({key: "SceneBoot"});
    }

    create () {
        console.log(this.scene);
        this.scene.start("ScenePreload");
    }
}

export default SceneBoot;