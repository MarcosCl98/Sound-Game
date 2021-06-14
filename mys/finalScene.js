class FinalScene extends Phaser.Scene {

    constructor ()
    {
        super('FinalScene');
        this.x = window.innerWidth/2;
        this.y = window.innerHeight/2;
    }

    preload ()
    {
        this.load.image('background', 'mys/assets/background.jpg');
        this.load.image('menu', 'mys/assets/menuButton.png');
    }

    create ()
    {
        this.add.image(this.x, this.y,'background');

        this.clickButton = new TextTitle(this, this.x-190, this.y-210, 'You have completed the game!',
             { fontFamily: 'myFont', fontSize:30, fill: '#ffff00'});
        this.add.existing(this.clickButton);
        
        this.menu = this.add.image(this.x, this.y-60,'menu'), () => this.scene.start('MenuScene');
        this.menu.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('MenuScene'));
        
        var cam  = this.cameras.add(0, 0, this.x*2, this.y*2);    
        cam.setBackgroundColor('0xfffffff');

        this.lights.enable();

        this.lights.addLight(300, 300, 300, 0xff0000, 1);
        this.lights.addLight(400, 300, 300, 0x00ff00, 1);
        this.lights.addLight(600, 500, 300, 0x0000ff, 1);
          
    }
}