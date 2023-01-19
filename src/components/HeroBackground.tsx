import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import { StaticImage } from "gatsby-plugin-image";
import { parseToRgb, rgba } from "polished";
import { ClassNames } from "@emotion/react";
import type { ClassNamesContent } from "@emotion/react";
import type { RgbColor } from "polished/lib/types/color";

import {
  hybridColor,
  ColorMode,
  mode,
  HeroBackgroundColors as HeroBackgroundColorStrings,
} from "../theme/color";
import { useColorMode, useGlobalDebugHandle, useMediaQuery } from "../hooks";
import type { NonEmptyArray, TupleVector2 } from "../ts-utils";
// Must only `import type` from WaveCanvas, since it should be bundle-split:
import type { WaveCanvasRef } from "./WaveCanvas/WaveCanvas";

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

const HeroBackgroundColorObjects: {
  [k in ColorMode]: NonEmptyArray<RgbColor>;
} = Object.fromEntries(
  Object.entries(
    // Assert that the constant is correct so that the output of the
    // transformation is valid.
    HeroBackgroundColorStrings satisfies {
      [k in ColorMode]: Readonly<NonEmptyArray<string>>;
    }
  ).map(([k, v]) => [k, v.map((c) => parseToRgb(c))])
) as { [k in ColorMode]: NonEmptyArray<RgbColor> };

const Styled = {
  HeroLayout: styled.div`
    display: grid;
    height: min(100%, 100vh);
    width: 100%;
    z-index: -1;
    user-select: none;

    .dark-fallback,
    .light-fallback {
      max-height: 100vh;
    }

    ${mode(ColorMode.Light)} {
      .dark-fallback {
        display: none;
      }
    }

    ${mode(ColorMode.Dark)} {
      .light-fallback {
        display: none;
      }
    }

    /* When forced-colors are enabled, hide the background */
    @media (forced-colors: active) {
      .dark-fallback,
      .light-fallback {
        display: none;
      }
    }
  `,
  makeWaveCanvasClassName: (css: ClassNamesContent["css"]): string => css`
    opacity: 0;
    transition: opacity 1s linear;
    grid-area: 1/1;
    height: 100%;
    width: 100%;
    z-index: 1;
    max-height: 100vh;
    &.wave-canvas-loaded {
      opacity: 1;
    }

    /* When forced-colors or prefers-reduced-motion are enabled, hide the
    canvas. This is also done in script, but duplicate it here. */
    @media (forced-colors: active) {
      display: none;
    }
    @media (prefers-reduced-motion: reduce) {
      display: none;
    }
  `,
  HeroMask: styled.div`
    height: 100%;

    /* Construct the wave-like mask and full-screen color overlay,
    using partially-faded background color values for all color modes.
    Previously, this used a PNG mask to accomplish the wave shape,
    but having it all in CSS reduces the data transferred
    and makes it a lot easier to change the colors */
    ${enumKeys(ColorMode)
      .map(
        (key) => `
          ${mode(ColorMode[key])} {
            background-color:
              ${rgba(hybridColor("bg", ColorMode[key]), 0.3)};
            background-image: linear-gradient(
                ${rgba(hybridColor("bg", ColorMode[key]), 0)},
                ${rgba(hybridColor("bg", ColorMode[key]), 0)} 30%,
                ${rgba(hybridColor("bg", ColorMode[key]), 1)} 95%,
                ${rgba(hybridColor("bg", ColorMode[key]), 1)}
              ),
              radial-gradient(
                circle 40vw at right 20% bottom 0%,
                ${rgba(hybridColor("bg", ColorMode[key]), 0.8)},
                ${rgba(hybridColor("bg", ColorMode[key]), 0)}
              ),
              radial-gradient(
                circle 40vw at right 20% bottom 30%,
                ${rgba(hybridColor("bg", ColorMode[key]), 0.8)},
                ${rgba(hybridColor("bg", ColorMode[key]), 0)}
              ),
              radial-gradient(
                circle 40vw at right 20% bottom 40%,
                ${rgba(hybridColor("bg", ColorMode[key]), 0.8)},
                ${rgba(hybridColor("bg", ColorMode[key]), 0)}
              ),
              radial-gradient(
                circle 35vw at left -5% bottom 0%,
                ${rgba(hybridColor("bg", ColorMode[key]), 0.8)},
                ${rgba(hybridColor("bg", ColorMode[key]), 0)}
              ),
              radial-gradient(
                circle 35vw at left -5% bottom 5%,
                ${rgba(hybridColor("bg", ColorMode[key]), 0.8)},
                ${rgba(hybridColor("bg", ColorMode[key]), 0)}
              ),
              radial-gradient(
                circle 35vw at left 50% bottom 0%,
                ${rgba(hybridColor("bg", ColorMode[key]), 0.5)},
                ${rgba(hybridColor("bg", ColorMode[key]), 0)}
              );
          }`
      )
      .join("\n")}

    /* When forced-colors are enabled, hide the background */
    @media (forced-colors: active) {
      display: none;
    }
  `,
};

