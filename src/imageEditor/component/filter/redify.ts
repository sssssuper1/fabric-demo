import { fabric } from 'fabric';

// @ts-ignore
fabric.Image.filters.Redify = fabric.util.createClass(fabric.Image.filters.BaseFilter, {

  type: 'Redify',

  /**
   * Fragment source for the redify program
   */
  fragmentSource: 'precision highp float;\n' +
    'uniform sampler2D uTexture;\n' +
    'varying vec2 vTexCoord;\n' +
    'void main() {\n' +
    'vec4 color = texture2D(uTexture, vTexCoord);\n' +
    'color.r = 0.0;\n' +
    'color.b = 0.0;\n' +
    'gl_FragColor = color;\n' +
    '}',

  applyTo2d() {
    throw new Error('This filter requires WebGL!');
  }
});

// @ts-ignore
fabric.Image.filters.Redify.fromObject = fabric.Image.filters.BaseFilter.fromObject;
