import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import type { RgbColor } from "polished/lib/types/color";
import isDeepEqual from "fast-deep-equal";
import type { IUniform } from "three";

import WaveRenderer from "./WaveRenderer";
import type { Vector2Like } from "./WaveRenderer";
import { log, logWarn, logError } from "./log";
import type { NonEmptyArray } from "../../ts-utils";

export type WaveCanvasProps = {
  /**
   * An array of colors that will appear as scrolling "lights" on the wave.
   * There must be at least one color.
   */
  colors: NonEmptyArray<RgbColor>;
  /**
   * Color that will be used as the "clear color" for the canvas.
   */
  fallbackColor: RgbColor;
  /**
   * Called after the canvas has been initialized, before the first frame
   * is rendered.
   */
  onLoad?: () => void;
  /**
   * Called at the end of each frame.
   */
  onRender?: () => void;
  /**
   * The initial time for the wave animation. This can be used to control
   * the initial frame so that it is reproducible.
   */
  initialTime?: number;
  /**
   * Sets The subdivision of the plane geometry. This is a vector so that the
   * plane can be subdivided differently in the x and y directions.
   *
   * Note that the vector passed in is implicitly scaled by the plane's aspect
   * ratio, might may not be square.
   */
  subdivision?: Vector2Like;
  /**
   * Whether the animation is paused.
   */
  isPaused?: boolean;
  /**
   * Sets a custom noise function for the wave deformation and colors. This is a
   * GLSL snippet that should contain an implementation for the following
   * interface:
   *
   * ```glsl
   * float noiseFunc(vec3 v);
   * ```
   */
  customNoiseSource?: string;
  /**
   * Sets a custom blend function for the light colors. This is a GLSL snippet
   * that should contain an implementation for the following interface:
   *
   * ```glsl
   * vec3 blendFunc(vec3 bg, vec3 fg, float alpha);
   * ```
   */
  customBlendSource?: string;
  /**
   * Custom uniforms available in the shaders.
   */
  customUniforms?: Record<string, IUniform>;

  /**
   * The frequency of the deform noise texture. Higher values increase the
   * number of peaks and valleys that appear on the plane, and decrease their
   * x-y size. This is a vector so that the noise can be scaled differently in
   * the x and y directions.
   */
  deformNoiseFrequency?: Vector2Like;
  /**
   * The speed of the animation of the deform noise texture. Higher values
   * result in faster animation.
   */
  deformNoiseSpeed?: number;
  /**
   * The strength of the deform noise texture. Higher values result in
   * sharper valleys and peaks.
   */
  deformNoiseStrength?: number;
  /**
   * The speed of the passive scrolling of the deform noise texture. Higher
   * values result in faster scrolling. This is a vector so that the noise can
   * be scrolled at different speeds in the x and y directions.
   */
  deformNoiseScrollSpeed?: Vector2Like;

  /**
   * The frequency of the light noise texture. Higher values increase the
   * number of bright areas that appear on the plane and decrease their size.
   * This is a vector so that the noise can be scaled differently in the x and
   * y directions.
   */
  lightNoiseFrequency?: Vector2Like;
  /**
   * The speed of the animation of the light noise texture. Higher values
   * result in faster animation.
   */
  lightNoiseSpeed?: number;
  /**
   * The speed of the passive scrolling of the light noise texture. Higher
   * values result in faster scrolling. This is a vector so that the noise can
   * be scrolled at different speeds in the x and y directions.
   */
  lightNoiseScrollSpeed?: Vector2Like;
  /**
   * The opacity that each light will have when blended together. The last
   * light will inherently be the strongest, since it is applied last (using a
   * "normal" blend mode).
   */
  lightBlendStrength?: number;
  /**
   * The offset that each successive light will have on the noise texture.
   */
  perLightNoiseOffset?: number;

  className?: string;
  style?: React.CSSProperties;
};

export type WaveCanvasRef = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  rendererRef: React.MutableRefObject<WaveRenderer | null>;
};

/**
 * Displays an animated wavy background, using a Canvas element to render the
 * background with Three.js/WebGL.
 *
 * All props other than `className` and `style` are safe to change between SSR
 * and client render, since their values are only used in effects.
 */
