import React from "react";
import styled from "@emotion/styled";
import type { RgbColor } from "polished/lib/types/color";
import { parseToRgb } from "polished";

import Layout from "../components/Layout";
import { gap } from "../theme/spacing";
import { container } from "../theme/layout";
import Meta from "../components/Meta";
import WaveCanvas from "../components/HeroBackground/WaveCanvas";
import type { NonEmptyArray } from "../ts-utils";
import { ColorMode, HeroBackgroundColors, color } from "../theme/color";
import { useColorMode } from "../hooks";

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
};

export default function GradientTestPage(): React.ReactElement {
  const [isPaused, setIsPaused] = React.useState(false);
  const [initialTime, setInitialTime] = React.useState(0);
  return (
    <Layout
      overlayChildren={
        <Background isPaused={isPaused} initialTime={initialTime} />
      }
      hideFooter
      headerProps={{ spacing: "compact" }}
    >
      <Styled.PageLayout>
        <Styled.PageTitle>Gradient test page</Styled.PageTitle>
        <button
          type="button"
          onClick={(): void => {
            setIsPaused((prev) => !prev);
          }}
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <input
          type="number"
          value={initialTime}
          onChange={(e): void => {
            setInitialTime(Number(e.target.value));
          }}
        />
      </Styled.PageLayout>
    </Layout>
  );
}

// Gatsby Head component:
// https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
export function Head(): React.ReactElement {
  return <Meta title="Gradient test page" noIndex />;
}

const GRADIENT_COLORS: { [k in ColorMode]: NonEmptyArray<RgbColor> } =
  Object.fromEntries(
    Object.entries(
      // Assert that the constant is correct so that the output of the
      // transformation is valid.
      HeroBackgroundColors satisfies {
        [k in ColorMode]: Readonly<NonEmptyArray<string>>;
      }
    ).map(([k, v]) => [k, v.map((c) => parseToRgb(c))])
  ) as { [k in ColorMode]: NonEmptyArray<RgbColor> };

type BackgroundProps = {
  initialTime: number;
  isPaused: boolean;
};

function Background({
  initialTime,
  isPaused,
}: BackgroundProps): React.ReactElement {
  // This only gets used in the WaveCanvas component in effects. As a result,
  // it's safe to use this value without gating it on the initial render.
  const colorMode = useColorMode();

  return (
    <Styled.Canvas
      colors={GRADIENT_COLORS[colorMode]}
      fallbackColor={GRADIENT_COLORS[colorMode][0]}
      onLoad={(): void => {
        window.console.log("[GradientTestPage] Wave canvas loaded");
      }}
      // initialTime={33}
      initialTime={initialTime}
      isPaused={isPaused}
      subdivision={72}
      deformNoiseFrequency={2}
      deformNoiseSpeed={0.06}
      deformNoiseStrength={0.2}
      deformNoiseScrollSpeed={[0.025, 0.01]}
      lightNoiseFrequency={1}
      lightNoiseSpeed={0.03}
      lightNoiseScrollSpeed={[0.025, 0.01]}
      lightBlendStrength={0.9}
      perLightNoiseOffset={0.2}
    />
  );
}
