class GameScene extends Phaser.Scene {

    constructor ()
    {
        super('GameScene');
        this.x = window.innerWidth/2;
        this.y = window.innerHeight/2;
        this.freeze = false;
        this.numWrongClicks = 0;
        this.posiciones = [new Position(-300,0), new Position(-150,0),new Position(0,0),new Position(150,0),new Position(300,0),
            new Position(-300,-120),new Position(-150,-120),new Position(0,-120),new Position(150,-120),new Position(300,-120)];
        this.player1text;
        this.numCorrectsPlayer1 = 1;

        this.board = [
            {image:'1',sprite:'instrument1',image:'guitar'},
            {image:'2',sprite:'instrument2',image:'piano'},
            {image:'3',sprite:'instrument3',image:'flute'},
            {image:'4',sprite:'instrument4',image:'fiddle'},
            {image:'5',sprite:'instrument5',image:'trumpet'},
            {image:'6',sprite:'instrument6',image:'drums'},
            {image:'7',sprite:'instrument7',image:'accordion'},
            {image:'8',sprite:'instrument8',image:'harp'},
            {image:'9',sprite:'instrument9',image:'maracas'},
            {image:'10',sprite:'instrument10',image:'tambourine'}
        ];    

        this.boardSound = [ new Sound('guitar'), new Sound('piano'),new Sound('accordion'),new Sound('drums'),new Sound('fiddle'),
                                new Sound('flute'),new Sound('harp'),new Sound('maracas'),new Sound('tambourine'),new Sound('trumpet')]
    }

    preload ()
    {
        this.load.image('background', 'mys/assets/background.jpeg');

        this.load.spritesheet('instrument1', 'mys/assets/guitar.jpg',
        { frameWidth: 150, frameHeight: 150 }  );

        this.load.spritesheet('instrument2', 'mys/assets/piano.jpg',
        { frameWidth: 150, frameHeight: 150 }  );
        
        this.load.spritesheet('instrument3', 'mys/assets/flute.jpg',
        { frameWidth: 150, frameHeight: 150 }   );
         
        this.load.spritesheet('instrument4', 'mys/assets/fiddle.jpg',
        { frameWidth: 150, frameHeight: 150 }   );
      
        this.load.spritesheet('instrument5', 'mys/assets/trumpet.jpg',
        { frameWidth: 150, frameHeight: 150 }   );

        this.load.spritesheet('instrument6', 'mys/assets/drums.png',
        { frameWidth: 150, frameHeight: 150 }  );
        
        this.load.spritesheet('instrument7', 'mys/assets/accordion.jpg',
        { frameWidth: 150, frameHeight: 150 }   );
         
        this.load.spritesheet('instrument8', 'mys/assets/harp.jpg',
        { frameWidth: 150, frameHeight: 150 }   );
      
        this.load.spritesheet('instrument9', 'mys/assets/maracas.jpg',
        { frameWidth: 150, frameHeight: 150 }   );

        this.load.spritesheet('instrument10', 'mys/assets/tambourine.jpeg',
        { frameWidth: 150, frameHeight: 150 }  );

        this.load.image('playButton', 'mys/assets/play.png');

        this.load.image('stopButton', 'mys/assets/stop.png');
      
        this.load.audio("guitar","mys/assets/sound/guitar.mp3");

        this.load.audio("piano","mys/assets/sound/piano.mp3")

        this.load.audio("accordion","mys/assets/sound/accordion.mp3")

        this.load.audio("drums","mys/assets/sound/drums.mp3")

        this.load.audio("fiddle","mys/assets/sound/fiddle.mp3")

        this.load.audio("flute","mys/assets/sound/flute.mp3")

        this.load.audio("harp","mys/assets/sound/harp.mp3")

        this.load.audio("maracas","mys/assets/sound/maracas.mp3")

        this.load.audio("tambourine","mys/assets/sound/tambourine.mp3")

        this.load.audio("trumpet","mys/assets/sound/trumpet.mp3")

        //Emojis
        this.load.image('sad', 'mys/assets/sad.png');
        this.load.image('smile', 'mys/assets/smile.png');
    }

    create ()
    {
        initTracking ('gameScene')
        this.add.image(this.x, this.y,'background');

        this.emojiSad = this.add.image(this.x, this.y-250,'sad');
        this.emojiSmile = this.add.image(this.x, this.y-250,'smile');
        this.emojiSad.setVisible(false);
        this.emojiSmile.setVisible(false);

        var cam  = this.cameras.add(0, 0, this.x*2, this.y*2);    
        cam.setBackgroundColor('0x000000');

        this.checkPreviousGame(this.posiciones.length);

        this.instruments = [];

        this.createLevel();

        this.createText();
  }

