import { Graphics } from '../graphics';

export type ComponentType = 'FILTER';

export class BaseComponent {
  name: ComponentType;
  graphics: Graphics;
  
  constructor(name: ComponentType, graphics: Graphics) {
    this.name = name;
    this.graphics = graphics;
  }

  get canvas() {
    return this.graphics.getCanvas();
  }

  get image() {
    return this.graphics.getImage();
  }
}