const WaveCanvas = forwardRef<WaveCanvasRef, WaveCanvasProps>(
  (
    {
      colors,
      fallbackColor,
      onLoad,
      onRender,
      initialTime,
      subdivision,
      isPaused,
      customNoiseSource,
      customBlendSource,
      customUniforms,
      deformNoiseFrequency,
      deformNoiseSpeed,
      deformNoiseStrength,
      deformNoiseScrollSpeed,
      lightNoiseFrequency,
      lightNoiseSpeed,
      lightNoiseScrollSpeed,
      lightBlendStrength,
      perLightNoiseOffset,
      className,
      style,
    }: WaveCanvasProps,
    selfRef
  ): React.ReactElement | null => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<WaveRenderer | null>(null);

    useImperativeHandle(selfRef, () => ({ canvasRef, rendererRef }));

    const skipEffectBeforeInit = (
      effect: React.EffectCallback
    ): ReturnType<React.EffectCallback> => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (rendererRef.current != null) {
        return effect();
      }
    };

    // Prop change effects.
    //
    // These need to be ordered before the initialization effect,
    // since we don't want the prop change effects to run on the initial render
    // (see `skipEffectBeforeInit` function).
    useEffectOnDeepUpdate(
      () => skipEffectBeforeInit(() => rendererRef.current?.setColors(colors)),
      [colors]
    );
    useEffectOnDeepUpdate(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setFallbackColor(fallbackColor)
        ),
      [fallbackColor]
    );
    useEffect(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setOnLoad(onLoad ?? null)
        ),
      [onLoad]
    );
    useEffect(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setOnRender(onRender ?? null)
        ),
      [onRender]
    );
    useEffect(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setInitialTime(initialTime ?? null)
        ),
      [initialTime]
    );
    useEffectOnDeepUpdate(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setSubdivision(subdivision ?? null)
        ),
      [subdivision]
    );
    useEffect(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setIsPaused(isPaused ?? null)
        ),
      [isPaused]
    );
    useEffect(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setNoiseSource(customNoiseSource ?? null)
        ),
      [customNoiseSource]
    );
    useEffect(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setBlendSource(customBlendSource ?? null)
        ),
      [customBlendSource]
    );
    useEffectOnDeepUpdate(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setExtraUniforms(customUniforms ?? null)
        ),
      [customUniforms]
    );
    useEffectOnDeepUpdate(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setDeformNoiseFrequency(
            deformNoiseFrequency ?? null
          )
        ),
      [deformNoiseFrequency]
    );
    useEffect(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setDeformNoiseSpeed(deformNoiseSpeed ?? null)
        ),
      [deformNoiseSpeed]
    );
    useEffect(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setDeformNoiseStrength(
            deformNoiseStrength ?? null
          )
        ),
      [deformNoiseStrength]
    );
    useEffectOnDeepUpdate(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setDeformNoiseScrollSpeed(
            deformNoiseScrollSpeed ?? null
          )
        ),
      [deformNoiseScrollSpeed]
    );
    useEffectOnDeepUpdate(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setLightNoiseFrequency(
            lightNoiseFrequency ?? null
          )
        ),
      [lightNoiseFrequency]
    );
    useEffect(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setLightNoiseSpeed(lightNoiseSpeed ?? null)
        ),
      [lightNoiseSpeed]
    );
    useEffectOnDeepUpdate(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setLightNoiseScrollSpeed(
            lightNoiseScrollSpeed ?? null
          )
        ),
      [lightNoiseScrollSpeed]
    );
    useEffect(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setLightBlendStrength(lightBlendStrength ?? null)
        ),
      [lightBlendStrength]
    );
    useEffect(
      () =>
        skipEffectBeforeInit(() =>
          rendererRef.current?.setPerLightNoiseOffset(
            perLightNoiseOffset ?? null
          )
        ),
      [perLightNoiseOffset]
    );

    // Initialization effect
    useEffect(() => {
      if (canvasRef.current === null) {
        logError("WaveCanvas", "canvasRef.current is null in init");
        return;
      }

      const renderer = new WaveRenderer();
      renderer.setOnLoad(onLoad ?? null);
      renderer.setOnRender(onRender ?? null);
      renderer.setColors(colors);
      renderer.setFallbackColor(fallbackColor);
      renderer.setInitialTime(initialTime ?? null);
      renderer.setSubdivision(subdivision ?? null);
      renderer.setIsPaused(isPaused ?? null);
      renderer.setNoiseSource(customNoiseSource ?? null);
      renderer.setBlendSource(customBlendSource ?? null);
      renderer.setExtraUniforms(customUniforms ?? null);
      renderer.setDeformNoiseFrequency(deformNoiseFrequency ?? null);
      renderer.setDeformNoiseSpeed(deformNoiseSpeed ?? null);
      renderer.setDeformNoiseStrength(deformNoiseStrength ?? null);
      renderer.setDeformNoiseScrollSpeed(deformNoiseScrollSpeed ?? null);
      renderer.setLightNoiseFrequency(lightNoiseFrequency ?? null);
      renderer.setLightNoiseSpeed(lightNoiseSpeed ?? null);
      renderer.setLightNoiseScrollSpeed(lightNoiseScrollSpeed ?? null);
      renderer.setLightBlendStrength(lightBlendStrength ?? null);
      renderer.setPerLightNoiseOffset(perLightNoiseOffset ?? null);
      rendererRef.current = renderer;

      // Make the canvas initialization low-priority, if possible:
      const deferredInit = (): void => {
        if (rendererRef.current === null) {
          // Possible if the component unmounted before this callback ran.
          logWarn(
            "WaveCanvas",
            "rendererRef.current was null in deferred init"
          );
          return;
        } else if (canvasRef.current === null) {
          logWarn("WaveCanvas", "canvasRef.current was null in deferred init");
          return;
        }

        log("WaveCanvas", "Mounting renderer");
        rendererRef.current.mount({ canvas: canvasRef.current });
      };
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(deferredInit, { timeout: 1000 });
      } else {
        (window as Window).setTimeout(deferredInit, 200);
      }

      return (): void => {
        if (rendererRef.current === null) {
          logWarn("WaveCanvas", "rendererRef.current was null in unmount");
          return;
        }

        log("WaveCanvas", "Unmounting renderer");
        rendererRef.current.unmount();
        rendererRef.current = null;
      };

      // This hook should only run once upon mounting, with the initial props:
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <canvas ref={canvasRef} className={className} style={style} />;
  }
);

export default WaveCanvas;

/**
 * Run an effect only when the dependencies change deeply.
 */
function useEffectOnDeepUpdate(
  effect: React.EffectCallback,
  dependencies: React.DependencyList
): void {
  const previousValues = useRef(dependencies);
  useEffect(() => {
    const currentValues = dependencies;
    if (!isDeepEqual(previousValues.current, currentValues)) {
      previousValues.current = currentValues;
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
