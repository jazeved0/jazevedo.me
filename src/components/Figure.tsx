import React from "react";
import classNames from "classnames";
import styled from "@emotion/styled";

import { color } from "../theme/color";
import { shadow } from "../theme/shadows";
import { noImageStylesClass } from "./Article";
import ImageLightboxHandler from "./ImageLightboxHandler";

const Styled = {
  Figure: styled.figure`
    /* Make the figure as wide as the contained image, if any:
    https://stackoverflow.com/a/19113067
    This is only needed if 'size-to-content' is set on the figure,
    but it's easier to use the same strategy all the time and just set
    'width: 100%' when 'size-to-content' is not set. (causing the figure to fully
    expand, subject to max-width).
    This means that to get a background, border radius, and box-shadow
    around the caption and figure together, each needs to be applied separately. */
    display: table;
    --figure-background-color: ${color("bg+15")};
    --figure-border-radius: var(--img-border-radius);
    --figure-box-shadow: ${shadow("z2")};

    &:not(.size-to-content) {
      /* Make the figure as wide as the surroundings, subject to any max-width
      set on the figure itself. */
      width: 100%;
    }

    /* Apply common styles to the "display-table" part of the figure
    (i.e. figure, excluding the caption).
    This will have a top rounded border, but a bottom square border. */
    background-color: var(--figure-background-color);
    border-top-left-radius: var(--figure-border-radius);
    border-top-right-radius: var(--figure-border-radius);
    box-shadow: var(--figure-box-shadow);

    position: relative;

    /* Fix a link inside figure content, containing an image, from taking up
    its own vertical space and showing a sliver of its background. */
    & > a > img {
      display: block;
    }

    /* Apply a default style to each image block child */
    & img {
      &:not(p img):not(.${noImageStylesClass} img) {
        border-radius: 0;
      }
    }

    /* Select the first child.
    HACK: use workaround for Emotion 10 not supporting :first-child:
    https://github.com/emotion-js/emotion/issues/1105#issuecomment-1126025608 */
    & > :first-of-type:not(style):not(:first-of-type ~ *),
    & > style + * {
      /* Make the first image in the figure have a top rounded border. */
      & img,
      &:is(img) {
        &:not(p img):not(.${noImageStylesClass} img) {
          overflow: hidden;
          border-top-left-radius: var(--figure-border-radius);
          border-top-right-radius: var(--figure-border-radius);
        }
      }

      /* Ensure that the Gatsby responsive image wrapper also has the
      same styles applied, so that the blurred placeholder image does not
      go out of the border radius bounds: */
      & a.gatsby-resp-image-link,
      a.gatsby-resp-image-link,
      & .gatsby-resp-image-wrapper,
      &.gatsby-resp-image-wrapper {
        overflow: hidden;
        border-top-left-radius: var(--figure-border-radius);
        border-top-right-radius: var(--figure-border-radius);
      }
    }

    /* Make child images that are not inside a paragraph responsive. To opt
    out, wrap the image with a 'noImageStylesClass' ancestor div. */
    & img {
      &:not(p img):not(.${noImageStylesClass} img) {
        /* If the image is not a Gatsby responsive image, make it responsive */
        &:not(.gatsby-resp-image-image) {
          width: 100%;
        }
      }
    }

    /* Style the caption */
    figcaption {
      display: table-caption;
      caption-side: bottom;

      /* Apply common styles to the "display-table-caption" part of the figure
      (i.e. the figure, excluding the content).
      This will have a bottom rounded border, but a top square border. */
      /* overflow: hidden; */
      background-color: var(--figure-background-color);
      border-bottom-left-radius: var(--figure-border-radius);
      border-bottom-right-radius: var(--figure-border-radius);
      box-shadow: var(--figure-box-shadow);

      padding: 10px 16px;
      color: ${color("text")};

      /* Ensure that this is on top of the figure, so that the box-shadow
      from the content of the figure is not visible */
      position: relative;
      z-index: 1;

      /* When forced-colors are enabled, manually add a border
      (the color is ignored) */
      @media (forced-colors: active) {
        border: solid 1px white;
      }

      & > :last-child {
        /* Remove the margin-bottom from the last child of the figure caption */
        margin-bottom: 0;
      }
    }

    & > :last-child {
      /* Remove the margin-bottom from the last child of the figure */
      margin-bottom: 0;
    }

    &.centered {
      margin-left: auto;
      margin-right: auto;
    }

    & .gatsby-resp-image-wrapper {
      /* Remove the default box shadow and border radius */
      box-shadow: none;
      /* This will get overriden by the first-child selector above */
      border-radius: 0;
    }
  `,
};

export type FigureProps = {
  children?: React.ReactNode;
  centered?: boolean;
  sizeToContent?: boolean;
  maxWidth?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function Figure({
  children,
  centered = false,
  sizeToContent = false,
  maxWidth = 1260,
  className,
  style,
}: FigureProps): React.ReactElement {
  // HACK: search the children for the `figcaption` element, if it exists.
  // It must be a direct child of this component.
  let caption: React.ReactNode | undefined;
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === "figcaption") {
      caption = child;
    }
  });

  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <Styled.Figure
        className={classNames(className, {
          centered,
          "size-to-content": sizeToContent,
        })}
        style={{ maxWidth, ...style }}
        ref={ref}
      >
        {children}
      </Styled.Figure>
      <ImageLightboxHandler parentRef={ref} captionChildren={caption} />
    </>
  );
}
