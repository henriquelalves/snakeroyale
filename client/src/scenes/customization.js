import CustomButton from '../objects/customButton';

class SceneCustomization extends Phaser.Scene {
    constructor() {
        super({ key: "SceneCustomization" });
    }

    preload() {
        this.load.image('grid', 'assets/grid.png');
    }

    getSkinsRequest(callback)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", 'https://secure-fjord-42060.herokuapp.com/userskin/' + this.registry.get('userID'), true); // true for asynchronous 
        xmlHttp.send(null);
    }

    create() {
        // Analytics
        window.ga('send', 'pageview', 'customization');

        var that = this;

        // Scrolling background
        this.background = this.add.tileSprite(window.innerWidth / 2.0, window.innerHeight / 2.0, window.innerWidth, window.innerHeight, 'grid');
        this.background.tileScaleX = 0.5;
        this.background.tileScaleY = 0.5;

        // GET request for skin
        this.getSkinsRequest(function(skins) {
            console.log("Skins: ", skins);
        })
    }

    update(delta, deltaTime) {
        // Move background diagonally
        this.background.tilePositionX += 100.0 * deltaTime * 0.001;
        this.background.tilePositionY += 100.0 * deltaTime * 0.001;
    }
}

export default SceneCustomization;
