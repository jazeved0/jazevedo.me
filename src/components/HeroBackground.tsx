import React from "react";
import styled from "@emotion/styled";
import { StaticImage } from "gatsby-plugin-image";
import { rgba } from "polished";

import {
  hybridColor,
  ColorMode,
  mode,
  heroGradientColors,
} from "../theme/color";
import StripeGradient from "./StripeGradient";
import { useColorMode } from "../hooks";

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

const Styled = {
  HeroLayout: styled.div`
    display: grid;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    user-select: none;

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
  `,
  HeroGradient: styled(StripeGradient)`
    opacity: 0;
    transition: opacity 2.5s linear;

    /* stripe-gradient applies the .isLoaded class */
    &.isLoaded {
      opacity: 1;
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
  `,
};

export type HeroBackgroundProps = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Displays an animated wavy background,
 * using a Canvas and Stripe's Gradient class
 * to render the background using WebGL:
 * https://kevinhufnagl.com/how-to-stripe-website-gradient-effect/
 *
 * While loading, the background uses blurred Gatsby images
 * as a placeholder, and then smoothly fades
 * the animated canvas in once it's ready.
 */
export default function HeroBackground({
  className,
  style,
}: HeroBackgroundProps): React.ReactElement {
  // The prop this gets passed to (Gradient.colors)
  // only has a meaning in the JS runtime,
  // so there is no risk for hydration side effects
  // by using it even on the initial render.
  const colorMode = useColorMode();
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
      <Styled.HeroGradient
        colors={heroGradientColors[colorMode]}
        style={{
          gridArea: "1/1",
          height: "100%",
          width: "100%",
          zIndex: 1,
        }}
      />
      <Styled.HeroMask style={{ gridArea: "1/1", zIndex: 2 }} />
    </Styled.HeroLayout>
  );
}
