class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }

    preload(){
        //load Audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create(){
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX, centerY-textSpacer*1.5, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY+textSpacer*1.5, 'Move Mouse to move & Click Mouse to Fire', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY+textSpacer*2, 'Use <- -> & A/D to move Rocket For 2-Player Mod', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY+textSpacer*2.5, '(F) & (W) to Fire For 2-Player Mod', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY+textSpacer, 'Press <- for Single or -> for Double', menuConfig).setOrigin(0.5);
        
        this.add.text(20, 20, "Roecket Patrol Menu");

        // launch the next scene
        //this.scene.start("playScene");

         //define keyboard keys
         keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
         keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update(){
        //easy mode
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
            game.settings = {
                spaceshipSpeed: 3,
                bonusSpeed: 5.5,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start("play1Scene");
        }
        //hard mode
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            game.settings = {
                spaceshipSpeed: 3,
                bonusSpeed: 5.5,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start("play2Scene");
        }
    }

}