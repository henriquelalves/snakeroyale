class ScenePreload extends Phaser.Scene {
    constructor() {
        super({ key: "ScenePreload" });
    }

    preload() {

        this.load.atlas('emoji', 'assets/emoji_atlas.png', 'assets/emoji_atlas.json');
        this.load.atlas('menu', 'assets/menu_atlas.png', 'assets/menu_atlas.json');
        this.load.image('body', 'assets/body.png');
        this.load.image('food', 'assets/food.png');

        // let assets_json = this.cache.json.get('assetsData');
        // this.loadResources(assets_json);
    }

    create() {
        // Analytics
        window.ga('send', 'pageview', 'preload');

        this.scene.start('SceneMenu');
    }
}

export default ScenePreload;