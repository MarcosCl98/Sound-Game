class MenuScene extends Phaser.Scene {

    constructor ()
    {
        super('MenuScene');
        this.x = window.innerWidth/2;
        this.y = window.innerHeight/2;
    }

    preload ()
    {
        this.load.image('background', 'mys/assets/background.jpeg');
        this.load.image('demcare', 'mys/assets/demcarelogo.png');
        this.load.image('button1', 'mys/assets/button1.png');
    }

    create ()
    {
        this.add.image(this.x, this.y,'background');
        var logo = this.add.image(this.x, this.y+100,'demcare');
        logo.setScale(0.7,0.7);

        this.clickButton = new TextTitle(this, this.x-220, this.y-210, 'Click the button to start the game!',
             { fontFamily: 'myFont', fontSize:30, fill: '#ffff00'});
        this.add.existing(this.clickButton);
        
        this.button1 = this.add.image(this.x, this.y-80,'button1'), () => this.scene.start('GameScene');
        this.button1.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('GameScene'));

        var cam  = this.cameras.add(0, 0, this.x*2, this.y*2);    
        cam.setBackgroundColor('0xfffffff');

        this.lights.enable();

        this.lights.addLight(300, 300, 300, 0xff0000, 1);
        this.lights.addLight(400, 300, 300, 0x00ff00, 1);
        this.lights.addLight(600, 500, 300, 0x0000ff, 1);
        
       
    }

    
}