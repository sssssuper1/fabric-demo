import { fabric } from 'fabric';

// @ts-ignore
fabric.Image.filters.Sharpen = fabric.util.createClass(fabric.Image.filters.BaseFilter, {

  type: 'Sharpen',

  /**
   * Fragment source for the redify program
   */
  fragmentSource: `precision highp float;
  uniform sampler2D uTexture;
  varying vec2 vTexCoord;
  float SHARPEN_FACTOR = 16.0;
  
  vec4 sharpenMask (vec2 fragCoord)
  {
    vec4 up = texture2D (uTexture, (fragCoord + vec2 (0, 1)));
    vec4 left = texture2D (uTexture, (fragCoord + vec2 (-1, 0)));
    vec4 center = texture2D (uTexture, fragCoord);
    vec4 right = texture2D (uTexture, (fragCoord + vec2 (1, 0)));
    vec4 down = texture2D (uTexture, (fragCoord + vec2 (0, -1)));
    
    return (1.0 + 4.0*SHARPEN_FACTOR)*center - SHARPEN_FACTOR*(up + left + right + down);
  }
  
  void main() {
    gl_FragColor = sharpenMask(vTexCoord);
  }
`,

  applyTo2d() {
    throw new Error('This filter requires WebGL!');
  }
});

// @ts-ignore
fabric.Image.filters.Sharpen.fromObject = fabric.Image.filters.BaseFilter.fromObject;
