/* eslint-disable max-classes-per-file */

import type { RgbColor } from "polished/lib/types/color";
import type { OrthographicCamera, IUniform } from "three";
import {
  WebGLRenderer,
  Scene,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Color as ThreeColor,
  Vector2,
} from "three";

import { logError, logWarn } from "./log";
import type { NonEmptyArray } from "../../ts-utils";
import {
  createOrthoCamera,
  adaptiveZoomOrthoViewport,
  updateOrthoCamera,
} from "./OrthoViewport";
import type { OrthoViewport } from "./OrthoViewport";
import { MAX_LIGHTS, makeVertexShader, makeFragmentShader } from "./shaders";
import type { LightStruct } from "./shaders";
import defaultNoise from "./shaders/noise/default.glsl";
import defaultBlend from "./shaders/blend/default.glsl";

// The aspect ratio is designed to create a square area ((-1,-1) to (1,1)) that
// will always have the deformed, tilted plane covering it. The adaptive zoom
// camera then ensures that the canvas viewport is some region of this square
// area.
const PLANE_ASPECT: Vector2 = new Vector2(1, 3.2);
const PLANE_SCALE: Vector2 = new Vector2(2, 2);
const PLANE_TILT = 0.75;
const CAMERA_BASE_VIEWPORT: OrthoViewport = {
  left: -1,
  right: 1,
  top: 1,
  bottom: -1,
  near: -100,
  far: 100,
};
function computeCameraViewport(
  clientWidth: number,
  clientHeight: number
): OrthoViewport {
  return adaptiveZoomOrthoViewport({
    clientWidth,
    clientHeight,
    baseViewport: CAMERA_BASE_VIEWPORT,
  });
}

type PlaybackState =
  | {
      type: "playing";
      startTimestamp: DOMHighResTimeStamp;
      frameCount: number;
    }
  | {
      type: "paused";
      pauseTime: number;
      forceRerenderNextFrame: boolean;
    };

type RendererState =
  | {
      type: "unmounted";
    }
  | {
      type: "mounted";
      canvas: HTMLCanvasElement;
      boundOnResizeWindow: () => void;
      camera: OrthographicCamera;
      renderer: WebGLRenderer;
      scene: Scene;
      plane: Mesh;
      material: ShaderMaterial;
      frameCount: number;
      playbackState: PlaybackState;
      renderStopWrapper: RenderStopWrapper;
    };

export type Vector2Like = readonly [x: number, y: number] | number;

/**
 * A renderer for the waves in the hero background.
 *
 * This can be mounted onto a canvas HTML element, and will handle rendering
 * the waves to the canvas every other frame.
 */
export default class WaveRenderer {
  public static DEFAULT_WAVE_COLOR: RgbColor = {
    red: 0,
    green: 0,
    blue: 0,
  };

  public static DEFAULT_INITIAL_TIME = 0;
  public static DEFAULT_SUBDIVISION: Vector2Like = 64;
  public static DEFAULT_BLEND_SOURCE = defaultBlend;
  public static DEFAULT_NOISE_SOURCE = defaultNoise;

  public static DEFAULT_DEFORM_NOISE_FREQUENCY: Vector2Like = 2;
  public static DEFAULT_DEFORM_NOISE_SPEED = 6;
  public static DEFAULT_DEFORM_NOISE_STRENGTH = 2;
  public static DEFAULT_DEFORM_NOISE_SCROLL_SPEED: Vector2Like = [2.5, 1];
  public static DEFAULT_DEFORM_NOISE_CLAMP_LOW = -1;
  public static DEFAULT_DEFORM_NOISE_CLAMP_HIGH = 1;

  public static DEFAULT_LIGHT_NOISE_FREQUENCY: Vector2Like = 1;
  public static DEFAULT_LIGHT_NOISE_SPEED = 3;
  public static DEFAULT_LIGHT_NOISE_SCROLL_SPEED: Vector2Like = [2.5, 1];
  public static DEFAULT_LIGHT_NOISE_CLAMP_LOW = -0.5;
  public static DEFAULT_LIGHT_NOISE_CLAMP_HIGH = 1;
  public static DEFAULT_LIGHT_BLEND_STRENGTH = 1;
  public static DEFAULT_PER_LIGHT_NOISE_OFFSET = 8;

