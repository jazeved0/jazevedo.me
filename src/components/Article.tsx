import React, { useRef } from "react";
import styled from "@emotion/styled";
import { rgba } from "polished";

import { gap } from "../theme/spacing";
import { color, ColorMode, hybridColor, mode } from "../theme/color";
import { down } from "../theme/media";
import { shadow } from "../theme/shadows";
import { highlightLinks } from "../theme/mixins";
import { iframeClass } from "./Iframe";
import ImageLightboxHandler from "./ImageLightboxHandler";

/**
 * Class name for wrapping an image in a "card" (i.e. have a background color
 * and padding outside the image).
 */
export const cardImageClass = "article--card-image";

/**
 * Class name to signal that all ancestor images should be skipped when adding
 * styles related to adding border radius, box shadow, responsive sizing, etc.
 * This also disables the "lightbox" functionality from applying.
 */
export const noImageStylesClass = "article--skip-images";

/**
 * Class name to opt out of anchor styles on a single anchor element.
 */
export const noLinkStylesClass = "article--skip-link";

const Styled = {
  Article: styled.article`
    --par-spacing: ${gap.micro};
    --large-block-spacing: ${gap.milli};

    ${down("md")} {
      --large-block-spacing: ${gap.micro};
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: var(--large-block-spacing);
      margin-bottom: var(--par-spacing);
    }

    pre,
    blockquote,
    hr,
    table,
    figure {
      margin-bottom: var(--large-block-spacing);
    }

    figure + figure {
      ${down("md")} {
        margin-top: calc(var(--site-padding) - var(--par-spacing));
      }
    }

    p,
    ol,
    ul {
      margin-bottom: var(--par-spacing);
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: ${color("text-strong")};
    }

    ul {
      position: relative;
      list-style: none;
      padding-left: 1.5em;
      margin-left: 0.8em;

      li:before {
        content: "\\25C6";
        font-size: 0.6em;
        position: absolute;
        transform: translateY(0.7em);
        left: 0;
      }
    }

    ol {
      padding-inline-start: 32px;

      & > li {
        padding-left: 0.65rem;
      }
    }

    ul,
    ol {
      & > li {
        & > :last-child {
          margin-bottom: 0;
        }
      }

      &:not(.no-list-spacing) > li {
        /* Add spacing to the start of each paragraph in a ul or ol,
        since if it turns into a list of paragraphs, spacing is likely desired.
        This can be turned off by using a div wrapper with the '.no-list-spacing' class. */
        &:not(:first-of-type) {
          & > p {
            margin-top: var(--par-spacing);
          }
        }
      }
    }

    blockquote {
      padding: ${gap.micro};
      border-left: solid 8px ${color("primary")};
      border-bottom-left-radius: 8px;
      border-top-left-radius: 8px;

      ${mode(ColorMode.Light)} {
        background-color: ${rgba(hybridColor("primary", ColorMode.Light), 0.2)};
      }

      ${mode(ColorMode.Dark)} {
        background-color: ${rgba(hybridColor("primary", ColorMode.Dark), 0.2)};
      }

      ${down("sm")} {
        padding: ${gap.nano};
      }

      & > :last-child {
        margin-bottom: 0;
      }

      /* When forced-colors are enabled, manually add a border */
      @media (forced-colors: active) {
        /* Add a border to every side except left
        (it already has a thick border) */
        border-right: solid 1px;
        border-bottom: solid 1px;
        border-top: solid 1px;
      }
    }

    table {
      border-collapse: collapse;
      border: none;
      --border-radius: 8px;
      border-radius: var(--border-radius);
      box-shadow: ${shadow("z2")};

      thead tr:first-of-type th:first-of-type {
        border-top-left-radius: var(--border-radius);
      }

      thead tr:first-of-type th:last-child {
        border-top-right-radius: var(--border-radius);
      }

      tbody tr:last-child td:first-of-type {
        border-bottom-left-radius: var(--border-radius);
      }

      tbody tr:last-child td:last-child {
        border-bottom-right-radius: var(--border-radius);
      }

      /* When forced-colors are enabled, manually add a border
      (the color is ignored) */
      @media (forced-colors: active) {
        border: solid 1px white;

        td,
        th {
          border: solid 1px white;
        }
      }

      td,
      th {
        min-width: 6rem;
        padding: 0.75rem;
        vertical-align: top;
        text-align: left;
      }

      td:not(:first-of-type),
      th:not(:first-of-type) {
        min-width: 8rem;
      }

      ${down("md")} {
        td:not(:first-of-type),
        th:not(:first-of-type) {
          min-width: 10rem;
        }
      }

      tbody {
        border: none;

        ${mode(ColorMode.Light)} {
          tr:nth-of-type(2n) {
            background-color: ${color("bg+10")};
          }

          tr:nth-of-type(2n + 1) {
            background-color: ${color("bg+5")};
          }
        }

        ${mode(ColorMode.Dark)} {
          tr:nth-of-type(2n) {
            background-color: ${color("bg+15")};
          }

          tr:nth-of-type(2n + 1) {
            background-color: ${color("bg+10")};
          }
        }
      }

      thead {
        tr {
          box-shadow: ${shadow("z1")};
          z-index: 1;
          position: relative;

          ${mode(ColorMode.Light)} {
            background-color: ${color("bg+15")};
          }

          ${mode(ColorMode.Dark)} {
            background-color: ${color("bg+20")};
          }
        }

        th {
          font-size: 0.9rem;
          text-transform: uppercase;
          color: ${color("text-faint")};
          letter-spacing: 1px;
        }
      }

      td {
        font-size: 0.9rem;
        font-weight: 400;
      }
    }

    & a:not(.gatsby-resp-image-link):not(.${noLinkStylesClass}) {
      ${highlightLinks}
    }

    --img-border-radius: 8px;
    .gatsby-resp-image-wrapper {
      max-width: none !important;
      box-shadow: ${shadow("z2")};
      border-radius: var(--img-border-radius);
    }

    a.gatsby-resp-image-link {
      &::after {
        border-radius: 2px;
        box-shadow: 0 0 0 8px ${color("primary+20")};
        content: "";
        height: 100%;
        left: 0;
        opacity: 0;
        position: absolute;
        top: 0;
        transition: opacity 0.2s ease-in-out;
        width: 100%;
        z-index: 10;
      }

      &:focus-visible::after {
        opacity: 1;
      }
    }

    .${cardImageClass} {
      --card-image-padding: ${gap.nano};

      box-shadow: ${shadow("z2")};
      padding: var(--card-image-padding);
      background-color: ${color("bg+15")};
      border-radius: var(--img-border-radius);

      .gatsby-resp-image-wrapper {
        /* Remove the default box shadow and border radius from the image wrapper */
        box-shadow: none;
        border-radius: 0;
      }
    }

    /* Add a border radius and box shadow to children that are not inside a
    paragraph. To opt out, wrap the image with a 'noImageStylesClass' ancestor
    div. */
    & img {
      &:not(p img):not(.${noImageStylesClass} img) {
        border-radius: var(--img-border-radius);
        display: block;

        /* If the image is not a Gatsby responsive image, make it responsive
        and add the box shadow */
        &:not(.gatsby-resp-image-image) {
          width: 100%;
          box-shadow: ${shadow("z2")};
        }
      }
    }

    .${iframeClass} {
      margin-top: ${gap.micro};
      border-radius: var(--img-border-radius);
      box-shadow: ${shadow("z2")};
    }
  `,
};

export type ArticleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Supplies styles to markdown-style content
 * (i.e. headings, anchors, paragraphs, code blocks)
 * in the children.
 */
export default function Article({
  children,
  className,
  style,
}: ArticleProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Styled.Article className={className} style={style} ref={ref}>
      {children}
      <ImageLightboxHandler parentRef={ref} />
    </Styled.Article>
  );
}
