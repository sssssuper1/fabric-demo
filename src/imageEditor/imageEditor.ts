import { fabric } from 'fabric';
import { CommandType } from './command';
import { Graphics } from './graphics';
import { Invoker } from './invoker';

interface ImageEitorConstructor {
  canvasElement: HTMLCanvasElement | string;
  maxWidth?: number;
  maxHeight?: number;
}

export type Mode = 'normal' | 'crop' | 'mosaic';

export type Filter = 'Brightness';

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

    this.graphics = new Graphics(this.canvas);
    this.invoker = new Invoker();
  }

  setUrl(url: string) {
    this.imageUrl = url;

    return new Promise<void>((resolve, reject) => {
      try {
        fabric.Image.fromURL(url, imgInstance => {
          this.image = imgInstance;
          const size = this.calculateCanvasSizeByImage(imgInstance.width || 0, imgInstance.height || 0);
          console.log(size)
          imgInstance.scale(size.scale);
          this.setCanvasSize(size);
          this.graphics.setImage(imgInstance);
          this.canvas.setBackgroundImage(imgInstance, () => {
            this.reRender();
            resolve();
          });
        }, {
          crossOrigin: 'anonymous',
        });
      } catch (err) {
        reject(err);
      };
    });
  }

  calculateCanvasSizeByImage(width: number, height: number) {
    if (!this.maxWidth || !this.maxHeight) return { width, height, scale: 1 };

    const scale = Math.min(this.maxWidth / width, this.maxHeight / height);

    return {
      width: Math.floor(width * scale),
      height: Math.floor(height * scale),
      scale,
    };
  }

  setCanvasSize(options: fabric.ICanvasDimensions) {
    this.canvas.setDimensions(options);
  }

  setMode(mode: Mode) {
    this.mode = mode;
  }

  setFilter(filter: Filter, options?: any) {
    this.execute('applyFilter', filter, options);
  }

  rotate(angle: number) {
    if (!this.image) return;
    this.image?.rotate(((this.image.angle || 0) + angle) % 360);

    this.reRender();
  }

  flip() {
    if (!this.image) return;
    this.image.flipX = !this.image.flipX;

    this.reRender();
  }

  addMosaic(graininess = 20) {
    this.squareEdgeLength = graininess;
    this.makeGrid(100, 80, 150, 150);
  }

  private reRender() {
    this.canvas.renderAll();
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


  // production
  private execute(type: CommandType, ...args: any[]) {
    if (!this.image) return;
    this.invoker.execute(this.graphics, type, args);
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
