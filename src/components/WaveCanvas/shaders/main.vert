// blendFunc and noiseFunc are linked when constructing the shader

// Struct must stay in sync with `LightStruct` in ./index.ts
struct LightStruct {
  int count;
  // Size of the array must stay in sync with `MAX_LIGHTS` in ./index.ts
  vec3 colors[8];
};

uniform float inTime;
uniform vec2 inDeformNoiseFrequency;
uniform float inDeformNoiseSpeed;
uniform vec2 inDeformNoiseScrollSpeed;
uniform float inDeformNoiseStrength;
uniform LightStruct inLights;
uniform vec2 inLightNoiseFrequency;
uniform float inLightNoiseSpeed;
uniform vec2 inLightNoiseScrollSpeed;
uniform float inLightBlendStrength;
uniform float inPerLightNoiseOffset;

varying vec3 outColor;

void main() {
  // Compute the deformed position using Simplex noise.
  vec2 noiseSpaceCoord =
      (uv * inDeformNoiseFrequency) + (inTime * inDeformNoiseScrollSpeed);
  float noiseTimeCoord = inTime * inDeformNoiseSpeed;
  vec3 noiseCoord = vec3(noiseSpaceCoord, noiseTimeCoord);
  float zOffset = noiseFunc(noiseCoord) * inDeformNoiseStrength;
  vec3 deformedPosition = vec3(position.x, position.y, position.z + zOffset);

  // Compute the blended color from the lights. Each light is applied using
  // a Simplex noise mask, and then blended together. Each light has its own
  // noise-space coordinate, so that the mask is different for each light.
  vec3 blendedColor = inLights.colors[0];
  for (int i = 1; i < inLights.count; i++) {
    vec2 noiseSpaceCoordOffset = vec2(float(i) * inPerLightNoiseOffset);
    vec2 noiseSpaceCoord = (uv * inLightNoiseFrequency) +
                           (inTime * inLightNoiseScrollSpeed) +
                           noiseSpaceCoordOffset;
    float noiseTimeCoordOffset = float(i) * inPerLightNoiseOffset;
    float noiseTimeCoord = (inTime * inLightNoiseSpeed) + noiseTimeCoordOffset;
    vec3 noiseCoord = vec3(noiseSpaceCoord, noiseTimeCoord);
    float mask = noiseFunc(noiseCoord);
    vec3 lightColor = inLights.colors[i];
    blendedColor =
        blendFunc(blendedColor, lightColor, mask * inLightBlendStrength);
  }

  gl_Position =
      projectionMatrix * modelViewMatrix * vec4(deformedPosition, 1.0);
  outColor = blendedColor;
}
