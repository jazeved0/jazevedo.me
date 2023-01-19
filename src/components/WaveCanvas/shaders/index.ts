import { Color } from "three";

import vertexShader from "./main.vert";
import fragmentShader from "./main.frag";

export const MAX_LIGHTS = 8;
export type LightStruct = {
  count: number;
  colors: Array<Color>;
};

export function makeVertexShader({
  noiseSource,
  blendSource,
}: {
  noiseSource: string;
  blendSource: string;
}): string {
  return `
    ${noiseSource}
    ${blendSource}
    ${vertexShader}
  `;
}

export function makeFragmentShader(): string {
  return fragmentShader;
}
