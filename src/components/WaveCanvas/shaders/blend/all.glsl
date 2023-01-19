// clang-format off
#pragma glslify: blendAdd = require(glsl-blend/add)
#pragma glslify: blendAverage = require(glsl-blend/average)
#pragma glslify: blendColorBurn = require(glsl-blend/color-burn)
#pragma glslify: blendColorDodge = require(glsl-blend/color-dodge)
#pragma glslify: blendDarken = require(glsl-blend/darken)
#pragma glslify: blendDifference = require(glsl-blend/difference)
#pragma glslify: blendExclusion = require(glsl-blend/exclusion)
#pragma glslify: blendGlow = require(glsl-blend/glow)
#pragma glslify: blendHardLight = require(glsl-blend/hard-light)
#pragma glslify: blendHardMix = require(glsl-blend/hard-mix)
#pragma glslify: blendLighten = require(glsl-blend/lighten)
#pragma glslify: blendLinearBurn = require(glsl-blend/linear-burn)
#pragma glslify: blendLinearDodge = require(glsl-blend/linear-dodge)
#pragma glslify: blendLinearLight = require(glsl-blend/linear-light)
#pragma glslify: blendMultiply = require(glsl-blend/multiply)
#pragma glslify: blendNegation = require(glsl-blend/negation)
#pragma glslify: blendNormal = require(glsl-blend/normal)
#pragma glslify: blendOverlay = require(glsl-blend/overlay)
#pragma glslify: blendPhoenix = require(glsl-blend/phoenix)
#pragma glslify: blendPinLight = require(glsl-blend/pin-light)
#pragma glslify: blendReflect = require(glsl-blend/reflect)
#pragma glslify: blendScreen = require(glsl-blend/screen)
#pragma glslify: blendSoftLight = require(glsl-blend/soft-light)
#pragma glslify: blendSubtract = require(glsl-blend/subtract)
#pragma glslify: blendVividLight = require(glsl-blend/vivid-light)
// clang-format on

uniform int inBlendType;

vec3 blendFunc(vec3 bg, vec3 fg, float alpha) {
  switch (inBlendType) {
  case 0:
    return blendNormal(bg, fg, alpha);
  case 1:
    return blendAdd(bg, fg, alpha);
  case 2:
    return blendAverage(bg, fg, alpha);
  case 3:
    return blendDarken(bg, fg, alpha);
  case 4:
    return blendMultiply(bg, fg, alpha);
  case 5:
    return blendColorBurn(bg, fg, alpha);
  case 6:
    return blendLinearBurn(bg, fg, alpha);
  case 7:
    return blendLighten(bg, fg, alpha);
  case 8:
    return blendScreen(bg, fg, alpha);
  case 9:
    return blendColorDodge(bg, fg, alpha);
  case 10:
    return blendLinearDodge(bg, fg, alpha);
  case 11:
    return blendOverlay(bg, fg, alpha);
  case 12:
    return blendSoftLight(bg, fg, alpha);
  case 13:
    return blendHardLight(bg, fg, alpha);
  case 14:
    return blendVividLight(bg, fg, alpha);
  case 15:
    return blendLinearLight(bg, fg, alpha);
  case 16:
    return blendPinLight(bg, fg, alpha);
  case 17:
    return blendHardMix(bg, fg, alpha);
  case 18:
    return blendDifference(bg, fg, alpha);
  case 19:
    return blendExclusion(bg, fg, alpha);
  case 20:
    return blendSubtract(bg, fg, alpha);
  case 21:
    return blendGlow(bg, fg, alpha);
  case 22:
    return blendNegation(bg, fg, alpha);
  case 23:
    return blendPhoenix(bg, fg, alpha);
  case 24:
    return blendReflect(bg, fg, alpha);
  default:
    return vec3(0.0);
  }
}
