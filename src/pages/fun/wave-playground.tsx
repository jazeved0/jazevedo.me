import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import type { RgbColor } from "polished/lib/types/color";
import { parseToRgb } from "polished";
import { folder, button, Leva, useControls } from "leva";
import Stats from "three/examples/jsm/libs/stats.module";
import isDeepEqual from "fast-deep-equal";

import Layout from "../../components/Layout";
import Meta from "../../components/Meta";
import WaveCanvas from "../../components/WaveCanvas";
import type { WaveCanvasRef } from "../../components/WaveCanvas/WaveCanvas";
import type { NonEmptyArray, TupleVector2 } from "../../ts-utils";
import {
  ColorMode,
  HeroBackgroundColors as WaveColorStrings,
  getColorModeKey,
} from "../../theme/color";
import { useInitialRender } from "../../hooks";
import { MAX_LIGHTS } from "../../components/WaveCanvas/shaders";
import allNoiseFunctions from "../../components/WaveCanvas/shaders/noise/all.glsl";
import { NoiseType } from "../../components/WaveCanvas/shaders/noise/all";
import allBlendFunctions from "../../components/WaveCanvas/shaders/blend/all.glsl";
import { BlendType } from "../../components/WaveCanvas/shaders/blend/all";

const Styled = {
  Canvas: styled(WaveCanvas)`
    height: min(100%, 100vh);
    width: 100%;
    overflow: hidden;
  `,
  LevaContainer: styled.div`
    /* Increase the width of the controls */
    & > :not(canvas) {
      width: 320px;
    }
  `,
};

/**
 * Page that renders a <WaveCanvas> component with a bunch of controls.
 * The controls are made using the [Leva library](https://github.com/pmndrs/leva).
 */
export default function WavesPlaygroundPage(): React.ReactElement {
  const initialRender = useInitialRender();

  return (
    <Layout
      hideFooter
      hideHeader
      overlayChildren={
        <>
          {/* Render the Playground only on the client-side */}
          {initialRender ? null : <Playground />}
        </>
      }
    />
  );
}

// Gatsby Head component:
// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
export function Head(): React.ReactElement {
  return <Meta title="Waves playground 🌊" noIndex noSiteTitle />;
}

type PlaygroundControls = {
  showStats: boolean;
  timeOffset: number;
  currentTime: number;
  isPaused: boolean;
  subdivision: number;
  noiseFunction: NoiseType;
  deformNoiseFrequency: TupleVector2;
  deformNoiseSpeed: number;
  deformNoiseStrength: number;
  deformNoiseScrollSpeed: TupleVector2;
  deformNoiseClampLow: number;
  deformNoiseClampHigh: number;
  lightNoiseFrequency: TupleVector2;
  lightNoiseSpeed: number;
  lightNoiseScrollSpeed: TupleVector2;
  lightNoiseClampLow: number;
  lightNoiseClampHigh: number;
  lightBlendFunction: BlendType;
  lightBlendStrength: number;
  perLightNoiseOffset: number;
  colorMode: ColorMode;
} & { [key in ColorMode as `${key}Colors`]: Readonly<NonEmptyArray<string>> };

const defaultControls = {
  showStats: true,
  timeOffset: 0,
  currentTime: 0,
  isPaused: false,
  subdivision: 72,
  noiseFunction: NoiseType.Simplex,
  deformNoiseFrequency: [2, 2],
  deformNoiseSpeed: 6,
  deformNoiseStrength: 2,
  deformNoiseScrollSpeed: [2.5, 1],
  deformNoiseClampLow: -1,
  deformNoiseClampHigh: 1,
  lightNoiseFrequency: [1, 1],
  lightNoiseSpeed: 3,
  lightNoiseScrollSpeed: [2.5, 1],
  lightNoiseClampLow: -0.5,
  lightNoiseClampHigh: 1,
  lightBlendFunction: BlendType.Normal,
  lightBlendStrength: 1,
  perLightNoiseOffset: 0.2,
  colorMode: ColorMode.Dark,
  darkColors: WaveColorStrings.dark,
  lightColors: WaveColorStrings.light,
} as const satisfies Readonly<PlaygroundControls>;

