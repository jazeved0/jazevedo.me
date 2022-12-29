import React from "react";
import classNames from "classnames";
import styled from "@emotion/styled";

import { color } from "../theme/color";
import { shadow } from "../theme/shadows";

const Styled = {
  Figure: styled.figure`
    --img-border-radius: 8px;

    &.gatsby-resp-image-figure {
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    }

    &.left {
      margin-left: 0;
    }

    &.merged {
      p {
        border-radius: var(--img-border-radius);
        box-shadow: ${shadow("z2")};
      }

      span.gatsby-resp-image-background-image,
      img.gatsby-resp-image-image {
        box-shadow: none !important;
      }

      span.gatsby-resp-image-wrapper:not(:first-of-type) {
        span.gatsby-resp-image-background-image,
        img.gatsby-resp-image-image {
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;
        }
      }
    }

    &,
    &.gatsby-resp-image-figure {
      display: table;
      max-width: 800px;

      img {
        border-bottom-left-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
        box-shadow: ${shadow("z2")};
        margin-bottom: 0;
        vertical-align: middle;
      }

      figcaption {
        padding: 10px 16px;
        background-color: ${color("bg+15")};
        border-top: none;
        color: ${color("text")};
        border-bottom-right-radius: var(--img-border-radius) !important;
        border-bottom-left-radius: var(--img-border-radius) !important;

        display: table-caption;
        caption-side: bottom;
        box-shadow: ${shadow("z2")};

        /* When forced-colors are enabled, manually add a border
        (the color is ignored) */
        @media (forced-colors: active) {
          border: solid 1px white;
        }
      }
    }
  `,
};

export type FigureProps = {
  children?: React.ReactNode;
  caption: string;
  sharp?: boolean;
  left?: boolean;
  merged?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function Figure({
  children,
  caption,
  sharp = false,
  left = false,
  merged = false,
  className,
  style,
}: FigureProps): React.ReactElement {
  return (
    <Styled.Figure
      className={classNames(className, {
        "gatsby-resp-image-figure": sharp,
        left,
        merged,
      })}
      style={style}
    >
      {children}
      <figcaption>{caption}</figcaption>
    </Styled.Figure>
  );
}
