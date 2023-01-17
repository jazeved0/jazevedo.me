import { Color } from "three";
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/order */
import mainVertexShader from "raw-loader!./main.vert";
import mainFragmentShader from "raw-loader!./main.frag";
import simplexNoise3d from "raw-loader!./vendor/webgl-noise/noise3D.glsl";
/* eslint-enable import/no-webpack-loader-syntax */
/* eslint-enable import/no-unresolved */
/* eslint-enable import/order */

export const vertexShader = `
${simplexNoise3d}
${mainVertexShader}
`;

export const fragmentShader = `
${mainFragmentShader}
`;

export const MAX_LIGHTS = 8;
export type LightStruct = {
  count: number;
  colors: Array<Color>;
};
