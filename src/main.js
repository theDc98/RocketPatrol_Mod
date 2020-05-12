let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play1, Play2 ],
};

let game = new Phaser.Game(config);

//reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT, keyW, keyA, keyD;

//define Game settings
game.settings = {
    spaceshipSpeed: 3,
    bonusSpeed: 5,
    gameTimer: 60000
}