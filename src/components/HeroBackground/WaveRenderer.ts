/* eslint-disable max-classes-per-file */

import type { RgbColor } from "polished/lib/types/color";
import {
  OrthographicCamera,
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
import { vertexShader, fragmentShader, MAX_LIGHTS } from "./shaders";
import type { LightStruct } from "./shaders";

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
      startTimestamp: DOMHighResTimeStamp;
      frameCount: number;
      renderStopWrapper: RenderStopWrapper;
    };

export type Vector2Like = [x: number, y: number] | number;

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

  public static DEFAULT_DEFORM_NOISE_FREQUENCY: Vector2Like = 2;
  public static DEFAULT_DEFORM_NOISE_SPEED = 0.06;
  public static DEFAULT_DEFORM_NOISE_STRENGTH = 0.2;
  public static DEFAULT_DEFORM_NOISE_SCROLL_SPEED: Vector2Like = [0.025, 0.01];

  public static DEFAULT_LIGHT_NOISE_FREQUENCY: Vector2Like = 1;
  public static DEFAULT_LIGHT_NOISE_SPEED = 0.03;
  public static DEFAULT_LIGHT_NOISE_SCROLL_SPEED: Vector2Like = [0.025, 0.01];
  public static DEFAULT_LIGHT_BLEND_STRENGTH = 1;
  public static DEFAULT_PER_LIGHT_NOISE_OFFSET = 8;

  private onLoadCallback: (() => void) | null = null;
  private colors: NonEmptyArray<RgbColor> = [WaveRenderer.DEFAULT_WAVE_COLOR];
  private fallbackColor: RgbColor = WaveRenderer.DEFAULT_WAVE_COLOR;
  private initialTime: number = WaveRenderer.DEFAULT_INITIAL_TIME;
  private subdivision: Vector2Like = WaveRenderer.DEFAULT_SUBDIVISION;

  private deformNoiseFrequency: Vector2Like =
    WaveRenderer.DEFAULT_DEFORM_NOISE_FREQUENCY;
  private deformNoiseSpeed: number = WaveRenderer.DEFAULT_DEFORM_NOISE_SPEED;
  private deformNoiseStrength: number =
    WaveRenderer.DEFAULT_DEFORM_NOISE_STRENGTH;
  private deformNoiseScrollSpeed: Vector2Like =
    WaveRenderer.DEFAULT_DEFORM_NOISE_SCROLL_SPEED;

  private lightNoiseFrequency: Vector2Like =
    WaveRenderer.DEFAULT_LIGHT_NOISE_FREQUENCY;
  private lightNoiseSpeed: number = WaveRenderer.DEFAULT_LIGHT_NOISE_SPEED;
  private lightNoiseScrollSpeed: Vector2Like =
    WaveRenderer.DEFAULT_LIGHT_NOISE_SCROLL_SPEED;
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
   * Sets the colors to use for the waves. The array must be non-empty.
   */
  public setColors(colors: NonEmptyArray<RgbColor>): void {
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
    }
  }

  /**
   * Sets the initial time for the wave animation. This can be used to control
   * the initial frame so that it is reproducible.
   */
  public setInitialTime(time: number | null): void {
    this.initialTime = time ?? WaveRenderer.DEFAULT_INITIAL_TIME;
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
        this.deformNoiseSpeed;
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
        this.deformNoiseStrength;
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
        this.lightNoiseSpeed;
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
    }
  }

  /**
   * Mounts the renderer to the given canvas, initializing the mesh geometry
   * and compiling the shaders.
   */
  public mount({ canvas }: { canvas: HTMLCanvasElement }): void {
    const scene = new Scene();
    const { clientWidth, clientHeight } = canvas;
    const initialViewport = computeCameraViewport(clientWidth, clientHeight);
    const camera = createOrthoCamera(initialViewport);
    camera.name = "main-camera";
    scene.add(camera);

    const renderer = new WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(clientWidth, clientHeight, /* updateStyle */ false);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(rgbColorToThreeColor(this.fallbackColor));

    const { plane, material } = this.setupScene({ scene });

    const boundOnResizeWindow = this.onResizeWindow.bind(this);
    window.addEventListener("resize", boundOnResizeWindow);

    const startTimestamp = performance.now();
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
      startTimestamp,
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
   * Sets up the Three.js scene for the waves.
   */
  private setupScene({ scene }: { scene: Scene }): {
    plane: Mesh;
    material: ShaderMaterial;
  } {
    const geometry = this.createPlaneGeometry();
    const material = new ShaderMaterial({
      uniforms: {
        inTime: { value: /* This value is ignored */ 0 },
        inDeformNoiseFrequency: { value: this.getDeformNoiseFrequency() },
        inDeformNoiseSpeed: { value: this.deformNoiseSpeed },
        inDeformNoiseStrength: { value: this.deformNoiseStrength },
        inDeformNoiseScrollSpeed: { value: this.getDeformNoiseScrollSpeed() },
        inLights: { value: this.getLightsUniformValue() },
        inLightNoiseFrequency: { value: this.getLightNoiseFrequency() },
        inLightNoiseSpeed: { value: this.lightNoiseSpeed },
        inLightNoiseScrollSpeed: { value: this.getLightNoiseScrollSpeed() },
        inLightBlendStrength: { value: this.lightBlendStrength },
        inPerLightNoiseOffset: { value: this.perLightNoiseOffset },
      },
      vertexShader,
      fragmentShader,
    });
    const plane = new Mesh(geometry, material);
    plane.rotation.x = (Math.PI / 2) * PLANE_TILT;
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

  private getDeformNoiseScrollSpeed(): Vector2 {
    const vec = vector2LikeToThreeVector2(this.deformNoiseScrollSpeed);
    return new Vector2(vec.x * PLANE_ASPECT.x, vec.y * PLANE_ASPECT.y);
  }

  private getLightNoiseFrequency(): Vector2 {
    const vec = vector2LikeToThreeVector2(this.lightNoiseFrequency);
    return new Vector2(vec.x * PLANE_ASPECT.x, vec.y * PLANE_ASPECT.y);
  }

  private getLightNoiseScrollSpeed(): Vector2 {
    const vec = vector2LikeToThreeVector2(this.lightNoiseScrollSpeed);
    return new Vector2(vec.x * PLANE_ASPECT.x, vec.y * PLANE_ASPECT.y);
  }

  /**
   * Called from `requestAnimationFrame` to render the scene.
   */
  private render(time: DOMHighResTimeStamp): void {
    if (this.state.type === "unmounted") {
      return;
    }

    const { frameCount } = this.state;
    if (frameCount % 2 !== 1) {
      // Skip this frame to reduce load.
    } else {
      const elapsed = time - this.state.startTimestamp;
      this.state.material.uniforms.inTime.value =
        elapsed / 1000 + this.initialTime;
      this.state.renderer.render(this.state.scene, this.state.camera);
    }

    this.state.frameCount = frameCount + 1;
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
