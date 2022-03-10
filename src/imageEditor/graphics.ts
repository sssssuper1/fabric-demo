import { fabric } from 'fabric';
import { Cropper } from './component/cropper';
import { Filter } from './component/filter';
import { Filp } from './component/flip';
import { Rotation } from './component/rotation';

export type EventType = 'sizeChange';

export class Graphics {
  canvas: fabric.Canvas;
  image?: fabric.Image;
  maxWidth?: number;
  maxHeight?: number;

  private canvasStatus?: fabric.ICanvasDimensions & { scale: number };

  private listeners: Record<EventType, Function[]> = {
    sizeChange: [],
  };

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

  setCanvasSize(options: fabric.ICanvasDimensions) {
    this.canvas.setDimensions(options);
    this.eventTrigger('sizeChange', { ...options })
  }

  startCropMode() {
    if (this.canvasStatus) {
      this.resetCanvasStatus();
    } else {
      this.saveCanvasStatus();
    }
  }

  saveCanvasStatus() {
    this.canvasStatus = {
      width: this.canvas.getWidth(),
      height: this.canvas.getHeight(),
      scale: this.image?.scaleX || 1,
    };
  }

  resetCanvasStatus() {
    if (!this.canvasStatus) return;

    this.setCanvasSize(this.canvasStatus);
    this.image?.scale(this.canvasStatus.scale).center();
  }

  eventTrigger(name: EventType, ...args: any[]) {
    this.listeners[name].forEach(cb => cb(...args));
  }

  addEventListener(name: EventType, handler: Function) {
    this.listeners[name].push(handler);
  }

  removeEventListener(name: EventType, handler: Function) {
    this.listeners[name] = this.listeners[name].filter(cb => cb !== handler);
  }
}