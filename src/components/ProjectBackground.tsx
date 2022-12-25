import React from "react";
import styled from "@emotion/styled";

import BackgroundSVG from "../images/project-background.inline.svg";
import { down } from "../theme/media";
import { mode, ColorMode, color } from "../theme/color";

const Styled = {
  Wrapper: styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;
  `,
  SVG: styled(BackgroundSVG)`
    --width: 2920px;
    --height: 700px;

    position: absolute;
    top: 0;
    left: calc(50% - var(--width) / 2 - 80px);
    width: var(--width);
    height: var(--height);

    ${down("lg")} {
      /* Fill more height on smaller screens */
      left: -910px;
      --width: 3030px;
      --height: 800px;
    }

    /* These correspond to calsses in the SVG */
    .background-piece-1 {
      ${mode(ColorMode.Light)} {
        fill: ${color("bg-5")};
        filter: drop-shadow(0 0 24px rgba(255, 255, 255, 0.3));
      }

      ${mode(ColorMode.Dark)} {
        fill: ${color("bg+5")};
        filter: drop-shadow(0 0 24px rgba(0, 0, 0, 0.2));
      }
    }

    .background-piece-2 {
      ${mode(ColorMode.Light)} {
        fill: ${color("bg-10")};
        filter: drop-shadow(0 0 24px rgba(255, 255, 255, 0.3));
      }

      ${mode(ColorMode.Dark)} {
        fill: ${color("bg+10")};
        filter: drop-shadow(0 0 24px rgba(0, 0, 0, 0.2));
      }
    }

    /* When forced-colors are enabled, hide the background */
    @media (forced-colors: active) {
      display: none;
    }
  `,
};

export type ProjectBackgroundProps = {
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Large, top-anchored triangles
 * that visually offset the left-aligned project overview.
 * Used on main project pages.
 */
export default function ProjectBackground({
  className,
  style,
}: ProjectBackgroundProps): React.ReactElement {
  return (
    <Styled.Wrapper className={className} style={style}>
      <Styled.SVG />
    </Styled.Wrapper>
  );
}