export type HeroBackgroundProps = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Displays an animated wavy background with a gradient mask on top of it
 * to fade into the normal site background at the bottom.
 *
 * While loading, the background uses blurred Gatsby images as a placeholder,
 * and then smoothly fades the animated canvas in once it's ready.
 *
 * ### Steps for regenerating the background fallback images:
 * 1. Open the homepage of the site.
 * 2. Open Chrome devtools, and use the device toolbar to manually set the
 *    device resolution to 3840x3840. Ensure the device pixel ratio is set to 1.
 * 3. In the console, run:
 *    ```js
 *    window.debug.takeHeroBackgroundFallbacks();
 *    ```
 */
export default function HeroBackground({
  className,
  style,
}: HeroBackgroundProps): React.ReactElement {
  // Disable the animated gradient if the agent prefers reduced motion,
  // or if a forced color/high contrast mode is enabled.
  // The lazy-loader always renders nothing on its first render, so it's safe
  // to render the component on the first render without worrying about
  // hydration inconsistencies.
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const usingForcedColor = useMediaQuery("(forced-colors: active)");
  const renderWaveCanvas = !usingForcedColor && !reducedMotion;

  return (
    <Styled.HeroLayout className={className} style={style}>
      <StaticImage
        className="dark-fallback"
        style={{
          gridArea: "1/1",
          zIndex: 0,
          userSelect: "none",
        }}
        layout="fullWidth"
        alt=""
        src="../images/hero/fallback.dark.png"
        placeholder="blurred"
        formats={["auto", "webp", "avif"]}
        quality={60}
        draggable={false}
      />
      <StaticImage
        className="light-fallback"
        style={{
          gridArea: "1/1",
          zIndex: 0,
          userSelect: "none",
        }}
        layout="fullWidth"
        alt=""
        src="../images/hero/fallback.light.png"
        placeholder="blurred"
        formats={["auto", "webp", "avif"]}
        quality={60}
        draggable={false}
      />
      {renderWaveCanvas && <WaveCanvasLazyLoader />}
      <Styled.HeroMask style={{ gridArea: "1/1", zIndex: 2 }} />
    </Styled.HeroLayout>
  );
}

async function requestLowPriority(): Promise<void> {
  if ("requestIdleCallback" in window) {
    return new Promise((resolve) => {
      window.requestIdleCallback(() => resolve(), { timeout: 2000 });
    });
  } else {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }
}

const LazyWaveCanvas = React.lazy(async () => {
  // Load the WaveCanvas component asynchronously, at a low priority.
  await requestLowPriority();
  const WaveCanvas = await import("./WaveCanvas");
  return WaveCanvas;
});

/**
 * Client-side only component that loads the WaveCanvas component.
 */
