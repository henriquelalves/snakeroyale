import 'phaser';
import SceneBoot from './scenes/boot';
import ScenePreload from './scenes/preload';
import SceneMenu from './scenes/menu';
import SceneGame from './scenes/game';
import SceneCustomization from './scenes/customization';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#ffbb22",
    scene: [SceneBoot, ScenePreload, SceneMenu, SceneGame, SceneCustomization]
};

var game = new Phaser.Game(config);
