//Bonus prefabs
class Bonus extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame)

        scene.add.existing(this);  //add object to existing, displayList, updateList
        this.points = pointValue;
    }

    update(){
        //move spaceship left
        this.x -= game.settings.bonusSpeed;
        //wraparound screen bounds
        if(this.x <= 0 - this.width){
            this.x = game.config.width;
            this.y = Phaser.Math.Between(110, 240);
        }
    }   
    
    //reset spaceship
    reset(){
        this.x = game.config.width;
        this.y = Phaser.Math.Between(110, 240);
    }
}