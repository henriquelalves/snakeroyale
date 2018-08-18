class ScenePreload extends Phaser.Scene {
    constructor() {
        super({ key: "ScenePreload" });
    }

    preload() {
        let assets_json = this.cache.json.get('assetsData');
        this.loadResources(assets_json);
    }

    create() {
        this.scene.start('SceneMenu');
    }

    loadResources(f) {
        for (let i = 0; i < f.children.length; i += 1) {
            let child = f.children[i];
            // console.log(child);
            if (child.type == 'folder') {
                this.loadResources(child)
            } else {
                let name = child.name.slice(0, -4);
                let suffix = child.name.slice(-3);
                if (suffix == 'png') {
                    this.load.image(name, child.path);
                    // if (name.search("spritesheet") === 0) {
                    //     let sub1 = 11;
                    //     let sub2 = name.search("x");
                    //     let sub3 = name.search("_");
                    //     let width = parseInt(name.substring(sub1, sub2));
                    //     let height = parseInt(name.substring(sub2 + 1, sub3));
                    //     let key = name.substring(sub3 + 1);
                    //     this.game.load.spritesheet(key, child.path, width, height);
                    // }
                    // else {
                    //     this.game.load.image(name, child.path);
                    // }
                }
            }
        }
    }
}

export default ScenePreload;