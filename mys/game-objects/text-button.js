class TextButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, callback) {
      super(scene, x, y, text, style);
  
      this.style = style;

      var graphics = scene.add.graphics({ x: 0, y: 0, fillStyle: { color: 0xB9CADB, alpha: 0.6 }, lineStyle: { color: 0x00ff00 } });

      this.setInteractive({ useHandCursor: true })
        .on('pointerover', () => this.enterButtonHoverState() )
        .on('pointerout', () => this.enterButtonRestState() )
        .on('pointerdown', () => {this.enterButtonActiveState();callback();} )
        .on('pointerup', () => {
          this.enterButtonHoverState();
          
        });
      /*
      var bounds = this.getBounds();
      graphics.fillRect(bounds.x-2, bounds.y-2, bounds.width+4, bounds.height+4);
      */

    }
  
    enterButtonHoverState() {
      this.setTint(0xff0000);
    }
  
    enterButtonRestState() {
      this.setTint(0xffffff);
    }
  
    enterButtonActiveState() {
      //this.setStyle({ fill: '#0ff' });
    }
  }