  private onLoadCallback: (() => void) | null = null;
  private onRenderCallback: (() => void) | null = null;
  private colors: NonEmptyArray<RgbColor> = [WaveRenderer.DEFAULT_WAVE_COLOR];
  private fallbackColor: RgbColor = WaveRenderer.DEFAULT_WAVE_COLOR;
  private timeOffset: number = WaveRenderer.DEFAULT_INITIAL_TIME;
  private subdivision: Vector2Like = WaveRenderer.DEFAULT_SUBDIVISION;
  private startPaused = false;
  private startAtTime: number | null = null;
  private blendSource: string = WaveRenderer.DEFAULT_BLEND_SOURCE;
  private noiseSource: string = WaveRenderer.DEFAULT_NOISE_SOURCE;
  private extraUniforms: Record<string, IUniform> = {};

  private deformNoiseFrequency: Vector2Like =
    WaveRenderer.DEFAULT_DEFORM_NOISE_FREQUENCY;
  private deformNoiseSpeed: number = WaveRenderer.DEFAULT_DEFORM_NOISE_SPEED;
  private deformNoiseStrength: number =
    WaveRenderer.DEFAULT_DEFORM_NOISE_STRENGTH;
  private deformNoiseScrollSpeed: Vector2Like =
    WaveRenderer.DEFAULT_DEFORM_NOISE_SCROLL_SPEED;
  private deformNoiseClampLow: number =
    WaveRenderer.DEFAULT_DEFORM_NOISE_CLAMP_LOW;
  private deformNoiseClampHigh: number =
    WaveRenderer.DEFAULT_DEFORM_NOISE_CLAMP_HIGH;

  private lightNoiseFrequency: Vector2Like =
    WaveRenderer.DEFAULT_LIGHT_NOISE_FREQUENCY;
  private lightNoiseSpeed: number = WaveRenderer.DEFAULT_LIGHT_NOISE_SPEED;
  private lightNoiseScrollSpeed: Vector2Like =
    WaveRenderer.DEFAULT_LIGHT_NOISE_SCROLL_SPEED;
  private lightNoiseClampLow: number =
    WaveRenderer.DEFAULT_LIGHT_NOISE_CLAMP_LOW;
  private lightNoiseClampHigh: number =
    WaveRenderer.DEFAULT_LIGHT_NOISE_CLAMP_HIGH;
  private lightBlendStrength: number =
    WaveRenderer.DEFAULT_LIGHT_BLEND_STRENGTH;
  private perLightNoiseOffset: number =
    WaveRenderer.DEFAULT_PER_LIGHT_NOISE_OFFSET;

  private state: RendererState = { type: "unmounted" };

  /**
   * Sets the callback to invoke when the renderer has finished loading.
   *
   * This is called at the end of the `mount` method.
   */
  public setOnLoad(callback: (() => void) | null): void {
    this.onLoadCallback = callback;
  }

  /**
   * Sets the callback to invoke at the end of each frame.
   */
  public setOnRender(callback: (() => void) | null): void {
    this.onRenderCallback = callback;
  }

