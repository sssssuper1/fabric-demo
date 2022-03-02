import { fabric } from 'fabric';
import { ComponentType } from './component';
import { Filter } from './component/filter';

export class Graphics {
  canvas: fabric.Canvas;
  image?: fabric.Image;
  componentsMap = {
    FILTER: new Filter(this),
  };

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
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

  getComponent(type: ComponentType) {
    return this.componentsMap[type];
  }
}