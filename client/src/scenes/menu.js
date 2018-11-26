import CustomButton from '../objects/customButton';

class SceneMenu extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMenu" });
    }

    preload() {
        this.load.image('grid', 'assets/grid.png');
    }

    create() {
        // Analytics
        window.ga('send', 'pageview', 'menu');

        var that = this;

        // Facebook login variable TODO: Should be global!
        this.fb_is_logged_in = false;
        window.FB.getLoginStatus(function (response) {
            if (response.status === "connected") {
                that.fb_is_logged_in = true;
            }
        })

        // Scrolling background
        this.background = this.add.tileSprite(window.innerWidth / 2.0, window.innerHeight / 2.0, window.innerWidth, window.innerHeight, 'grid');
        this.background.tileScaleX = 0.5;
        this.background.tileScaleY = 0.5;

        // Buttons
        this.playButton = new CustomButton(this, window.innerWidth * 0.5, window.innerHeight * 0.4, ['menu', 'play_button'], ['menu', 'button_shadow'], this.onPlayButton, this);
        this.playButton.setScale((window.innerWidth * 0.4) / this.playButton.list[0].width)
        this.statisticsButton = new CustomButton(this, window.innerWidth * 0.5, window.innerHeight * 0.6, ['menu', 'statistics_button'], ['menu', 'button_shadow'], this.onStatisticsButton, this);
        this.statisticsButton.setScale((window.innerWidth * 0.4) / this.playButton.list[0].width)
        this.customizeButton = new CustomButton(this, window.innerWidth * 0.5, window.innerHeight * 0.8, ['menu', 'customize_button'], ['menu', 'button_shadow'], this.onCustomizeButton, this);
        this.customizeButton.setScale((window.innerWidth * 0.4) / this.playButton.list[0].width)
        this.logoutButton = new CustomButton(this, window.innerWidth * 0.85, window.innerHeight * 0.95, ['menu', 'logout_button'], ['menu', 'button_shadow'], this.onLogoutButton, this);
        this.logoutButton.setScale((window.innerWidth * 0.2) / this.playButton.list[0].width);

        // Facebook popup
        this.fb_panel = this.add.sprite(window.innerWidth * 0.5, window.innerHeight * 0.5, 'menu', 'facebook_panel');
        var min_scale = Math.min((window.innerWidth * 0.9) / this.fb_panel.width, (window.innerHeight * 0.9) / this.fb_panel.height);
        this.fb_panel.setScale(min_scale);

        this.ohyeah = new CustomButton(this, (window.innerWidth * 0.5) + this.fb_panel.width * min_scale * 0.25, (window.innerHeight * 0.5) + (this.fb_panel.height * min_scale * 0.35), ['menu', 'ohyeah_button'], ['menu', 'button_shadow'], this.onFbAccept, this);
        this.ohyeah.setScale((this.fb_panel.width * min_scale * 0.4) / this.ohyeah.list[0].width);

        this.nah = new CustomButton(this, (window.innerWidth * 0.5) - this.fb_panel.width * min_scale * 0.25, (window.innerHeight * 0.5) + (this.fb_panel.height * min_scale * 0.35), ['menu', 'nah_button'], ['menu', 'button_shadow'], this.onFbReject, this);
        this.nah.setScale((this.fb_panel.width * min_scale * 0.4) / this.nah.list[0].width);

        this.fb_popup = this.add.container(0, 0, [this.fb_panel, this.ohyeah, this.nah]);
        this.fb_popup.alpha = 0.0;
        this.fb_popup.x = window.innerWidth;
    }

    popup() {
        this.fb_popup.x = 0;
        this.tweens.add({ targets: this.fb_popup, alpha: 1.0, ease: 'Power1', duration: 300 });
    }

    popdown() {
        var that = this.fb_popup;
        this.tweens.add({ targets: this.fb_popup, alpha: 0.0, ease: 'Power1', duration: 300, onComplete: function () { that.x = window.innerWidth; } });
    }

    onFbAccept() {
        var that = this;

        window.ga('send', 'event', 'Menu', 'FacebookAcceptButton');
        window.FB.login(function(response) {
            console.log(response);
            that.registry.set('userID', response.authResponse.userID);
        });
        console.log('User id: ', this.registry.get('userID'));
        
        // TODO needs facebook callback
        this.popdown();
        this.fb_is_logged_in = true;
    }

    onFbReject() {
        window.ga('send', 'event', 'Menu', 'FacebookRejectButton');
        this.popdown();
    }

    onPlayButton() {
        window.ga('send', 'event', 'Menu', 'PlayButton');
        this.scene.start('SceneGame');
    }

    onStatisticsButton() {
        window.ga('send', 'event', 'Menu', 'StatisticsButton');

        if (this.fb_is_logged_in === false) {
            this.popup();
        } else {
            // do something
        }

        // console.log("Statistics clicked");
        // window.FB.getLoginStatus(function (response) {
        //     console.log(response);
        //     window.FB.login();
        // });
    }

    onCustomizeButton() {
        window.ga('send', 'event', 'Menu', 'CustomizeButton');

        if (this.fb_is_logged_in === false) {
            this.popup();
        } else {
            this.scene.start('SceneCustomization');
        }

        // console.log("Customized clicked");
        // window.FB.logout(function (response) {
        //     console.log("byebye");
        // });
    }

    onLogoutButton() {
        window.FB.logout(function (response) {
            console.log("byebye");
        });
        this.fb_is_logged_in = false;
    }

    update(delta, deltaTime) {
        // Move background diagonally
        this.background.tilePositionX += 100.0 * deltaTime * 0.001;
        this.background.tilePositionY += 100.0 * deltaTime * 0.001;
    }
}

export default SceneMenu;