  /**
   * Sets the colors to use for the waves. The array must be non-empty.
   */
  public setColors(colors: Readonly<NonEmptyArray<RgbColor>>): void {
    let colorsCopy = colors.slice() as NonEmptyArray<RgbColor>;
    if (colorsCopy.length > MAX_LIGHTS) {
      logWarn(
        "WaveRenderer",
        `Too many colors provided (${colorsCopy.length}). Only the first ${MAX_LIGHTS} will be used.`
      );
      colorsCopy = colorsCopy.slice(0, MAX_LIGHTS) as NonEmptyArray<RgbColor>;
    }

    this.colors = colorsCopy;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inLights.value =
        this.getLightsUniformValue();
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the color that will be used as the "clear color" for the canvas
   * renderer. If the renderer has already mounted, then this will cause the
   * renderer to update the material.
   */
  public setFallbackColor(color: RgbColor | null): void {
    this.fallbackColor = color ?? WaveRenderer.DEFAULT_WAVE_COLOR;

    if (this.state.type === "mounted") {
      this.state.renderer.setClearColor(
        rgbColorToThreeColor(this.fallbackColor)
      );
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the initial time for the wave animation. This can be used to control
   * the initial frame so that it is reproducible.
   */
  public setTimeOffset(time: number | null): void {
    this.timeOffset = time ?? WaveRenderer.DEFAULT_INITIAL_TIME;
    this.invalidateIfPaused();
  }

  /**
   * Sets the subdivision of the plane geometry. This is a vector so that the
   * plane can be subdivided differently in the x and y directions.
   *
   * Note that the vector passed in is implicitly scaled by the plane's aspect
   * ratio, which might not be square.
   */
  public setSubdivision(subdivision: Vector2Like | null): void {
    this.subdivision = subdivision ?? WaveRenderer.DEFAULT_SUBDIVISION;

    if (this.state.type === "mounted") {
      this.state.plane.geometry.dispose();
      this.state.plane.geometry = this.createPlaneGeometry();
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets whether the animation is paused.
   */
  public setIsPaused(isPaused: boolean | null): void {
    this.startPaused = isPaused ?? false;

    if (this.state.type === "mounted") {
      if (this.state.playbackState.type === "paused" && !isPaused) {
        const newStartTimestamp = performance.now();
        this.state.playbackState = {
          type: "playing",
          startTimestamp:
            newStartTimestamp - this.state.playbackState.pauseTime * 1000,
          frameCount: 1,
        };
      } else if (this.state.playbackState.type === "playing" && isPaused) {
        const now = performance.now();
        this.state.playbackState = {
          type: "paused",
          pauseTime: (now - this.state.playbackState.startTimestamp) / 1000,
          forceRerenderNextFrame: true,
        };
      }
    }
  }

  /**
   * Sets a custom noise function for the wave deformation and colors. This is a
   * GLSL snippet that should contain an implementation for the following
   * interface:
   *
   * ```glsl
   * float noiseFunc(vec3 v);
   * ```
   */
  public setNoiseSource(noiseSource: string | null): void {
    this.noiseSource = noiseSource ?? WaveRenderer.DEFAULT_NOISE_SOURCE;

    if (this.state.type === "mounted") {
      this.state.material.vertexShader = makeVertexShader({
        noiseSource: this.noiseSource,
        blendSource: this.blendSource,
      });
      this.state.material.needsUpdate = true;
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets a custom blend function for the light colors. This is a GLSL snippet
   * that should contain an implementation for the following interface:
   *
   * ```glsl
   * vec3 blendFunc(vec3 bg, vec3 fg, float alpha);
   * ```
   */
  public setBlendSource(blendSource: string | null): void {
    this.blendSource = blendSource ?? WaveRenderer.DEFAULT_BLEND_SOURCE;

    if (this.state.type === "mounted") {
      this.state.material.vertexShader = makeVertexShader({
        noiseSource: this.noiseSource,
        blendSource: this.blendSource,
      });
      this.state.material.needsUpdate = true;
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets custom uniforms for the wave shaders.
   */
  public setExtraUniforms(newUniforms: Record<string, IUniform> | null): void {
    const uniformKeysBefore = new Set(Object.keys(this.extraUniforms));
    this.extraUniforms = newUniforms ?? {};

    if (this.state.type === "mounted") {
      const uniformKeysAfter = new Set(Object.keys(this.extraUniforms));
      // From https://stackoverflow.com/a/31129384:
      const setEquality = <T>(xs: Set<T>, ys: Set<T>): boolean =>
        xs.size === ys.size && [...xs].every((x) => ys.has(x));
      if (setEquality(uniformKeysBefore, uniformKeysAfter)) {
        // If the uniforms are the same, then we can just update the values.
        const { material } = this.state;
        Object.entries(this.extraUniforms).forEach(([key, value]) => {
          (material.uniforms[key] as IUniform<unknown>).value = value.value;
        });
      } else {
        // Otherwise, we need to recreate the material.
        Object.assign(this.state.material.uniforms, this.extraUniforms);
        this.state.material.needsUpdate = true;
      }
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the frequency of the deform noise texture. Higher values increase the
   * number of peaks and valleys that appear on the plane, and decrease their
   * x-y size. This is a vector so that the noise can be scaled differently in
   * the x and y directions.
   */
  public setDeformNoiseFrequency(frequency: Vector2Like | null): void {
    this.deformNoiseFrequency =
      frequency ?? WaveRenderer.DEFAULT_DEFORM_NOISE_FREQUENCY;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inDeformNoiseFrequency.value =
        this.getDeformNoiseFrequency();
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the speed of the animation of the deform noise texture. Higher values
   * result in faster animation.
   */
  public setDeformNoiseSpeed(speed: number | null): void {
    this.deformNoiseSpeed = speed ?? WaveRenderer.DEFAULT_DEFORM_NOISE_SPEED;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inDeformNoiseSpeed.value =
        this.getDeformNoiseSpeed();
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the strength of the deform noise texture. Higher values result in
   * sharper valleys and peaks.
   */
  public setDeformNoiseStrength(strength: number | null): void {
    this.deformNoiseStrength =
      strength ?? WaveRenderer.DEFAULT_DEFORM_NOISE_STRENGTH;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inDeformNoiseStrength.value =
        this.getDeformNoiseStrength();
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the speed of the passive scrolling of the deform noise texture. Higher
   * values result in faster scrolling. This is a vector so that the noise can
   * be scrolled at different speeds in the x and y directions.
   */
  public setDeformNoiseScrollSpeed(scrollSpeed: Vector2Like | null): void {
    this.deformNoiseScrollSpeed =
      scrollSpeed ?? WaveRenderer.DEFAULT_DEFORM_NOISE_SCROLL_SPEED;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inDeformNoiseScrollSpeed.value =
        this.getDeformNoiseScrollSpeed();
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the minimum value of the deform noise texture.
   */
  public setDeformNoiseClampLow(clampLow: number | null): void {
    this.deformNoiseClampLow =
      clampLow ?? WaveRenderer.DEFAULT_DEFORM_NOISE_CLAMP_LOW;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inDeformNoiseClampLow.value =
        this.deformNoiseClampLow;
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the maximum value of the deform noise texture.
   */
  public setDeformNoiseClampHigh(clampHigh: number | null): void {
    this.deformNoiseClampHigh =
      clampHigh ?? WaveRenderer.DEFAULT_DEFORM_NOISE_CLAMP_HIGH;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inDeformNoiseClampHigh.value =
        this.deformNoiseClampHigh;
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the frequency of the light noise texture. Higher values increase the
   * number of bright areas that appear on the plane and decrease their size.
   * This is a vector so that the noise can be scaled differently in the x and
   * y directions.
   */
  public setLightNoiseFrequency(frequency: Vector2Like | null): void {
    this.lightNoiseFrequency =
      frequency ?? WaveRenderer.DEFAULT_LIGHT_NOISE_FREQUENCY;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inLightNoiseFrequency.value =
        this.getLightNoiseFrequency();
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the speed of the animation of the light noise texture. Higher values
   * result in faster animation.
   */
  public setLightNoiseSpeed(speed: number | null): void {
    this.lightNoiseSpeed = speed ?? WaveRenderer.DEFAULT_LIGHT_NOISE_SPEED;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inLightNoiseSpeed.value =
        this.getLightNoiseSpeed();
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the speed of the passive scrolling of the light noise texture. Higher
   * values result in faster scrolling. This is a vector so that the noise can
   * be scrolled at different speeds in the x and y directions.
   */
  public setLightNoiseScrollSpeed(scrollSpeed: Vector2Like | null): void {
    this.lightNoiseScrollSpeed =
      scrollSpeed ?? WaveRenderer.DEFAULT_LIGHT_NOISE_SCROLL_SPEED;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inLightNoiseScrollSpeed.value =
        this.getLightNoiseScrollSpeed();
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the minimum value of the light noise texture.
   */
  public setLightNoiseClampLow(clampLow: number | null): void {
    this.lightNoiseClampLow =
      clampLow ?? WaveRenderer.DEFAULT_LIGHT_NOISE_CLAMP_LOW;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inLightNoiseClampLow.value =
        this.lightNoiseClampLow;
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the maximum value of the light noise texture.
   */
  public setLightNoiseClampHigh(clampHigh: number | null): void {
    this.lightNoiseClampHigh =
      clampHigh ?? WaveRenderer.DEFAULT_LIGHT_NOISE_CLAMP_HIGH;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inLightNoiseClampHigh.value =
        this.lightNoiseClampHigh;
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the opacity that each light will have when blended together. The last
   * light will inherently be the strongest, since it is applied last (using a
   * "normal" blend mode).
   */
  public setLightBlendStrength(strength: number | null): void {
    this.lightBlendStrength =
      strength ?? WaveRenderer.DEFAULT_LIGHT_BLEND_STRENGTH;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inLightBlendStrength.value =
        this.lightBlendStrength;
      this.invalidateIfPaused();
    }
  }

  /**
   * Sets the offset that each successive light will have on the noise texture.
   */
  public setPerLightNoiseOffset(offset: number | null): void {
    this.perLightNoiseOffset =
      offset ?? WaveRenderer.DEFAULT_PER_LIGHT_NOISE_OFFSET;

    if (this.state.type === "mounted") {
      this.state.material.uniforms.inPerLightNoiseOffset.value =
        this.perLightNoiseOffset;
      this.invalidateIfPaused();
    }
  }

  /**
   * Mounts the renderer to the given canvas, initializing the mesh geometry
   * and compiling the shaders.
   */
  public mount({ canvas }: { canvas: HTMLCanvasElement }): void {
    const scene = new Scene();
    scene.matrixWorldAutoUpdate = false;
    const { clientWidth, clientHeight } = canvas;
    const initialViewport = computeCameraViewport(clientWidth, clientHeight);
    const camera = createOrthoCamera(initialViewport);
    camera.name = "main-camera";
    camera.matrixWorldAutoUpdate = false;
    scene.add(camera);

    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(clientWidth, clientHeight, /* updateStyle */ false);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(rgbColorToThreeColor(this.fallbackColor));

    const { plane, material } = this.setupScene({
      scene,
    });

    const boundOnResizeWindow = this.onResizeWindow.bind(this);
    window.addEventListener("resize", boundOnResizeWindow);

    let playbackState: PlaybackState;
    if (this.startPaused) {
      playbackState = {
        type: "paused",
        pauseTime: this.startAtTime ?? 0,
        forceRerenderNextFrame: true,
      };
    } else {
      const startTimestamp = performance.now();
      playbackState = {
        type: "playing",
        startTimestamp: startTimestamp - (this.startAtTime ?? 0) * 1000,
        frameCount: 1,
      };
    }

    const renderStopWrapper = new RenderStopWrapper(this.render.bind(this));
    this.state = {
      type: "mounted",
      canvas,
      boundOnResizeWindow,
      camera,
      renderer,
      scene,
      plane,
      material,
      playbackState,
      frameCount: 1,
      renderStopWrapper,
    };

    if (this.onLoadCallback != null) {
      this.onLoadCallback();
    }

    renderStopWrapper.start();
  }

  /**
   * Tears down the renderer and frees up resources. The state of the renderer
   * afterwards will be its initial state, and can be mounted again.
   */
  public unmount(): void {
    if (this.state.type === "unmounted") {
      logError("WaveRenderer", "Cannot unmount when already unmounted");
      return;
    }

    window.removeEventListener("resize", this.state.boundOnResizeWindow);
    this.state.material.dispose();
    this.state.renderer.dispose();
    this.state.renderStopWrapper.stop();
    this.state = { type: "unmounted" };
  }

  /**
   * Restarts the animation to `t = this.timeOffset`.
   */
  public restartAnimation(): void {
    if (this.state.type === "unmounted") {
      logError("WaveRenderer", "Cannot restart animation when unmounted");
      return;
    }

    if (this.state.playbackState.type === "playing") {
      const startTimestamp = performance.now();
      this.state.playbackState = {
        type: "playing",
        startTimestamp,
        frameCount: 1,
      };
    } else {
      this.state.playbackState = {
        type: "paused",
        pauseTime: 0,
        forceRerenderNextFrame: true,
      };
    }
  }

  public exportImage(mimeType: string): string {
    if (this.state.type === "unmounted") {
      logError("WaveRenderer", "Cannot export image when unmounted");
      return "";
    }

    // Re-render the scene to ensure that the pixel data is in the buffer.
    this.state.material.uniforms.inTime.value =
      this.getTime() + this.timeOffset;
    this.state.renderer.render(this.state.scene, this.state.camera);
    const dataUrl = this.state.canvas.toDataURL(mimeType);
    return dataUrl;
  }

  private createMaterial(): ShaderMaterial {
    return new ShaderMaterial({
      uniforms: {
        inTime: { value: /* This value is ignored */ 0 },
        inDeformNoiseFrequency: { value: this.getDeformNoiseFrequency() },
        inDeformNoiseSpeed: { value: this.getDeformNoiseSpeed() },
        inDeformNoiseStrength: { value: this.getDeformNoiseStrength() },
        inDeformNoiseScrollSpeed: { value: this.getDeformNoiseScrollSpeed() },
        inDeformNoiseClampLow: { value: this.deformNoiseClampLow },
        inDeformNoiseClampHigh: { value: this.deformNoiseClampHigh },
        inLights: { value: this.getLightsUniformValue() },
        inLightNoiseFrequency: { value: this.getLightNoiseFrequency() },
        inLightNoiseSpeed: { value: this.getLightNoiseSpeed() },
        inLightNoiseScrollSpeed: { value: this.getLightNoiseScrollSpeed() },
        inLightNoiseClampLow: { value: this.lightNoiseClampLow },
        inLightNoiseClampHigh: { value: this.lightNoiseClampHigh },
        inLightBlendStrength: { value: this.lightBlendStrength },
        inPerLightNoiseOffset: { value: this.perLightNoiseOffset },
        ...this.extraUniforms,
      },
      vertexShader: makeVertexShader({
        noiseSource: this.noiseSource,
        blendSource: this.blendSource,
      }),
      fragmentShader: makeFragmentShader(),
    });
  }

  private setupScene({ scene }: { scene: Scene }): {
    plane: Mesh;
    material: ShaderMaterial;
  } {
    const geometry = this.createPlaneGeometry();
    const material = this.createMaterial();
    const plane = new Mesh(geometry, material);
    plane.rotation.x = (Math.PI / 2) * PLANE_TILT;
    plane.updateMatrixWorld();
    plane.matrixWorldAutoUpdate = false;
    scene.add(plane);

    return { plane, material };
  }

  private createPlaneGeometry(): PlaneGeometry {
    const size: Vector2 = new Vector2(
      PLANE_ASPECT.x * PLANE_SCALE.x,
      PLANE_ASPECT.y * PLANE_SCALE.x
    );
    const baseSubdivisions = vector2LikeToThreeVector2(this.subdivision);
    const subdivisions = new Vector2(
      Math.ceil(baseSubdivisions.x * PLANE_ASPECT.x),
      Math.ceil(baseSubdivisions.y * PLANE_ASPECT.y)
    );
    return new PlaneGeometry(size.x, size.y, subdivisions.x, subdivisions.y);
  }

  private getLightsUniformValue(): LightStruct {
    return {
      count: this.colors.length,
      // Pad the array with black to the max number of lights
      colors: this.colors
        .map<ThreeColor>(rgbColorToThreeColor)
        .concat(
          new Array(MAX_LIGHTS - this.colors.length).fill(
            rgbColorToThreeColor({ red: 0, green: 0, blue: 0 })
          )
        ),
    };
  }

  private getDeformNoiseFrequency(): Vector2 {
    const vec = vector2LikeToThreeVector2(this.deformNoiseFrequency);
    return new Vector2(vec.x * PLANE_ASPECT.x, vec.y * PLANE_ASPECT.y);
  }

  private getDeformNoiseSpeed(): number {
    // Implicitly scale by 100 to make default value more reasonable:
    return this.deformNoiseSpeed / 100;
  }

  private getDeformNoiseStrength(): number {
    // Implicitly scale by 10 to make default value more reasonable:
    return this.deformNoiseStrength / 10;
  }

  private getDeformNoiseScrollSpeed(): Vector2 {
    // Implicitly scale by 100 to make default value more reasonable:
    const vec = vector2LikeToThreeVector2(
      this.deformNoiseScrollSpeed
    ).multiplyScalar(1 / 100);
    return new Vector2(vec.x * PLANE_ASPECT.x, vec.y * PLANE_ASPECT.y);
  }

  private getLightNoiseFrequency(): Vector2 {
    const vec = vector2LikeToThreeVector2(this.lightNoiseFrequency);
    return new Vector2(vec.x * PLANE_ASPECT.x, vec.y * PLANE_ASPECT.y);
  }

  private getLightNoiseSpeed(): number {
    // Implicitly scale by 100 to make default value more reasonable:
    return this.lightNoiseSpeed / 100;
  }

  private getLightNoiseScrollSpeed(): Vector2 {
    // Implicitly scale by 100 to make default value more reasonable:
    const vec = vector2LikeToThreeVector2(
      this.lightNoiseScrollSpeed
    ).multiplyScalar(1 / 100);
    return new Vector2(vec.x * PLANE_ASPECT.x, vec.y * PLANE_ASPECT.y);
  }

  /**
   * Called from `requestAnimationFrame` to render the scene.
   */
  private render(timestamp: DOMHighResTimeStamp): void {
    if (this.state.type === "unmounted") {
      return;
    }

    const { playbackState } = this.state;
    const time = this.getTime(timestamp);
    if (time === null) {
      throw new Error("Time should not be null");
    }
    if (playbackState.type === "paused") {
      if (playbackState.forceRerenderNextFrame) {
        playbackState.forceRerenderNextFrame = false;

        this.state.material.uniforms.inTime.value = time + this.timeOffset;
        this.state.renderer.render(this.state.scene, this.state.camera);
        if (this.onRenderCallback !== null) {
          this.onRenderCallback();
        }
      }
    } else if (playbackState.type === "playing") {
      if (playbackState.frameCount % 2 !== 1) {
        // Skip this frame to reduce load.
      } else {
        this.state.material.uniforms.inTime.value = time + this.timeOffset;
        this.state.renderer.render(this.state.scene, this.state.camera);
        if (this.onRenderCallback !== null) {
          this.onRenderCallback();
        }
      }

      playbackState.frameCount += 1;
    }
  }

  /**
   * Returns the second offset of the animation, relative to the initial time.
   */
  public getTime(atTimestamp?: DOMHighResTimeStamp): number {
    if (this.state.type === "unmounted") {
      return this.startAtTime ?? 0;
    }

    const { playbackState } = this.state;
    if (playbackState.type === "paused") {
      return playbackState.pauseTime;
    } else if (playbackState.type === "playing") {
      const resolvedTimestamp = atTimestamp ?? performance.now();
      const elapsed = resolvedTimestamp - playbackState.startTimestamp;
      return elapsed / 1000;
    } else {
      throw new Error("Unexpected playback state");
    }
  }

  /**
   * Seeks to a specific time in the animation, relative to the initial time.
   */
  public seekToTime(time: number): void {
    if (this.state.type === "unmounted") {
      this.startAtTime = time;
      return;
    }

    const { playbackState } = this.state;
    if (playbackState.type === "playing") {
      playbackState.startTimestamp = performance.now() - time * 1000;
    } else if (playbackState.type === "paused") {
      playbackState.pauseTime = time;
    }
  }

  /**
   * Forces a re-render of the scene if the playback state is paused.
   */
  private invalidateIfPaused(): void {
    if (this.state.type === "unmounted") {
      return;
    }

    const { playbackState } = this.state;
    if (playbackState.type === "paused") {
      playbackState.forceRerenderNextFrame = true;
    }
  }

  /**
   * Callback that gets bound to the window's `resize` event.
   */
  private onResizeWindow(): void {
    if (this.state.type === "unmounted") {
      logWarn("WaveRenderer", "Cannot resize when unmounted (ignoring)");
      return;
    }

    const { clientWidth, clientHeight } = this.state.canvas;
    const updatedViewport = computeCameraViewport(clientWidth, clientHeight);
    updateOrthoCamera(this.state.camera, updatedViewport);
    this.state.renderer.setSize(
      clientWidth,
      clientHeight,
      /* updateStyle */ false
    );
    this.invalidateIfPaused();
  }
}

function rgbColorToThreeColor(color: RgbColor): ThreeColor {
  return new ThreeColor(color.red / 255, color.green / 255, color.blue / 255);
}

function vector2LikeToThreeVector2(vector: Vector2Like): Vector2 {
  if (typeof vector === "number") {
    return new Vector2(vector, vector);
  } else {
    return new Vector2(vector[0], vector[1]);
  }
}

/**
 * Class to ensure that the render loop is stopped when the renderer becomes
 * unmounted, without introducing data races.
 */
class RenderStopWrapper {
  private rendering = false;
  private readonly renderCallback: (time: DOMHighResTimeStamp) => void;

  constructor(renderCallback: (time: DOMHighResTimeStamp) => void) {
    this.renderCallback = renderCallback;
  }

  public start(): void {
    this.rendering = true;
    window.requestAnimationFrame(this.renderAndScheduleNext.bind(this));
  }

  public stop(): void {
    this.rendering = false;
  }

  private renderAndScheduleNext(timestamp: DOMHighResTimeStamp): void {
    if (this.rendering) {
      this.renderCallback(timestamp);
      window.requestAnimationFrame(this.renderAndScheduleNext.bind(this));
    }
  }
}
