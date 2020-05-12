class Play1 extends Phaser.Scene{
    constructor(){
        super("play1Scene");
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
        this.p1Rocket = new Rocket1(this, game.config.width/2, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        //add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width +192, 132, 'spaceship', 0, 60).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width +95, 185, 'spaceship', 0, 45).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, 255, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship04 = new Bonus(this, game.config.width, Phaser.Math.Between(110, 240), 'spaceship', 0, 100).setScale(0.5).setOrigin(0, 0);
        
        //define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        //keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //mouse control the rocket to move and fire
        this.input.on('pointermove', function(pointer){
            this.input.mouse.requestPointerLock();
            if(this.p1Rocket.x >= 47 || this.p1Rocket.x <= 598){
                if(!this.p1Rocket.isFiring && !this.gameOver && this.input.mouse.locked){
                    this.p1Rocket.x += pointer.movementX;
                    this.p1Rocket.x = Phaser.Math.Wrap(this.p1Rocket.x, 0, game.renderer.width);
                }
            }
            if(!this.gameOver && !this.isFiring && pointer.leftButtonDown()){
                this.p1Rocket.isFiring = true;
                this.p1Rocket.sfxRocket.play();
            }
        }, this);

        //unlock the mouse
        this.input.keyboard.on('keydown_Q', function(event){
            if(this.input.mouse.locked){
                this.input.mouse.releasePointerLock();
            }
        }, this);



        //score
        this.p1Score = 0;
        //score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

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
            //update spaceship*3
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset(); 
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.ship04)){
            this.p1Rocket.reset(); 
            this.shipExplode(this.ship04);
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

    shipExplode(ship){
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
        this.scoreLeft.text = this.p1Score;

        //collision sound
        this.sound.play('sfx_explosion');
    }

}
