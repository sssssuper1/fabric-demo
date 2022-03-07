import { fabric } from 'fabric';
import { Filter } from './component/filter';
import { Filp } from './component/flip';
import { Rotation } from './component/rotation';

export class Graphics {
  canvas: fabric.Canvas;
  image?: fabric.Image;
  maxWidth?: number;
  maxHeight?: number;
  componentsMap = {
    FILTER: new Filter(this),
    FLIP: new Filp(this),
    ROTATION: new Rotation(this),
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
}