const serializedKeyMap = {
  showStats: "stats",
  timeOffset: "t0",
  currentTime: "t",
  isPaused: "p",
  subdivision: "sub",
  noiseFunction: "noiseFn",
  deformNoiseFrequency: "defFreq",
  deformNoiseSpeed: "defSpeed",
  deformNoiseStrength: "defStrength",
  deformNoiseScrollSpeed: "defScroll",
  deformNoiseClampLow: "defLow",
  deformNoiseClampHigh: "defHigh",
  lightNoiseFrequency: "lightFreq",
  lightNoiseSpeed: "lightSpeed",
  lightNoiseScrollSpeed: "lightScroll",
  lightNoiseClampLow: "lightLow",
  lightNoiseClampHigh: "lightHigh",
  lightBlendFunction: "blendFn",
  lightBlendStrength: "blendStrength",
  perLightNoiseOffset: "lightOffset",
  colorMode: "theme",
  darkColors: "dColors",
  lightColors: "lColors",
} as const satisfies { [key in keyof PlaygroundControls]: string };

const serializedKeyMapInverse = Object.fromEntries(
  Object.entries(serializedKeyMap).map(([key, value]) => [value, key])
) as { [key in string]: keyof PlaygroundControls };

function toFixedTrimmed(value: number, precision: number): string {
  let base = value.toFixed(precision);
  // Remove trailing zeros
  base = base.replace(/0+$/, "");
  // Remove trailing decimal point
  base = base.replace(/\.$/, "");
  return base;
}

function throttle<T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number
): T {
  let lastCall = 0;
  return ((...args: never[]) => {
    const now = Date.now();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }) as T;
}

const replaceSearchParams = throttle(
  (serializedSearchParams: string | null): void => {
    if (serializedSearchParams === null) {
      window.history.replaceState(null, "", window.location.pathname);
    } else {
      window.history.replaceState(null, "", `?${serializedSearchParams}`);
    }
  },
  250
);

function usePlaygroundControlsState(): {
  controls: PlaygroundControls;
  patchControls: (patch: Partial<PlaygroundControls>) => void;
  updateControls: (
    updater: (currentControls: PlaygroundControls) => PlaygroundControls
  ) => void;
  resetControls: () => void;
} {
  const [controls, setControls] = useState<PlaygroundControls>(() => {
    // Grab the initial values from the URL search parameters.
    const urlParams = new URLSearchParams(window.location.search);
    const initialControls: PlaygroundControls = { ...defaultControls };
    urlParams.forEach((value, key) => {
      const keyInControls = serializedKeyMapInverse[key];
      if (keyInControls === undefined) {
        return;
      }

      const valueInControls: unknown = JSON.parse(value);
      Object.assign(initialControls, { [keyInControls]: valueInControls });
    });

    return initialControls;
  });

  const updateControls = useCallback(
    (update: (currentControls: PlaygroundControls) => PlaygroundControls) => {
      setControls((currentControls: PlaygroundControls) => {
        const newControls = update(currentControls);
        const urlParams = new URLSearchParams();
        Object.entries(newControls).forEach(([key, value]) => {
          const typedKey = key as keyof PlaygroundControls;
          const keyInSerializedKeyMap = serializedKeyMap[typedKey];
          if (keyInSerializedKeyMap === undefined) {
            return;
          }

          if (!isDeepEqual(value, defaultControls[typedKey])) {
            // Serialize numbers to 3 decimal places.
            if (typeof value === "number") {
              urlParams.set(keyInSerializedKeyMap, toFixedTrimmed(value, 3));
            } else if (
              Array.isArray(value) &&
              value.length === 2 &&
              value.every((v) => typeof v === "number")
            ) {
              urlParams.set(
                keyInSerializedKeyMap,
                `[${(value as TupleVector2)
                  .map((v) => toFixedTrimmed(v, 3))
                  .join(",")}]`
              );
            } else {
              urlParams.set(keyInSerializedKeyMap, JSON.stringify(value));
            }
          }
        });

        if (Array.from(urlParams.keys()).length === 0) {
          replaceSearchParams(null);
        } else {
          replaceSearchParams(urlParams.toString());
        }

        return newControls;
      });
    },
    [setControls]
  );

  const patchControls = useCallback(
    (patch: Partial<PlaygroundControls>) => {
      updateControls((currentControls: PlaygroundControls) => ({
        ...currentControls,
        ...patch,
      }));
    },
    [updateControls]
  );

  const resetControls = useCallback(() => {
    patchControls(defaultControls);
  }, [patchControls]);

  return {
    controls,
    patchControls,
    updateControls,
    resetControls,
  };
}

/**
 * Client-side only component.
 */
