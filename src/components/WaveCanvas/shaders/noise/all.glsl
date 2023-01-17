// clang-format off
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
// clang-format on

uniform int inNoiseType;

float noiseFunc(vec3 v) {
  switch (inNoiseType) {
  case 0:
    return snoise3(v);
  case 1:
    return cnoise3(v);
  default:
    return 0.0;
  }
}
