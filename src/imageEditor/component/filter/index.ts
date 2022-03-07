import { fabric } from 'fabric';
import { Graphics } from '../../graphics';
import { BaseComponent } from "..";

// 注册滤镜
import './redify';
import './sharpen';

export type FilterType = 'Brightness' | 'Contrast' | 'Saturation' | 'Redify' | 'Sharpen';

export type FilterOptions = {
  brightness: number; // -1 ~ 1
} | {
  contrast?: number; // -1 ~ 1
} | {
  saturation?: number; // -1 ~ 1
}

export interface BaseFilterConfig {
  type: FilterType;
}

export class Filter extends BaseComponent {
  constructor(graphics: Graphics) {
    super('FILTER', graphics);
  }

  add(type: FilterType, options?: any) {
    const current = this.getFilter(type);

    if (current) {
      current.setOptions(options);
    } else {
      // @ts-ignore
      this.image.filters?.push(new fabric.Image.filters[type](options));
    }

    this.apply();
  }

  remove(type: FilterType) {
    this.image.filters = (this.image.filters || []).filter(f => (f.toObject() as BaseFilterConfig).type !== type);
    this.apply();
  }

  getFilter(type: FilterType) {
    return this.image.filters?.find(f => (f.toObject() as BaseFilterConfig).type === type);
  }

  getOptions(type: FilterType) {
    const current = this.getFilter(type);

    return current?.toObject().options;
  }

  apply() {
    this.image.applyFilters();
    this.canvas.renderAll();
  }
}