function Playground(): React.ReactElement {
  const canvasRef = React.useRef<WaveCanvasRef | null>(null);

  // Add Three.js stats to the page.
  const statsRef = useRef<Stats>(null as unknown as Stats);
  if (statsRef.current === null) {
    statsRef.current = Stats();
  }
  useEffect(() => {
    document.body.appendChild(statsRef.current.dom);
    // Increase the size of the stats.
    statsRef.current.dom.style.transformOrigin = "top left";
    statsRef.current.dom.style.transform = "scale(1.5)";
    return () => {
      document.body.removeChild(statsRef.current.dom);
    };
  }, []);
  const postRender = useCallback(() => {
    statsRef.current.update();
  }, []);

  const { controls, patchControls, updateControls, resetControls } =
    usePlaygroundControlsState();
  const {
    showStats,
    timeOffset,
    currentTime,
    isPaused,
    subdivision,
    noiseFunction,
    deformNoiseFrequency,
    deformNoiseSpeed,
    deformNoiseStrength,
    deformNoiseScrollSpeed,
    deformNoiseClampLow,
    deformNoiseClampHigh,
    lightNoiseFrequency,
    lightNoiseSpeed,
    lightNoiseScrollSpeed,
    lightNoiseClampLow,
    lightNoiseClampHigh,
    lightBlendFunction,
    lightBlendStrength,
    perLightNoiseOffset,
    colorMode,
    ...colors
  } = controls;

  const lightThemeKey = "Lights.theme";
  const [, set] = useControls(() => ({
    "Take screenshot": button(() => {
      if (
        canvasRef.current != null &&
        canvasRef.current.canvasRef.current != null
      ) {
        const imageData =
          canvasRef.current.rendererRef.current?.exportImage("image/png") ?? "";
        if (imageData === "") {
          window.console.error(
            "[WavesPlaygroundPage] Failed to take screenshot"
          );
          return;
        }

        const fakeDownloadLink = document.createElement("a");
        fakeDownloadLink.download = "waves.png";
        fakeDownloadLink.href = imageData;
        fakeDownloadLink.click();
      }
    }),
    "Restart animation": button(() => {
      canvasRef.current?.rendererRef.current?.restartAnimation();
      patchControls({ currentTime: 0 });
    }),
    "Reset controls": button(() => {
      // HACK: this function needs to reset both the controlled state and the
      // leva-internal state (via `set`/its cousins):
      resetControls();
      set({
        isPaused: defaultControls.isPaused,
        timeOffset: defaultControls.timeOffset,
        hideStats: !defaultControls.showStats,
        subdivision: defaultControls.subdivision,
        noiseFunction: NoiseType[defaultControls.noiseFunction],
        deformNoiseFrequency: defaultControls.deformNoiseFrequency,
        deformNoiseSpeed: defaultControls.deformNoiseSpeed,
        deformNoiseStrength: defaultControls.deformNoiseStrength,
        deformNoiseScrollSpeed: defaultControls.deformNoiseScrollSpeed,
        deformNoiseClamp: [
          defaultControls.deformNoiseClampLow,
          defaultControls.deformNoiseClampHigh,
        ],
        lightNoiseFrequency: defaultControls.lightNoiseFrequency,
        lightNoiseSpeed: defaultControls.lightNoiseSpeed,
        lightNoiseScrollSpeed: defaultControls.lightNoiseScrollSpeed,
        lightNoiseClamp: [
          defaultControls.lightNoiseClampLow,
          defaultControls.lightNoiseClampHigh,
        ],
        perLightNoiseOffset: defaultControls.perLightNoiseOffset,
        lightBlendFunction: BlendType[defaultControls.lightBlendFunction],
        lightBlendStrength: defaultControls.lightBlendStrength,
        [lightThemeKey]: getColorModeKey(defaultControls.colorMode),
      } as Parameters<typeof set>[0]);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      setLightCountStore(
        Object.fromEntries(
          Object.values(ColorMode).map((mode: ColorMode) => {
            const defaultColors = defaultControls[`${mode}Colors`];
            return [
              // eslint-disable-next-line @typescript-eslint/no-use-before-define
              makeLightCountKey(mode),
              defaultColors.length,
            ];
          })
        )
      );
      Object.values(ColorMode).forEach((mode: ColorMode) => {
        const defaultColors = defaultControls[`${mode}Colors`];
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        syncLightColorsStore(defaultColors, mode);
      });
    }),
    isPaused: {
      label: "Pause",
      value: isPaused,
      onChange: (newIsPaused: boolean) =>
        patchControls({ isPaused: newIsPaused }),
    },
    timeOffset: {
      label: "Time offset",
      min: 0,
      step: 0.25,
      hint: "The initial time of the animation",
      value: timeOffset,
      onChange: (newTimeOffset: number) =>
        patchControls({ timeOffset: newTimeOffset }),
    },
    hideStats: {
      label: "Hide stats",
      hint: "Hides the Three.js stats panel in the top-left",
      value: !showStats,
      onChange: (newHideStats: boolean): void => {
        statsRef.current.dom.style.display = newHideStats ? "none" : "block";
        patchControls({ showStats: !newHideStats });
      },
    },
    subdivision: {
      label: "Subdivision",
      hint: "The number of segments that make up the plane geometry, in both the X and Y directions",
      step: 1,
      min: 1,
      value: subdivision,
      onChange: (newSubdivision: number) =>
        patchControls({ subdivision: newSubdivision }),
    },
    noiseFunction: {
      label: "Noise function",
      hint: "The noise function used to deform the plane geometry and generate the light patterns",
      options: Object.keys(NoiseType).filter((x) => !(parseInt(x, 10) >= 0)),
      value: NoiseType[noiseFunction],
      onChange: (newNoiseFunction: keyof typeof NoiseType) =>
        patchControls({ noiseFunction: NoiseType[newNoiseFunction] }),
    },
    "Deform noise": folder({
      deformNoiseFrequency: {
        label: "Frequency",
        hint: "The frequency of the deform noise texture. Higher values increase the number of peaks and valleys that appear on the plane, and decrease their x-y size. This is a vector so that the noise can be scaled differently in the x and y directions.",
        lock: true,
        x: { min: 0, step: 0.01 },
        y: { min: 0, step: 0.01 },
        value: deformNoiseFrequency as [number, number],
        onChange: (newDeformNoiseFrequency: TupleVector2) =>
          patchControls({ deformNoiseFrequency: newDeformNoiseFrequency }),
      },
      deformNoiseSpeed: {
        label: "Speed",
        hint: "The speed of the animation of the deform noise texture. Higher values result in faster animation.",
        step: 0.01,
        value: deformNoiseSpeed,
        onChange: (newDeformNoiseSpeed: number) =>
          patchControls({ deformNoiseSpeed: newDeformNoiseSpeed }),
      },
      deformNoiseStrength: {
        label: "Strength",
        hint: "The strength of the deform noise texture. Higher values result in sharper valleys and peaks.",
        step: 0.01,
        value: deformNoiseStrength,
        onChange: (newDeformNoiseStrength: number) =>
          patchControls({ deformNoiseStrength: newDeformNoiseStrength }),
      },
      deformNoiseScrollSpeed: {
        label: "Scroll speed",
        hint: "The speed of the passive scrolling of the deform noise texture. Higher values result in faster scrolling. This is a vector so that the noise can be scrolled at different speeds in the x and y directions.",
        lock: true,
        x: { step: 0.01 },
        y: { step: 0.01 },
        value: deformNoiseScrollSpeed as [number, number],
        onChange: (newDeformNoiseScrollSpeed: TupleVector2) =>
          patchControls({ deformNoiseScrollSpeed: newDeformNoiseScrollSpeed }),
      },
      deformNoiseClamp: {
        label: "Clamp",
        hint: "The lower and upper bounds of the deform noise texture.",
        min: -1,
        max: 1,
        step: 0.01,
        value: [deformNoiseClampLow, deformNoiseClampHigh],
        onChange: (newDeformNoiseClamp: [number, number]) =>
          patchControls({
            deformNoiseClampLow: newDeformNoiseClamp[0],
            deformNoiseClampHigh: newDeformNoiseClamp[1],
          }),
      },
    }),
    "Lights noise": folder({
      lightNoiseFrequency: {
        label: "Frequency",
        hint: "The frequency of the light noise texture. Higher values increase the number of bright areas that appear on the plane and decrease their size. This is a vector so that the noise can be scaled differently in the x and y directions.",
        lock: true,
        x: { min: 0, step: 0.01 },
        y: { min: 0, step: 0.01 },
        value: lightNoiseFrequency as [number, number],
        onChange: (newLightNoiseFrequency: TupleVector2) =>
          patchControls({ lightNoiseFrequency: newLightNoiseFrequency }),
      },
      lightNoiseSpeed: {
        label: "Speed",
        hint: "The speed of the animation of the light noise texture. Higher values result in faster animation.",
        step: 0.01,
        value: lightNoiseSpeed,
        onChange: (newLightNoiseSpeed: number) =>
          patchControls({ lightNoiseSpeed: newLightNoiseSpeed }),
      },
      lightNoiseScrollSpeed: {
        label: "Scroll speed",
        hint: "The speed of the passive scrolling of the light noise texture. Higher values result in faster scrolling. This is a vector so that the noise can be scrolled at different speeds in the x and y directions.",
        lock: true,
        x: { step: 0.01 },
        y: { step: 0.01 },
        value: lightNoiseScrollSpeed as [number, number],
        onChange: (newLightNoiseScrollSpeed: TupleVector2) =>
          patchControls({ lightNoiseScrollSpeed: newLightNoiseScrollSpeed }),
      },
      lightNoiseClamp: {
        label: "Clamp",
        hint: "The lower and upper bounds of the light noise texture.",
        min: -1,
        max: 1,
        step: 0.01,
        value: [lightNoiseClampLow, lightNoiseClampHigh],
        onChange: (newLightNoiseClamp: [number, number]) =>
          patchControls({
            lightNoiseClampLow: newLightNoiseClamp[0],
            lightNoiseClampHigh: newLightNoiseClamp[1],
          }),
      },
      perLightNoiseOffset: {
        label: "Offset per light",
        hint: "The offset that each successive light will have on the noise texture.",
        step: 0.01,
        value: perLightNoiseOffset,
        onChange: (newPerLightNoiseOffset: number) =>
          patchControls({ perLightNoiseOffset: newPerLightNoiseOffset }),
      },
    }),
    Lights: folder({
      lightBlendStrength: {
        label: "Blend strength",
        hint: 'The opacity that each light will have when blended together. The last light will inherently be the strongest, since it is applied last (when using the "Normal" blend function).',
        min: 0,
        max: 1,
        step: 0.01,
        value: lightBlendStrength,
        onChange: (newLightBlendStrength: number) =>
          patchControls({ lightBlendStrength: newLightBlendStrength }),
      },
      lightBlendFunction: {
        label: "Blend function",
        hint: "The function that will be used to blend the lights together. Similar to Photoshop layer blend modes.",
        options: Object.keys(BlendType).filter((x) => !(parseInt(x, 10) >= 0)),
        value: BlendType[lightBlendFunction],
        onChange: (newLightBlendFunction: keyof typeof BlendType) =>
          patchControls({
            lightBlendFunction: BlendType[newLightBlendFunction],
          }),
      },
    }),
    [lightThemeKey]: {
      label: "Theme",
      options: Object.keys(ColorMode).filter((x) => !(parseInt(x, 10) >= 0)),
      value: getColorModeKey(colorMode),
      onChange: (newColorModeKey: keyof typeof ColorMode) =>
        patchControls({ colorMode: ColorMode[newColorModeKey] }),
    },
  }));

  const makeLightCountKey = (mode: ColorMode): string =>
    `Lights.lights-${mode}-count`;
  const makeLightColorKey = (mode: ColorMode, i: number): string =>
    `Lights.lights-${mode}-color-${i}`;

  const [lightColorsStore, _setLightColorsStore] = useControls(
    () =>
      Object.fromEntries(
        Object.values(ColorMode).flatMap((mode: ColorMode) => {
          const baseColors = colors[`${mode}Colors`];
          // Pad the array with black colors up to the maximum number of lights.
          const allColors = [
            ...baseColors,
            ...Array<string>(MAX_LIGHTS - baseColors.length).fill("#000000"),
          ];
          return allColors.map((c, i) => [
            makeLightColorKey(mode, i),
            {
              label: String(i),
              transient: false,
              order: 2,
              render: (get) =>
                ColorMode[get(lightThemeKey) as keyof typeof ColorMode] ===
                  mode && get(makeLightCountKey(mode)) > i,
              value: c,
              onChange: (newColor: string): void => {
                updateControls((currentControls) => {
                  const currentColors = currentControls[`${mode}Colors`];
                  if (i >= currentColors.length) {
                    return currentControls;
                  }

                  const newColors = [...currentColors];
                  newColors[i] = newColor;
                  return {
                    ...currentControls,
                    [`${mode}Colors`]: newColors,
                  };
                });
              },
            },
          ]);
        })
      ),
    [colorMode]
  );
  type SetLightColorsStoreArg = {
    [key: string]: string;
  };
  type SetLightColorsStore = (arg: SetLightColorsStoreArg) => void;
  const setLightColorsStore =
    _setLightColorsStore as unknown as SetLightColorsStore;
  const syncLightColorsStore = (
    newColors: readonly string[],
    mode: ColorMode
  ): void => {
    setLightColorsStore({
      ...Object.fromEntries(
        Array.from(Array(MAX_LIGHTS).keys()).map((i) => [
          makeLightColorKey(mode, i),
          i < newColors.length ? newColors[i] : "#000000",
        ])
      ),
    });
  };

  const [lightCountStore, _setLightCountStore] = useControls(() =>
    Object.fromEntries(
      Object.values(ColorMode).map((mode: ColorMode) => [
        makeLightCountKey(mode),
        {
          label: "Count",
          transient: false,
          order: 1,
          min: 1,
          max: MAX_LIGHTS,
          step: 1,
          render: (get): boolean =>
            ColorMode[get(lightThemeKey) as keyof typeof ColorMode] === mode,
          value: colors[`${mode}Colors`].length,
          onChange: (newLightCount: number): void => {
            updateControls((currentControls) => {
              const currentColors = currentControls[`${mode}Colors`];
              const newColors: string[] = [];
              for (let i = 0; i < newLightCount; i++) {
                if (currentColors.length <= i) {
                  newColors.push("#000000");
                } else {
                  newColors.push(currentColors[i]);
                }
              }

              syncLightColorsStore(newColors, mode);
              return {
                ...currentControls,
                [`${mode}Colors`]: newColors,
              };
            });
          },
        },
      ])
    )
  );
  type SetLightCountStoreArg = {
    [key: string]: number;
  };
  type SetLightCountStore = (arg: SetLightCountStoreArg) => void;
  const setLightCountStore =
    _setLightCountStore as unknown as SetLightCountStore;

  useEffect(() => {
    // On the first render, set the current time for the animation, if needed.
    if (currentTime > 0.00001) {
      canvasRef.current?.rendererRef?.current?.seekToTime(currentTime);
    }

    // Set up an interval to update the current time.
    const interval = window.setInterval(() => {
      const newTime = canvasRef.current?.rendererRef?.current?.getTime() ?? 0;
      patchControls({ currentTime: newTime });
    }, 500);

    return () => window.clearInterval(interval);
    // This effect should only run once, when the component is mounted,
    // using the initial current time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patchControls]);

  // Extract the color array from the stores.
  const allLightColors: string[] = Array.from(Array(MAX_LIGHTS).keys()).flatMap(
    (i): string[] => {
      const key = makeLightColorKey(colorMode, i);
      if (key in lightColorsStore) {
        return [lightColorsStore[key] as unknown as string];
      }
      return [];
    }
  );
  const lightCount: number = lightCountStore[makeLightCountKey(colorMode)];
  const lightColors: string[] = allLightColors.slice(0, lightCount);
  const lightColorObjects: RgbColor[] = lightColors.map(parseToRgb);

  return (
    <>
      <Styled.Canvas
        ref={canvasRef}
        colors={lightColorObjects as NonEmptyArray<RgbColor>}
        fallbackColor={{ red: 0, green: 0, blue: 0 }}
        timeOffset={timeOffset}
        isPaused={isPaused}
        subdivision={subdivision}
        deformNoiseFrequency={deformNoiseFrequency}
        deformNoiseSpeed={deformNoiseSpeed}
        deformNoiseStrength={deformNoiseStrength}
        deformNoiseScrollSpeed={deformNoiseScrollSpeed}
        deformNoiseClampLow={deformNoiseClampLow}
        deformNoiseClampHigh={deformNoiseClampHigh}
        lightNoiseFrequency={lightNoiseFrequency}
        lightNoiseSpeed={lightNoiseSpeed}
        lightNoiseScrollSpeed={lightNoiseScrollSpeed}
        lightNoiseClampLow={lightNoiseClampLow}
        lightNoiseClampHigh={lightNoiseClampHigh}
        lightBlendStrength={lightBlendStrength}
        perLightNoiseOffset={perLightNoiseOffset}
        onRender={postRender}
        // Include all noise functions and blend functions, and pass in the
        // expected uniforms as custom uniforms:
        customNoiseSource={allNoiseFunctions}
        customBlendSource={allBlendFunctions}
        customUniforms={{
          inBlendType: {
            value: lightBlendFunction,
          },
          inNoiseType: {
            value: noiseFunction,
          },
        }}
      />
      <Styled.LevaContainer>
        <Leva />
      </Styled.LevaContainer>
    </>
  );
}
