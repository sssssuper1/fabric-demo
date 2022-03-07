import { Graphics } from '../../graphics';
import { BaseComponent } from "..";

export type FlipType = 'x' | 'y';

export class Filp extends BaseComponent {
  constructor(graphics: Graphics) {
    super('FLIP', graphics);
  }

  flip(type: FlipType) {
    if (type === 'x') {
      this.flipX();
    } else {
      this.flipY();
    }
    this.canvas.renderAll();
  }

  private flipX() {
    this.image.flipX = !this.image.flipX;
    
  }

  private flipY() {
    this.image.flipY = !this.image.flipY;
  }
}
