var config = {
    type: Phaser.AUTO,
    width: window.innerWidth, 
    height: window.innerHeight,
    parent: 'phaser-example',
    backgroundColor: '#2d2d2d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [ MenuScene , GameScene, FinalScene]
};
var game = new Phaser.Game(config);