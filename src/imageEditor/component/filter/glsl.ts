export const sharpen = `precision highp float;
uniform sampler2D uTexture;
uniform vec3 iResolution;
varying vec2 vTexCoord;
float SHARPEN_FACTOR = 15.0;

vec4 sharpenMask (vec2 fragCoord)
{
  vec4 up = texture2D (uTexture, (fragCoord + vec2 (0, 1))/iResolution.xy);
  vec4 left = texture2D (uTexture, (fragCoord + vec2 (-1, 0))/iResolution.xy);
  vec4 center = texture2D (uTexture, fragCoord/iResolution.xy);
  vec4 right = texture2D (uTexture, (fragCoord + vec2 (1, 0))/iResolution.xy);
  vec4 down = texture2D (uTexture, (fragCoord + vec2 (0, -1))/iResolution.xy);
  
  return (1.0 + 4.0*SHARPEN_FACTOR)*center - SHARPEN_FACTOR*(up + left + right + down);
}

void main() {
  gl_FragColor = sharpenMask(vTexCoord)
}`

export const brightness = 'precision highp float;\n' +
'uniform sampler2D uTexture;\n' +
'uniform float uBrightness;\n' +
'varying vec2 vTexCoord;\n' +
'void main() {\n' +
  'vec4 color = texture2D(uTexture, vTexCoord);\n' +
  'color.rgb += uBrightness;\n' +
  'gl_FragColor = color;\n' +
'}'
