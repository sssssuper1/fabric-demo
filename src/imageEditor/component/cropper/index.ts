import { Graphics } from '../../graphics';
import { calculateCanvasSizeByImage } from '../../utils';
import { BaseComponent } from "..";

interface Coordinate {
  x: number;
  y: number;
  w: number;
  h: number;
  scale?: number;
}

export class Cropper extends BaseComponent {
  constructor(graphics: Graphics) {
    super('CROPPER', graphics);
  }

  crop({ x, y, w, h, scale }: Coordinate, reset: boolean) {
    const { maxWidth, maxHeight } = this.graphics;
    const size = calculateCanvasSizeByImage(w, h, maxWidth, maxHeight);

    const currentScale = this.image.scaleX || 1;

    this.image.set({
      left: reset ? x : ((this.image.left || 0) - x) * size.scale,
      top: reset ? y : ((this.image.top || 0) - y) * size.scale,
    });
    this.image.scale(scale || size.scale * currentScale);
    this.canvas.setDimensions(size);
    this.canvas.renderAll();
  }

  getCurrentSize() {
    return {
      x: this.image.left || 0,
      y: this.image.top || 0,
      w: this.canvas.getWidth(),
      h: this.canvas.getHeight(),
      scale: this.image.scaleX || 1,
    };
  }
}
