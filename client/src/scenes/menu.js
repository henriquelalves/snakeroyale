import CustomButtom from '../objects/customButton';
import CustomButton from '../objects/customButton';

class SceneMenu extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMenu" });
    }

    preload() {
        this.load.image('grid', 'assets/grid.png');
    }

    create() {
        // this.scene.start('SceneGame');
        console.log("Menu");
        
        // Scrolling background
        this.background = this.add.tileSprite(window.innerWidth/2.0, window.innerHeight/2.0, window.innerWidth, window.innerHeight, 'grid');
        this.background.tileScaleX = 0.5;
        this.background.tileScaleY = 0.5;

        // Buttons
        this.playButton = new CustomButton(this, window.innerWidth*0.5, window.innerHeight*0.4, ['menu', 'play_button'], ['menu', 'button_shadow'], this.onPlayButton, this);
        this.playButton.setScale((window.innerWidth*0.4)/this.playButton.list[0].width)
        this.statisticsButton = new CustomButton(this, window.innerWidth*0.5, window.innerHeight*0.6, ['menu', 'statistics_button'], ['menu', 'button_shadow'], this.onStatisticsButton, this);
        this.statisticsButton.setScale((window.innerWidth*0.4)/this.playButton.list[0].width)
        this.customizeButton = new CustomButton(this, window.innerWidth*0.5, window.innerHeight*0.8, ['menu', 'customize_button'], ['menu', 'button_shadow'], this.onCustomizeButton, this);
        this.customizeButton.setScale((window.innerWidth*0.4)/this.playButton.list[0].width)
    }

    onPlayButton() {
        console.log(this);
        this.scene.start('SceneGame');
    }

    onStatisticsButton() {
        console.log("Statistics clicked");
    }

    onCustomizeButton() {
        console.log("Customized clicked");
    }

    update(delta, deltaTime) {
        // Move background diagonally
        this.background.tilePositionX += 100.0 * deltaTime * 0.001;
        this.background.tilePositionY += 100.0 * deltaTime * 0.001;
    }
}

export default SceneMenu;
