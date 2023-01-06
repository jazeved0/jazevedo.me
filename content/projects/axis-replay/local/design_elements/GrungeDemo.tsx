import React from "react";
import styled from "@emotion/styled";
import classNames from "classnames";

import { cardImageClass } from "../../../../../src/components/Article";
import HangerDarkSvg from "./hanger-dark.inline.svg";
import { gap } from "../../../../../src/theme/spacing";
import { color } from "../../../../../src/theme/color";
import { down } from "../../../../../src/theme/media";

const Styled = {
  Wrapper: styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${gap.nano};
    padding: ${gap.nano};

    ${down("sm")} {
      grid-template-columns: 1fr;
    }
  `,
  HangerSvg: styled(HangerDarkSvg)`
    color: ${color("text-ghost+3")};
  `,
};

export type GrungeDemoProps = {
  /**
   * Contains the grunge example image
   * (created from Markdown by `gatsby-remark-images`).
   */
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Shows the grunge example image next to the source SVG.
 */
export default function GrungeDemo({
  children,
  className,
  style,
}: GrungeDemoProps): React.ReactElement {
  return (
    <Styled.Wrapper
      className={classNames(className, cardImageClass)}
      style={style}
    >
      {children}
      <Styled.HangerSvg />
    </Styled.Wrapper>
  );
}
