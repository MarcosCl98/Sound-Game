class Instrument extends Phaser.GameObjects.Sprite{

    constructor (scene, x, y, texture, image)
      {
        super(scene, x, y, texture);
        this.image = image;
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setInteractive().on('pointerdown', this.onClick.bind(this));
        this.clicked = false;
      }
  
    onClick(piece, pointer, localX, localY, event){
      if(!this.scene.isFreeze()){
        if(this.scene.getSound() == this.getImage()){
          this.setVisible();
          this.scene.correctClick();
        }else{
          this.scene.wrongClick();
        }
      }
    }

    getImage(){
      return this.image;
    }

    setClicked(){
      this.clicked = false;
    }

    setVisible(){
      this.visible = false;
    }

}