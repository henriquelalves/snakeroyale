class SceneBoot extends Phaser.Scene {
    constructor() {
        super({ key: "SceneBoot" });
    }

    preload() {
        // Should load loading screen sprite
    }

    create() {
        // Analytics
        window.ga('send', 'pageview', 'boot');

        this.scene.start("ScenePreload");
    }
}

export default SceneBoot;