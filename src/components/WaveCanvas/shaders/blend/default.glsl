// clang-format off
#pragma glslify: blendNormal = require(glsl-blend/normal)
// clang-format on

vec3 blendFunc(vec3 bg, vec3 fg, float alpha) {
  return blendNormal(bg, fg, alpha);
}