function WaveCanvasLazyLoader(): React.ReactElement {
  const colorMode = useColorMode();
  const [isLoaded, setIsLoaded] = useState(false);
  const onLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);
  const canvasRef = useRef<WaveCanvasRef | null>(null);

  // Augment the global scope's `debug` object with a  command to take a
  // screenshot of the canvas, at the beginning of the animation.
  useGlobalDebugHandle(
    {
      takeHeroBackgroundFallbacks: (): void => {
        window.console.log("[HeroBackground] Taking screenshots...");
        const rendererRef = canvasRef.current?.rendererRef.current;
        if (rendererRef == null) {
          window.console.error(
            "[HeroBackground] Failed to make fallback images: no renderer ref"
          );
          return;
        }

        Object.values(ColorMode).forEach((m) => {
          rendererRef.seekToTime(0);
          rendererRef.setFallbackColor(HeroBackgroundColorObjects[m][0]);
          rendererRef.setColors(HeroBackgroundColorObjects[m]);
          const imageData = rendererRef.exportImage("image/png") ?? "";
          if (imageData === "") {
            window.console.error("[HeroBackground] Failed to take screenshot");
            return;
          }

          const fakeDownloadLink = document.createElement("a");
          fakeDownloadLink.download = `fallback.${m}.png`;
          fakeDownloadLink.href = imageData;
          fakeDownloadLink.click();
          window.console.log(`[HeroBackground] Took screenshot for ${m}`);
        });

        window.console.log("[HeroBackground] Success");
      },
    },
    []
  );

  // When the canvas first loads, slowly ramp up the animation speed.
  // This has to be done in a bit of a hack, since each frame of the animation
  // is a function of both the current speed and the time elapsed since the
  // start of the animation (instead of just the time since the start).
  //
  // Instead, we need to manually adjust both the time offset and current time
  // of the animation in a way that preserves the current animation state
  // across speed changes:

  const baseTimeOffset = 32;
  const baseDeformNoiseSpeed = 3;
  const baseDeformNoiseScrollSpeed = [1.5, 0.5] as const;
  const baseLightNoiseSpeed = 3;
  const baseLightNoiseScrollSpeed = [2.5, 1] as const;

  const speedRamp = [0.001, 0.2, 0.4, 0.6, 0.8, 1] as const;
  const rampDelayMs = 1000;
  const [speedRampIndex, setSpeedRampIndex] = useState<number>(0);

  const getTimeOffset = (index: number): number =>
    baseTimeOffset / speedRamp[index];
  const getDeformNoiseSpeed = (index: number): number =>
    speedRamp[index] * baseDeformNoiseSpeed;
  const getDeformNoiseScrollSpeed = (index: number): TupleVector2 =>
    baseDeformNoiseScrollSpeed.map(
      (v) => v * speedRamp[index]
    ) as unknown as TupleVector2;
  const getLightNoiseSpeed = (index: number): number =>
    speedRamp[index] * baseLightNoiseSpeed;
  const getLightNoiseScrollSpeed = (index: number): TupleVector2 =>
    baseLightNoiseScrollSpeed.map(
      (v) => v * speedRamp[index]
    ) as unknown as TupleVector2;

  useEffect((): (() => void) | void => {
    if (isLoaded && speedRampIndex < speedRamp.length - 1) {
      const timeout = setTimeout(() => {
        const rendererRef = canvasRef.current?.rendererRef.current;
        if (rendererRef != null) {
          const oldSpeedIndex = speedRampIndex;
          const newSpeedIndex = speedRampIndex + 1;

          // Instantly update the animation's speed, without waiting for a React
          // render cycle.

          // Additionally, correct the time of the animation to account for the
          // speed change.
          //
          // This needs to preserve the following equation:
          // (oldTime + oldTimeOffset) * oldSpeed = (newTime + newTimeOffset) * newSpeed
          //
          // Or, equivalently:
          // oldTime * oldSpeed = newTime * newSpeed
          const oldSpeed = speedRamp[oldSpeedIndex];
          const newSpeed = speedRamp[newSpeedIndex];
          const oldTime = rendererRef.getTime();
          const newTime = (oldTime * oldSpeed) / newSpeed;
          rendererRef.seekToTime(newTime);

          rendererRef.setTimeOffset(getTimeOffset(newSpeedIndex));
          rendererRef.setDeformNoiseSpeed(getDeformNoiseSpeed(newSpeedIndex));
          rendererRef.setDeformNoiseScrollSpeed(
            getDeformNoiseScrollSpeed(newSpeedIndex)
          );
          rendererRef.setLightNoiseSpeed(getLightNoiseSpeed(newSpeedIndex));
          rendererRef.setLightNoiseScrollSpeed(
            getLightNoiseScrollSpeed(newSpeedIndex)
          );

          // Update the React state to trigger a re-render and scheduling of the
          // next speed ramp effect.
          setSpeedRampIndex(newSpeedIndex);
        }
      }, rampDelayMs);
      return () => clearTimeout(timeout);
    }
    // `speedRamp` and `getXXX` are constants, so we can safely disable the
    // exhaustive-deps rule.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedRampIndex, isLoaded]);

  return (
    <ClassNames>
      {({ css, cx }): React.ReactElement => (
        <Suspense fallback={null}>
          <LazyWaveCanvas
            ref={canvasRef}
            colors={HeroBackgroundColorObjects[colorMode]}
            fallbackColor={HeroBackgroundColorObjects[colorMode][0]}
            className={cx(Styled.makeWaveCanvasClassName(css), {
              "wave-canvas-loaded": isLoaded,
            })}
            onLoad={onLoad}
            timeOffset={getTimeOffset(speedRampIndex)}
            deformNoiseSpeed={getDeformNoiseSpeed(speedRampIndex)}
            deformNoiseScrollSpeed={getDeformNoiseScrollSpeed(speedRampIndex)}
            lightNoiseSpeed={getLightNoiseSpeed(speedRampIndex)}
            lightNoiseScrollSpeed={getLightNoiseScrollSpeed(speedRampIndex)}
            subdivision={72}
            deformNoiseFrequency={[2, 1.5]}
            deformNoiseStrength={5}
            deformNoiseClampLow={0}
            deformNoiseClampHigh={1}
            lightNoiseFrequency={1.25}
            lightNoiseClampLow={-0.3}
            lightNoiseClampHigh={1}
            lightBlendStrength={1}
            perLightNoiseOffset={0.2}
          />
        </Suspense>
      )}
    </ClassNames>
  );
}
