import React, { useCallback, useContext, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import type { RgbColor } from "polished/lib/types/color";
import { parseToRgb } from "polished";
import { folder, button, Leva, useControls } from "leva";
import Stats from "three/examples/jsm/libs/stats.module";

import Layout from "../../components/Layout";
import { gap } from "../../theme/spacing";
import { container } from "../../theme/layout";
import Meta from "../../components/Meta";
import WaveCanvas from "../../components/WaveCanvas";
import type { WaveCanvasRef } from "../../components/WaveCanvas/WaveCanvas";
import type { NonEmptyArray } from "../../ts-utils";
import {
  ColorMode,
  HeroBackgroundColors as WaveColorStrings,
  color,
  ColorModeContext,
  getColorModeKey,
} from "../../theme/color";
import { useInitialRender } from "../../hooks";
import { MAX_LIGHTS } from "../../components/WaveCanvas/shaders";
import allNoiseFunctions from "../../components/WaveCanvas/shaders/noise/all.glsl";
import { NoiseType } from "../../components/WaveCanvas/shaders/noise/all";
import allBlendFunctions from "../../components/WaveCanvas/shaders/blend/all.glsl";
import { BlendType } from "../../components/WaveCanvas/shaders/blend/all";

const Styled = {
  PageLayout: styled.div`
    ${container}
    padding-top: ${gap.milli};
    padding-bottom: ${gap.milli};
  `,
  PageTitle: styled.h2`
    color: ${color("text-strong")};
    font-size: 3rem;
    font-weight: 200;
    line-height: 1;
  `,
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
  const [hideUI, setHideUI] = React.useState(false);
  const initialRender = useInitialRender();

  return (
    <Layout
      hideFooter
      headerProps={{ spacing: "compact" }}
      overlayChildren={
        initialRender ? null : (
          <Playground hideUI={hideUI} setHideUI={setHideUI} />
        )
      }
      hideHeader={hideUI}
    >
      <Styled.PageLayout>
        {!hideUI && <Styled.PageTitle>Waves playground 🌊</Styled.PageTitle>}
      </Styled.PageLayout>
    </Layout>
  );
}

// Gatsby Head component:
// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
export function Head(): React.ReactElement {
  return <Meta title="Waves playground 🌊" noIndex noSiteTitle />;
}

type PlaygroundProps = {
  hideUI: boolean;
  setHideUI: (hideUI: boolean) => void;
};

function Playground({
  hideUI,
  setHideUI,
}: PlaygroundProps): React.ReactElement {
  const { mode: colorMode, setMode: setColorMode } =
    useContext(ColorModeContext);
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

  const {
    initialTime,
    isPaused,
    subdivision,
    noiseFunction,
    deformNoiseFrequency,
    deformNoiseSpeed,
    deformNoiseStrength,
    deformNoiseScrollSpeed,
    lightNoiseFrequency,
    lightNoiseSpeed,
    lightNoiseScrollSpeed,
    lightBlendStrength,
    lightBlendFunction,
    perLightNoiseOffset,
  } = useControls({
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
    }),
    isPaused: {
      label: "Pause",
      value: false,
    },
    initialTime: {
      label: "Initial time",
      value: 0,
      min: 0,
      step: 0.25,
      hint: "The initial time of the animation",
    },
    hideUI: {
      label: "Hide UI",
      value: hideUI,
      onChange: setHideUI,
    },
    hideStats: {
      label: "Hide stats",
      value: false,
      onChange: (hideStats) => {
        statsRef.current.dom.style.display = hideStats ? "none" : "block";
      },
    },
    subdivision: {
      label: "Subdivision",
      value: 72,
      step: 1,
      min: 1,
    },
    noiseFunction: {
      label: "Noise function",
      value: "Simplex" satisfies keyof typeof NoiseType,
      options: Object.keys(NoiseType).filter((x) => !(parseInt(x, 10) >= 0)),
    },
    "Deform noise": folder({
      deformNoiseFrequency: {
        label: "Frequency",
        value: [2, 2],
        lock: true,
        x: { min: 0 },
        y: { min: 0 },
      },
      deformNoiseSpeed: {
        label: "Speed",
        value: 0.06,
      },
      deformNoiseStrength: {
        label: "Strength",
        value: 0.2,
      },
      deformNoiseScrollSpeed: {
        label: "Scroll speed",
        value: [0.025, 0.01],
        lock: true,
      },
    }),
    "Lights noise": folder({
      lightNoiseFrequency: {
        label: "Frequency",
        value: [1, 1],
        lock: true,
        x: { min: 0 },
        y: { min: 0 },
      },
      lightNoiseSpeed: {
        label: "Speed",
        value: 0.03,
      },
      lightNoiseScrollSpeed: {
        label: "Scroll speed",
        value: [0.025, 0.01],
        lock: true,
      },
      perLightNoiseOffset: {
        label: "Offset per light",
        value: 0.2,
      },
    }),
    Lights: folder({
      lightBlendStrength: {
        label: "Blend strength",
        value: 1,
        min: 0,
        max: 1,
      },
      lightBlendFunction: {
        label: "Blend function",
        value: "Normal" satisfies keyof typeof BlendType,
        options: Object.keys(BlendType).filter((x) => !(parseInt(x, 10) >= 0)),
      },
    }),
  });

  const lightThemeKey = "Lights.theme";
  const [, setThemeStore] = useControls(() => ({
    [lightThemeKey]: {
      label: "Theme",
      value: getColorModeKey(colorMode),
      options: Object.keys(ColorMode).filter((x) => !(parseInt(x, 10) >= 0)),
      onChange: (newColorModeKey: keyof typeof ColorMode) =>
        setColorMode(ColorMode[newColorModeKey]),
      transient: false,
    },
  }));
  // If the color mode changes, update the control to match.
  useEffect(() => {
    setThemeStore({ [lightThemeKey]: getColorModeKey(colorMode) });
  }, [colorMode, setThemeStore]);

  const makeLightCountKey = (mode: ColorMode): string =>
    `Lights.lights-${mode}-count`;
  const lightCountStore = useControls(
    Object.fromEntries(
      Object.values(ColorMode).map((mode: ColorMode) => [
        makeLightCountKey(mode),
        {
          label: "Count",
          value: WaveColorStrings[mode].length,
          min: 1,
          max: MAX_LIGHTS,
          step: 1,
          render: (get) =>
            ColorMode[get(lightThemeKey) as keyof typeof ColorMode] === mode,
        },
      ])
    )
  );

  const makeLightColorKey = (mode: ColorMode, i: number): string =>
    `Lights.lights-${mode}-color-${i}`;
  const lightColorsStore = useControls(
    Object.fromEntries(
      Object.values(ColorMode).flatMap((mode: ColorMode) => {
        const baseColors = WaveColorStrings[mode];
        // Pad the array with black colors up to the maximum number of lights.
        const allColors = [
          ...baseColors,
          ...Array<string>(MAX_LIGHTS - baseColors.length).fill("#000000"),
        ];
        return allColors.map((c, i) => [
          makeLightColorKey(mode, i),
          {
            label: String(i),
            value: c,
            render: (get) =>
              ColorMode[get(lightThemeKey) as keyof typeof ColorMode] ===
                mode && get(makeLightCountKey(mode)) > i,
          },
        ]);
      })
    ),
    [colorMode]
  );

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
        onLoad={(): void => {
          window.console.log("[GradientTestPage] Wave canvas loaded");
        }}
        initialTime={initialTime}
        isPaused={isPaused}
        subdivision={subdivision}
        customNoiseSource={allNoiseFunctions}
        customBlendSource={allBlendFunctions}
        customUniforms={{
          inBlendType: {
            value: BlendType[lightBlendFunction as keyof typeof BlendType],
          },
          inNoiseType: {
            value: NoiseType[noiseFunction as keyof typeof NoiseType],
          },
        }}
        deformNoiseFrequency={deformNoiseFrequency}
        deformNoiseSpeed={deformNoiseSpeed}
        deformNoiseStrength={deformNoiseStrength}
        deformNoiseScrollSpeed={deformNoiseScrollSpeed}
        lightNoiseFrequency={lightNoiseFrequency}
        lightNoiseSpeed={lightNoiseSpeed}
        lightNoiseScrollSpeed={lightNoiseScrollSpeed}
        lightBlendStrength={lightBlendStrength}
        perLightNoiseOffset={perLightNoiseOffset}
        onRender={postRender}
      />
      <Styled.LevaContainer>
        <Leva />
      </Styled.LevaContainer>
    </>
  );
}