    update()
    {   
        
    }

    //Clicks
    correctClick(){
        this.numCorrectsPlayer1++
        if(this.numCorrectsPlayer1 == 11){
            this.winnerText.visible=true;
            this.emojiSmile.setVisible(true);
            setTimeout(() => {this.emojiSmile.setVisible(false), this.freeze = false;}, 1500);
            this.player1text.setText("Round:" + + this.numCorrectsPlayer1 );
            this.soundInstrument.stop();
            setTimeout(() => { this.scene.start('FinalScene'), finishTracking(window.location.href, 'Sound Game', 12,this.numWrongClicks)}, 1500);
        }else{
            this.freeze = true;
            this.emojiSmile.setVisible(true);
            setTimeout(() => {this.emojiSmile.setVisible(false), this.freeze = false;}, 1500);
            this.player1text.setText("Round:" + + this.numCorrectsPlayer1 );
            this.soundInstrument.stop();
            this.soundInstrument = this.getRandomSound();
        }
    }

    wrongClick(){
        this.numWrongClicks++;
        this.freeze = true;
        this.emojiSad.setVisible(true);
        setTimeout(() => {this.emojiSad.setVisible(false), this.freeze = false;}, 1500);
    }

    //Getters
    getRandomPosition(max,min) {
        return Math.round(Math.random() * (max - min) + min);
    }

    getSound(){
        return this.soundInstrument.key;
    }

    getRandomSound(){
        var posicion = this.getRandomPosition(this.boardSound.length-1,0)
        var name = this.boardSound[posicion].getSound()
        var sound = this.sound.add(name);
        this.boardSound.splice(posicion, 1)
        return sound;
        
    }

    isFreeze(){
        return this.freeze;
    }

    //Check
    checkPreviousGame(length){
        if(length == 0){
            this.numWrongClicks = 0;
            this.posiciones = [new Position(-300,0), new Position(-150,0),new Position(0,0),new Position(150,0),new Position(300,0),
                new Position(-300,-120),new Position(-150,-120),new Position(0,-120),new Position(150,-120),new Position(300,-120)];
            this.numCorrectsPlayer1 = 1;
            this.freeze = false;
            this.boardSound = [ new Sound('guitar'), new Sound('piano'),new Sound('accordion'),new Sound('drums'),new Sound('fiddle'),
                                new Sound('flute'),new Sound('harp'),new Sound('maracas'),new Sound('tambourine'),new Sound('trumpet')]
        }
    }

    //Creates
    createText(){
        this.player1text = this.add.text(this.x-350, this.y-270);
        this.player1text.setStyle({ fontFamily: 'myFont', fontSize:30, fill: '#FFFFFF'});
        this.player1text.setText('Round: '+ this.numCorrectsPlayer1);
        this.player1text.visible=true;

        this.winnerText = this.add.text(this.x-170, this.y-120);
        this.winnerText.setStyle({ fontFamily: 'myFont', fontSize:30, fill: '#ffff00'});
        this.winnerText.visible=false;

        this.playText = this.add.text(this.x-95, this.y+160);
        this.playText.setStyle({ fontFamily: 'myFont', fontSize:20, fill: '#FFFFFF'});
        this.playText.setText("play")
        this.playText.visible=true;

        this.stopText = this.add.text(this.x+60, this.y+160);
        this.stopText.setStyle({ fontFamily: 'myFont', fontSize:20, fill: '#FFFFFF'});
        this.stopText.setText("stop")
        this.stopText.visible=true;

        this.clickButton = new TextButton(this, this.x-220, this.y-50, 'Click here to return to the menu !',
             { fontFamily: 'myFont', fontSize:30, fill: '#ffff00'}, () => this.scene.start('SceneMenu'));
        this.add.existing(this.clickButton);
        this.clickButton.visible=false;
    }

    createLevel(){
        this.board.forEach(element => {
            var posicion = this.getRandomPosition(this.posiciones.length-1,0)
            var xinstrument = this.posiciones[posicion];
            var instrument = new Instrument ( this, xinstrument.getX()+this.x, xinstrument.getY()+this.y, element["sprite"], element["image"]);
            this.posiciones.splice(posicion, 1)
            this.instruments.push( instrument );
        });

        this.soundInstrument = this.getRandomSound();
        
        this.playButton = this.add.image(this.x-80, this.y+120,'playButton'), () => this.soundInstrument.play({
            volume: .3,
            loop: false
          });
        this.playButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.soundInstrument.play({
            volume: .3,
            loop: false
          }));

        this.stopButton = this.add.image(this.x+80, this.y+120,'stopButton'), () => this.soundInstrument.stop();
        this.stopButton.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.soundInstrument.stop());
    }
    
}