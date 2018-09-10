class CustomButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, texture, shadow, callback, callback_ctx) {
        super(scene, x, y, [scene.add.sprite(0, 0, shadow[0], shadow[1]), scene.add.sprite(0, -10, texture[0], texture[1])]);
        scene.add.existing(this);

        // Clicking callback
        this.callback = callback;
        this.callback_ctx = callback_ctx;

        // Pointer input callbacks
        this.list[1].setInteractive();
        this.list[1].on('pointerover', this.onPointerOver, this);
        this.list[1].on('pointerout', this.onPointerOut, this);
        this.list[1].on('pointerdown', this.onPointerDown, this);
        this.list[1].on('pointerup', this.onPointerUp, this);

        this.pressing = false;

        // Shadow alpha
        this.list[0].alpha = 0.8;
    }

    onPointerOver(event, gameObjects) {
        this.scene.tweens.add({ targets: this.list[1], y: -15, ease: 'Power1', duration: 300 });
        this.scene.tweens.add({ targets: this.list[0], y: 5, ease: 'Power1', duration: 300 });
    }
    onPointerOut(event, gameObjects) {
        this.pressing = false;
        this.scene.tweens.add({ targets: this.list[1], y: -10, ease: 'Power1', duration: 300 });
        this.scene.tweens.add({ targets: this.list[0], y: 0, ease: 'Power1', duration: 300 });
    }
    onPointerDown(event, gameObjects) {
        this.pressing = true;
        this.scene.tweens.add({ targets: this.list[1], y: -5, ease: 'Power1', duration: 100 });
        this.scene.tweens.add({ targets: this.list[0], y: -5, ease: 'Power1', duration: 100 });
    }
    onPointerUp(event, gameObjects) {
        this.scene.tweens.add({ targets: this.list[1], y: -10, ease: 'Power1', duration: 100 });
        this.scene.tweens.add({ targets: this.list[0], y: 0, ease: 'Power1', duration: 100 });

        if (this.pressing) {
            this.callback.call(this.callback_ctx);
        }
    }
}

export default CustomButton;