import { fabric } from 'fabric';
import { Cropper } from './component/cropper';
import { Filter } from './component/filter';
import { Filp } from './component/flip';
import { Rotation } from './component/rotation';

export class Graphics {
  canvas: fabric.Canvas;
  image?: fabric.Image;
  maxWidth?: number;
  maxHeight?: number;

  private canvasStatus?: fabric.ICanvasDimensions & { scale: number };

  componentsMap = {
    FILTER: new Filter(this),
    FLIP: new Filp(this),
    ROTATION: new Rotation(this),
    CROPPER: new Cropper(this),
  };

  constructor(canvas: fabric.Canvas, maxWidth?: number, maxHeight?: number) {
    this.canvas = canvas;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
  }

  getCanvas() {
    return this.canvas;
  }

  setImage(image: fabric.Image) {
    this.image = image;
  }

  getImage() {
    return this.image!;
  }

  startCropMode() {
    if (this.canvasStatus) {
      this.resetCanvasStatus();
    } else {
      this.saveCanvasStatus();
    }
  }

  private saveCanvasStatus() {
    this.canvasStatus = {
      width: this.canvas.getWidth(),
      height: this.canvas.getHeight(),
      scale: this.image?.scaleX || 1,
    };
  }

  private resetCanvasStatus() {
    if (!this.canvasStatus) return;

    this.canvas.setDimensions(this.canvasStatus);
    this.image?.scale(this.canvasStatus.scale).center();
  }
}