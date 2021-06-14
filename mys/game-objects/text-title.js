class TextTitle extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, callback) {
      super(scene, x, y, text, style);
      this.style = style;
      var graphics = scene.add.graphics({ x: 0, y: 0, fillStyle: { color: 0xB9CADB, alpha: 0.6 }, lineStyle: { color: 0x00ff00 } });
    }
  }