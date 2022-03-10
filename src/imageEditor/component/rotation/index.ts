import { Graphics } from '../../graphics';
import { calculateCanvasSizeByImage } from '../../utils';
import { BaseComponent } from "..";

export class Rotation extends BaseComponent {
  constructor(graphics: Graphics) {
    super('FLIP', graphics);
  }

  rotate(angle: number, saveCanvasStatus?: boolean) {
    let newAngle = ((this.image.angle || 0) + angle) % 360;
    if (newAngle < 0) newAngle += 360;
    this.image.centeredRotation = true;
    this.image.centeredScaling = true;
    this.calcImageSizeAfterRotate(newAngle);
    this.image.rotate(newAngle);
    this.canvas.renderAll();
    
    if (saveCanvasStatus) {
      this.graphics.saveCanvasStatus();
    }
  }

  private calcImageSizeAfterRotate(angle: number) {
    const { maxWidth, maxHeight } = this.graphics;
    const { width = 0, height = 0 } = this.image;

    const isDiagonal = (angle >= 0 && angle < 90) ||
      (angle >= 180 && angle < 270);

    let _angle = ((angle % 90) / 180) * Math.PI;
    
    const outWidth = Math.floor(Math.cos(_angle) * width + Math.sin(_angle) * height);
    const outHeight = Math.floor(Math.sin(_angle) * width + Math.cos(_angle) * height);

    const size = calculateCanvasSizeByImage(isDiagonal ? outWidth : outHeight, isDiagonal ? outHeight : outWidth, maxWidth, maxHeight);

    this.graphics.setCanvasSize(size);
    this.image.scale(size.scale).center();
  }
}
