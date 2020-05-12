class Play2 extends Phaser.Scene{
    constructor(){
        super("play2Scene");
    }

    preload(){
        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});

        //load images/title sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
    }

    create(){
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        //white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        //add rocket (p1)
        this.p1Rocket = new Rocket1(this, game.config.width/2-30, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);
        this.p2Rocket = new Rocket2(this, game.config.width/2+30, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        //add spaceship (x4)
        this.ship01 = new Spaceship(this, game.config.width +192, 132, 'spaceship', 0, 50).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width +95, 185, 'spaceship', 0, 40).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 255, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship04 = new Bonus(this, game.config.width, Phaser.Math.Between(110, 240), 'spaceship', 0, 100).setScale(0.5).setOrigin(0, 0);
        
        //define keyboard keys for P1
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        //define keyboard keys for P2
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        //score
        this.p1Score = 0;
        this.p2Score = 0;

        //score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '22px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        
        this.score1 = this.add.text(69, 42, this.p1Score, scoreConfig);
        this.score2 = this.add.text(69, 72, this.p2Score, scoreConfig);

        //Game flag 
        this.gameOver = false;

        //Game time: 60s
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(60000, () => {
            this.add.text(game.config.width/2, game.config.height/2 - 20, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

    }
 
    update(){

        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.restart(this.p1Score);
            //this.scene.restart(this.p2Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start("menuScene");
        }

        //scroll starfield
        this.starfield.tilePositionX -= 4;  //horizontal
        this.starfield.tilePositionY -= 4;  //vertical

        if(!this.gameOver){
            //update rocket
            this.p1Rocket.update(); 
            this.p2Rocket.update();

            //update spaceship*4
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        //check collisions p1
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode1(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode1(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset(); 
            this.shipExplode1(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.ship04)){
            this.p1Rocket.reset();
            this.shipExplode1(this.ship04);
        }
        //check collision p2
        if(this.checkCollision(this.p2Rocket, this.ship03)){
            this.p2Rocket.reset();
            this.shipExplode2(this.ship03);
        }
        if(this.checkCollision(this.p2Rocket, this.ship02)){
            this.p2Rocket.reset();
            this.shipExplode2(this.ship02);
        }
        if(this.checkCollision(this.p2Rocket, this.ship01)){
            this.p2Rocket.reset(); 
            this.shipExplode2(this.ship01);
        }
        if(this.checkCollision(this.p2Rocket, this.ship04)){
            this.p2Rocket.reset();
            this.shipExplode2(this.ship04);
        }

        //explosion animation
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0 }),
            frameRate: 30
        });
    }

    checkCollision(rocket, ship){
        //simple AABB checking
        if(rocket.x < ship.x + ship.width &&
           rocket.x + rocket.width > ship.x &&
           rocket.y < ship.y + ship.height &&
           rocket.height + rocket.y > ship.y){
               return true;
        }else{
            return false;
        }
    }

    shipExplode1(ship){
        ship.alpha = 0;                          //temporarily hide ship
        //create explosion sprite at ship position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             //play explode animation
        boom.on('animationcomplete', () => {    //callback after animation completes
            ship.reset();                       //reset ship position
            ship.alpha = 1;                      //make ship visible again
            boom.destroy();                     //remove explosion sprite
        });
        //score imcrement and repaint
        this.p1Score += ship.points;
        this.score1.text = this.p1Score;

        //collision sound
        this.sound.play('sfx_explosion');
    }

    shipExplode2(ship){
        ship.alpha = 0;                          //temporarily hide ship
        //create explosion sprite at ship position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             //play explode animation
        boom.on('animationcomplete', () => {    //callback after animation completes
            ship.reset();                       //reset ship position
            ship.alpha = 1;                      //make ship visible again
            boom.destroy();                     //remove explosion sprite
        });
        //score imcrement and repaint
        this.p2Score += ship.points;
        this.score2.text = this.p2Score;

        //collision sound
        this.sound.play('sfx_explosion');
    }

}
