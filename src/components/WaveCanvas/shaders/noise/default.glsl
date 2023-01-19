// clang-format off
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
// clang-format on

float noiseFunc(vec3 v) { return snoise3(v); }
