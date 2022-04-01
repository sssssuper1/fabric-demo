import { fabric } from 'fabric';
import { CommandType } from './command';
import { FilterType, FilterOptions } from './component/filter';
import { FlipType } from './component/flip';
import { Graphics, EventType } from './graphics';
import { Invoker } from './invoker';
import { calculateCanvasSizeByImage } from './utils';

interface ImageEitorConstructor {
  canvasElement: HTMLCanvasElement | string;
  maxWidth?: number;
  maxHeight?: number;
}

export type Mode = 'normal' | 'crop' | 'mosaic';

fabric.textureSize = 5168;
const squareEdgeLength  = 10;

const { devicePixelRatio } = window;


export default class ImageEditor {
  canvas: fabric.Canvas;
  imageUrl?: string;
  image?: fabric.Image;
  maxWidth?: number;
  maxHeight?: number;
  mode: Mode = 'normal';
  squareEdgeLength = 20;

  graphics: Graphics;
  invoker: Invoker;

  constructor({
    canvasElement,
    maxWidth,
    maxHeight,
  }: ImageEitorConstructor) {
    this.canvas = new fabric.Canvas(canvasElement);
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;

    this.graphics = new Graphics(this.canvas, maxWidth, maxHeight);
    this.invoker = new Invoker();
  }

  setUrl(url: string) {
    this.imageUrl = url;

    return new Promise<void>((resolve, reject) => {
      try {
        fabric.Image.fromURL(url, imgInstance => {
          this.image = imgInstance;
          const size = calculateCanvasSizeByImage(imgInstance.width || 0, imgInstance.height || 0, this.maxWidth, this.maxHeight);
          imgInstance.scale(size.scale);
          this.setCanvasSize(size);
          this.graphics.setImage(imgInstance);
          this.canvas.setBackgroundImage(imgInstance, () => {
            this.reRender();
            resolve();
          });
        }, {
          crossOrigin: 'anonymous',
          centeredRotation: true,
          centeredScaling: true,
        });
      } catch (err) {
        reject(err);
      };
    });
  }

  setCanvasSize(options: fabric.ICanvasDimensions) {
    this.graphics.setCanvasSize(options);
  }

  getCanvasSize() {
    return { width: this.canvas.getWidth(), height: this.canvas.getHeight() };
  }

  setMode(mode: Mode) {
    this.mode = mode;
    if (mode === 'crop') {
      this.graphics.startCropMode();
    }
  }

  setFilter(filter: FilterType, options?: FilterOptions) {
    this.execute('applyFilter', filter, options);
  }

  flip(type: FlipType) {
    this.execute('flip', type);
  }

  rotate(angle: number) {
    this.execute('rotate', angle, this.mode === 'crop');
  }

  crop(x: number, y: number, w: number, h: number) {
    this.setMode('normal');
    this.execute('crop', { x, y, w, h });
  }

  addEventListener(name: EventType, handler: Function) {
    this.graphics.addEventListener(name, handler);
  }

  removeEventListener(name: EventType, handler: Function) {
    this.graphics.removeEventListener(name, handler);
  }

  // test >>>>>>>>>>>

  test() {
    const rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 100,
      height: 100,
      fill: 'red',
      hasRotatingPoint: false,
    });

    rect.setControlsVisibility({ mtr: false });
    this.canvas.add(rect);

    this.reRender();
  }

  addMosaic(graininess = 20) {
    this.squareEdgeLength = graininess;
    this.makeGrid(100, 80, 150, 150);
  }

  // mosaic
  private makeGrid(beginX: number, beginY: number, rectWidth: number, rectHight: number) {
    const row = Math.round(rectWidth / squareEdgeLength) + 1
    const column = Math.round(rectHight / squareEdgeLength) + 1
    for (let i = 0; i < row * column; i++) {
      let x = (i % row) * squareEdgeLength + beginX
      let y = Math.floor(i / row) * squareEdgeLength + beginY
      this.setColor(x, y)
    }
  }

  private setColor(x: number, y: number) {
    const ctx = this.canvas.getContext();
    const { data: imgData } = ctx.getImageData(x * devicePixelRatio, y * devicePixelRatio, squareEdgeLength * devicePixelRatio, squareEdgeLength * devicePixelRatio)
    let r = 0, g = 0, b = 0
    for (let i = 0; i < imgData.length; i += 4) {
      r += imgData[i]
      g += imgData[i + 1]
      b += imgData[i + 2]
    }
    r = Math.round(r / (imgData.length / 4))
    g = Math.round(g / (imgData.length / 4))
    b = Math.round(b / (imgData.length / 4))
    this.drawRect(x, y, squareEdgeLength, squareEdgeLength, `rgb(${r}, ${g}, ${b})`)
  }

  private drawRect(x: number, y: number, width: number, height: number, fillStyle: string, globalAlpha?: number) {
    const ctx = this.canvas.getContext();
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.fillStyle = fillStyle
    ctx.strokeStyle = fillStyle
    globalAlpha && (ctx.globalAlpha = globalAlpha)

    ctx.stroke()
    ctx.fill()
  }

  // <<<<<<<<<<<< test

  private reRender() {
    this.canvas.renderAll();
  }

  private execute(type: CommandType, ...args: any[]) {
    if (!this.image) return;
    const track = this.mode !== 'crop';
    this.invoker.execute(this.graphics, type, track, args);
  }

  undo() {
    if (!this.image) return;
    this.invoker.undo();
  }

  redo() {
    if (!this.image) return;
    this.invoker.redo();
  }
}
